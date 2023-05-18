/**
 * Test cases for testing unfolding of intermediate representations
 */
import {
  OperationTree,
  UnfoldedTokenExpression,
  type Unfoldable,
} from '../../../src/wat_compiler/ir_types';
import { getSampleToken as t } from './resolved_tokens';

export interface FunctionBodyTestCaseData {
  str: string;
  ir: Unfoldable;
  unfolded_ir: UnfoldedTokenExpression;
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
  unfolded_ir: new UnfoldedTokenExpression([
    new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    new UnfoldedTokenExpression([t('f64.const'), t('1.5')]),
    t('f64.add'),
  ]),
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
  unfolded_ir: new UnfoldedTokenExpression([
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ]),
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ]),
    t('f64.add'),
  ]),
};

export const validTestCases = [simple_addition_sexpr, nested_addition_sexpr];
