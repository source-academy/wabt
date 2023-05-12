import {
  FunctionExpression,
  OperationTree,
  UnfoldedTokenExpression,
  type IntermediateRepresentation,
  ModuleExpression,
  type TokenExpression,
  ExportExpression,
  EmptyTokenExpression,
  BlockExpression,
} from './ir_types';
import { Token, TokenType } from '../common/token';
import { type ParseTree } from './tree_types';

import { Opcode } from '../common/opcode';
import { type ValueType } from '../common/type';
import { assert } from '../common/assert';

export function getIR(parseTree: ParseTree): IntermediateRepresentation {
  if (isSExpression(parseTree) || isStackExpression(parseTree)) {
    return parseExpression(parseTree);
  }

  if (isFunctionExpression(parseTree)) {
    return parseFunctionExpression(parseTree);
  }

  if (isModuleDeclaration(parseTree)) {
    return parseModuleExpression(parseTree);
  }

  if (isExportDeclaration(parseTree)) {
    return parseExportDeclaration(parseTree);
  }

  throw new Error(
    `Unexpected token type to parse: ${JSON.stringify(parseTree, undefined, 2)}`,
  );
}

/*
  Functions for parsing
*/
function parseExpression(parseTree: ParseTree): TokenExpression {
  if (parseTree.length === 0 || typeof parseTree === 'undefined') {
    return new EmptyTokenExpression();
  }

  if (isBlockExpression(parseTree)) {
    return parseBlockExpression(parseTree);
  }

  if (isSExpression(parseTree)) {
    return parseSExpression(parseTree);
  }

  if (isStackExpression(parseTree)) {
    return parseStackExpression(parseTree);
  }

  throw new Error(
    `Cannot parse into function expression: ${JSON.stringify(
      parseTree,
      undefined,
      2,
    )}`,
  ); // TODO legit error message when coming from function declarations.
}

function parseSExpression(parseTree: ParseTree): OperationTree {
  let head = parseTree[0];
  assert(head instanceof Token); // Head should be token here, assert to make typescript happy
  head = head as Token;

  const body: (Token | TokenExpression)[] = [];
  for (let i = 1; i < parseTree.length; i++) {
    const token = parseTree[i];
    if (token instanceof Token) {
      body.push(token);
    } else {
      const irNode = getIR(token);
      if (
        !(
          irNode instanceof Token
          || irNode instanceof OperationTree
          || irNode instanceof UnfoldedTokenExpression
        )
      ) {
        throw new Error(); //TODO proper error
      }
      body.push(irNode);
    }
  }

  assert(Opcode.getParamLength(head.opcodeType!) === body.length); // TODO handle this separately in validation.
  return new OperationTree(head, body);
}

function parseStackExpression(parseTree: ParseTree): UnfoldedTokenExpression {
  const nodes: (Token | OperationTree)[] = [];
  parseTree.forEach((tokenNode) => {
    if (tokenNode instanceof Token) {
      nodes.push(tokenNode);
    } else {
      const temp = getIR(tokenNode);
      if (!(temp instanceof Token || temp instanceof OperationTree)) {
        throw new Error(); // TODO proper error
      }
      nodes.push(temp);
    }
  });

  return new UnfoldedTokenExpression(nodes);
}

function parseBlockExpression(parseTree: ParseTree): BlockExpression {
  if (parseTree[1] instanceof Token && parseTree[1].type === TokenType.Var) {
    return new BlockExpression(
      parseTree[0] as Token,
      parseExpression(parseTree.slice(2)),
      parseTree[1].lexeme,
    );
  }
  return new BlockExpression(
    parseTree[0] as Token,
    parseExpression(parseTree.slice(1)),
  );
}

function parseFunctionExpression(parseTree: ParseTree): FunctionExpression {
  assert(isFunctionExpression(parseTree));
  let functionName: string | null = null;
  let inlineExportName: string | null = null;
  const paramTypes: ValueType[] = [];
  const paramNames: (string | null)[] = [];
  const resultTypes: ValueType[] = [];
  const localTypes: ValueType[] = [];
  const localNames: (string | null)[] = [];

  let cursor = 1;

  // Parse function name if necessary
  let token = parseTree[cursor];
  if (token instanceof Token && token.type === TokenType.Var) {
    functionName = token.lexeme;
    cursor += 1;
  }

  // Parse inline export if necessary
  // Inline exports are in the format of (func $name (export "name"))
  token = parseTree[cursor];
  if (
    token instanceof Array
    && token[0] instanceof Token
    && token[0].type === TokenType.Export
    && token[1] instanceof Token
  ) {
    inlineExportName = token[1].extractText();
    cursor++;
  }

  // Parse function param declaration
  for (; cursor < parseTree.length; cursor++) {
    const parseTreeNode = parseTree[cursor];
    if (
      parseTreeNode instanceof Token
      || !isFunctionParamDeclaration(parseTreeNode)
    ) {
      break;
    }
    const { types, names } = parseFunctionParamExpression(parseTreeNode);
    paramTypes.push(...types);
    paramNames.push(...names);
  }

  // Parse function result declaration
  for (; cursor < parseTree.length; cursor++) {
    const parseTreeNode = parseTree[cursor];
    if (
      parseTreeNode instanceof Token
      || !isFunctionResultDeclaration(parseTreeNode)
    ) {
      break;
    }
    const types = parseFunctionResultExpression(parseTreeNode);
    resultTypes.push(...types);
  }

  // Parse function local declaration
  for (; cursor < parseTree.length; cursor++) {
    const parseTreeNode = parseTree[cursor];
    if (
      parseTreeNode instanceof Token
      || !isFunctionLocalDeclaration(parseTreeNode)
    ) {
      break;
    }
    const { types, names } = parseFunctionLocalExpression(parseTreeNode);
    localTypes.push(...types);
    localNames.push(...names);
  }

  // Parse function params and declarations first
  let remainingTree: ParseTree = parseTree.slice(cursor);

  // If the function body is something like [add 1 0], slicing the tree yields:
  // [[add 1 0]] --> this is not a valid s-expression that can be parsed.
  // Token check is in place to avoid opening up [token] => token, the latter of which also cannot be parsed
  if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
    remainingTree = remainingTree[0];
  }

  const ir = parseExpression(remainingTree);
  return new FunctionExpression(
    functionName,
    inlineExportName,
    paramTypes,
    paramNames,
    resultTypes,
    localTypes,
    localNames,
    ir,
  );
}

