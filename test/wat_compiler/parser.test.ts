import { validTestCases as tc1 } from './resources/valid_function_bodies';
import { validTestCases as tc2 } from './resources/function_expressions';
import { validTestCases as tc3 } from './resources/export_expressions';
import { parse } from '../../src/wat_compiler';

import { expect } from '@jest/globals';
import { isTokenEqual } from '../token_comparisons';

test.each(tc1)(
  'test get parse tree of function body expressions',
  (testCase) => {
    // const expectedTree = Tree.treeMap(testCase.parseTree, TokenData.fromToken);
    const expectedTree = testCase.parseTree;
    const tree = parse(testCase.str);
    expect(tree)
      .toEqual(expectedTree);
  },
);

test.each(tc2)('test get parse tree of function expressions', (testCase) => {
  const expectedTree = testCase.parseTree;
  const tree = parse(testCase.str);
  expect(tree)
    .toEqual(expectedTree);
});

test.each(tc3)('test get parse tree of export expressions', (testCase) => {
  const expectedTree = testCase.parseTree;
  const tree = parse(testCase.str);
  expect(tree)
    .toEqual(expectedTree);
});

expect.addEqualityTesters([isTokenEqual]);
