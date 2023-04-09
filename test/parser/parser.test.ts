import {
  type IntermediateRepresentation,
  OperationTree,
  PureUnfoldedTokenExpression,
  UnfoldedTokenExpression,
  FunctionExpression,
  ModuleExpression,
} from '../../src/parser/ir';
import { getIntermediateRepresentation } from '../../src/parser/parser';
import { isEqual as isDeepEqual, isEqual } from 'lodash';
import { expect } from '@jest/globals';
import { TokenData } from '../resources/resolved_tokens';
import { Token } from '../../src/common/token';
import {
  module_with_exported_add_function_no_names,
  module_with_one_simple_add_function_with_param_names,
} from '../resources/module_program_fragments';
import { simple_addition_sexpr_without_argument_bracket_fails } from '../resources/invalid_function_bodies';

import { validTestCases as tc2 } from '../resources/function_expressions';
import { irTestCases as tc1 } from '../resources/valid_function_bodies';
import { validTestCases as tc3 } from '../resources/export_expressions';

describe('get intermediate expression of function body expressions', () => {
  test.each(tc1)(
    'test convert function body expressions into ir',
    (testCase) => {
      const parseTree = testCase.parseTree!;
      const ir = getIntermediateRepresentation(parseTree);
      const expectedIR = testCase.ir!;

      expect(ir)
        .toEqual(expectedIR);
    },
  );

  test('expect simple_addition_sexpr_without_argument_bracket_fails to throw', () => {
    const testCase = simple_addition_sexpr_without_argument_bracket_fails;
    const parseTree = testCase.parseTree!;
    expect(() => getIntermediateRepresentation(parseTree))
      .toThrow();
  });
});

test.each(tc2)('test convert function expressions into ir', (testCase) => {
  const parseTree = testCase.parseTree!;
  const ir = getIntermediateRepresentation(parseTree);
  const expectedIR = testCase.ir!;

  expect(ir)
    .toEqual(expectedIR);
});

test.each(tc3)('test convert export expressions into ir', (testCase) => {
  const parseTree = testCase.parseTree!;
  const ir = getIntermediateRepresentation(parseTree);
  const expectedIR = testCase.ir!;

  expect(ir)
    .toEqual(expectedIR);
});

test('convert module_with_one_simple_add_function_no_param_names into ir', () => {
  const parseTree
    = module_with_one_simple_add_function_with_param_names.parseTree;
  const ir = getIntermediateRepresentation(parseTree);
  const expectedIR = module_with_one_simple_add_function_with_param_names.ir;
  expect(ir)
    .toEqual(expectedIR);
});

test('convert module_with_exported_add_function_no_names into ir', () => {
  const parseTree = module_with_exported_add_function_no_names.parseTree;
  const ir = getIntermediateRepresentation(parseTree);
  const expectedIR = module_with_exported_add_function_no_names.ir;
  expect(ir)
    .toEqual(expectedIR);
});

/**
 * Custom equality comparison between tokens/intermediate representations for testing purposes
 * @param lhs to compare
 * @param rhs to compare
 * @returns true if equal
 */
// eslint-disable-next-line complexity
function isIREqual(
  lhs: IntermediateRepresentation | Token | Token[],
  rhs: IntermediateRepresentation | Token | Token[],
): boolean | undefined {
  if (lhs instanceof Token && rhs instanceof Token) {
    return isDeepEqual(TokenData.fromToken(lhs), TokenData.fromToken(rhs));
  }

  if (lhs instanceof Array<Token> && rhs instanceof Array<Token>) {
    if (lhs.length !== rhs.length) {
      return false;
    }
    for (let i = 0; i < lhs.length; i++) {
      if (!isIREqual(lhs[i], rhs[i])) {
        return false;
      }
    }
    return true;
  }

  if (
    lhs instanceof PureUnfoldedTokenExpression
    && rhs instanceof PureUnfoldedTokenExpression
  ) {
    return isIREqual(lhs.tokens, rhs.tokens);
  }

  if (lhs instanceof OperationTree && rhs instanceof OperationTree) {
    if (
      !isIREqual(lhs.operator, rhs.operator)
      || lhs.operands.length !== rhs.operands.length
    ) {
      return false;
    }

    for (let i = 0; i < lhs.operands.length; i++) {
      if (!isIREqual(lhs.operands[i], rhs.operands[i])) {
        return false;
      }
    }
    return true;
  }

  if (
    lhs instanceof UnfoldedTokenExpression
    && rhs instanceof UnfoldedTokenExpression
  ) {
    return isIREqual(lhs.tokens, rhs.tokens);
  }
  if (
    lhs instanceof PureUnfoldedTokenExpression
    && rhs instanceof PureUnfoldedTokenExpression
  ) {
    return isIREqual(lhs.tokens, rhs.tokens);
  }

  if (lhs instanceof FunctionExpression && rhs instanceof FunctionExpression) {
    return (
      isIREqual(lhs.functionBody.body, rhs.functionBody.body)
      && isEqual(lhs.functionSignature, rhs.functionSignature)
    );
  }

  if (lhs instanceof ModuleExpression && rhs instanceof ModuleExpression) {
    if (lhs.functionDeclarations.length !== rhs.functionDeclarations.length) {
      return false;
    }
    for (let i = 0; i < lhs.functionDeclarations.length; i++) {
      if (
        !isIREqual(lhs.functionDeclarations[i], rhs.functionDeclarations[i])
      ) {
        return false;
      }
    }
    return true;
  }

  return isDeepEqual(lhs, rhs);
}

expect.addEqualityTesters([isIREqual]);
