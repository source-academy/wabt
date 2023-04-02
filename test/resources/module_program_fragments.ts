import { ValueType } from '../../src/common/type';
import { FunctionExpression, UnfoldedTokenExpression, ModuleExpression } from '../../src/parser/ir';
import { Tree } from '../../src/parser/tree_types';
import { type TestCaseData } from './program_fragments';
import { getSampleToken as t } from './resolved_tokens';

export const module_with_one_simple_add_function_with_param_names = {
  str: `
  (module
    (func (param $lhs i32) (param $rhs i32) (result i32)
      local.get $lhs
      local.get $rhs
      i32.add))
      `,
  tokens: [
    ...['(', 'module'],
    ...['(', 'func', '(', 'param', '$lhs', 'i32', ')', '(', 'param', '$rhs', 'i32', ')', '(', 'result', 'i32', ')'],
    ...['local.get', '$lhs'],
    ...['local.get', '$rhs'],
    ...['i32.add', ')', ')'],
  ].map(t),

  tokenTree: Tree.treeMap(['module', ['func',
    ['param', '$lhs', 'i32'],
    ['param', '$rhs', 'i32'],
    ['result', 'i32'],
    'local.get',
    '$lhs',
    'local.get',
    '$rhs',
    'i32.add']]
  , t),
  ir: new ModuleExpression(
    [
      new FunctionExpression(
        [ValueType.I32, ValueType.I32],
        [ValueType.I32],
        ['$lhs', '$rhs'],
        new UnfoldedTokenExpression(['local.get', '$lhs', 'local.get', '$rhs', 'i32.add'].map(t)),
      ),
    ],
  ),
  type_section_encoding: new Uint8Array([0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f]),
  function_section_encoding: new Uint8Array([0x03, 0x02, 0x01, 0x00]),
  code_section_encoding: new Uint8Array([0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b]),
};
