import { ValueType } from '../../src/common/type';
import { FunctionExpression, FunctionSignature, FunctionBody, UnfoldedTokenExpression, ModuleExpression } from '../../src/parser/ir';
import { Tree } from '../../src/parser/tree_types';
import { type TestCaseData } from './program_fragments';
import { getSampleToken as t } from './resolved_tokens';

export const module_with_one_simple_add_function_with_param_names: TestCaseData = {
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
    [new FunctionExpression(
      new FunctionSignature([ValueType.I32, ValueType.I32], [ValueType.I32], ['$lhs', '$rhs']),
      new FunctionBody(
        new UnfoldedTokenExpression(['local.get', '$lhs', 'local.get', '$rhs', 'i32.add'].map(t)),
      ),
    )],
  ),
  minimal_binary: undefined,
};
