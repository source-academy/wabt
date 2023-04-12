import { type Unfoldable } from '../src/wat2wasm/ir_types';
import { validTestCases as tc1 } from './resources/valid_function_bodies';

test.each(tc1)('unfold simple_addition_sexpr', (testCase) => {
  const ir = testCase.ir! as Unfoldable;
  const unfolded = ir.unfold();
  const expected = testCase.unfolded_ir!;
  expect(unfolded)
    .toEqual(expected);
});
