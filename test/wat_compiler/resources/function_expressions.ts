/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { type Token } from '../../../src/common/token';
import { ValueType } from '../../../src/common/type';
import {
  EmptyTokenExpression,
  FunctionExpression,
  OperationTree,
  UnfoldedTokenExpression,
} from '../../../src/wat_compiler/ir_types';
import { Tree } from '../../../src/wat_compiler/tree_types';
import { getSampleToken as t } from './resolved_tokens';

interface ValidTestCaseData {
  str: string;
  parseTree: Tree<Token>;
  ir: FunctionExpression;
  minimal_binary_function_signature: Uint8Array;
  minimal_binary_function_body: Uint8Array;
}

interface InvalidTestCaseData {
  str: string;
}

const simple_function_sexpr_with_param_names: ValidTestCaseData = {
  str: `
    (func (param $p f64)
    (result f64)
    (f64.add 
      (local.get $p)
      (local.get $p))
    )
      `,
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
    null,
    null,
    [ValueType.F64],
    ['$p'],
    [ValueType.F64],
    [],
    [],
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

const simple_add_function_no_param_names: ValidTestCaseData = {
  str: `
  (func (param i32) (param i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
    `,
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
    null,
    null,
    [ValueType.I32, ValueType.I32],
    [null, null],
    [ValueType.I32],
    [],
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

const named_empty_function: ValidTestCaseData = {
  str: '(func $name (param) (result))',
  parseTree: [t('func'), t('$name'), [t('param')], [t('result')]],
  ir: new FunctionExpression(
    '$name',
    null,
    [],
    [],
    [],
    [],
    [],
    new EmptyTokenExpression(),
  ),
  minimal_binary_function_signature: new Uint8Array([0x60, 0x00, 0x00]),
  minimal_binary_function_body: new Uint8Array([0x02, 0x00, 0x0b]),
};

const empty_function_with_combined_params: ValidTestCaseData = {
  str: '(func (param f64 f64 f64) (result))',
  parseTree: [
    t('func'),
    [t('param'), t('f64'), t('f64'), t('f64')],
    [t('result')],
  ],
  ir: new FunctionExpression(
    null,
    null,
    [ValueType.F64, ValueType.F64, ValueType.F64],
    [null, null, null],
    [],
    [],
    [],
    new EmptyTokenExpression(),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x03, 0x7c, 0x7c, 0x7c, 0x00,
  ]),
  minimal_binary_function_body: new Uint8Array([0x02, 0x00, 0x0b]),
};

const function_all_named_params: ValidTestCaseData = {
  str: `
( func (param $one f64) (param $two f64) (param $three f64) (result f64)
  local.get $two
)
`,
  parseTree: Tree.treeMap(
    [
      'func',
      ['param', '$one', 'f64'],
      ['param', '$two', 'f64'],
      ['param', '$three', 'f64'],
      ['result', 'f64'],
      'local.get',
      '$two',
    ],
    t,
  ),
  ir: new FunctionExpression(
    null,
    null,
    [ValueType.F64, ValueType.F64, ValueType.F64],
    ['$one', '$two', '$three'],
    [ValueType.F64],
    [],
    [],
    new UnfoldedTokenExpression([t('local.get'), t('$two')]),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x03, 0x7c, 0x7c, 0x7c, 0x01, 0x7c,
  ]),
  minimal_binary_function_body: new Uint8Array([0x04, 0x00, 0x20, 0x01, 0x0b]),
};

const function_some_named_params: ValidTestCaseData = {
  str: `
(func (param f64) (param f64) (param $three f64) (result f64)
  local.get $three
)
`,
  parseTree: Tree.treeMap(
    [
      'func',
      ['param', 'f64'],
      ['param', 'f64'],
      ['param', '$three', 'f64'],
      ['result', 'f64'],
      'local.get',
      '$three',
    ],
    t,
  ),
  ir: new FunctionExpression(
    null,
    null,
    [ValueType.F64, ValueType.F64, ValueType.F64],
    [null, null, '$three'],
    [ValueType.F64],
    [],
    [],
    new UnfoldedTokenExpression([t('local.get'), t('$three')]),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x03, 0x7c, 0x7c, 0x7c, 0x01, 0x7c,
  ]),
  minimal_binary_function_body: new Uint8Array([0x04, 0x00, 0x20, 0x02, 0x0b]),
};

const function_multiple_separate_result: ValidTestCaseData = {
  str: `
(func $name (param) (result f64) (result f64)
  f64.const 1
  f64.const 1
)
`,
  parseTree: Tree.treeMap(
    [
      'func',
      '$name',
      ['param'],
      ['result', 'f64'],
      ['result', 'f64'],
      'f64.const',
      '1',
      'f64.const',
      '1',
    ],
    t,
  ),
  ir: new FunctionExpression(
    '$name',
    null,
    [],
    [],
    [ValueType.F64, ValueType.F64],
    [],
    [],
    new UnfoldedTokenExpression(['f64.const', '1', 'f64.const', '1'].map(t)),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x00, 0x02, 0x7c, 0x7c,
  ]),
  minimal_binary_function_body: new Uint8Array([
    0x14,
    0x00,
    0x44,
    ...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f],
    0x44,
    ...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f],
    0x0b,
  ]),
};

const function_multiple_combined_result: ValidTestCaseData = {
  str: `
(func $name (param) (result f64 f64)
  f64.const 1
  f64.const 1
)
`,
  parseTree: Tree.treeMap(
    [
      'func',
      '$name',
      ['param'],
      ['result', 'f64', 'f64'],
      'f64.const',
      '1',
      'f64.const',
      '1',
    ],
    t,
  ),
  ir: new FunctionExpression(
    '$name',
    null,
    [],
    [],
    [ValueType.F64, ValueType.F64],
    [],
    [],
    new UnfoldedTokenExpression(['f64.const', '1', 'f64.const', '1'].map(t)),
  ),
  minimal_binary_function_signature: new Uint8Array([
    0x60, 0x00, 0x02, 0x7c, 0x7c,
  ]),
  minimal_binary_function_body: new Uint8Array([
    0x14,
    0x00,
    0x44,
    ...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f],
    0x44,
    ...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x3f],
    0x0b,
  ]),
};

const function_combined_multiple_named_params: InvalidTestCaseData = {
  str: '(func (param $one f64 $two f64 $three f64) (result))',
};
/*
 // throws
*/

export const validTestCases = [
  simple_function_sexpr_with_param_names,
  simple_add_function_no_param_names,
  named_empty_function,
  empty_function_with_combined_params,
  function_all_named_params,
  function_some_named_params,
  function_multiple_separate_result,
  function_multiple_combined_result,
];

export const invalidTestCases = [function_combined_multiple_named_params];
