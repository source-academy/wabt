import { expect } from '@jest/globals';

import { validTestCases as tc1 } from './resources/unfold.testcase';

describe('test unfolding', () => {
  test.each(tc1)('unfold simple_addition_sexpr', (testCase) => {
    const ir = testCase.ir;
    const unfolded = ir.unfold();
    const expected = testCase.unfolded_ir!;
    expect(unfolded)
      .toEqual(expected);
  });
});
