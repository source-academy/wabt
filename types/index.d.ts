import { TokenTree, Tree } from './parser/tree_types';
/**
 * Compile a given WebAssembly Binary Text module into a binary.
 * @param program program to compile.
 * @returns an 8-bit integer array.
 */
export declare const compile: (program: string) => Uint8Array;
/**
 * Get the parse tree of a given WebAssembly Binary Text expression.
 * @param program program to parse
 * @returns a tree of string tokens.
 */
export declare const getParseTree: (program: string) => Tree<string>;
/**
 * Compile a given parse tree of a given WebAssembly Binary Text expression.
 * Parse tree may either be a tree of Token objects, or strings representing token lexeme's.
 * If parse tree of strings, they will be processed into Tokens, but line and column information will not be available.
 * @param tree tree to compile.
 * @returns an 8-bit integer array.
 */
export declare const compileParseTree: (tree: Tree<string> | TokenTree) => Uint8Array;
