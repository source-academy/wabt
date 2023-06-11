/* eslint-disable @typescript-eslint/no-use-before-define */
import { type ValueType } from '../common/type';
import { Token, TokenType } from '../common/token';
import { ExportType } from '../common/export_types';
import { assert } from '../common/assert';
import { isEqual } from 'lodash';
import { OpcodeType } from '../common/opcode';

/**
 * An interface for intermediate expressions that can have a name/identifier to be referenced by.
 * Mainly to be used for global types that can be referenced by name.
 */
export interface HasIdentifier {
  getID(): string | null;
}

/**
 * Interface for intermediate expressions that has a signature.
 * Used for functions and blocks.
 */
export interface HasSignature {
  getSignatureType(): SignatureType;
}

export abstract class IntermediateRepresentation {
  abstract set parent(parentExpression: IntermediateRepresentation | null);
  abstract get parent(): IntermediateRepresentation | null;
  abstract toString(): string;
}

type GlobalType = SignatureType; // TODO add more
type GlobalExpression = HasIdentifier;

/**
 * Type signatures for functions and blocks.
 */
export class SignatureType {
  private _paramTypes: ValueType[];
  private _returnTypes: ValueType[];

  constructor(paramTypes: ValueType[], returnTypes: ValueType[]) {
    this._paramTypes = paramTypes;
    this._returnTypes = returnTypes;
  }

  isEmpty() {
    return this.paramTypes.length === 0 && this.returnTypes.length === 0;
  }

  get paramTypes(): ValueType[] {
    return this._paramTypes;
  }
  get returnTypes(): ValueType[] {
    return this._returnTypes;
  }
}

export class ModuleExpression extends IntermediateRepresentation {
  /*
    Sections in modules:
      0  Custom (unused)
      1  Type (Function Signatures)
      2  Import
      3  Function (Function )
      4  Table
      5  Memory
      6  Global
      7  Export
      8  Start
      9  Element
      10 Code
      11 Data
      12 DataCount
  */

  /**
   * Type Section. This stores global types, only function signature for now.
   * Only UNIQUE types stored here.
   */
  globalTypes: GlobalType[] = [];

  /**
   * For the function section.
   */
  functions: FunctionExpression[] = [];

  /**
   * Global variables that can be exported
   */
  globals: GlobalExpression[] = [];

  /**
   * Declarations for export section
   */
  exportExpressions: ExportExpression[] = []; // TODO add support for multiple export expressions

  addFunctionExpression(functionExpression: FunctionExpression) {
    this.functions.push(functionExpression);
    this.addGlobalType(functionExpression.getSignatureType());
    this.globals.push(functionExpression);

    // Generate an export expression if it has an inline export.
    if (functionExpression.hasInlineExport()) {
      this.addExportExpression(
        new ExportExpression(
          functionExpression.getInlineExportName()!,
          ExportType.Func,
          this.functions.length - 1,
        ),
      );
    }
  }

  addExportExpression(exportExpression: ExportExpression) {
    this.exportExpressions.push(exportExpression);
  }

  /**
   * Add a type to the list of global types.
   * Only addes to the list of types if it does not already exist
   * @param type type to add to global type.
   */
  addGlobalType(type: GlobalType) {
    for (const existingType of this.globalTypes) {
      if (isEqual(existingType, type)) {
        return;
      }
    }
    this.globalTypes.push(type);
  }

  getGlobalTypes(): GlobalType[] {
    return this.globalTypes;
  }

  /**
   * Query and resolve the index of a given global type.
   * Global type must exist within the module.
   * TODO: This takes O(n) per query, ideally should reduce to O(1)
   * @param type type to query
   * @returns index of type in module
   */
  resolveGlobalTypeIndex(type: GlobalType) {
    for (const [i, existing_type] of this.globalTypes.entries()) {
      if (isEqual(existing_type, type)) {
        return i;
      }
    }

    assert(
      false,
      `Global type not found! This is an error that should be raised to the developer.
      Please help raise an issue on GitHub. Got: ${JSON.stringify(
    type,
    undefined,
    2,
  )}.
      Global types available are: ${JSON.stringify(
    this.globalTypes.entries(),
    undefined,
    2,
  )}`,
    );
    return -1; // This will never run, assert throws error
  }

  /**
   * Query and resolve the index of a given global expression.
   * Global expression must exist within the module.
   * Comparison is made by name.
   * TODO: This takes O(n) per query, ideally should reduce to O(1)
   * @param type type to query
   * @returns index of type in module
   */
  resolveGlobalExpressionIndex(name: string) {
    for (const [i, existing_type] of this.globals.entries()) {
      if (existing_type.getID() === name) {
        return i;
      }
    }

    assert(false, 'Global not found!'); // TODO better error message
    return -1; // This will never run, assert throws error
  }

