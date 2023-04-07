import { TokenData } from '../resources/resolved_tokens';
import {
  simple_function_sexpr_with_param_names,
  simple_add_function_no_param_names,
  export_func_add_by_index,
} from '../resources/program_fragments';
import { Tree } from '../../src/parser/tree_types';
import { getTokenTree } from '../../src/parser/treeify';
import { module_with_exported_add_function_no_names, module_with_one_simple_add_function_with_param_names } from '../resources/module_program_fragments';
import { tokenTreeTestCases as tc1 } from '../resources/valid_function_body_fragments';

test.each(tc1)('test get parse tree of function body expressions', (testCase) => {
  const tree = Tree.treeMap(getTokenTree(testCase.tokens!), TokenData.fromToken);
  const expectedTree = Tree.treeMap(testCase.tokenTree!, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});

test('treeify simple_function_sexpr', () => {
  const tree = Tree.treeMap(getTokenTree(simple_function_sexpr_with_param_names.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(simple_function_sexpr_with_param_names.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify simple_function_sexpr_with_param_names', () => {
  const tree = Tree.treeMap(getTokenTree(simple_function_sexpr_with_param_names.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(simple_function_sexpr_with_param_names.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify simple_add_function_no_param_names', () => {
  const tree = Tree.treeMap(getTokenTree(simple_add_function_no_param_names.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(simple_add_function_no_param_names.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});


test('treeify export_func_add_by_index', () => {
  const tree = Tree.treeMap(getTokenTree(export_func_add_by_index.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(export_func_add_by_index.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});

test('treeify module_with_one_simple_add_function_no_param_names', () => {
  const tree = Tree.treeMap(getTokenTree(module_with_one_simple_add_function_with_param_names.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(module_with_one_simple_add_function_with_param_names.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});

test('treeify module_with_exported_add_function_no_names', () => {
  const tree = Tree.treeMap(getTokenTree(module_with_exported_add_function_no_names.tokens), TokenData.fromToken);
  const expectedTree = Tree.treeMap(module_with_exported_add_function_no_names.tokenTree, TokenData.fromToken);

  expect(tree)
    .toEqual(expectedTree);
});
