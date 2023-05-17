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