  getFunctionSignatureTypes(): SignatureType[] {
    return this.functions.map((func) => func.getSignatureType());
  }

  getFunctionBodies(): TokenExpression[] {
    return this.functions.map((func) => func.getBody());
  }

  toString(): string {
    return JSON.stringify(this, undefined, 2);
  }

  get parent(): IntermediateRepresentation | null {
    return null;
  }
  set parent(parentExpression: IntermediateRepresentation) {
    throw new Error('Module Expression should not have parent.');
  }
}

export class ExportExpression extends IntermediateRepresentation {
  exportName: string;
  exportType: ExportType;
  exportReferenceIndex: number | null = null;
  exportReferenceName: string | null = null;

  _parent?: ModuleExpression;

  // Constructor for inline function exports
  constructor(
    exportName: string,
    exportType: ExportType,
    exportReference: number
  );
  // TODO need to refine this construtor.
  constructor(exportName: Token, exportType: Token, exportReference: Token);
  constructor(
    exportName: string | Token,
    exportType: ExportType | Token,
    exportReference: number | Token,
  ) {
    super();
    if (typeof exportName === 'string') {
      this.exportName = exportName;
    } else {
      this.exportName = this.getExportName(exportName);
    }

    if (exportType instanceof Token) {
      this.exportType = this.getExportType(exportType);
    } else {
      this.exportType = exportType;
    }

    if (typeof exportReference === 'number') {
      this.exportReferenceIndex = exportReference;
    } else {
      [this.exportReferenceIndex, this.exportReferenceName]
        = this.getExportReference(exportReference);
    }
  }

  private getExportName(exportName: Token) {
    if (exportName.type !== TokenType.Text) {
      throw new Error(`unexpected export name: ${exportName}`); // TODO better errors
    }
    return exportName.extractName();
  }

  private getExportType(exportType: Token) {
    if (exportType.type !== TokenType.Func) {
      throw new Error(`unexpected export type: ${exportType}`); // TODO better errors
    }
    return ExportType.Func;
  }

  private getExportReference(
    exportReference: Token,
  ): [number, null] | [null, string] {
    switch (exportReference.type) {
      case TokenType.Nat:
        return [Number.parseInt(exportReference.lexeme), null];
      case TokenType.Var:
        return [null, exportReference.lexeme];
      default:
        throw new Error(
          `unexpected export ID: ${JSON.stringify(
            exportReference,
            undefined,
            2,
          )}.`,
        );
    }
  }

  get parent(): ModuleExpression {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }
  set parent(parent: ModuleExpression) {
    this._parent = parent;
  }

  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}, ${this.exportName}`;
  }
}
/*
FUNCTIONS
*/

/**
 * Intermediate representation of function expression.
 * Note that signature and body will be encoded in different places afterward
 */
export class FunctionExpression
  extends IntermediateRepresentation
  implements HasIdentifier, HasSignature {
  private signature: FunctionSignature;
  private body: TokenExpression;
  _parent?: ModuleExpression;

  constructor(signature: FunctionSignature, body: TokenExpression) {
    super();
    this.signature = signature;
    this.body = body;
    body.parent = this;
  }

  getID(): string | null {
    return this.signature.functionName;
  }
  getParamNames() {
    return this.signature.paramNames;
  }
  getSignatureType() {
    return this.signature.signatureType;
  }
  getLocalTypes() {
    return this.signature.localTypes;
  }
  getLocalNames() {
    return this.signature.localNames;
  }
  getInlineExportName() {
    return this.signature.inlineExportName;
  }
  hasInlineExport() {
    return this.signature.inlineExportName !== null;
  }
  getBody() {
    return this.body;
  }

  resolveVariableIndex(nameToResolve: string) {
    for (const [i, name] of [
      ...this.getParamNames(),
      ...this.getLocalNames(),
    ].entries()) {
      if (name === nameToResolve) {
        return i;
      }
    }
    throw new Error(
      `Parameter name ${nameToResolve} not found in function. Parameter names available: ${[
        this.getParamNames(),
      ]}, Local Names available: ${this.getLocalNames()}`,
    );
  }

  get parent(): ModuleExpression {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }
  set parent(parent: ModuleExpression) {
    this._parent = parent;
  }

  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}, ${JSON.stringify(
      this.signature,
      undefined,
      2,
    )}`;
  }
}

/**
 * Class for function signature.
 * This class shoudl contain literally everything to do with function declaration.
 */
export class FunctionSignature {
  functionName: string | null;
  paramNames: (string | null)[];
  localTypes: ValueType[];
  localNames: (string | null)[];
  inlineExportName: string | null;
  signatureType: SignatureType;

