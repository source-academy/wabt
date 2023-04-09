import { encode } from './binary_writer';
import { getSingleToken, tokenize } from './lexer/lexer';
import { getIntermediateRepresentation } from './parser/parser';
import { ParseTree, Tree } from './parser/tree_types';
import { getParseTree as treeify } from './parser/parse_tree';

/**
 * Compile a given WebAssembly Binary Text module into a binary.
 * @param program program to compile.
 * @returns an 8-bit integer array.
 */
export const compile: (program: string) => Uint8Array = (program: string) => encode(getIntermediateRepresentation(treeify(tokenize(program))));

/**
 * Get the parse tree of a given WebAssembly Binary Text expression.
 * @param program program to parse
 * @returns a tree of string tokens.
 */
export const getParseTree: (program: string) => Tree<string> = (
  program: string,
) => ParseTree.getStringArrayRepr(treeify(tokenize(program)));

/**
 * Compile a given parse tree of a given WebAssembly Binary Text expression.
 * Parse tree may either be a tree of Token objects, or strings representing token lexeme's.
 * If parse tree of strings, they will be processed into Tokens, but line and column information will not be available.
 * @param tree tree to compile.
 * @returns an 8-bit integer array.
 */
export const compileParseTree: (
  tree: Tree<string> | ParseTree
) => Uint8Array = (tree: Tree<string> | ParseTree) => {
  if (!(tree instanceof ParseTree)) {
    tree = Tree.treeMap(tree, getSingleToken); // TODO implement decompiler then compile to get token metadata
  }
  return encode(getIntermediateRepresentation(tree));
};
