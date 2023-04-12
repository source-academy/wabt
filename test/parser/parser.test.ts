import { TokenData, isTokenEqual } from '../resources/resolved_tokens';
import { Tree } from '../../src/wat2wasm/tree_types';

import { validTestCases as tc1 } from '../resources/valid_function_bodies';
import { validTestCases as tc2 } from '../resources/function_expressions';
import { validTestCases as tc3 } from '../resources/export_expressions';
import { parse } from '../../src/wat2wasm';

import { expect } from '@jest/globals';

test.each(tc1)(
  'test get parse tree of function body expressions',
  (testCase) => {
    const expectedTree = Tree.treeMap(testCase.parseTree, TokenData.fromToken);
    const tree = parse(testCase.str);
    expect(tree)
      .toEqual(expectedTree);
  },
);

test.each(tc2)('test get parse tree of function expressions', (testCase) => {
  const expectedTree = Tree.treeMap(testCase.parseTree, TokenData.fromToken);
  const tree = parse(testCase.str);
  expect(tree)
    .toEqual(expectedTree);
});

test.each(tc3)('test get parse tree of export expressions', (testCase) => {
  const expectedTree = Tree.treeMap(testCase.parseTree, TokenData.fromToken);
  const tree = parse(testCase.str);
  expect(tree)
    .toEqual(expectedTree);
});

expect.addEqualityTesters([isTokenEqual]);
