/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { type Token } from '../../src/common/token';
import { ValueType } from '../../src/common/type';
import {
  EmptyTokenExpression,
  FunctionExpression,
  OperationTree,
  PureUnfoldedTokenExpression,
  UnfoldedTokenExpression,
} from '../../src/parser/ir';
import { Tree } from '../../src/parser/tree_types';
import { getSampleToken as t } from './resolved_tokens';

interface TestCaseData {
  str: string;
  tokens: Array<Token>;
  parseTree: Tree<Token>;
  ir: FunctionExpression;
  minimal_binary_function_signature: Uint8Array;
  minimal_binary_function_body: Uint8Array;
}

const simple_function_sexpr_with_param_names: TestCaseData = {
  str: `
    (func (param $p f64)
    (result f64)
    (f64.add 
      (local.get $p)
      (local.get $p))
    )
      `,
  tokens: [
    ...['(', 'func', '(', 'param', '$p', 'f64', ')'],
    ...['(', 'result', 'f64', ')'],
    ...['(', 'f64.add'],
    ...['(', 'local.get', '$p', ')'],
    ...['(', 'local.get', '$p', ')', ')'],
    ...[')'],
  ].map(t),

  parseTree: Tree.treeMap(
    [
      'func',
      ['param', '$p', 'f64'],
      ['result', 'f64'],
      ['f64.add', ['local.get', '$p'], ['local.get', '$p']],
    ],
    t,
  ),
  ir: new FunctionExpression(
    [ValueType.F64],
    [ValueType.F64],
    ['$p'],
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('local.get'), t('$p')]),
      new UnfoldedTokenExpression([t('local.get'), t('$p')]),
    ]),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x01, 0x7c, 0x01, 0x7c,
  ]),
  minimal_binary_function_body: new Uint8Array([
    0x07, 0x00, 0x20, 0x00, 0x20, 0x00, 0xa0, 0x0b,
  ]),
};

const simple_add_function_no_param_names: TestCaseData = {
  str: `
  (func (param i32) (param i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
    `,
  tokens: [
    ...[
      '(',
      'func',
      '(',
      'param',
      'i32',
      ')',
      '(',
      'param',
      'i32',
      ')',
      '(',
      'result',
      'i32',
      ')',
    ],
    ...['local.get', '0'],
    ...['local.get', '1'],
    ...['i32.add', ')'],
  ].map(t),

  parseTree: Tree.treeMap(
    [
      'func',
      ['param', 'i32'],
      ['param', 'i32'],
      ['result', 'i32'],
      'local.get',
      '0',
      'local.get',
      '1',
      'i32.add',
    ],
    t,
  ),
  ir: new FunctionExpression(
    [ValueType.I32, ValueType.I32],
    [ValueType.I32],
    [],
    new UnfoldedTokenExpression(
      ['local.get', '0', 'local.get', '1', 'i32.add'].map(t),
    ),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
  ]),
  minimal_binary_function_body: new Uint8Array([
    0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b,
  ]),
};

const named_function: TestCaseData = {
  str: '(func $name (param) (result))',
  tokens: [
    '(',
    'func',
    '$name',
    '(',
    'param',
    ')',
    '(',
    'result',
    ')',
    ')',
  ].map(t),
  parseTree: [t('func'), t('$name'), [t('param')], [t('result')]],
  ir: new FunctionExpression([], [], [], new EmptyTokenExpression([]), '$name'),
  minimal_binary_function_signature: new Uint8Array([0x60, 0x00, 0x00]),
  minimal_binary_function_body: new Uint8Array([0x01, 0x02, 0x00, 0x0b]),
};

// const function_combined_params: TestCaseData = {
//   str: '(func (param f64 f64 f64) (result))',
//   tokens: [
//     '(',
//     'func',
//     '(',
//     'param',
//     'f64',
//     'f64',
//     'f64',
//     ')',
//     '(',
//     'result',
//     ')',
//     ')',
//   ].map(t),
//   parseTree: [],
//   ir: undefined,
//   minimal_binary_function_signature: undefined,
//   minimal_binary_function_body: undefined,
// };

// const function_all_named_params: TestCaseData = {
//   str: `
// (func (param $one f64) (param $two f64) (param $three f64) (result f64)
//   local.get $two
// )
// `,
//   tokens: [],
//   parseTree: [],
//   ir: undefined,
//   minimal_binary_function_signature: undefined,
//   minimal_binary_function_body: undefined,
// };

// const function_some_named_params: TestCaseData = {
//   str: `
// (func (param f64) (param f64) (param $three f64) (result f64)
//   local.get $three
// )
// `,
//   tokens: [],
//   parseTree: [],
//   ir: undefined,
//   minimal_binary_function_signature: undefined,
//   minimal_binary_function_body: undefined,
// };

// const function_multiple_separate_result: TestCaseData = {
//   str: `
// (func $name (param) (result f64) (result f64)
//   f64.const 1
//   f64.const 1
// )
// `,
//   tokens: [],
//   parseTree: [],
//   ir: undefined,
//   minimal_binary_function_signature: undefined,
//   minimal_binary_function_body: undefined,
// };

// const function_multiple_combined_result: TestCaseData = {
//   str: `
// (func $name (param) (result f64 f64)
//   f64.const 1
//   f64.const 1
// )
// `,
//   tokens: [],
//   parseTree: [],
//   ir: undefined,
//   minimal_binary_function_signature: undefined,
//   minimal_binary_function_body: undefined,
// };

/*
(func (param $one f64 $two f64 $three f64) (result)) // throws
*/

export const validTestCases = [
  simple_function_sexpr_with_param_names,
  simple_add_function_no_param_names,
  named_function,
];
