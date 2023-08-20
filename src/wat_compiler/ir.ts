import {
  FunctionExpression,
  OperationTree,
  UnfoldedTokenExpression,
  ModuleExpression,
  type TokenExpression,
  ExportExpression,
  EmptyTokenExpression,
  type BlockExpression,
  SignatureType,
  FunctionSignature,
  IRToken,
  SelectExpression,
  BlockBlockExpression,
  BlockIfExpression,
  StartExpression, MemoryExpression, GlobalExpression, ImportExpression, ImportGlobalExpression, ElementExpression, type ElementMode, ElementItemExpression, TableExpression,
} from './ir_types';
import { Token, TokenType } from '../common/token';
import { Tree, type ParseTree } from './tree_types';

import { Opcode, OpcodeType } from '../common/opcode';
import { ValueType } from '../common/type';
import { assert } from '../common/assert';
import { IllegalMemorySection, IllegalStartSection, ParseTreeException } from './exceptions';
import { first, max, toInteger } from 'lodash';
import { ExportType } from '../common/export_types';
import { parse } from '.';

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
        this.module.addIntermediateRepresentation(
          this.parseFunctionExpression(parseTreeNode),
        );
        continue;
      }

      if (isExportExpression(parseTreeNode)) {
        this.parseExportExpression(parseTreeNode)
          .forEach((exp) => {
            this.module.addIntermediateRepresentation(exp);
          });
        continue;
      }

      if (isStartExpression(parseTreeNode)) {
        const startExp = this.parseStartExpression(parseTreeNode);
        this.module.addIntermediateRepresentation(startExp);
        continue;
      }

      if (isMemoryExpression(parseTreeNode)) {
        const moduleExp = this.parseMemoryExpression(parseTreeNode);
        this.module.addIntermediateRepresentation(moduleExp);
        continue;
      }

      if (isGlobalExpression(parseTreeNode)) {
        const globalExp = this.parseGlobalExpression(parseTreeNode);
        this.module.addIntermediateRepresentation(globalExp);
        continue;
      }

      if (isImportExpression(parseTreeNode)) {
        const importExp = this.parseImportExpression(parseTreeNode);
        this.module.addIntermediateRepresentation(importExp);
        continue;
      }

      if (isElementExpression(parseTreeNode)) {
        const elemExp = this.parseElementExpression(parseTreeNode);
        this.module.addIntermediateRepresentation(elemExp);
        continue;
      }

      if (isTableExpression(parseTreeNode)) {
        const tableExp = this.parseTableExpression(parseTreeNode);
        this.module.addIntermediateRepresentation(tableExp);
        continue;
      }

      console.log(parseTreeNode);

      throw new Error(`Unrecognised Expression: ${Tree.treeMap(parseTreeNode, (t) => t.lexeme)}`);
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
      if (!(exportInfo instanceof Array)) {
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

  private parseStartExpression(parseTree: ParseTree): StartExpression {
    if (parseTree.length !== 2) {
      throw new IllegalStartSection('Illegal Start Section', parseTree);
    }
    const [first, second] = parseTree;
    if (!(first instanceof Token && second instanceof Token)) {
      throw new IllegalStartSection('Illegal Start Section', parseTree);
    }

    return new StartExpression(first, second);
  }

  private parseMemoryExpression(parseTree: ParseTree): MemoryExpression {
    assert(isMemoryExpression(parseTree));
    let memorySize: number | null = null;
    let memoryLimit: number | null = null;
    let memoryName: string | null = null;
    /*
    Potential syntax:
    (memory SIZE)
    (memory SIZE SIZE_LIMIT)
    */
    for (let i = 1; i < parseTree.length; i++) {
      const token = parseTree[i];
      if (!(token instanceof Token)) {
        throw new IllegalMemorySection('Illegal Memory Section', parseTree);
      }

      if (memorySize === null && token.type === TokenType.Var) {
        memoryName = token.lexeme;
        continue;
      }

      if (memorySize === null && token.type === TokenType.Nat) {
        memorySize = toInteger(token.lexeme);
        continue;
      }

      if (memorySize !== null && token.type === TokenType.Nat) {
        memoryLimit = toInteger(token.lexeme);
        continue;
      }
      throw new IllegalMemorySection('Illegal Memory Section', parseTree);
    }

    if (memorySize === null) {
      throw new IllegalMemorySection('Illegal Memory Section', parseTree);
    }

    return new MemoryExpression(parseTree[0] as Token, memorySize, memoryLimit, memoryName);
  }

  private parseGlobalExpression(parseTree:ParseTree): GlobalExpression {
    let name: string | null = null;
    let type: ValueType | null = null;
    let type_mutability: boolean = false;
    let expr: Tree<Token> | null = null;
    for (const [i, token] of parseTree.entries()) {
      if (token instanceof Token && token.type === TokenType.Var) {
        name = token.lexeme;
        continue;
      }

      if (token instanceof Token && token.type === TokenType.ValueType) {
        type = token.valueType;
        continue;
      }

      if (token[0] instanceof Token && token[0].type === TokenType.Mut && token[1] instanceof Token && token[1].type === TokenType.ValueType) {
        type = token[1].valueType;
        type_mutability = true;
        continue;
      }

      if (type !== null && token instanceof Array) {
        expr = token;
      }
    }
    if (parseTree[0] instanceof Array) {
      throw new Error(`Expected Global Expression to start with token: ${Tree.treeMap(parseTree, ((t) => t.lexeme))}`);
    }
    if (type === null) {
      throw new Error(`Expected type in Global Expression: ${Tree.treeMap(parseTree, ((t) => t.lexeme))}`);
    }
    if (!(expr instanceof Array && expr.length === 2 && expr[0] instanceof Token && expr[1] instanceof Token)) {
      throw new Error(`Expected expression in Global Expression: ${Tree.treeMap(parseTree, ((t) => t.lexeme))}`);
    }

    return new GlobalExpression(parseTree[0] as Token, type, type_mutability, expr[0] as Token, expr[1] as Token, name);
  }

  private parseImportExpression(parseTree: ParseTree): ImportExpression {
    if (parseTree.length !== 4) {
      throw new Error(`Expected 4 tokens in import expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    const importModule = parseTree[1];
    const importName = parseTree[2];
    if (!(importModule instanceof Token) || importModule.type !== TokenType.Text) {
      throw new Error(`Expected module name to be a string in import expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    if (!(importName instanceof Token) || importName.type !== TokenType.Text) {
      throw new Error(`Expected import name to be a string in import expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    const importdesc = parseTree[3];
    if (!(importdesc instanceof Array) || !(importdesc[0] instanceof Token)) {
      throw new Error(`Expected import description to be a sequence of tokens in import expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    switch (importdesc[0].type) {
      case TokenType.Func:
        return ImportExpression.functionImport(importModule, importName, this.parseFunctionExpressionSignature(importdesc)[0]);
      case TokenType.Table:
        // console.log(this.parseTableExpression(importdesc));
        throw new Error('Table expressions are not supported yet.'); // FIXME
        break;
      case TokenType.Memory:
        return ImportExpression.memoryImport(importModule, importName, this.parseMemoryExpression(importdesc));
        // console.log(this.parseMemoryExpression(importdesc));
      case TokenType.Global:
        return ImportExpression.globalImport(importModule, importName, this.parseImportGlobalExpression(importdesc));
        break;
      default:
        throw new Error(`Unrecognised import description: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    throw new Error(`Unrecognised Expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
  }

  private parseImportGlobalExpression(parseTree: ParseTree): ImportGlobalExpression {
    const headerToken = parseTree[0];
    const typeToken = parseTree[1];
    if (parseTree.length !== 2) {
      throw new Error(`Expected 2 tokens in import global expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    if (!(headerToken instanceof Token)) {
      throw new Error(`Expected header token in import global expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    if (!(typeToken instanceof Token)) {
      throw new Error(`Expected type token in import global expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    return new ImportGlobalExpression(headerToken, typeToken);
  }

  private parseElementExpression(parseTree: ParseTree): ElementExpression {
    assert(isElementExpression(parseTree));

    if (parseTree.length === 1) {
      return new ElementExpression(parseTree[0] as Token, null, 'passive');
    }

    let cursor = 1;
    let currentToken = parseTree[cursor];

    if (currentToken instanceof Token && currentToken.type === TokenType.Var) {
      cursor++;
      currentToken = parseTree[cursor];
    }

    if (currentToken instanceof Array && currentToken[0] instanceof Token && (currentToken[0].type === TokenType.Table || currentToken[0].type === TokenType.Offset)) {
      return this.parseActiveElementExpression(parseTree);
    }

    if (currentToken instanceof Token && currentToken.type === TokenType.Declare) {
      return this.parseDeclarativeElementExpression(parseTree);
    }

    return this.parsePassiveElementExpression(parseTree);
  }

  private parsePassiveElementExpression(parseTree: ParseTree): ElementExpression {
    let cursor = 1;
    let currentToken = parseTree[cursor];
    let name : string | null = null;
    let elementType: Token;

    if (currentToken instanceof Token && currentToken.type === TokenType.Var) {
      name = currentToken.lexeme;
      cursor++;
      currentToken = parseTree[cursor];
    }

    if (!(currentToken instanceof Token)) {
      throw new Error(`Expected token in passive element expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    elementType = currentToken ?? null;
    cursor++;
    currentToken = parseTree[cursor];

    const items = parseTree.slice(cursor)
      .map((x) => this.parseElementItemExpression(x));

    return ElementExpression.Passive(
      parseTree[0] as Token,
      elementType,
      name,
      items,
    );
  }

  private parseActiveElementExpression(parseTree: ParseTree): ElementExpression {
    let cursor = 0;
    let currentToken = parseTree[cursor];

    const headerToken = currentToken as Token;
    currentToken = parseTree[++cursor];

    let name : string | null = null;
    let elementType: Token | null = null;
    let linkedTableExpression = null;
    let offsetExpression;

    if (currentToken instanceof Token && currentToken.type === TokenType.Var) {
      name = currentToken.lexeme;
      currentToken = parseTree[++cursor];
    }

    if (currentToken instanceof Array && currentToken[0] instanceof Token && currentToken[0].type === TokenType.Table) {
      if (currentToken.length !== 2) {
        throw new Error(`Expected 2 tokens in linked table expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
      }
      linkedTableExpression = currentToken;
      currentToken = parseTree[++cursor];
    }

    if (!(currentToken[0] instanceof Token) && currentToken[0].type !== TokenType.Offset) {
      throw new Error(`Expected offset expression in active element expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    offsetExpression = this.parseFunctionBodyExpression(currentToken.slice(1), true); // TODO: compile-time verification of offset expression
    currentToken = parseTree[++cursor];

    elementType = currentToken ?? null;
    currentToken = parseTree[++cursor];

    const items = parseTree.slice(cursor)
      .map((x) => this.parseElementItemExpression(x));

    return ElementExpression.Active(
      headerToken,
      elementType,
      name,
      linkedTableExpression,
      offsetExpression,
      items,
    );
  }

  private parseDeclarativeElementExpression(parseTree: ParseTree): ElementExpression {
    let cursor = 0;

    const headerToken = parseTree[cursor++] as Token; //FIXME : static checks for this
    let name: string | null = null;
    if (parseTree[cursor] instanceof Token && (parseTree[cursor] as Token).type === TokenType.Var) {
      name = (parseTree[cursor++] as Token).lexeme; //FIXME : static checks for this
    }
    const declarationToken = parseTree[cursor++] as Token; //FIXME : static checks for this
    const elementType = (parseTree[cursor++] as Token) ?? null; //FIXME : static checks for this
    const items = parseTree.slice(cursor)
      .map((x) => this.parseElementItemExpression(x));

    return ElementExpression.Declarative(headerToken, name, declarationToken, elementType, items);
  }

  private parseElementItemExpression(itemExpression: Token[]): ElementItemExpression {
    assert(isElementItemExpression(itemExpression));
    if (itemExpression.length === 2 && (itemExpression[0] as Token).type !== TokenType.Item) {
      const itemType = itemExpression[0];
      const itemToken = itemExpression[1];
      return new ElementItemExpression(itemType.type, itemToken);
    }
    if (itemExpression.length === 2 && (itemExpression[0] as Token).type === TokenType.Item) {
      const itemType = itemExpression[1][0] as Token;
      const itemToken = itemExpression[1][1] as Token;
      return new ElementItemExpression(itemType.type, itemToken);
    }
    if (itemExpression.length === 3) {
      const itemType = itemExpression[1];
      const itemToken = itemExpression[2];
      return new ElementItemExpression(itemType.type, itemToken);
    }
    throw new Error(`Unrecognised element item expression: ${Tree.treeMap(itemExpression, (t) => t.lexeme)}`);
  }

  private parseTableExpression(parseTree: ParseTree): TableExpression | ImportExpression {
    assert(isTableExpression(parseTree));
    const headerToken = parseTree[0] as Token;
    let tableName: string | null = null;
    let minFlag: number | null = null;
    let maxFlag: number | null = null;
    let tableType: ValueType | null = null;
    let linkedImportExpression = null;
    let linkedExportExpression = null;

    let cursor = 1;
    let currentToken = parseTree[cursor];
    if (currentToken instanceof Token && currentToken.type === TokenType.Var) {
      tableName = currentToken.lexeme;
      currentToken = parseTree[++cursor];
    }

    if (currentToken instanceof Array) {
      const firstToken = currentToken[0];
      if (firstToken instanceof Token && firstToken.type === TokenType.Import) {
        linkedImportExpression = this.parseInlineTableImportExpression(currentToken);
      } else if (firstToken instanceof Token && firstToken.type === TokenType.Export) {
        linkedExportExpression = this.parseInlineTableExportExpression(currentToken);
        linkedExportExpression.exportType = ExportType.Table;
      }
      currentToken = parseTree[++cursor];
    }

    if (!(currentToken instanceof Token) || currentToken.type !== TokenType.Nat) {
      throw new Error(`Expected min flag in table expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    minFlag = parseInt(currentToken.lexeme);
    currentToken = parseTree[++cursor];

    if (currentToken instanceof Token && currentToken.type === TokenType.Nat) {
      maxFlag = parseInt(currentToken.lexeme);
      currentToken = parseTree[++cursor];
    }

    if (currentToken instanceof Token && (currentToken.valueType === ValueType.FuncRef || currentToken.valueType === ValueType.ExternRef)) {
      tableType = currentToken.valueType;
      currentToken = parseTree[++cursor];
    }

    if (minFlag === null) {
      throw new Error(`Expected min flag in table expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    if (tableType === null) {
      throw new Error(`Expected table type in table expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }

    const result = new TableExpression(headerToken, tableName, minFlag, maxFlag, tableType);

    if (linkedExportExpression !== null) {
      this.module.addExportExpression(linkedExportExpression);
    }
    if (linkedImportExpression !== null) {
      return linkedImportExpression(result);
    }

    return result;
  }

  private parseInlineTableImportExpression(parseTree: ParseTree): (tableExpression: TableExpression) => ImportExpression {
    if (parseTree.length !== 3) {
      throw new Error(`Expected 3 tokens in inline table import expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    for (const token of parseTree) {
      if (!(token instanceof Token)) {
        throw new Error(`Invalid inline table import expression (No nested expression): ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
      }
    }
    parseTree = parseTree as Token[];

    const importModuleName = parseTree[1] as Token;
    const importEntityName = parseTree[2] as Token;

    return (tableExpression: TableExpression) => ImportExpression.tableImport(importModuleName, importEntityName, tableExpression);
  }

  private parseInlineTableExportExpression(parseTree: ParseTree): ExportExpression {
    if (parseTree.length !== 2) {
      throw new Error(`Expected 2 tokens in inline table export expression: ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
    }
    for (const token of parseTree) {
      if (!(token instanceof Token)) {
        throw new Error(`Invalid inline table export expression (No nested expression): ${Tree.treeMap(parseTree, (t) => t.lexeme)}`);
      }
    }
    parseTree = parseTree as Token[];

    const exportName = (parseTree[1] as Token).extractName();

    return new ExportExpression(exportName, ExportType.Table, this.module.exportableTables.length);
  }

  private parseFunctionExpression(parseTree: ParseTree): FunctionExpression {
    assert(isFunctionExpression(parseTree));
    const [functionSignature, cursor] = this.parseFunctionExpressionSignature(parseTree);

    // Parse function params and declarations first
    let remainingTree: ParseTree = parseTree.slice(cursor);
    let isStart = false;

    // If the function body is something like [add 1 0], slicing the tree yields:
    // [[add 1 0]] --> this is not a valid s-expression that can be parsed.
    // Token check is in place to avoid opening up [token] => token, the latter of which also cannot be parsed
    if (remainingTree.length === 1 && !(remainingTree[0] instanceof Token)) {
      remainingTree = remainingTree[0];
      isStart = true;
    }


    this.module.addGlobalType(functionSignature.signatureType);
    const ir = this.parseFunctionBodyExpression(remainingTree, isStart);
    return new FunctionExpression(functionSignature, ir);
  }

  private parseFunctionExpressionSignature(parseTree: ParseTree): [FunctionSignature, number] {
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
      // console.log(parseTreeNode instanceof Token);
      // console.log(isFunctionSignatureResultExpression(parseTreeNode));
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


    const functionSignature = new FunctionSignature(
      functionName,
      inlineExportName,
      paramTypes,
      paramNames,
      resultTypes,
      localTypes,
      localNames,
    );

    return [functionSignature, cursor];
  }

  /*
  Functions for parsing
  */
  private parseFunctionBodyExpression(
    parseTree: ParseTree,
    isStart: boolean,
  ): TokenExpression {
    if (parseTree.length === 0 || typeof parseTree === 'undefined') {
      return new EmptyTokenExpression();
    }

    if (isFunctionBodyBlockExpression(parseTree, isStart)) {
      return this.parseFunctionBodyBlockExpression(parseTree, isStart);
    }

    if (isFunctionBodyStackExpression(parseTree, isStart)) {
      return this.parseFunctionBodyStackExpression(parseTree, isStart);
    }

    if (isFunctionBodySExpression(parseTree, isStart)) {
      return this.parseFunctionBodySExpression(parseTree, isStart);
    }
    // if (isFunctionBodySelectExpression(parseTree)) {
    //   return this.parseFunctionBodySelectExpression(parseTree);
    // }

    throw new Error(
      `Cannot parse into function body expression: ${JSON.stringify(
        parseTree,
        undefined,
        2,
      )}`,
    ); // TODO legit error message when coming from function declarations.
  }

  private parseFunctionBodySExpression(
    parseTree: ParseTree,
    isStart: boolean,
  ): OperationTree {
    let head = parseTree[0];
    assert(head instanceof Token); // Head should be token here, assert to make typescript happy
    head = head as Token;

    const body: (Token | TokenExpression)[] = [];
    for (let i = 1; i < parseTree.length; i++) {
      const token = parseTree[i];
      if (token instanceof Token) {
        body.push(token);
      } else {
        const irNode = this.parseFunctionBodyExpression(token, false);
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
    isStart: boolean,
  ): UnfoldedTokenExpression {
    const nodes: (Token | TokenExpression)[] = [];
    for (let i = 0; i < parseTree.length; i++) {
      const tokenNode = parseTree[i];
      const isStart = i === 0;

      if (
        isFunctionBodySelectExpression(tokenNode, parseTree[i + 1], isStart)
      ) {
        nodes.push(
          this.parseFunctionBodySelectExpression(
            tokenNode,
            parseTree[i + 1],
            isStart,
          ),
        );
        i++;
        continue;
      }

      if (isFunctionBodyStackBlockExpression(parseTree.slice(i))) {
        const [node, consumed] = this.parseFunctionBodyStackBlockExprssion(
          parseTree.slice(i),
          isStart,
        );
        i += consumed;
        nodes.push(node);
        continue;
      }

      if (tokenNode instanceof Token) {
        nodes.push(tokenNode);
        continue;
      }
      const temp = this.parseFunctionBodyExpression(tokenNode, true);

      // if (!(temp instanceof Token || temp instanceof OperationTree)) {
      //   console.log(`parseTree: ${JSON.stringify(parseTree, undefined, 2)}`);
      //   throw new Error(`${temp.constructor.name}, ${temp}`);
      //   // throw new Error(`${temp} - ${JSON.stringify(temp, undefined, 2)}`); // TODO proper error
      // }
      nodes.push(temp);
    }

    return new UnfoldedTokenExpression(nodes);
  }

  private parseFunctionBodySelectExpression(
    headerToken: Token | Tree<Token>,
    nextToken: Token | Tree<Token> | undefined,
    isStart: boolean,
  ): TokenExpression {
    if (typeof nextToken === 'undefined') {
      if (!(headerToken instanceof Token)) {
        throw new Error();
      }
      return new SelectExpression([headerToken]);
    }
    if (
      !(
        headerToken instanceof Token
        && nextToken instanceof Array
        && nextToken[0] instanceof Token
        && nextToken[1] instanceof Token
        && nextToken.length === 2
      )
    ) {
      throw new Error(
        `Cannot convert into Select Expression: [${JSON.stringify(
          headerToken,
          undefined,
          2,
        )}, ${JSON.stringify(nextToken, undefined, 2)}]`,
      ); //TODO Proper error
    }
    return new SelectExpression([headerToken, nextToken[0], nextToken[1]]);
  }

  private parseFunctionBodyBlockExpression(
    parseTree: ParseTree,
    isStart: boolean,
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

    const signature = new SignatureType(paramTypes, resultTypes);
    // Empty signature or signature with 0 param 1 return is represented inline and not added to the global signature types.

    if (
      !signature.isEmpty()
      && !(signature.paramTypes.length === 0 && signature.returnTypes.length === 1)
    ) {
      this.module.addGlobalType(signature);
    }

    if (
      firstToken.type === TokenType.Block
      || firstToken.type === TokenType.Loop
    ) {
      return this.parseFunctionBodyBlockBlockBodyExpression(
        firstToken,
        blockLabel,
        paramTypes,
        resultTypes,
        parseTree.slice(cursor),
        isStart,
      );
    }

    if (firstToken.type === TokenType.If) {
      return this.parseFunctionBodyBlockIfBodyExpression(
        firstToken,
        blockLabel,
        paramTypes,
        resultTypes,
        parseTree.slice(cursor),
      );
    }

    throw new Error();
  }

  private parseFunctionBodyStackBlockExprssion(
    parseTree: ParseTree,
    isStart: boolean,
  ): [BlockExpression, number] {
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

    const signature = new SignatureType(paramTypes, resultTypes);
    // Empty signature or signature with 0 param 1 return is represented inline and not added to the global signature types.

    if (
      !signature.isEmpty()
      && !(signature.paramTypes.length === 0 && signature.returnTypes.length === 1)
    ) {
      this.module.addGlobalType(signature);
    }

    const body_start_cursor = cursor;

    let block_depth = 1;
    for (; cursor < parseTree.length; cursor++) {
      current = parseTree[cursor];
      if (current instanceof Token && current.isBlock()) {
        block_depth++;
      }
      if (current instanceof Token && current.type === TokenType.End) {
        block_depth--;
      }
      if (block_depth === 0) {
        break;
      }
    }
    const exp = new BlockBlockExpression(
      firstToken,
      blockLabel,
      paramTypes,
      resultTypes,
      this.parseFunctionBodyExpression(
        parseTree.slice(body_start_cursor, cursor),
        false,
      ),
    );
    return [exp, cursor];
  }

  /**
   * Parse the body expression of a (block ...) expression
   */
  private parseFunctionBodyBlockBlockBodyExpression(
    firstToken: Token,
    blockLabel: string | null,
    paramTypes: ValueType[],
    resultTypes: ValueType[],
    body: ParseTree,
    isStart: boolean,
  ) {
    return new BlockBlockExpression(
      firstToken,
      blockLabel,
      paramTypes,
      resultTypes,
      this.parseFunctionBodyExpression(body, isStart),
    );
  }

  /**
   * Parse the body expression of a (if ...) expression
   */
  private parseFunctionBodyBlockIfBodyExpression(
    firstToken: Token,
    blockLabel: string | null,
    paramTypes: ValueType[],
    resultTypes: ValueType[],
    body: ParseTree,
  ) {
    const thenExpression = body[0];
    const elseExpression = body[1] ?? null;
    if (typeof thenExpression === 'undefined') {
      throw new Error("If 'then' expression cannot be null!");
    }
    if (thenExpression instanceof Token || elseExpression instanceof Token) {
      throw new Error(
        `Unexpected tokens: ${thenExpression}, ${elseExpression}`,
      );
    }
    if (elseExpression === null) {
      return new BlockIfExpression(
        firstToken,
        blockLabel,
        paramTypes,
        resultTypes,
        this.parseFunctionBodyExpression(thenExpression.slice(1), false),
      );
    }
    return new BlockIfExpression(
      firstToken,
      blockLabel,
      paramTypes,
      resultTypes,
      this.parseFunctionBodyExpression(
        [...thenExpression.slice(1), ...elseExpression],
        false,
      ),
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

function isFunctionBodySExpression(
  parseTree: ParseTree,
  isStart: boolean,
): boolean {
  const tokenHeader = parseTree[0];
  // assert(
  //   tokenHeader instanceof Token,
  //   `first token of ${JSON.stringify(
  //     parseTree,
  //     undefined,
  //     2,
  //   )} is not a Token type`,
  // );

  return (
    isStart
    && tokenHeader instanceof Token
    && tokenHeader.isOpcodeToken()
    && Opcode.getParamLength(tokenHeader.opcodeType!) > 0
  );
}

function isFunctionBodyStackExpression(
  parseTree: ParseTree,
  isStart: boolean,
): boolean {
  const tokenHeader = parseTree[0];
  // assert(
  //   tokenHeader instanceof Token,
  //   `first token of ${JSON.stringify(
  //     parseTree,
  //     undefined,
  //     2,
  //   )} is not a Token type`,
  // );

  return (
    !(tokenHeader instanceof Token)
    || (tokenHeader.isOpcodeToken()
      && !isFunctionExpression(parseTree)
      && !isFunctionBodySExpression(parseTree, isStart))
    // && !isFunctionBodyBlockExpression(parseTree)
    // && !isModuleDeclaration(parseTree)
  );
}

function isFunctionBodySelectExpression(
  token: Token | Tree<Token>,
  nextToken: Token | Tree<Token> | undefined,
  isStart: boolean,
): boolean {
  if (!(token instanceof Token) || token.type !== TokenType.Select) {
    return false;
  }
  if (typeof nextToken === 'undefined') {
    return true;
  }
  if (
    nextToken instanceof Array
    && nextToken.length === 2
    && nextToken[0] instanceof Token
    && nextToken[1] instanceof Token
    && isFunctionSignatureResultExpression(nextToken)
  ) {
    return true;
  }
  return false;
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

function isStartExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Start;
}

function isMemoryExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Memory;
}

function isGlobalExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Global;
}

function isImportExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Import;
}

function isElementExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Elem;
}

function isElementItemExpression(parseTree: ParseTree): boolean {
  const firstToken = parseTree[0];
  if (!(firstToken instanceof Token)) {
    return false;
  }

  if (parseTree.length === 3) {
    return firstToken.type === TokenType.Item
    && parseTree[1] instanceof Token
    && parseTree[2] instanceof Token;
  }

  if (parseTree.length === 2 && firstToken.type === TokenType.Item) {
    return parseTree[1] instanceof Array
    && parseTree[1].length === 2
    && parseTree[1][0] instanceof Token
    && (parseTree[1][0].type === TokenType.RefFunc || parseTree[1][0].type === TokenType.RefExtern);
  }

  if (parseTree.length === 2 && (firstToken.type === TokenType.RefFunc || firstToken.type === TokenType.RefExtern)) {
    return parseTree[1] instanceof Token;
  }

  return false;
}

function isTableExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.type === TokenType.Table;
}

/**
 * Check if given parse tree is a block expression --> (block ?? )
 */
function isFunctionBodyBlockExpression(
  parseTree: ParseTree,
  isStart: boolean,
): boolean {
  const tokenHeader = parseTree[0];
  return isStart && tokenHeader instanceof Token && tokenHeader.isBlock();
}

function isFunctionBodyStackBlockExpression(parseTree: ParseTree): boolean {
  const tokenHeader = parseTree[0];
  return tokenHeader instanceof Token && tokenHeader.isBlock();
}

function isReservedType(token: Token, lexeme: string) {
  return token.type === TokenType.Reserved && token.lexeme === lexeme;
}
