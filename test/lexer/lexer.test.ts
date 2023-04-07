import { tokenize } from '../../src/lexer/lexer';
import { TokenData } from '../resources/resolved_tokens';

import { module_with_exported_add_function_no_names, module_with_one_simple_add_function_with_param_names } from '../resources/module_program_fragments';

import { tokenizeTestCases as tc1 } from '../resources/valid_function_bodies';
import { validTestCases as tc2 } from '../resources/function_expressions';
import { validTestCases as tc3 } from '../resources/export_expressions';

test.each(tc1)('test tokenize function body expressions', (testCase) => {
  const tokens = tokenize(testCase.str)
    .map(TokenData.fromToken);
  const expectedTokenData = testCase.tokens!.map(TokenData.fromToken);
  expect(tokens)
    .toEqual(expectedTokenData);
});

test.each(tc2)('test tokenize function expressions', (testCase) => {
  const tokens = tokenize(testCase.str)
    .map(TokenData.fromToken);
  const expectedTokenData = testCase.tokens!.map(TokenData.fromToken);
  expect(tokens)
    .toEqual(expectedTokenData);
});

test.each(tc3)('test tokenize export expressions', (testCase) => {
  const tokens = tokenize(testCase.str)
    .map(TokenData.fromToken);
  const expectedTokenData = testCase.tokens!.map(TokenData.fromToken);
  expect(tokens)
    .toEqual(expectedTokenData);
});

test('tokenize module_with_one_simple_add_function_no_param_names', () => {
  const tokens = tokenize(module_with_one_simple_add_function_with_param_names.str)
    .map(TokenData.fromToken);
  const expectedTokenData = module_with_one_simple_add_function_with_param_names.tokens.map(TokenData.fromToken);

  expect(tokens)
    .toEqual(expectedTokenData);
});

test('tokenize module_with_exported_add_function_no_names', () => {
  const tokens = tokenize(module_with_exported_add_function_no_names.str)
    .map(TokenData.fromToken);
  const expectedTokenData = module_with_exported_add_function_no_names.tokens.map(TokenData.fromToken);

  expect(tokens)
    .toEqual(expectedTokenData);
});
