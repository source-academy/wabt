import {
  FunctionExpression,
  OperationTree,
  UnfoldedTokenExpression,
  type IntermediateRepresentation, FunctionBody, FunctionSignature, ModuleExpression, type TokenExpression, ExportExpression, ExportObject,
} from './ir';
import { Token, TokenType } from '../common/token';
import { type TokenTree } from './tree_types';

import { Opcode } from '../common/opcode';
import { type ValueType } from '../common/type';
import { assert } from '../common/assert';

export function getIntermediateRepresentation(
  tokenTree: TokenTree,
): IntermediateRepresentation {
  if (isSExpression(tokenTree) || isStackExpression(tokenTree)) {
    return parseExpression(tokenTree);
  }

  if (isFunctionExpression(tokenTree)) {
    return parseFunctionExpression(tokenTree);
  }

  if (isModuleDeclaration(tokenTree)) {
    return parseModuleExpression(tokenTree);
  }

  if (isExportDeclaration(tokenTree)) {
    return parseExportDeclaration(tokenTree);
  }

  throw new Error(
    `Unexpected token type to parse: ${JSON.stringify(tokenTree, undefined, 2)}`,
  );
}

/*
  Functions for parsing
*/
function parseExpression(tokenTree:TokenTree): TokenExpression {
  // console.log(tokenTree[0]);
  // console.log(isSExpression(tokenTree));
  // console.log(isStackExpression(tokenTree));
  if (isSExpression(tokenTree)) {
    return parseSExpression(tokenTree);
  }

  if (isStackExpression(tokenTree)) {
    return parseStackExpression(tokenTree);
  }

  throw new Error(`Cannot parse into function expression: ${JSON.stringify(tokenTree, undefined, 2)}`); // TODO legit error message when coming from function declarations.
}

function parseSExpression(tokenTree: TokenTree): OperationTree {
  let head = tokenTree[0];
  assert(head instanceof Token); // Head should be token here, assert to make typescript happy
  head = head as Token;

  const body: (Token | TokenExpression)[] = [];
  for (let i = 1; i < tokenTree.length; i++) {
    const token = tokenTree[i];
    if (token instanceof Token) {
      body.push(token);
    } else {
      const irNode = getIntermediateRepresentation(token);
      if (!(irNode instanceof Token || irNode instanceof OperationTree || irNode instanceof UnfoldedTokenExpression)) {
        throw new Error(); //TODO proper error
      }
      body.push(irNode);
    }
  }

  assert(Opcode.getParamLength(head.opcodeType!) === body.length);
  return new OperationTree(head, body);
}

