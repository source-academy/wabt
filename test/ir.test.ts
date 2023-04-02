import { type Unfoldable, UnfoldedTokenExpression, type OperationTree } from '../src/parser/ir';
import { simple_addition_sexpr, simple_addition_stack, nested_addition_stack, nested_addition_sexpr } from './resources/program_fragments';

describe('Test unfolding of intermediate representations', () => {
  test('unfold simple_addition_sexpr', () => {
    const ir = simple_addition_sexpr.ir as Unfoldable;
    const unfolded = ir.unfold();
    const expected = simple_addition_sexpr.unfolded_ir;
    expect(unfolded)
      .toEqual(expected);
  });
  test('unfold simple_addition_stack', () => {
    const ir = simple_addition_stack.ir as Unfoldable;
    const unfolded = ir.unfold();
    const expected = simple_addition_stack.unfolded_ir;
    expect(unfolded)
      .toEqual(expected);
  });
  test('unfold nested_addition_stack', () => {
    const ir = nested_addition_stack.ir as Unfoldable;
    const unfolded = ir.unfold();
    const expected = nested_addition_stack.unfolded_ir;
    expect(unfolded)
      .toEqual(expected);
  });
  test('unfold nested_addition_sexpr', () => {
    const ir = nested_addition_sexpr.ir as Unfoldable;
    const unfolded = ir.unfold();
    const expected = nested_addition_sexpr.unfolded_ir;
    expect(unfolded)
      .toEqual(expected);
  });
});
