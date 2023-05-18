import {
  FunctionExpression,
  OperationTree,
  UnfoldedTokenExpression,
  ModuleExpression,
  type TokenExpression,
  ExportExpression,
  EmptyTokenExpression,
  BlockExpression,
  SignatureType,
  FunctionSignature,
} from './ir_types';
import { Token, TokenType } from '../common/token';
import { type ParseTree } from './tree_types';

import { Opcode } from '../common/opcode';
import { type ValueType } from '../common/type';
import { assert } from '../common/assert';

export function getIR(parseTree: ParseTree) {
  const ir = new IRWriter(parseTree)
    .parse();
  return ir;
}

export class IRWriter {
  module: ModuleExpression = new ModuleExpression();
  parseTree: ParseTree;

  constructor(parseTree: ParseTree) {
    this.parseTree = parseTree;
  }

  parse(): ModuleExpression {
    this.parseModuleExpression(this.parseTree);
    return this.module;
  }

  private parseModuleExpression(parseTree: ParseTree): void {
    assert(isModuleExpression(parseTree));

    for (let i = 1; i < parseTree.length; i++) {
      const parseTreeNode = parseTree[i];
      if (parseTreeNode instanceof Token) {
        throw new Error(); // Better error mesage
      }

      if (isFunctionExpression(parseTreeNode)) {
        this.module.addFunctionExpression(
          this.parseFunctionExpression(parseTreeNode),
        );
      }

      if (isExportExpression(parseTreeNode)) {
        this.parseExportExpression(parseTreeNode)
          .forEach((exp) => {
            this.module.addExportExpression(exp);
          });
      }
    }
  }

  /**
   * Parse an export expression.
   * Returns an array of export expressions since one export expression may contain multiple exports.
   * @param parseTree
   * @returns an array of ExportExpressions
   */
  private parseExportExpression(parseTree: ParseTree): ExportExpression[] {
    assert(isExportExpression(parseTree));

    const exportExpressions: ExportExpression[] = [];

    for (let i = 1; i < parseTree.length; i += 2) {
      const exportName = parseTree[i];
      if (!(exportName instanceof Token)) {
        throw new Error(); // Better error mesage
      }
      const exportInfo = parseTree[i + 1];
      if (!(exportInfo instanceof Array<Token>)) {
        throw new Error(); // Better error mesage
      }
      const [exportType, exportIndex] = exportInfo;
      if (!(exportType instanceof Token && exportIndex instanceof Token)) {
        throw new Error(); // Better error mesage
      }

      exportExpressions.push(
        new ExportExpression(exportName, exportType, exportIndex),
      );
    }

    return exportExpressions;
  }

  private parseFunctionExpression(parseTree: ParseTree): FunctionExpression {
    assert(isFunctionExpression(parseTree));
    let functionName: string | null = null;
    let inlineExportName: string | null = null;
    const paramTypes: ValueType[] = [];
    const paramNames: (string | null)[] = [];
    const resultTypes: ValueType[] = [];
    const localTypes: ValueType[] = [];
    const localNames: (string | null)[] = [];

    let cursor = 1;

    // Parse function name if necessary
    let token = parseTree[cursor];
    if (token instanceof Token && token.type === TokenType.Var) {
      functionName = token.lexeme;
      cursor += 1;
    }

    // Parse inline export if necessary
    // Inline exports are in the format of (func $name (export "name"))
    token = parseTree[cursor];
    if (
      token instanceof Array
      && token[0] instanceof Token
      && token[0].type === TokenType.Export
      && token[1] instanceof Token
    ) {
      inlineExportName = token[1].extractName();
      cursor++;
    }

    // Parse function param declaration
    for (; cursor < parseTree.length; cursor++) {
      const parseTreeNode = parseTree[cursor];
      if (
        parseTreeNode instanceof Token
        || !isFunctionSignatureParamExpression(parseTreeNode)
      ) {
        break;
      }
      const { types, names }
        = this.parseFunctionSignatureParamExpression(parseTreeNode);
      paramTypes.push(...types);
      paramNames.push(...names);
    }

    // Parse function result declaration
    for (; cursor < parseTree.length; cursor++) {
      const parseTreeNode = parseTree[cursor];
      if (
        parseTreeNode instanceof Token
        || !isFunctionSignatureResultExpression(parseTreeNode)
      ) {
        break;
      }
      const types = this.parseFunctionSignatureResultExpression(parseTreeNode);
      resultTypes.push(...types);
    }

    // Parse function local declaration
    for (; cursor < parseTree.length; cursor++) {
      const parseTreeNode = parseTree[cursor];
      if (
        parseTreeNode instanceof Token
        || !isFunctionSignatureLocalExpression(parseTreeNode)
      ) {
        break;
      }
      const { types, names }
        = this.parseFunctionSignatureLocalExpression(parseTreeNode);
      localTypes.push(...types);
      localNames.push(...names);
    }

    // Parse function params and declarations first
    let remainingTree: ParseTree = parseTree.slice(cursor);

    // If the function body is something like [add 1 0], slicing the tree yields:
    // [[add 1 0]] --> this is not a valid s-expression that can be parsed.
    // Token check is in place to avoid opening up [token] => token, the latter of which also cannot be parsed
    if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
      remainingTree = remainingTree[0];
    }

