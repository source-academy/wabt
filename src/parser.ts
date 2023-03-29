import { Token, TokenType } from './token';
import assert from 'assert';
import {
  FunctionBody, FunctionExpression,
  FunctionSignature,
  ModuleExpression,
  UnfoldedTokenSequence,
  type IntermediateRepresentation,
} from './ir';

import { type ValueType } from './type';

type NestedArray<T> = (T | NestedArray<T>)[];

export namespace ProgramTree {
  export type ProgramTreeNode = Token | ProgramTree;
  export type ProgramTreeContents = [Token, ...(ProgramTreeNode)[]];
}
import ProgramTreeNode = ProgramTree.ProgramTreeNode;
import ProgramTreeContents = ProgramTree.ProgramTreeContents;

export class ProgramTree {
  private contents: [Token, ...(ProgramTreeNode)[]];

  constructor(contents: Token);
  constructor(contents: [Token, ...(ProgramTreeNode)[]]);
  constructor(contents: Token | [Token, ...(ProgramTreeNode)[]]) {
    if (contents instanceof Token) {
      contents = [contents];
    }
    this.contents = contents;
  }

  push(element: ProgramTreeNode) {
    this.contents.push(element);
  }

  at(index: number) {
    return this.contents[index];
  }

  getTypeToken() {
    return this.contents[0];
  }

  getBody() {
    return this.contents.slice(1);
  }

  /**
   * Unfold a given program tree into from an s-expression to a sequence of tokens for a stack machine
   * @returns an array of tokens.
   */
  unfold(): Token[] {
    const unfoldedBody = this.getBody()
      .flatMap((tok) => {
        if (tok instanceof ProgramTree) { return tok.unfold(); }
        return [tok];
      });


    if (this.getTypeToken()
      .isOpcodeToken() && this.getTypeToken()
      .getOpcodeParamLength() > 0) {
      assert(this.getBody().length === this.getTypeToken()
        .getOpcodeParamLength());
      return [...unfoldedBody, this.getTypeToken()];
    }

    return [this.getTypeToken(), ...unfoldedBody];
  }

  isReservedType(lexeme: string) {
    return (
      this.getTypeToken().type === TokenType.Reserved
      && this.getTypeToken().lexeme === lexeme
    );
  }

  isFunctionDeclaration(): boolean {
    return this.isReservedType('func');
  }

  isModuleDeclaration(): boolean {
    return this.isReservedType('module');
  }

  treeMap<T>(func: (t: Token) => T): NestedArray<T> {
    return this.contents.map(
      (t) => ((t instanceof ProgramTree) ? t.treeMap(func) : func(t)),
    );
  }
}

export class Parser {
  private readonly tokens: Token[];
  tree: ProgramTree | undefined;
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

  private isEof(): boolean {
    return this.cursor >= this.tokens.length;
  }

  getGrouping(): ProgramTree {
    const tree: ProgramTree = new ProgramTree(this.read());
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

  parseProgramTree(
    tree: ProgramTree | Token,
  ): IntermediateRepresentation {
    if (tree instanceof Token) {
      return tree;
    }

    if (tree.isModuleDeclaration()) {
      return this.parseModuleExpression(tree);
    }

    if (tree.isFunctionDeclaration()) {
      return this.parseFunctionExpression(tree);
    }

    return new UnfoldedTokenSequence(tree.unfold());
  }

  private parseModuleExpression(tree: ProgramTree): ModuleExpression {
    return new ModuleExpression(tree.getBody()
      .map((t) => this.parseProgramTree(t))); // If I just do map(this.parseProgramTree), 'this' becomes undefined
  }

  private parseFunctionExpression(tree: ProgramTree): FunctionExpression {
    let paramTypes: ValueType[] = [];
    let paramNames: string[] = [];
    let resultTypes: ValueType[] = [];
    let body: IntermediateRepresentation[] = [];

    assert(tree.isFunctionDeclaration());

    // cleaner this way
    // eslint-disable-next-line newline-per-chained-call
    for (const t of tree.getBody()) {
      if (t instanceof Token) {
        body.push(t);
      } else if (t.isReservedType('param')) {
        // eslint-disable-next-line newline-per-chained-call
        t.getBody().forEach((param) => {
          assert(param instanceof Token);
          if (param.type === TokenType.Var) {
            paramNames.push(param.lexeme);
          } else if (param.type === TokenType.ValueType) {
            assert(param.valueType !== null);
            paramTypes.push(param.valueType);
          }
        });
      } else if (t.isReservedType('result')) {
        // eslint-disable-next-line newline-per-chained-call
        t.getBody().forEach((result) => {
          assert(result instanceof Token);
          assert(result.valueType !== null);
          resultTypes.push(result.valueType);
        });
      } else {
        body.push(this.parseProgramTree(t));
      }
    }

    return new FunctionExpression(new FunctionSignature(paramTypes, paramNames, resultTypes), new FunctionBody(body));
  }

  parse() {
    this.cursor = 0;
    this.tree = this.getGrouping();
    let ir = this.parseProgramTree(this.tree);
    return ir;
  }
}
