import { type Token } from '../common/token';
import { type TokenTree } from './tree_types';
/**
 * Parse a sequence of tokens to a tree of tokens
 * @param tokenList an array of tokens to parse
 * @returns a program tree
 */
export declare function getTokenTree(tokenList: Token[]): TokenTree;
