/* eslint-disable @typescript-eslint/no-use-before-define */
import { type ValueType } from '../common/type';
import { Token, TokenType } from '../common/token';
import { ExportType } from '../common/export_types';
import { assert } from '../common/assert';
import { isEqual } from 'lodash';
import { Opcode, OpcodeType } from '../common/opcode';

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

export abstract class IntermediateRepresentation {}

type GlobalType = SignatureType; // TODO add more
type GlobalExpression = HasIdentifier;

/**
 * Type signatures for functions and blocks.
 */
export class SignatureType {
  paramTypes: ValueType[];
  returnTypes: ValueType[];

  constructor(paramTypes: ValueType[], returnTypes: ValueType[]) {
    this.paramTypes = paramTypes;
    this.returnTypes = returnTypes;
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
      Please help raise an issue on GitHub.`,
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
}

export class ExportExpression extends IntermediateRepresentation {
  exportName: string;
  exportType: ExportType;
  exportReferenceIndex: number | null = null;
  exportReferenceName: string | null = null;

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

  constructor(signature: FunctionSignature, body: TokenExpression) {
    super();
    this.signature = signature;
    this.body = body;
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
export interface Unfoldable {
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
  operator: Token;
  operands: (Token | TokenExpression)[];

  constructor(operator: Token, operands: (Token | TokenExpression)[]) {
    super();
    this.operator = operator;
    this.operands = operands;
  }

  unfold(): UnfoldedTokenExpression {
    const unfoldedOperands: (Token | TokenExpression)[] = this.operands.map(
      (operand) => {
        if (operand instanceof Token) {
          return operand;
        }

        return operand;
      },
    );

    return new UnfoldedTokenExpression([...unfoldedOperands, this.operator]);
  }
}

/**
 * Class representing a stack token expression. May have s-expressions inside.
 */
export class UnfoldedTokenExpression extends TokenExpression {
  expr: (Token | TokenExpression)[];

  constructor(expr: (Token | TokenExpression)[]) {
    super();
    this.expr = expr;
  }
}

/**
 * Class to represent an empty token expression
 */
export class EmptyTokenExpression extends TokenExpression {
  unfold(): UnfoldedTokenExpression {
    return new UnfoldedTokenExpression([]);
  }
}

export class UnfoldedBlockExpression extends UnfoldedTokenExpression {
  signature: SignatureType;
  expr: (Token | TokenExpression)[];
  constructor(signature: SignatureType, tokens: (Token | TokenExpression)[]) {
    super(tokens);
    this.signature = signature;
    this.expr = tokens;
  }
}
/**
 * Class representing a Block expression that wrap around an expression.
 * For expressions such as block, if, loop instructions.
 */
export class BlockExpression extends OperationTree implements HasSignature {
  private body: TokenExpression;
  private signature: BlockSignature;
  private headerToken: Token; // First token in block that specifies block type.

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
    this.headerToken = headerToken;
  }

  unfold(): UnfoldedBlockExpression {
    return new UnfoldedBlockExpression(this.getSignatureType(), [
      this.headerToken,
      this.body,
      this.createEndToken(),
    ]);
  }

  private createEndToken(): Token {
    return new Token(
      TokenType.End,
      'end',
      this.headerToken.line,
      this.headerToken.col,
      this.headerToken.indexInSource, // TODO col and indexinsource should not be headertoken.
      OpcodeType.End,
      null,
    );
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
