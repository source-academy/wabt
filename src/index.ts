// import { ParseTree } from './wat_compiler/tree_types';
// import { getSingleToken } from './wat_compiler/lexer';
// import { Tree } from './wat_compiler/tree_types';

/**
 * Compile a given WebAssembly Binary Text module into a binary.
 * @param program program to compile.
 * @returns an 8-bit integer array.
 */
// const compile: (program: string) => Uint8Array = (program: string) => _compileParseTree(parse(program));

/**
 * Get the string representation of the parse tree of a given WebAssembly Binary Text expression.
 * @param program program to parse
 * @returns a tree of string tokens.
 */
// const getStringParseTree: (program: string) => Tree<string> = (
//   program: string,
// ) => ParseTree.getStringArrayRepr(parse(program));

/**
 * Compile a given parse tree of a given WebAssembly Binary Text expression.
 * Parse tree is a tree of Token objects, or strings representing token lexeme's.
 * If parse tree of strings, they will be processed into Tokens, but line and column information will not be available.
 * @param tree tree to compile.
 * @returns an 8-bit integer array.
 */
// const compileParseTree: (tree: Tree<string> | ParseTree) => Uint8Array = (
//   tree: Tree<string> | ParseTree,
// ) => {
//   if (!(tree instanceof ParseTree)) {
//     tree = Tree.treeMap(tree, getSingleToken); // TODO implement decompiler then compile to get token metadata
//   }
//   return _compileParseTree(tree);
// };

export {
  parse,
  getIR,
  compile,
} from './wat_compiler';
// export { getStringParseTree, compileParseTree };
