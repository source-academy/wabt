import { TokenType, type Token } from '../token';
import { type TokenTree } from './tree_types';
import assert from 'assert';

/**
 * Parse a sequence of tokens to a tree of tokens
 * @param tokenList an array of tokens to parse
 * @returns a program tree
 */
export function getTokenTree(tokenList: Token[]): TokenTree {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Parser(tokenList)
    .getGrouping();
}

class Parser {
  private readonly tokens: Token[];
  tree: TokenTree | undefined;
  cursor: number = 0;

  constructor(tokens: Token[]) {
    // This is because the lexer automatically omits the first bracket (and makes the parser more robust in tests).
    if (tokens[0].type === TokenType.Lpar) {
      this.tokens = tokens.slice(1);
    } else {
      this.tokens = tokens;
    }
  }

  private peek(): Token {
    return this.tokens[this.cursor];
  }

  private read(): Token {
    return this.tokens[this.cursor++];
  }

  private isEof(): boolean {
    return this.cursor >= this.tokens.length;
  }

  getGrouping(): TokenTree {
    const getNestedGrouping: (() => Token | TokenTree) = () => {
      const token = this.read();
      console.log(token);
      if (token.type === TokenType.Lpar) {
        return getNestedGrouping();
      }
      if (token.opcodeType === null) { // If token is not opcode, token is by itself
        return token;
      }

      const subtree: TokenTree = [];
      const operandNumber = token.getOpcodeParamLength();

      for (let i = 0; i < operandNumber; i++) {
        subtree.push(getNestedGrouping());
      }
      return subtree;
    };

    const tree: TokenTree = [];
    while (!this.isEof()) {
      tree.push(getNestedGrouping());
    }

    return tree;
  }
}
