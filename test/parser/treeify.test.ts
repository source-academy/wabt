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
  const tree = getTokenTree(
    simple_addition_sexpr.tokens
      .map(getExpectedTokenData)
      .map(TokenData.toToken),
  );
  const expectedTree = Tree.treeMap(simple_addition_sexpr.tokenTreeStr, getExpectedTokenData);

  console.log(Tree.treeMap(tree, TokenData.fromToken));
  console.log(expectedTree);
  expect(Tree.treeMap(tree, TokenData.fromToken))
    .toEqual(expectedTree);
});


test('treeify simple_addition_stack', () => {
  const tree = getTokenTree(
    simple_addition_stack.tokens
      .map(getExpectedTokenData)
      .map(TokenData.toToken),
  );
  const expectedTree = Tree.treeMap(simple_addition_stack.tokenTreeStr, getExpectedTokenData);

  expect(Tree.treeMap(tree, TokenData.fromToken))
    .toEqual(expectedTree);
});


test('treeify nested_addition_stack', () => {
  const tree = getTokenTree(
    nested_addition_stack.tokens
      .map(getExpectedTokenData)
      .map(TokenData.toToken),
  );
  const expectedTree = Tree.treeMap(nested_addition_stack.tokenTreeStr, getExpectedTokenData);

  expect(Tree.treeMap(tree, TokenData.fromToken))
    .toEqual(expectedTree);
});


test('treeify nested_addition_sexpr', () => {
  const tree = getTokenTree(
    nested_addition_sexpr.tokens
      .map(getExpectedTokenData)
      .map(TokenData.toToken),
  );
  const expectedTree = Tree.treeMap(nested_addition_sexpr.tokenTreeStr, getExpectedTokenData);

  expect(Tree.treeMap(tree, TokenData.fromToken))
    .toEqual(expectedTree);
});


test('treeify simple_function_sexpr', () => {
  const tree = getTokenTree(
    simple_function_sexpr.tokens
      .map(getExpectedTokenData)
      .map(TokenData.toToken),
  );
  const expectedTree = Tree.treeMap(simple_function_sexpr.tokenTreeStr, getExpectedTokenData);

  expect(Tree.treeMap(tree, TokenData.fromToken))
    .toEqual(expectedTree);
});
