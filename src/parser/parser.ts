import {
  FunctionExpression,
  OperationTree,
  UnfoldedTokenExpression,
  type IntermediateRepresentation,
  ModuleExpression,
  type TokenExpression,
  ExportExpression,
} from './ir';
import { Token, TokenType } from '../common/token';
import { type ParseTree } from './tree_types';

import { Opcode } from '../common/opcode';
import { type ValueType } from '../common/type';
import { assert } from '../common/assert';

export function getIntermediateRepresentation(
  parseTree: ParseTree,
): IntermediateRepresentation {
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
      const irNode = getIntermediateRepresentation(token);
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

  assert(Opcode.getParamLength(head.opcodeType!) === body.length);
  return new OperationTree(head, body);
}

function parseStackExpression(parseTree: ParseTree): UnfoldedTokenExpression {
  const nodes: (Token | OperationTree)[] = [];
  parseTree.forEach((tokenNode) => {
    if (tokenNode instanceof Token) {
      nodes.push(tokenNode);
    } else {
      const temp = getIntermediateRepresentation(tokenNode);
      if (!(temp instanceof Token || temp instanceof OperationTree)) {
        throw new Error(); // TODO proper error
      }
      nodes.push(temp);
    }
  });

  return new UnfoldedTokenExpression(nodes);
}

function parseFunctionExpression(parseTree: ParseTree): FunctionExpression {
  assert(isFunctionExpression(parseTree));
  const paramTypes: ValueType[] = [];
  const paramNames: string[] = [];
  const resultTypes: ValueType[] = [];

  const parseParam = (parseTree: ParseTree) => {
    for (let i = 1; i < parseTree.length; i++) {
      const parseTreeNode = parseTree[i];
      if (!(parseTreeNode instanceof Token)) {
        throw new Error(); // TODO better error
      }
      if (parseTreeNode.type === TokenType.ValueType) {
        paramTypes.push(parseTreeNode.valueType!);
      } else if (parseTreeNode.type === TokenType.Var) {
        paramNames.push(parseTreeNode.lexeme);
      } else {
        throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
      }
    }
  };

  const parseResult = (parseTree: ParseTree) => {
    for (let i = 1; i < parseTree.length; i++) {
      const parseTreeNode = parseTree[i];
      if (!(parseTreeNode instanceof Token)) {
        throw new Error();
      }
      if (parseTreeNode.type === TokenType.ValueType) {
        resultTypes.push(parseTreeNode.valueType!);
      } else {
        throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
      }
    }
  };

  // Parse function params and declarations first
  // TODO this does not work when the first few function params are not named, and then some are named afterwards.
  let cursor;
  for (cursor = 1; cursor < parseTree.length; cursor++) {
    const parseTreeNode = parseTree[cursor];
    if (parseTreeNode instanceof Token) {
      break;
    }
    if (isFunctionParamDeclaration(parseTreeNode)) {
      parseParam(parseTreeNode);
    } else if (isFunctionResultDeclaration(parseTreeNode)) {
      parseResult(parseTreeNode);
    } else {
      break;
    }
  }
  let remainingTree: ParseTree = parseTree.slice(cursor);

  // If the function body is something like [add 1 0], slicing the tree yields:
  // [[add 1 0]] --> this is not a valid s-expression that can be parsed.
  // Token check is in place to avoid opening up [token] => token, the latter of which also cannot be parsed
  if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
    remainingTree = remainingTree[0];
  }

  const ir = parseExpression(remainingTree);
  return new FunctionExpression(paramTypes, resultTypes, paramNames, ir);
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
  assert(tokenHeader instanceof Token);
  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && Opcode.getParamLength(tokenHeader.opcodeType!) > 0
  );
}

function isStackExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
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

function isModuleDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Module;
}

function isExportDeclaration(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Export;
}

function isReservedType(token: Token, lexeme: string) {
  return token.type === TokenType.Reserved && token.lexeme === lexeme;
}
