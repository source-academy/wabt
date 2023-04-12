import { TokenData } from '../resources/resolved_tokens';
import { Tree } from '../../src/wat2wasm/tree_types';
import { getParseTree } from '../../src/wat2wasm/parser';

import { parseTreeTestCases as tc1 } from '../resources/valid_function_bodies';
import { validTestCases as tc2 } from '../resources/function_expressions';
import { validTestCases as tc3 } from '../resources/export_expressions';

test.each(tc1)(
  'test get parse tree of function body expressions',
  (testCase) => {
    const tree = Tree.treeMap(
      getParseTree(testCase.tokens!),
      TokenData.fromToken,
    );
    const expectedTree = Tree.treeMap(testCase.parseTree!, TokenData.fromToken);

    expect(tree)
      .toEqual(expectedTree);
  },
);

test.each(tc2)('test get parse tree of function expressions', (testCase) => {
  const tree = Tree.treeMap(
    getParseTree(testCase.tokens!),
    TokenData.fromToken,
  );
  const expectedTree = Tree.treeMap(testCase.parseTree!, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});

test.each(tc3)('test get parse tree of export expressions', (testCase) => {
  const tree = Tree.treeMap(
    getParseTree(testCase.tokens!),
    TokenData.fromToken,
  );
  const expectedTree = Tree.treeMap(testCase.parseTree!, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});
