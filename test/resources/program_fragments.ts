/* eslint-disable import/no-extraneous-dependencies */
import { type IntermediateRepresentation } from '../../src/parser/ir';
import { type Tree } from '../../src/parser/tree_types';



interface TestCaseData {
  str: string;
  tokens: Array<string>;
  tokenTreeStr: Tree<string>;
  ir?: IntermediateRepresentation;
  minimal_binary?: Uint8Array;
}

export const simple_addition_sexpr: TestCaseData = {
  str: `
  (f64.add
      f64.const 1
      f64.const 1.5)
  `,
  tokens: ['(', 'f64.add', 'f64.const', '1', 'f64.const', '1.5', ')'],
  tokenTreeStr: ['f64.add', 'f64.const', '1', 'f64.const', '1.5'],
  ir: undefined,
  minimal_binary: undefined,
};

export const simple_addition_stack: TestCaseData = {
  str: `
  (f64.const 1
      f64.const 1.5
      f64.add)
  `,
  tokens: ['(', 'f64.const', '1', 'f64.const', '1.5', 'f64.add', ')'],
  tokenTreeStr: ['f64.const', '1', 'f64.const', '1.5', 'f64.add'],
  ir: undefined,
  minimal_binary: undefined,
};

export const nested_addition_stack: TestCaseData = {
  str: `
    f64.const 1
    f64.const 1
    f64.add
    f64.const 1
    f64.const 1
    f64.add
    f64.add
    `,
  tokens: ['f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.add'],
  tokenTreeStr: ['f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.add'],
  ir: undefined,
  minimal_binary: undefined,
};

export const nested_addition_sexpr: TestCaseData = {
  str: `
  (f64.add
    (f64.add
        f64.const 1
        f64.const 1)
    (f64.add
        f64.const 1
        f64.const 1)))
    `,
  tokens: [
    ...['(', 'f64.add'],
    ...['(', 'f64.add'],
    ...['f64.const', '1'],
    ...['f64.const', '1', ')'],
    ...['(', 'f64.add'],
    ...['f64.const', '1'],
    ...['f64.const', '1', ')'],
    ')',
    ')',
  ],
  tokenTreeStr: [
    'f64.add',
    ['f64.add', 'f64.const', '1', 'f64.const', '1'],
    ['f64.add', 'f64.const', '1', 'f64.const', '1'],
  ],
  ir: undefined,
  minimal_binary: undefined,
};

export const simple_function_sexpr: TestCaseData = {
  str: `
  (func (param $p f64)
  (result f64)
  (f64.add 
    local.get $p
    local.get $p)
  )
    `,
  tokens: [
    ...['(', 'func', '(', 'param', '$p', 'f64', ')'],
    ...['(', 'result', 'f64', ')'],
    ...['(', 'f64.add'],
    ...['local.get', '$p'],
    ...['local.get', '$p', ')'],
    ...[')'],
  ],

  tokenTreeStr: ['func',
    ['param', '$p', 'f64'],
    ['result', 'f64'],
    ['f64.add', 'local.get', '$p', 'local.get', '$p']],
  ir: undefined,
  minimal_binary: undefined,
};