  constructor(
    functionName: string | null,
    inlineExportName: string | null,
    paramTypes: ValueType[],
    paramNames: (string | null)[],
    returnTypes: ValueType[],
    localTypes: ValueType[],
    localNames: (string | null)[],
  ) {
    assert(
      paramTypes.length === paramNames.length,
      `Function param types and names must have same length: [${paramTypes}], [${paramNames}]`,
    );
    assert(
      localTypes.length === localNames.length,
      `Function local types and names must have same length: [${localTypes}], [${localNames}]`,
    );
    this.functionName = functionName;
    this.signatureType = new SignatureType(paramTypes, returnTypes);
    this.paramNames = paramNames;
    this.localTypes = localTypes;
    this.localNames = localNames;
    this.inlineExportName = inlineExportName;
  }
}

/*
  EXPRESSION BODIES
*/
/**
 * Interface indicating that the particular intermediate representation
 * may contain s-expressions, and can therefore be 'unfolded'.
 */
export interface Unfoldable extends IntermediateRepresentation {
  unfold(): UnfoldedTokenExpression;
}
export namespace Unfoldable {
  /**
   * Check if a JS object is an Unfoldable interface. Note that this is hardly perfect.
   * @param o object to check
   * @returns true if unfoldable
   */
  export function instanceOf(o: any) {
    return 'unfold' in o && typeof o.unfold === 'function';
  }
}

/**
 * All possible token expressions.
 */
export abstract class TokenExpression extends IntermediateRepresentation {}

/**
 * Class representing operators and operands in an s-expression.
 */
export class OperationTree extends TokenExpression implements Unfoldable {
  _parent?: IntermediateRepresentation;
  operator: IRToken;
  operands: (IRToken | TokenExpression)[];

  constructor(operator: Token, operands: (Token | TokenExpression)[]) {
    super();
    this.operator = new IRToken(operator, this, null);

    this.operands = [];
    for (let i = 0; i < operands.length; i++) {
      const operand = operands[i];
      let prevOperand = i === 0 ? null : operands[i - 1];
      prevOperand = prevOperand instanceof TokenExpression ? null : prevOperand;

      if (operand instanceof TokenExpression) {
        operand.parent = this;
        this.operands.push(operand);
      } else {
        this.operands.push(new IRToken(operand, this, prevOperand));
      }
    }
  }

  unfold(): UnfoldedTokenExpression {
    if (typeof this.parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set for ${this}`,
      );
    }

    const unfoldedOperands: (IRToken | TokenExpression)[] = this.operands.map(
      (operand) => {
        if (operand instanceof IRToken) {
          return operand;
        }

        return operand;
      },
    );

    const unfoldedExpression = new UnfoldedTokenExpression([
      ...unfoldedOperands,
      this.operator,
    ]);
    unfoldedExpression.parent = this.parent;

    return unfoldedExpression;
  }

  get parent(): IntermediateRepresentation {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }
  set parent(parent: IntermediateRepresentation) {
    this._parent = parent;
  }

  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}, ${this.operator}`;
  }
}

/**
 * Class representing a stack token expression. May have s-expressions inside.
 */
export class UnfoldedTokenExpression extends TokenExpression {
  _parent?: IntermediateRepresentation;
  expr: (IRToken | TokenExpression)[];

  constructor(expr: (Token | TokenExpression)[]) {
    super();
    this.expr = [];
    for (let i = 0; i < expr.length; i++) {
      const exp = expr[i];
      let prevExp = i === 0 ? null : expr[i - 1];
      prevExp = prevExp instanceof TokenExpression ? null : prevExp;

      if (exp instanceof TokenExpression) {
        exp.parent = this;
        this.expr.push(exp);
      } else {
        this.expr.push(new IRToken(exp, this, prevExp));
      }
    }
  }

  get parent(): IntermediateRepresentation {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }

  set parent(parent: IntermediateRepresentation) {
    this._parent = parent;
  }
  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}, ${this.expr.toString()}`;
  }
}

/**
 * Class to represent an empty token expression
 */
export class EmptyTokenExpression extends TokenExpression {
  _parent?: IntermediateRepresentation;

  unfold(): UnfoldedTokenExpression {
    if (typeof this.parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }

    const unfoldedExpression = new UnfoldedTokenExpression([]);
    unfoldedExpression.parent = this.parent;
    return unfoldedExpression;
  }

  get parent(): IntermediateRepresentation {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }
  set parent(parent: IntermediateRepresentation) {
    this._parent = parent;
  }

  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}`;
  }
}

export class UnfoldedBlockExpression extends UnfoldedTokenExpression {
  _parent?: IntermediateRepresentation;
  signature: SignatureType;
  name: string | null;
  expr: (IRToken | TokenExpression)[];