function parseFunctionParamExpression(parseTree: ParseTree): {
  types: ValueType[];
  names: (string | null)[];
} {
  const types: ValueType[] = [];
  const names: (string | null)[] = [];
  for (let i = 1; i < parseTree.length; i++) {
    const parseTreeNode = parseTree[i];
    if (!(parseTreeNode instanceof Token)) {
      throw new Error(); // TODO better error
    }
    if (parseTreeNode.type === TokenType.ValueType) {
      types.push(parseTreeNode.valueType!);
      names.push(null);
    } else if (parseTreeNode.type === TokenType.Var) {
      names.push(parseTreeNode.lexeme);
      const nextToken = parseTree[++i];
      assert(
        nextToken instanceof Token && nextToken.type === TokenType.ValueType,
        `Expected Token Type to be a value type: ${nextToken}`,
      );
      types.push((nextToken as Token).valueType!); // TODO better errors
    } else {
      throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
    }
  }

  return {
    types,
    names,
  };
}

function parseFunctionResultExpression(parseTree: ParseTree): ValueType[] {
  const types: ValueType[] = [];
  for (let i = 1; i < parseTree.length; i++) {
    const parseTreeNode = parseTree[i];
    if (!(parseTreeNode instanceof Token)) {
      throw new Error();
    }
    if (parseTreeNode.type === TokenType.ValueType) {
      types.push(parseTreeNode.valueType!);
    } else {
      throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
    }
  }
  return types;
}

function parseFunctionLocalExpression(parseTree: ParseTree): {
  types: ValueType[];
  names: (string | null)[];
} {
  const types: ValueType[] = [];
  const names: (string | null)[] = [];
  for (let i = 1; i < parseTree.length; i++) {
    const parseTreeNode = parseTree[i];
    if (!(parseTreeNode instanceof Token)) {
      throw new Error(); // TODO better error
    }
    if (parseTreeNode.type === TokenType.ValueType) {
      types.push(parseTreeNode.valueType!);
      names.push(null);
    } else if (parseTreeNode.type === TokenType.Var) {
      names.push(parseTreeNode.lexeme);
      const nextToken = parseTree[++i];
      assert(
        nextToken instanceof Token && nextToken.type === TokenType.ValueType,
        `Expected Token Type to be a value type: ${nextToken}`,
      );
      types.push((nextToken as Token).valueType!); // TODO better errors
    } else {
      throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
    }
  }

  return {
    types,
    names,
  };
}

function parseModuleExpression(parseTree: ParseTree): ModuleExpression {
  assert(isModuleDeclaration(parseTree));

  const functionExps: FunctionExpression[] = [];
  const exportExps: ExportExpression[] = [];
  for (let i = 1; i < parseTree.length; i++) {
    const parseTreeNode = parseTree[i];
    if (parseTreeNode instanceof Token) {
      throw new Error(); // Better error mesage
    }

    if (isFunctionExpression(parseTreeNode)) {
      functionExps.push(parseFunctionExpression(parseTreeNode));
    }

    if (isExportDeclaration(parseTreeNode)) {
      exportExps.push(...parseExportDeclaration(parseTreeNode));
    }
  }

  return new ModuleExpression(...functionExps, ...exportExps); // TODO fix this: only first export experssion is passed
}

function parseExportDeclaration(parseTree: ParseTree): ExportExpression[] {
  assert(isExportDeclaration(parseTree));

  const exportExpressions: ExportExpression[] = [];

  for (let i = 1; i < parseTree.length; i += 2) {
    const exportName = parseTree[i];
    if (!(exportName instanceof Token)) {
      throw new Error(); // Better error mesage
    }
    const exportInfo = parseTree[i + 1];
    if (!(exportInfo instanceof Array<Token>)) {
      throw new Error(); // Better error mesage
    }
    const [exportType, exportIndex] = exportInfo;
    if (!(exportType instanceof Token && exportIndex instanceof Token)) {
      throw new Error(); // Better error mesage
    }

    exportExpressions.push(
      new ExportExpression(exportName, exportType, exportIndex),
    );
  }

  return exportExpressions;
}
/*
  Checks for Parse Tree
*/

function isSExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  assert(
    tokenHeader instanceof Token,
    `first token of ${parseTree} is not a Token type`,
  );

  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && Opcode.getParamLength(tokenHeader.opcodeType!) > 0
  );
}

function isStackExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  assert(
    tokenHeader instanceof Token,
    `first token of ${parseTree} is not a Token type`,
  );
  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && !isFunctionExpression(parseTree)
    && !isSExpression(parseTree)
    // && !isModuleDeclaration(parseTree)
  );
}

function isFunctionExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Func;
}

function isFunctionParamDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Param;
}

function isFunctionResultDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Result;
}

function isFunctionLocalDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Local;
}

function isModuleDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Module;
}

function isExportDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Export;
}

function isBlockExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.isBlock();
}
function isReservedType(token: Token, lexeme: string) {
  return token.type === TokenType.Reserved && token.lexeme === lexeme;
}