function parseStackExpression(tokenTree: TokenTree): UnfoldedTokenExpression {
  const nodes: (Token | OperationTree)[] = [];
  tokenTree.forEach((tokenNode) => {
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

function parseFunctionExpression(tokenTree: TokenTree): FunctionExpression {
  assert(isFunctionExpression(tokenTree));
  const paramTypes: ValueType[] = [];
  const paramNames: string[] = [];
  const resultTypes: ValueType[] = [];

  const parseParam = (tokenTree: TokenTree) => {
    for (let i = 1; i < tokenTree.length; i++) {
      const tokenTreeNode = tokenTree[i];
      if (!(tokenTreeNode instanceof Token)) {
        throw new Error(); // TODO better error
      }
      if (tokenTreeNode.type === TokenType.ValueType) {
        paramTypes.push(tokenTreeNode.valueType!);
      } else if (tokenTreeNode.type === TokenType.Var) {
        paramNames.push(tokenTreeNode.lexeme);
      } else {
        throw new Error(`Unexpected token, bla bla ${tokenTreeNode}`); // TODO Proper error message and type
      }
    }
  };

  const parseResult = (tokenTree: TokenTree) => {
    for (let i = 1; i < tokenTree.length; i++) {
      const tokenTreeNode = tokenTree[i];
      if (!(tokenTreeNode instanceof Token)) {
        throw new Error();
      }
      if (tokenTreeNode.type === TokenType.ValueType) {
        resultTypes.push(tokenTreeNode.valueType!);
      } else {
        throw new Error(`Unexpected token, bla bla ${tokenTreeNode}`); // TODO Proper error message and type
      }
    }
  };

  // Parse function params and declarations first
  // TODO this does not work when the first few function params are not named, and then some are named afterwards.
  let cursor;
  for (cursor = 1; cursor < tokenTree.length; cursor++) {
    const tokenTreeNode = tokenTree[cursor];
    if (tokenTreeNode instanceof Token) {
      break;
    }
    if (isFunctionParamDeclaration(tokenTreeNode)) {
      parseParam(tokenTreeNode);
    } else if (isFunctionResultDeclaration(tokenTreeNode)) {
      parseResult(tokenTreeNode);
    } else {
      break;
    }
  }
  let remainingTree: TokenTree = tokenTree.slice(cursor);

  // If the function body is something like [add 1 0], slicing the tree yields:
  // [[add 1 0]] --> this is not a valid s-expression that can be parsed.
  // Token check is in place to avoid opening up [token] => token, the latter of which also cannot be parsed
  if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
    remainingTree = remainingTree[0];
  }

  const ir = parseExpression(remainingTree);
  return new FunctionExpression(paramTypes, resultTypes, paramNames, ir);
}

function parseModuleExpression(tokenTree: TokenTree): ModuleExpression {
  assert(isModuleDeclaration(tokenTree));

  const functionExps: FunctionExpression[] = [];
  const exportExps: ExportExpression[] = [];
  for (let i = 1; i < tokenTree.length; i++) {
    const tokenTreeNode = tokenTree[i];
    if (tokenTreeNode instanceof Token) {
      throw new Error(); // Better error mesage
    }

    if (isFunctionExpression(tokenTreeNode)) {
      functionExps.push(parseFunctionExpression(tokenTreeNode));
    }

    if (isExportDeclaration(tokenTreeNode)) {
      exportExps.push(parseExportDeclaration(tokenTreeNode));
    }
  }

  return new ModuleExpression(functionExps, exportExps[0]); // TODO fix this: only first export experssion is passed
}

function parseExportDeclaration(tokenTree: TokenTree): ExportExpression {
  assert(isExportDeclaration(tokenTree));

  const exportObjects: ExportObject[] = [];

  for (let i = 1; i < tokenTree.length; i += 2) {
    const exportName = tokenTree[i];
    if (!(exportName instanceof Token)) {
      throw new Error(); // Better error mesage
    }
    const exportInfo = tokenTree[i + 1];
    if (!(exportInfo instanceof Array<Token>)) {
      throw new Error(); // Better error mesage
    }
    const [exportType, exportIndex] = exportInfo;
    if (!(exportType instanceof Token && exportIndex instanceof Token)) {
      throw new Error(); // Better error mesage
    }

    exportObjects.push(new ExportObject(exportName, exportType, exportIndex));
  }

  return new ExportExpression(exportObjects);
}
/*
  Checks for TokenTree
*/

function isSExpression(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  assert(tokenHeader instanceof Token);
  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && Opcode.getParamLength(tokenHeader.opcodeType!) > 0
  );
}

function isStackExpression(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && !isFunctionExpression(tokenTree)
    && !isSExpression(tokenTree)
    // && !isModuleDeclaration(tokenTree)
  );
}

function isFunctionExpression(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Func;
}

function isFunctionParamDeclaration(tokenTree:TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Param;
}

function isFunctionResultDeclaration(tokenTree:TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Result;
}

function isModuleDeclaration(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Module;
}

function isExportDeclaration(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Export;
}

function isReservedType(token: Token, lexeme: string) {
  return token.type === TokenType.Reserved && token.lexeme === lexeme;
}
