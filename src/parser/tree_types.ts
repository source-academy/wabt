/* eslint-disable import/no-extraneous-dependencies */
import { type Token } from '../common/token';
import 'reflect-metadata';
import { instanceToPlain } from 'class-transformer';

export class Tree<T> extends Array<T | Tree<T>> {}

// We unfortunately have to use this roundabout way of defining functions, because
// we lose implicit type conversion from nested array to trees if we define additional member functions for tree.
export namespace Tree {
  export function treeMap<T, S>(tree: Tree<T>, func: (t: T) => S): Tree<S> {
    return tree.map((node) => (node instanceof Array ? treeMap(node, func) : func(node)));
  }
}

export class ParseTree extends Tree<Token> {}

export namespace ParseTree {
  export function getStringArrayRepr(tree: ParseTree) {
    return Tree.treeMap(tree, (token) => token.lexeme);
  }
}
