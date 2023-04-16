import { assert } from '../common/assert';
import { type Token, TokenType } from '../common/token';
import { type ParseTree } from './tree_types';

/**
 * Parse a sequence of tokens to a tree of tokens
 * @param tokenList an array of tokens to parse
 * @returns a program tree
 */
export function getParseTree(tokenList: Token[]): ParseTree {
  if (tokenList[0].type === TokenType.Lpar) {
    tokenList = tokenList.slice(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Parser(tokenList)
    .getGrouping();
}

class Parser {
  private readonly tokens: Token[];
  tree: ParseTree | undefined;
  cursor: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.cursor];
  }

  private read(): Token {
    return this.tokens[this.cursor++];
  }

  private peekOffset(i: number): Token {
    assert(this.cursor + i >= 0 && this.cursor + i < this.tokens.length);
    return this.tokens[this.cursor + i];
  }

  private isEof(): boolean {
    return this.cursor >= this.tokens.length;
  }

  getGrouping(): ParseTree {
    const tree: ParseTree = [];
    while (!this.isEof()) {
      const token = this.read();
      if (token.type === TokenType.Lpar) {
        tree.push(this.getGrouping());
      } else if (token.type === TokenType.Rpar) {
        return tree;
      } else {
        tree.push(token);
      }
    }

    return tree;
  }
}