    const functionSignature = new FunctionSignature(
      functionName,
      inlineExportName,
      paramTypes,
      paramNames,
      resultTypes,
      localTypes,
      localNames,
    );

    this.module.addGlobalType(functionSignature.signatureType);
    const ir = this.parseFunctionBodyExpression(remainingTree);
    return new FunctionExpression(functionSignature, ir);
  }

  /*
  Functions for parsing
  */
  private parseFunctionBodyExpression(parseTree: ParseTree): TokenExpression {
    if (parseTree.length === 0 || typeof parseTree === 'undefined') {
      return new EmptyTokenExpression();
    }

    if (isFunctionBodyBlockExpression(parseTree)) {
      return this.parseFunctionBodyBlockExpression(parseTree);
    }

    if (isFunctionBodySExpression(parseTree)) {
      return this.parseFunctionBodySExpression(parseTree);
    }

    if (isFunctionBodyStackExpression(parseTree)) {
      return this.parseFunctionBodyStackExpression(parseTree);
    }

    throw new Error(
      `Cannot parse into function body expression: ${JSON.stringify(
        parseTree,
        undefined,
        2,
      )}`,
    ); // TODO legit error message when coming from function declarations.
  }

  private parseFunctionBodySExpression(parseTree: ParseTree): OperationTree {
    let head = parseTree[0];
    assert(head instanceof Token); // Head should be token here, assert to make typescript happy
    head = head as Token;

    const body: (Token | TokenExpression)[] = [];
    for (let i = 1; i < parseTree.length; i++) {
      const token = parseTree[i];
      if (token instanceof Token) {
        body.push(token);
      } else {
        const irNode = this.parseFunctionBodyExpression(token);
        if (
          !(
            irNode instanceof Token
            || irNode instanceof OperationTree
            || irNode instanceof UnfoldedTokenExpression
          )
        ) {
          throw new Error(); //TODO proper error
        }
        body.push(irNode);
      }
    }

    assert(Opcode.getParamLength(head.opcodeType!) === body.length); // TODO handle this separately in validation.
    return new OperationTree(head, body);
  }

  private parseFunctionBodyStackExpression(
    parseTree: ParseTree,
  ): UnfoldedTokenExpression {
    const nodes: (Token | OperationTree)[] = [];
    parseTree.forEach((tokenNode) => {
      if (tokenNode instanceof Token) {
        nodes.push(tokenNode);
      } else {
        const temp = this.parseFunctionBodyExpression(tokenNode);
        if (!(temp instanceof Token || temp instanceof OperationTree)) {
          console.log(`parseTree: ${JSON.stringify(parseTree, undefined, 2)}`);
          throw new Error(`${temp} - ${JSON.stringify(temp, undefined, 2)}`); // TODO proper error
        }
        nodes.push(temp);
      }
    });

    return new UnfoldedTokenExpression(nodes);
  }

  private parseFunctionBodyBlockExpression(
    parseTree: ParseTree,
  ): BlockExpression {
    let cursor = 0;
    let current;

    let firstToken: Token;
    let blockLabel: string | null = null;
    const paramTypes: ValueType[] = [];
    const resultTypes: ValueType[] = [];

    // Skip (and collect) block token
    current = parseTree[cursor];
    if (!(current instanceof Token) || !current.isBlock()) {
      throw new Error(
        `First token of a block expression is not block! Got: ${current}`,
      );
    }
    firstToken = current;
    cursor++;

    // parse optional block name
    current = parseTree[cursor];
    if (current instanceof Token && current.type === TokenType.Var) {
      blockLabel = current.lexeme;
      cursor++;
    }

    // parse param declaration. Note that params cannot be named here
    for (; cursor < parseTree.length; cursor++) {
      const parseTreeNode = parseTree[cursor];
      if (
        parseTreeNode instanceof Token
        || !isFunctionSignatureParamExpression(parseTreeNode)
      ) {
        break;
      }

      // TODO assert names is all null.
      const { types, names }
        = this.parseFunctionSignatureParamExpression(parseTreeNode);
      paramTypes.push(...types);
    }

    // Parse result declaration
    for (; cursor < parseTree.length; cursor++) {
      const parseTreeNode = parseTree[cursor];
      if (
        parseTreeNode instanceof Token
        || !isFunctionSignatureResultExpression(parseTreeNode)
      ) {
        break;
      }
      const types = this.parseFunctionSignatureResultExpression(parseTreeNode);
      resultTypes.push(...types);
    }

    this.module.addGlobalType(new SignatureType(paramTypes, resultTypes));

    return new BlockExpression(
      firstToken,
      blockLabel,
      paramTypes,
      resultTypes,
      this.parseFunctionBodyExpression(parseTree.slice(cursor)),
    );
  }

  private parseFunctionSignatureParamExpression(parseTree: ParseTree): {
    types: ValueType[];
    names: (string | null)[];
  } {
    const types: ValueType[] = [];
    const names: (string | null)[] = [];
    for (let i = 1; i < parseTree.length; i++) {
      const parseTreeNode = parseTree[i];
      if (!(parseTreeNode instanceof Token)) {
        throw new Error(); // TODO better error
      }
      if (parseTreeNode.type === TokenType.ValueType) {
        types.push(parseTreeNode.valueType!);
        names.push(null);
      } else if (parseTreeNode.type === TokenType.Var) {
        names.push(parseTreeNode.lexeme);
        const nextToken = parseTree[++i];
        assert(
          nextToken instanceof Token && nextToken.type === TokenType.ValueType,
          `Expected Token Type to be a value type: ${nextToken}`,
        );
        types.push((nextToken as Token).valueType!); // TODO better errors
      } else {
        throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
      }
    }

    return {
      types,
      names,
    };
  }

  private parseFunctionSignatureResultExpression(
    parseTree: ParseTree,
  ): ValueType[] {
    const types: ValueType[] = [];
    for (let i = 1; i < parseTree.length; i++) {
      const parseTreeNode = parseTree[i];
      if (!(parseTreeNode instanceof Token)) {
        throw new Error();
      }
      if (parseTreeNode.type === TokenType.ValueType) {
        types.push(parseTreeNode.valueType!);
      } else {
        throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
      }
    }
    return types;
  }

  private parseFunctionSignatureLocalExpression(parseTree: ParseTree): {
    types: ValueType[];
    names: (string | null)[];
  } {
    const types: ValueType[] = [];
    const names: (string | null)[] = [];
    for (let i = 1; i < parseTree.length; i++) {
      const parseTreeNode = parseTree[i];
      if (!(parseTreeNode instanceof Token)) {
        throw new Error(); // TODO better error
      }
      if (parseTreeNode.type === TokenType.ValueType) {
        types.push(parseTreeNode.valueType!);
        names.push(null);
      } else if (parseTreeNode.type === TokenType.Var) {
        names.push(parseTreeNode.lexeme);
        const nextToken = parseTree[++i];
        assert(
          nextToken instanceof Token && nextToken.type === TokenType.ValueType,
          `Expected Token Type to be a value type: ${nextToken}`,
        );
        types.push((nextToken as Token).valueType!); // TODO better errors
      } else {
        throw new Error(`Unexpected token, bla bla ${parseTreeNode}`); // TODO Proper error message and type
      }
    }

    return {
      types,
      names,
    };
  }
}

/*
  Checks for Parse Tree
*/

function isFunctionBodySExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  assert(
    tokenHeader instanceof Token,
    `first token of ${JSON.stringify(
      parseTree,
      undefined,
      2,
    )} is not a Token type`,
  );

  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && Opcode.getParamLength(tokenHeader.opcodeType!) > 0
  );
}

function isFunctionBodyStackExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  assert(
    tokenHeader instanceof Token,
    `first token of ${JSON.stringify(
      parseTree,
      undefined,
      2,
    )} is not a Token type`,
  );
  return (
    tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && !isFunctionExpression(parseTree)
    && !isFunctionBodySExpression(parseTree)
    // && !isModuleDeclaration(parseTree)
  );
}

function isFunctionExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Func;
}

function isFunctionSignatureParamExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Param;
}

function isFunctionSignatureResultExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Result;
}

function isFunctionSignatureLocalExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Local;
}

function isModuleExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Module;
}

function isExportExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Export;
}

function isFunctionBodyBlockExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.isBlock();
}
function isReservedType(token: Token, lexeme: string) {
  return token.type === TokenType.Reserved && token.lexeme === lexeme;
}
