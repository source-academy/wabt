import { expect } from '@jest/globals';

import { validTestCases as tc1 } from './resources/unfold.testcase';
import { EmptyTokenExpression } from '../../src/wat_compiler/ir_types';

describe('test unfolding', () => {
  test.each(tc1)('unfold simple_addition_sexpr', (testCase) => {
    const mock_parent = new EmptyTokenExpression();

    const ir = testCase.ir;
    ir.parent = mock_parent;
    const unfolded = ir.unfold();

    const expected = testCase.unfolded_ir!;
    expected.parent = mock_parent;

    expect(unfolded)
      .toEqual(expected);
  });
});
