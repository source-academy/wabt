import {
  OperationTree,
  UnfoldedTokenExpression,
  type IntermediateRepresentation,
} from './ir';
import { Token, TokenType } from '../common/token';
import { type TokenTree } from './tree_types';
import assert from 'assert';
import { Opcode } from '../common/opcode';

export function getIntermediateRepresentation(
  tokenTree: TokenTree,
): IntermediateRepresentation {
  if (isSExpression(tokenTree)) {
    const head = tokenTree[0];
    assert(head instanceof Token); // Head should be token here, assert to make typescript happy

    const body: (Token | OperationTree)[] = [];
    for (let i = 1; i < tokenTree.length; i++) {
      const token = tokenTree[i];
      if (token instanceof Token) {
        body.push(token);
      } else {
        const irNode = getIntermediateRepresentation(token);
        assert(irNode instanceof Token || irNode instanceof OperationTree);
        body.push(irNode);
      }
    }

    return new OperationTree(head, body);
  }

  if (isStackExpression(tokenTree)) {
    const nodes: (Token | OperationTree)[] = [];
    tokenTree.forEach((tokenNode) => {
      if (tokenNode instanceof Token) {
        nodes.push(tokenNode);
      } else {
        const temp = getIntermediateRepresentation(tokenNode);
        assert(temp instanceof Token || temp instanceof OperationTree);
        nodes.push(temp);
      }
    });

    return new UnfoldedTokenExpression(nodes);
  }

  throw new Error(
    `Unexpected token type to parse: ${JSON.stringify(tokenTree)}`,
  );
}

function isSExpression(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
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
    && !isFunctionDeclaration(tokenTree)
    // && !isModuleDeclaration(tokenTree)
    // && !isStackExpression(tokenTree)
  );
}

function isFunctionDeclaration(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && isReservedType(tokenHeader, 'func');
}

function isModuleDeclaration(tokenTree: TokenTree): boolean {
  const tokenHeader = tokenTree[0];
  return tokenHeader instanceof Token && isReservedType(tokenHeader, 'module');
}

function isReservedType(token: Token, lexeme: string) {
  return token.type === TokenType.Reserved && token.lexeme === lexeme;
}
