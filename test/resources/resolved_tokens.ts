import { OpcodeType } from '../../src/common/opcode';
import { Token, TokenType } from '../../src/common/token';
import { ValueType } from '../../src/common/type';
import assert from 'assert';

export interface TokenData {
  type: TokenType;
  lexeme: string;
  opcodeType: OpcodeType | null;
  valueType: ValueType | null;
}

export namespace TokenData {
  export function toToken(tokenData: TokenData) {
    return new Token(tokenData.type, tokenData.lexeme, -1, -1, -1, tokenData.opcodeType, tokenData.valueType);
  }
  export function fromToken(token: Token): TokenData {
    return {
      type: token.type,
      lexeme: token.lexeme,
      opcodeType: token.opcodeType,
      valueType: token.valueType,
    };
  }
}


namespace TokenObjects {
  export const getNatToken = (n: number) => {
    assert(Number.isInteger(n));
    return {
      type: TokenType.Nat,
      lexeme: n.toString(),
      opcodeType: null,
      valueType: null,
    };
  };
  export const LPAR: TokenData = {
    type: TokenType.Lpar,
    lexeme: '(',
    opcodeType: null,
    valueType: null,
  };
  export const RPAR: TokenData = {
    type: TokenType.Rpar,
    lexeme: ')',
    opcodeType: null,
    valueType: null,
  };
  export const F64: TokenData = {
    type: TokenType.ValueType,
    lexeme: 'f64',
    opcodeType: null,
    valueType: 3,
  };
  export const F64_ADD: TokenData = {
    type: TokenType.Binary,
    lexeme: 'f64.add',
    opcodeType: 150,
    valueType: null,
  };
  export const F64_CONST: TokenData = {
    type: TokenType.Const,
    lexeme: 'f64.const',
    opcodeType: 58,
    valueType: null,
  };
  export const I32: TokenData = {
    type: TokenType.ValueType,
    lexeme: 'i32',
    opcodeType: null,
    valueType: ValueType.I32,
  };
  export const I32_ADD: TokenData = {
    type: TokenType.Binary,
    lexeme: 'i32.add',
    opcodeType: OpcodeType.I32Add,
    valueType: null,
  };
  export const ONE_POINT_FIVE: TokenData = {
    type: TokenType.Float,
    lexeme: '1.5',
    opcodeType: null,
    valueType: null,
  };
  export const LOCAL_GET: TokenData = {
    type: TokenType.LocalGet,
    lexeme: 'local.get',
    opcodeType: 25,
    valueType: null,
  };
  export const VAR_P: TokenData = {
    type: TokenType.Var,
    lexeme: '$p',
    opcodeType: null,
    valueType: null,
  };
  export const FUNC: TokenData = {
    type: TokenType.Func,
    lexeme: 'func',
    opcodeType: null,
    valueType: 7,
  };
  export const PARAM: TokenData = {
    type: TokenType.Param,
    lexeme: 'param',
    opcodeType: null,
    valueType: null,
  };
  export const RESULT: TokenData = {
    type: TokenType.Result,
    lexeme: 'result',
    opcodeType: null,
    valueType: null,
  };

}
const resolvedTokens: Record<string, TokenData> = {
  '(': TokenObjects.LPAR,
  ')': TokenObjects.RPAR,
  'f64': TokenObjects.F64,
  'f64.add': TokenObjects.F64_ADD,
  'f64.const': TokenObjects.F64_CONST,
  'i32': TokenObjects.I32,
  'i32.add': TokenObjects.I32_ADD,
  '1.5': TokenObjects.ONE_POINT_FIVE,
  'local.get': TokenObjects.LOCAL_GET,
  '$p': TokenObjects.VAR_P,
  'func': TokenObjects.FUNC,
  'param': TokenObjects.PARAM,
  'result': TokenObjects.RESULT,
};

export function getExpectedTokenData(lexeme: string): TokenData {
  if (/^\d+$/.test(lexeme)) {
    return TokenObjects.getNatToken(Number.parseInt(lexeme));
  }
  return resolvedTokens[lexeme];
}

export function getSampleToken(lexeme: string): Token {
  return TokenData.toToken(getExpectedTokenData(lexeme));
}

// export function checkToken(token: TokenData | Token) {
//   const expectedToken = getExpectedTokenData(token.lexeme);

//   assert(hasSameData(token, expectedToken));
// }

export function hasSameData(lhs: TokenData | Token, rhs: TokenData | Token) {
  return (
    lhs.type === rhs.type
        && lhs.lexeme === rhs.lexeme
        && lhs.opcodeType === rhs.opcodeType
        && lhs.valueType === rhs.valueType
  );
}