  constructor(
    signature: SignatureType,
    name: string | null,
    tokens: (Token | TokenExpression)[],
  ) {
    super(tokens);
    this.signature = signature;
    this.name = name;

    this.expr = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      let prevToken = i === 0 ? null : tokens[i - 1];
      prevToken = prevToken instanceof TokenExpression ? null : prevToken;

      if (token instanceof TokenExpression) {
        token.parent = this;
        this.expr.push(token);
      } else {
        this.expr.push(new IRToken(token, this, prevToken));
      }
    }
  }

  get parent(): IntermediateRepresentation {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }
  set parent(parent: IntermediateRepresentation) {
    this._parent = parent;
  }

  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}, ${this.name}`;
  }
}
/**
 * Class representing a Block expression that wrap around an expression.
 * For expressions such as block, if, loop instructions.
 */
export class BlockExpression extends OperationTree implements HasSignature {
  _parent?: IntermediateRepresentation;
  private body: TokenExpression;
  private signature: BlockSignature;
  private headerToken: IRToken; // First token in block that specifies block type.

  constructor(
    headerToken: Token,
    name: string | null,
    paramTypes: ValueType[],
    returnTypes: ValueType[],
    blockExpression: TokenExpression,
  ) {
    super(headerToken, []);
    this.signature = new BlockSignature(
      headerToken.type,
      name,
      paramTypes,
      returnTypes,
    );
    this.body = blockExpression;
    this.headerToken = new IRToken(headerToken, this, null);
    blockExpression.parent = this;
  }

  unfold(): UnfoldedBlockExpression {
    if (typeof this.parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }

    const unfoldedExpression = new UnfoldedBlockExpression(
      this.getSignatureType(),
      this.getName(),
      [this.headerToken, this.body, this.createEndToken()],
    );
    unfoldedExpression.parent = this.parent;
    return unfoldedExpression;
  }

  private createEndToken(): IRToken {
    const token = new Token(
      TokenType.End,
      'end',
      this.headerToken.line,
      this.headerToken.col,
      this.headerToken.indexInSource, // TODO col and indexinsource should not be headertoken.
      OpcodeType.End,
      null,
    );
    return new IRToken(token, this, this.headerToken.prevToken);
  }

  getSignatureType(): SignatureType {
    return this.signature.signatureType;
  }
  getBlockType() {
    return this.signature.blockType;
  }

  getName(): string | null {
    return this.signature.name;
  }

  hasName(): boolean {
    return this.signature.name !== null;
  }
  getParamTypes() {
    return this.signature.signatureType.paramTypes;
  }
  getReturnTypes() {
    return this.signature.signatureType.returnTypes;
  }
  getBody(): TokenExpression {
    return this.body;
  }

  get parent(): IntermediateRepresentation {
    if (typeof this._parent === 'undefined') {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }
  set parent(parent: IntermediateRepresentation) {
    this._parent = parent;
  }

  /**
   * Get string representation of object
   */
  toString(): string {
    return `${this.constructor.name}, ${JSON.stringify(
      this.signature,
      undefined,
      2,
    )}`;
  }
}

class BlockSignature {
  blockType: TokenType;
  name: string | null;
  signatureType: SignatureType;

  constructor(
    blockType: TokenType,
    name: string | null,
    paramTypes: ValueType[],
    returnTypes: ValueType[],
  ) {
    assert(
      blockType === TokenType.Block
        || blockType === TokenType.Loop
        || blockType === TokenType.If,
      `block type must be Block, Loop or If, but got: ${blockType}. Please report this bug to the developer.`,
    );
    this.blockType = blockType;
    this.name = name;
    this.signatureType = new SignatureType(paramTypes, returnTypes);
  }
}

/**
 * Class that wraps around a token to store IR metadata.
 * Notably, stores: previous token, parent expression
 */
export class IRToken extends Token {
  private _prevToken: Token | null = null;
  private _parent: IntermediateRepresentation;

  constructor(
    token: Token,
    parent: IntermediateRepresentation,
    prevToken: Token | null = null,
  ) {
    super(
      token.type,
      token.lexeme,
      token.line,
      token.col,
      token.indexInSource,
      token.opcodeType,
      token.valueType,
    );
    this._prevToken = prevToken;
    this._parent = parent;
  }

  get prevToken() {
    return this._prevToken;
  }

  get parent(): IntermediateRepresentation {
    if (typeof this._parent === 'undefined' || this._parent === null) {
      throw new Error(
        `Parent Expression for this Function Expression not set ${this}`,
      );
    }
    return this._parent;
  }

  set parent(parent: IntermediateRepresentation) {
    this._parent = parent;
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }
}
