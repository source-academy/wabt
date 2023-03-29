/* eslint-disable import/no-extraneous-dependencies */
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { type IntermediateRepresentation } from '../../src/parser/ir';
import { Token } from '../../src/common/token';
import { type Tree, type TokenTree } from '../../src/parser/tree_types';
import { getSingleToken } from '../../src/lexer/lexer';



interface TestCase {
  str?: string;
  tokens?: Token[];
  tokenTreeStr?: Tree<string>;
  ir?: IntermediateRepresentation;
  bytecode?: Uint8Array;
}

export const f64_addition_sexpr = {
  str: `
  (f64.add
      f64.const 1
      f64.const 1.5)
  `,

  tokens: plainToInstance(Token, [{
    type: '(',
    lexeme: '',
    line: 1,
    col: 0,
    indexInSource: 4,
    opcodeType: null,
    valueType: null,
  }, {
    type: 'BINARY',
    lexeme: 'f64.add',
    line: 1,
    col: 0,
    indexInSource: 11,
    opcodeType: 150,
    valueType: null,
  }, {
    type: 'CONST',
    lexeme: 'f64.const',
    line: 2,
    col: 0,
    indexInSource: 27,
    opcodeType: 58,
    valueType: null,
  }, {
    type: 'NAT',
    lexeme: '1',
    line: 2,
    col: 0,
    indexInSource: 29,
    opcodeType: null,
    valueType: null,
  }, {
    type: 'CONST',
    lexeme: 'f64.const',
    line: 3,
    col: 0,
    indexInSource: 45,
    opcodeType: 58,
    valueType: null,
  }, {
    type: 'FLOAT',
    lexeme: '1.5',
    line: 3,
    col: 0,
    indexInSource: 49,
    opcodeType: null,
    valueType: null,
  }, {
    type: ')',
    lexeme: '',
    line: 3,
    col: 0,
    indexInSource: 50,
    opcodeType: null,
    valueType: null,
  }]),

  tokenTreeStr: ['f64.add',
    ['f64.const', '1'],
    ['f64.const', '1.5']],
};

export const f64_addition_stack = {
  str: `
  (f64.const 1
      f64.const 1.5
      f64.add)
  `,
  tokens: plainToInstance(Token, [{
    type: '(',
    lexeme: '',
    line: 1,
    col: 0,
    indexInSource: 4,
    opcodeType: null,
    valueType: null,
  }, {
    type: 'CONST',
    lexeme: 'f64.const',
    line: 1,
    col: 0,
    indexInSource: 13,
    opcodeType: 58,
    valueType: null,
  }, {
    type: 'NAT',
    lexeme: '1',
    line: 1,
    col: 0,
    indexInSource: 15,
    opcodeType: null,
    valueType: null,
  }, {
    type: 'CONST',
    lexeme: 'f64.const',
    line: 2,
    col: 0,
    indexInSource: 31,
    opcodeType: 58,
    valueType: null,
  }, {
    type: 'FLOAT',
    lexeme: '1.5',
    line: 2,
    col: 0,
    indexInSource: 35,
    opcodeType: null,
    valueType: null,
  }, {
    type: 'BINARY',
    lexeme: 'f64.add',
    line: 3,
    col: 0,
    indexInSource: 49,
    opcodeType: 150,
    valueType: null,
  }, {
    type: ')',
    lexeme: '',
    line: 3,
    col: 0,
    indexInSource: 50,
    opcodeType: null,
    valueType: null,
  }]),

  tokenTreeStr: [
    ['f64.const', '1'],
    ['f64.const', '1.5'],
    'f64.add',
  ],
};

export const double_function: TestCase = {
  str: `(func (param $p i32)
  (result i32)
  local.get $p
  local.get $p
  i32.add)
`,

  tokenTreeStr: ['func',
    ['param', '$p', 'i32'],
    ['result', 'i32'],
    ['local.get', '$p'],
    ['local.get', '$p'],
    ['i32.add']],
};
