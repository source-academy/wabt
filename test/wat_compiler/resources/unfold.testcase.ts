/**
 * Test cases for testing unfolding of intermediate representations
 */
import {
  OperationTree,
  PureUnfoldedTokenExpression,
  UnfoldedTokenExpression,
  type Unfoldable,
} from '../../../src/wat_compiler/ir_types';
import { getSampleToken as t } from './resolved_tokens';

export interface FunctionBodyTestCaseData {
  str: string;
  ir: Unfoldable;
  unfolded_ir: PureUnfoldedTokenExpression;
}

const simple_addition_sexpr: FunctionBodyTestCaseData = {
  str: `
    (f64.add
        (f64.const 1)
        (f64.const 1.5)
        )
    `,
  ir: new OperationTree(t('f64.add'), [
    new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    new UnfoldedTokenExpression([t('f64.const'), t('1.5')]),
  ]),
  unfolded_ir: new PureUnfoldedTokenExpression(
    ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ),
};

const simple_addition_stack: FunctionBodyTestCaseData = {
  str: `
    (f64.const 1
        f64.const 1.5
        f64.add)
    `,
  ir: new UnfoldedTokenExpression(
    ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ),
  unfolded_ir: new PureUnfoldedTokenExpression(
    ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ),
};

const nested_addition_stack: FunctionBodyTestCaseData = {
  str: `
      f64.const 1
      f64.const 1
      f64.add
      f64.const 1
      f64.const 1
      f64.add
      f64.add
      `,
  ir: new UnfoldedTokenExpression(
    [
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.add',
    ].map(t),
  ),
  unfolded_ir: new PureUnfoldedTokenExpression(
    [
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.add',
    ].map(t),
  ),
};

const nested_addition_sexpr: FunctionBodyTestCaseData = {
  str: `
    (f64.add
      (f64.add
        (f64.const 1)
        (f64.const 1)
      )
      (f64.add
        (f64.const 1)
        (f64.const 1)
      )
    )
      `,
  ir: new OperationTree(t('f64.add'), [
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ]),
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ]),
  ]),
  unfolded_ir: new PureUnfoldedTokenExpression(
    [
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.add',
    ].map(t),
  ),
};

export const validTestCases = [
  simple_addition_sexpr,
  simple_addition_stack,
  nested_addition_stack,
  nested_addition_sexpr,
];
