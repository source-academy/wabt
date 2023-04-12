import { TokenData } from '../resources/resolved_tokens';

import { tokenizeTestCases as tc1 } from '../resources/valid_function_bodies';
import { validTestCases as tc2 } from '../resources/function_expressions';
import { validTestCases as tc3 } from '../resources/export_expressions';
import { tokenize } from '../../src/wat2wasm/lexer';

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
