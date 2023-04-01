/* eslint-disable import/no-extraneous-dependencies */
import { type Token } from '../../src/common/token';
import { OperationTree, UnfoldedTokenExpression, type IntermediateRepresentation } from '../../src/parser/ir';
import { Tree } from '../../src/parser/tree_types';
import { getSampleToken as t } from './resolved_tokens';

interface TestCaseData {
  str: string;
  tokens: Array<Token>;
  tokenTree: Tree<Token>;
  ir?: IntermediateRepresentation;
  minimal_binary?: Uint8Array;
}

export const simple_addition_sexpr: TestCaseData = {
  str: `
  (f64.add
      f64.const 1
      f64.const 1.5)
  `,
  tokens: ['(', 'f64.add', 'f64.const', '1', 'f64.const', '1.5', ')'].map(t),
  tokenTree: ['f64.add', 'f64.const', '1', 'f64.const', '1.5'].map(t),
  ir: new OperationTree(t('f64.add'), ['f64.const', '1', 'f64.const', '1.5'].map(t)),
  minimal_binary: undefined,
};

export const simple_addition_stack: TestCaseData = {
  str: `
  (f64.const 1
      f64.const 1.5
      f64.add)
  `,
  tokens: ['(', 'f64.const', '1', 'f64.const', '1.5', 'f64.add', ')'].map(t),
  tokenTree: ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ir: new UnfoldedTokenExpression(['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t)),
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
  tokens: ['f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.add'].map(t),
  tokenTree: ['f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.add'].map(t),
  ir: new UnfoldedTokenExpression(['f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.const', '1', 'f64.const', '1', 'f64.add', 'f64.add'].map(t)),
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
  ].map(t),
  tokenTree: Tree.treeMap(
    [
      'f64.add',
      ['f64.add', 'f64.const', '1', 'f64.const', '1'],
      ['f64.add', 'f64.const', '1', 'f64.const', '1'],
    ]
    , t,
  ),
  ir: new OperationTree(
    t('f64.add'),
    [
      new OperationTree(
        t('f64.add'),
        ['f64.const', '1', 'f64.const', '1'].map(t),
      ),
      new OperationTree(
        t('f64.add'),
        ['f64.const', '1', 'f64.const', '1'].map(t),
      ),
    ],
  ),
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
  ].map(t),

  tokenTree: Tree.treeMap(['func',
    ['param', '$p', 'f64'],
    ['result', 'f64'],
    ['f64.add', 'local.get', '$p', 'local.get', '$p']]
  , t),
  ir: undefined,
  minimal_binary: undefined,
};
