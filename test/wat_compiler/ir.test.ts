import { expect } from '@jest/globals';

import { validTestCases as tc1 } from './resources/unfold.testcase';
import { isTokenEqual } from './resources/token_comparisons';
import {
  EmptyTokenExpression,
  OperationTree,
  UnfoldedTokenExpression,
  type TokenExpression,
} from '../../src/wat_compiler/ir_types';
import { getSampleToken as t } from './resources/resolved_tokens';
import { ValueType } from '../../src/common/type';

describe('test unfolding', () => {
  test.each(tc1)('unfold simple_addition_sexpr', (testCase) => {
    const ir = testCase.ir;
    const unfolded = ir.unfold();
    const expected = testCase.unfolded_ir!;
    expect(unfolded)
      .toEqual(expected);
  });
});

const positive_compile_time_type_test_case: [TokenExpression, ValueType[]][] = [
  [
    new OperationTree(
      t('i32.add'),
      ['i32.const', '0', 'i32.const', '0'].map(t),
    ),
    [ValueType.I32],
  ],
  [new EmptyTokenExpression(), []],
  [
    new UnfoldedTokenExpression(
      ['f64.const', '1', 'f64.const', '2', 'f64.add'].map(t),
    ),
    [ValueType.F64],
  ],
  [
    new OperationTree(t('i32.add'), [
      t('i32.const'),
      t('0'),
      new UnfoldedTokenExpression(
        ['f32.const', '0', 'f32.const', '1', 'f32.eq'].map(t),
      ),
    ]),
    [ValueType.I32],
  ],
];
describe('test compile-time evaluation of types', () => {
  test.each(positive_compile_time_type_test_case)('', (tokenExp, expected) => {
    expect(tokenExp.getReturnTypes())
      .toEqual(expected);
  });
});
expect.addEqualityTesters([isTokenEqual]);

const negative_compile_time_type_test_case: [TokenExpression][] = [
  [
    new OperationTree(t('i32.add'), ['i32.const', '0', 'i64.const', '0'].map(t)),
  ],
  [
    new UnfoldedTokenExpression(
      ['f64.const', '1', 'f32.const', '2', 'f64.add'].map(t),
    ),
  ],
  [
    new OperationTree(t('i64.add'), [
      t('i64.const'),
      t('0'),
      new UnfoldedTokenExpression(
        ['f32.const', '0', 'f32.const', '1', 'f32.eq'].map(t),
      ),
    ]),
  ],
];

describe('test compile-time evaluation of types (should throw)', () => {
  test.each(negative_compile_time_type_test_case)('', (tokenExp) => {
    expect(() => tokenExp.getReturnTypes())
      .toThrow();
  });
});
