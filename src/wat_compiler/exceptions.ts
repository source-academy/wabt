import { type ParseTree, Tree } from './tree_types';

export abstract class ParseTreeException extends Error {
  constructor(errorMsg: string, parseTree: ParseTree | null = null) {
    super(
      `${errorMsg}: ${
        parseTree === null
          ? ''
          : Tree.treeMap(parseTree, (token) => token.lexeme)
      }`,
    );
  }
}
export class IllegalStartSection extends ParseTreeException {}
export class IllegalMemorySection extends ParseTreeException {}
