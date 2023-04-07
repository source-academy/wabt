import { type Token } from '../common/token';
import 'reflect-metadata';
export declare class Tree<T> extends Array<T | Tree<T>> {
}
export declare namespace Tree {
    function treeMap<T, S>(tree: Tree<T>, func: ((t: T) => (S))): Tree<S>;
}
export declare class TokenTree extends Tree<Token> {
}
export declare namespace TokenTree {
    function getStringArrayRepr(tree: TokenTree): Tree<string>;
}
