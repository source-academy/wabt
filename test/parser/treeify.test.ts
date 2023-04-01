import { getExpectedTokenData, TokenData } from '../resources/resolved_tokens';
import {
  simple_addition_sexpr,
  simple_addition_stack,
  nested_addition_stack,
  nested_addition_sexpr,
  simple_function_sexpr,
} from '../resources/program_fragments';
import { Tree } from '../../src/parser/tree_types';
import { getTokenTree } from '../../src/parser/treeify';



test('treeify simple_addition_sexpr', () => {
  const tree = Tree.treeMap(getTokenTree(simple_addition_sexpr.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(simple_addition_sexpr.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify simple_addition_stack', () => {
  const tree = Tree.treeMap(getTokenTree(simple_addition_stack.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(simple_addition_stack.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify nested_addition_stack', () => {
  const tree = Tree.treeMap(getTokenTree(nested_addition_stack.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(nested_addition_stack.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify nested_addition_sexpr', () => {
  const tree = Tree.treeMap(getTokenTree(nested_addition_sexpr.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(nested_addition_sexpr.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify simple_function_sexpr', () => {
  const tree = Tree.treeMap(getTokenTree(simple_function_sexpr.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(simple_function_sexpr.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});
