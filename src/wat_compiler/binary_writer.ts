/* eslint-disable array-element-newline */ // (array formatting)
import {
  type SignatureType,
  type ModuleExpression,
  type ExportExpression,
  type FunctionExpression,
  UnfoldedBlockExpression,
  OperationTree,
  EmptyTokenExpression,
  type TokenExpression,
  UnfoldedTokenExpression,
  IRToken,
  type IntermediateRepresentation,
  BlockExpression,
  SelectExpression,
  type MemoryExpression,
  type GlobalExpression,
} from './ir_types';
import { ValueType } from '../common/type';
import { type Token, TokenType } from '../common/token';
import { Opcode, OpcodeType } from '../common/opcode';

import { ExportType } from '../common/export_types';
import { assert } from '../common/assert';
import { i64_to_leb128, i32_to_leb128 } from '../utils/number_encoder';
import { toInteger } from 'lodash';
import { IllegalStartSection } from './exceptions';

namespace SectionCode {
  export const Type = 1;
  export const Import = 2;
  export const Function = 3;
  export const Table = 4;
  export const Memory = 5;
  export const Global = 6;
  export const Export = 7;
  export const Start = 8;
  export const Element = 9;
  export const Code = 10;
  export const Data = 11;
}

export class BinaryWriter {
  private module: ModuleExpression;

  constructor(module: ModuleExpression) {
    this.module = module;
  }

  encode(): Uint8Array {
    return new Uint8Array([
      ...[0, 'a'.charCodeAt(0), 's'.charCodeAt(0), 'm'.charCodeAt(0)], // magic number
      ...[1, 0, 0, 0], // version number
      ...this.encodeTypeSection(),
      ...this.encodeImportSection(),
      ...this.encodeFunctionSection(),
      ...this.encodeTableSection(),
      ...this.encodeMemorySection(),
      ...this.encodeGlobalSection(),
      ...this.encodeExportSection(),
      ...this.encodeStartSection(),
      ...this.encodeElementSection(),
      ...this.encodeCodeSection(),
      ...this.encodeDataSection(),
    ]);
  }

  private encodeTypeSection(): Uint8Array {
    if (this.module.getGlobalTypes().length === 0) {
      return new Uint8Array([]);
    }
    const types = this.module.getGlobalTypes();

    const numTypes = types.length;

    let funcSignatureEncodings: number[] = [];
    types
      .map((func) => this.encodeFunctionSignature(func))
      .forEach((arr) => {
        funcSignatureEncodings = funcSignatureEncodings.concat(...arr);
      });

    const sectionSize = funcSignatureEncodings.length + 1;
    return new Uint8Array([
      SectionCode.Type,
      sectionSize,
      numTypes,
      ...funcSignatureEncodings,
    ]);
  }

  private encodeImportSection(): Uint8Array {
    return new Uint8Array([]);
  }

  private encodeFunctionSection(): Uint8Array {
    const functions = this.module.getFunctionSignatureTypes();
    const num_fns = functions.length;
    if (num_fns === 0) {
      return new Uint8Array([]);
    }
    const section_size = num_fns + 1;

    const function_indices = functions.map((funcSig) => this.module.resolveGlobalTypeIndex(funcSig));

    return new Uint8Array([
      SectionCode.Function,
      section_size,
      num_fns,
      ...function_indices,
    ]);
  }

  private encodeTableSection(): Uint8Array {
    return new Uint8Array([]);
  }

  private encodeMemorySection(): Uint8Array {
    if (this.module.memory === null) {
      return new Uint8Array([]);
    }

    const memorySectionEncoding = this.encodeMemoryExpression(this.module.memory);

    return new Uint8Array([
      SectionCode.Memory,
      memorySectionEncoding.length + 1,
      1,
      ...memorySectionEncoding,
    ]);
  }

  private encodeGlobalSection(): Uint8Array {
    if (this.module.globals.length === 0) {
      return new Uint8Array([]);
    }
    const globalEncoding: number[] = [];
    let n_globals = 0;
    this.module.globals.forEach((g) => {
      globalEncoding.push(...this.encodeGlobalExpression(g));
      n_globals++;
    });

    return new Uint8Array([
      SectionCode.Global,
      globalEncoding.length + 1,
      n_globals,
      ...globalEncoding,
    ]);
  }

  private encodeExportSection(): Uint8Array {
    const { exportExpressions: exportDeclarations } = this.module;
    if (typeof exportDeclarations === 'undefined') {
      return new Uint8Array([]);
    }
    const exportEncoding = this.encodeExportExpressions(exportDeclarations);
    const sectionLength = exportEncoding.length;

    if (sectionLength === 0) {
      return new Uint8Array();
    }
    return new Uint8Array([
      SectionCode.Export,
      sectionLength,
      ...exportEncoding,
    ]);
  }

  private encodeStartSection(): Uint8Array {
    if (this.module.start === null) {
      return new Uint8Array([]);
    }

    if (this.module.start.identifier.type === TokenType.Nat) {
      const startFunctionIndex = toInteger(this.module.start.identifier.lexeme);
      if (startFunctionIndex >= this.module.functions.length) {
        throw new IllegalStartSection(
          `Start function index ${startFunctionIndex} is out of bounds.`
            + `There are only ${this.module.functions.length} functions.`,
        );
      }
      return new Uint8Array([SectionCode.Start, 1, startFunctionIndex]);
    }

    if (this.module.start.identifier.type === TokenType.Var) {
      const startFunctionIndex = this.module.resolveExportableExpressionIndexByName(
        this.module.start.identifier.lexeme,
        ExportType.Func,
      );
      return new Uint8Array([SectionCode.Start, 1, startFunctionIndex]);
    }

    throw new IllegalStartSection(
      'Start function identifier is not a valid type.'
        + `Got ${this.module.start.identifier.lexeme}`,
    );

    // const startFunctionIndex = this.module.(this.module.start.identifier);
  }
  private encodeElementSection(): Uint8Array {
    return new Uint8Array([]);
  }

  private encodeCodeSection(): Uint8Array {
    const fnExps = this.module.functions;

    if (fnExps.length === 0) {
      return new Uint8Array([]);
    }

    const fnBodyEncodings: number[] = [];
    fnExps.forEach((body) => {
      fnBodyEncodings.push(...this.encodeFunctionBody(body));
    });

    const sectionSize = fnBodyEncodings.length + 1;
    const fnNumber = fnExps.length;

    return new Uint8Array([
      SectionCode.Code,
      sectionSize,
      fnNumber,
      ...fnBodyEncodings,
    ]);
  }

  private encodeDataSection(): Uint8Array {
    return new Uint8Array([]);
  }

  // Memory
  private encodeMemoryExpression(ir: MemoryExpression): Uint8Array {
    if (ir.memoryLimit === null) {
      return new Uint8Array([
        0,
        ir.memoryLength,
      ]);
    }

    return new Uint8Array([
      1,
      ir.memoryLength,
      ir.memoryLimit,
    ]);
  }

  private encodeGlobalExpression(ir: GlobalExpression): Uint8Array {
    const type = ir.type;
    const globalType = ir.globalType;
    const globalValue = ir.globalValue;

    const mutability = 0;

    let literal: Uint8Array;
    switch (type) {
      case ValueType.I32:
        literal = NumberEncoder.encodeI32Const(toInteger(globalValue.lexeme));
        break;
      case ValueType.I64:
        literal = NumberEncoder.encodeI64Const(toInteger(globalValue.lexeme));
        break;
      case ValueType.F32:
        literal = NumberEncoder.encodeF32Const(toInteger(globalValue.lexeme));
        break;
      case ValueType.F64:
        literal = NumberEncoder.encodeF64Const(toInteger(globalValue.lexeme));
        break;
      case ValueType.FuncRef:
        if (globalValue.type === TokenType.Var) {
          literal = new Uint8Array([this.module.resolveExportableExpressionIndexByName(globalValue.lexeme, ExportType.Func)]);
        } else if (globalValue.type === TokenType.Nat) {
          literal = new Uint8Array([toInteger(globalValue.lexeme)]);
        } else {
          literal = this.encodeToken(globalValue);
        }
        break;
      case ValueType.ExternRef:
        // throw new Error(`Invalid global type ${globalValue}`);
        literal = this.encodeToken(globalValue);
        break;
      default:
        throw new Error(`Invalid global type ${globalValue}`);
    }

    return new Uint8Array([
      ValueType.getValue(type),
      mutability,
      ...this.encodeToken(globalType),
      ...literal,
      0x0b, // End token
    ]);
  }
  // Functions

  /**
   * Encode the function signature of a FunctionSignature intermediate representation.
   * This function encodes a function signature to be used in the "Type" (1) section of a Module encoding.
   * @param ir function signature to encode
   * @returns a Uint8Array binary encoding.
   */
  private encodeFunctionSignature(ir: SignatureType): Uint8Array {
    const FUNCTION_SIG_PREFIX = 0x60;

    const param_encoding = ir.paramTypes.map((type) => ValueType.getValue(type));
    const param_len = param_encoding.length;

    const result_encoding = ir.returnTypes.map((type) => ValueType.getValue(type));
    const result_len = result_encoding.length;

    return new Uint8Array([
      FUNCTION_SIG_PREFIX,
      param_len,
      ...param_encoding,
      result_len,
      ...result_encoding,
    ]);
  }

  /**
   * Encode the function bidt of a FunctionExpression intermediate representation.
   * This function encodes a function body to be used in the "Code" (10 / 0x0a) section of a Module encoding.
   * @param fnExp function expression to encode
   * @returns a Uint8Array binary encoding.
   */
  private encodeFunctionBody(fnExp: FunctionExpression): Uint8Array {
    let fnBody = fnExp.getBody();

    const encodedBody = this.encodeFunctionBodyExpression(fnBody, fnExp);
    const encodedLocals = this.encodeFunctionBodyLocalTypeCount(fnExp);
    const sectionLength = encodedLocals.length + encodedBody.length + 1;
    const FUNCTION_END = 0x0b;

    // The random 0 there is the local declaration count. Not yet implemented, so it is 0 for now.
    return new Uint8Array([
      sectionLength,
      ...encodedLocals,
      ...encodedBody,
      FUNCTION_END,
    ]);
  }

  private encodeFunctionBodyExpression(
    expr: TokenExpression,
    fn: FunctionExpression,
  ): Uint8Array {
    if (expr instanceof OperationTree) {
      expr = expr.unfold();
    }

    if (expr instanceof EmptyTokenExpression) {
      return new Uint8Array([]);
    }

    if (expr instanceof UnfoldedTokenExpression) {
      if (expr instanceof UnfoldedBlockExpression) {
        return this.encodeUnfoldedBlockExpression(expr, fn);
      }
      if (expr instanceof SelectExpression) {
        return this.encodeSelectExpression(expr);
      }
      return this.encodeUnfoldedTokenExpression(expr, fn);
    }

    throw new Error(`${expr.toString()}`);
  }

  private encodeUnfoldedTokenExpression(
    unfoldedTokenExpr: UnfoldedTokenExpression,
    fnExpr: FunctionExpression,
  ): Uint8Array {
    const result: number[] = [];
    for (let i = 0; i < unfoldedTokenExpr.expr.length; i++) {
      let currentExpr = unfoldedTokenExpr.expr[i];

      if (currentExpr instanceof IRToken) {
        // Variable resolution
        if (currentExpr.type === TokenType.Var) {
          result.push(this.encodeVarToken(currentExpr, fnExpr));
        } else {
          result.push(...this.encodeToken(currentExpr));
        }
        continue;
      } else {
        result.push(...this.encodeFunctionBodyExpression(currentExpr, fnExpr));
      }
    }

    return new Uint8Array(result);
  }

  /**
   * Encode a token of type TokenType.Var
   * @param token token to encode
   * @param fnExpr function expression that wraps this token
   * @returns a number which represents the binary encoding of said token.
   */
  private encodeVarToken(token: IRToken, fnExpr: FunctionExpression): number {
    switch (token.prevToken?.type) {
      case TokenType.LocalSet:
      case TokenType.LocalGet:
        return this.encodeFunctionLocalVarToken(token, fnExpr);
      case TokenType.Br:
      case TokenType.BrIf:
        return this.encodeFunctionBrVarToken(token);

      default:
        throw new Error(
          `Unable to resolve var token ${token.prevToken?.lexeme} ${token.lexeme}`,
        );
    }
  }

  /**
   * Encode a 'Br $var' token by evaluating the index for $var.
   * @returns a number corresponding to the break stack index.
   */
  private encodeFunctionBrVarToken(token: IRToken): number {
    let parent: IntermediateRepresentation | null = token;
    let stack_count = 0;
    while (parent !== null) {
      if (
        (parent instanceof BlockExpression
          && parent.getName() === token.lexeme)
        || (parent instanceof UnfoldedBlockExpression
          && parent.name === token.lexeme)
      ) {
        return stack_count;
      }

      if (
        parent instanceof BlockExpression
        || parent instanceof UnfoldedBlockExpression
      ) {
        stack_count++;
      }
      parent = parent.parent;
    }

    throw new Error(`Br ${token.lexeme} not found.`);
  }
  /**
   * Encode a 'local.get $var' or 'local.set $var' token by evaluating the index for $var.
   * @returns a number corresponding to the local variable index.
   */
  private encodeFunctionLocalVarToken(
    token: IRToken,
    fnExpr: FunctionExpression,
  ): number {
    const nameToResolve = token.lexeme;
    for (const [i, name] of [
      ...fnExpr.getParamNames(),
      ...fnExpr.getLocalNames(),
    ].entries()) {
      if (name === nameToResolve) {
        return i;
      }
    }
    throw new Error(
      `Parameter name ${nameToResolve} not found in function. Parameter names available: ${[
        fnExpr.getParamNames(),
      ]}, Local Names available: ${fnExpr.getLocalNames()}`,
    );
  }

  /**
   * Encode local type count of function body
   */
  private encodeFunctionBodyLocalTypeCount(
    fnExp: FunctionExpression,
  ): Uint8Array {
    const localTypes = fnExp.getLocalTypes();
    let uniqueConsecutiveType: ValueType | null = null;
    let uniqueConsecutiveTypeCount: number = 0;
    let total_types = 0;
    const encoding: number[] = [];

    for (const type of localTypes) {
      if (uniqueConsecutiveType === type) {
        uniqueConsecutiveTypeCount++;
        continue;
      }
      if (uniqueConsecutiveType !== null) {
        encoding.push(
          uniqueConsecutiveTypeCount,
          ValueType.getValue(uniqueConsecutiveType),
        );
      }
      uniqueConsecutiveType = type;
      uniqueConsecutiveTypeCount = 1;
      total_types++;
    }
    if (uniqueConsecutiveType !== null) {
      encoding.push(
        uniqueConsecutiveTypeCount,
        ValueType.getValue(uniqueConsecutiveType),
      );
    }
    return Uint8Array.from([total_types, ...encoding]);
  }

  private encodeToken(token: IRToken): Uint8Array {
    if (!this.isLiteralToken(token)) {
      return this.encodeNonLiteralToken(token);
    }
    if (token.prevToken === null) {
      throw new Error(`Unable to encode ${token}`);
    }
    return this.encodeLiteralToken(token.prevToken, token);
  }

  private encodeUnfoldedBlockExpression(
    ir: UnfoldedBlockExpression,
    fnExpr: FunctionExpression,
  ): Uint8Array {
    const binary: number[] = [
      ...this.encodeUnfoldedTokenExpression(ir, fnExpr),
    ];

    const signature = ir.signature;

    if (signature.isEmpty()) {
      // Empty block type
      binary.splice(1, 0, 0x40);
    } else if (
      ir.signature.paramTypes.length === 0
      && ir.signature.returnTypes.length === 1
    ) {
      binary.splice(1, 0, ValueType.getValue(ir.signature.returnTypes[0]));
    } else {
      // Else, query block type
      binary.splice(1, 0, this.module.resolveGlobalTypeIndex(ir.signature));
    }
    return new Uint8Array(binary);
  }

  private encodeSelectExpression(ir: SelectExpression): Uint8Array {
    if (!ir.hasExplicitResult) {
      return this.encodeNonLiteralToken(ir.headerToken);
    }
    const valueType = ir.explicitResultType?.valueType ?? null;
    if (valueType === null) {
      throw new Error();
    }
    return new Uint8Array([
      ...this.encodeNonLiteralToken(ir.headerToken),
      1, // FIXME assume 1 result type for select expression.
      ValueType.getValue(valueType),
    ]);
  }
  // Exports

  /**
   * Encode an export expression.
   * TODO this does not work for multiple exports.
   * @param exportExpressions export expression to encode
   */
  private encodeExportExpressions(
    exportExpressions: ExportExpression[],
  ): Uint8Array {
    // If empty, return empty array
    if (exportExpressions.length === 0) {
      return new Uint8Array();
    }

    const exportNum = exportExpressions.length;

    const exportEncodings: number[] = [];
    for (const exportExp of exportExpressions) {
      let {
        exportReferenceIndex,
        exportName,
        exportType,
        exportReferenceName,
      } = exportExp;

      // Encode export name
      const exportNameEncoding = [];
      for (let i = 0; i < exportName.length; i++) {
        exportNameEncoding.push(exportName.charCodeAt(i));
      }
      exportEncodings.push(exportName.length);
      exportEncodings.push(...exportNameEncoding);

      if (exportReferenceIndex === null && exportReferenceName === null) {
        throw new Error(
          `Both export reference index and name cannot be null: ${exportExp}`,
        );
      }
      if (exportReferenceIndex === null) {
        exportReferenceIndex = this.module.resolveExportableExpressionIndexByName(
          exportReferenceName!,
          exportType,
        );
      }
      exportEncodings.push(ExportType.getEncoding(exportType));
      exportEncodings.push(exportReferenceIndex);
    }

    return new Uint8Array([exportNum, ...exportEncodings]);
  }

  // Tokens

  private convertVarToIndexToken(varToken: IRToken, index: number): IRToken {
    assert(Number.isInteger(index));
    assert(index >= 0);

    varToken.type = TokenType.Nat;
    varToken.lexeme = index.toString();
    return varToken;
    // return new Token(
    //   TokenType.Nat,
    //   index.toString(),
    //   varToken.line,
    //   varToken.col,
    //   varToken.indexInSource,
    //   null,
    //   null,
    // );
  }

  private isLiteralToken(token: IRToken): boolean {
    return token.type === TokenType.Nat || token.type === TokenType.Float;
  }

  /**
   * Encode an individual token.
   * @param token token to encode
   * @returns a Uint8Array of binary encodings.
   */
  private encodeNonLiteralToken(token: IRToken): Uint8Array {
    if (token.isValueToken()) {
      return new Uint8Array([ValueType.getValue(token.valueType!)]);
    }

    if (token.isMemoryOpcodeToken()) {
      return this.encodeMemoryOperationToken(token);
    }
    if (token.isOpcodeToken()) {
      return this.encodeOpcodeToken(token);
    }

    if (token.valueType !== null) {
      // This is a last-ditch attempt to translate a given token. May not be correct.
      return new Uint8Array([ValueType.getValue(token.valueType!)]);
    }

    throw new Error(`Unexpected token: ${token.toString()}`);
  }

  /**
   * Encode a literal token.
   * We need to know the previous token to determine the type of the current token.
   * @param prevToken previous token
   * @param token token
   */
  private encodeLiteralToken(prevToken: Token, token: IRToken): Uint8Array {
    if (prevToken.isOpcodeType(OpcodeType.F64Const)) {
      return NumberEncoder.encodeF64Const(
        /^\d+$/u.test(token.lexeme)
          ? Number.parseInt(token.lexeme)
          : Number.parseFloat(token.lexeme),
      );
    }
    if (prevToken.isOpcodeType(OpcodeType.F32Const)) {
      return NumberEncoder.encodeF32Const(
        /^\d+$/u.test(token.lexeme)
          ? Number.parseInt(token.lexeme)
          : Number.parseFloat(token.lexeme),
      );
    }
    if (prevToken.isOpcodeType(OpcodeType.I64Const)) {
      return NumberEncoder.encodeI64Const(BigInt(token.lexeme));
    }
    if (prevToken.isOpcodeType(OpcodeType.I32Const)) {
      return NumberEncoder.encodeI32Const(
        /^\d+$/u.test(token.lexeme)
          ? Number.parseInt(token.lexeme)
          : Number.parseFloat(token.lexeme),
      );
    }

    if (
      prevToken.type === TokenType.LocalGet
      || prevToken.type === TokenType.LocalSet
    ) {
      assert(token.type === TokenType.Nat); // TODO proper error
      return new Uint8Array([Number.parseInt(token.lexeme)]);
    }

    // Br tokens
    if (prevToken.type === TokenType.Br) {
      assert(token.type === TokenType.Nat); // TODO proper error
      return new Uint8Array([Number.parseInt(token.lexeme)]);
    }

    // TODO custom error
    throw new Error(
      `Unsuppored literal token type: [${JSON.stringify(
        prevToken,
        undefined,
        2,
      )}, ${JSON.stringify(token, undefined, 2)}]`,
    );
  }

  private encodeOpcodeToken(token: IRToken): Uint8Array {
    return new Uint8Array([Opcode.getCode(token.opcodeType!)]);
  }

  private encodeMemoryOperationToken(token: IRToken): Uint8Array {
    if (token.type === TokenType.Store) {
      return this.encodeMemoryStoreToken(token);
    }
    if (token.type === TokenType.Load) {
      return this.encodeMemoryLoadToken(token);
    }
    if (token.type === TokenType.MemoryGrow) {
      return this.encodeMemoryGrowToken(token);
    }
    if (token.type === TokenType.MemorySize) {
      return this.encodeMemorySizeToken(token);
    }
    throw new Error();
  }

  private encodeMemoryStoreToken(token: IRToken): Uint8Array {
    let alignment: number | null = null;
    const storeOffset: number = 0;
    switch (token.opcodeType) {
      case OpcodeType.I32Store8:
      case OpcodeType.I64Store8:
        alignment = 0;
        break;
      case OpcodeType.I32Store16:
      case OpcodeType.I64Store16:
        alignment = 1;
        break;
      case OpcodeType.F32Store:
      case OpcodeType.I32Store:
      case OpcodeType.I64Store32:
        alignment = 2;
        break;
      case OpcodeType.F64Store:
      case OpcodeType.I64Store:
        alignment = 3;
        break;
      default:
        throw new Error(`Unexpected opcode: ${token.lexeme}`);
    }
    return new Uint8Array([
      ...this.encodeOpcodeToken(token),
      alignment,
      storeOffset,
    ]);
  }

  private encodeMemoryLoadToken(token: IRToken): Uint8Array {
    let alignment: number | null = null;
    const storeOffset: number = 0;
    switch (token.opcodeType) {
      case OpcodeType.I32Load8S:
      case OpcodeType.I32Load8U:
      case OpcodeType.I64Load8S:
      case OpcodeType.I64Load8U:
        alignment = 0;
        break;
      case OpcodeType.I32Load16S:
      case OpcodeType.I64Load16S:
      case OpcodeType.I32Load16U:
      case OpcodeType.I64Load16U:
        alignment = 1;
        break;
      case OpcodeType.F32Load:
      case OpcodeType.I32Load:
      case OpcodeType.I64Load32S:
      case OpcodeType.I64Load32U:
        alignment = 2;
        break;
      case OpcodeType.F64Load:
      case OpcodeType.I64Load:
        alignment = 3;
        break;
      default:
        throw new Error(`Unexpected opcode: ${token.lexeme}`);
    }
    return new Uint8Array([
      ...this.encodeOpcodeToken(token),
      alignment,
      storeOffset,
    ]);
  }

  private encodeMemoryGrowToken(token: IRToken): Uint8Array {
    const memidx = 0; // This is the only valid memory ID in the current version of WebAssembly.
    return new Uint8Array([...this.encodeOpcodeToken(token), memidx]);
  }

  private encodeMemorySizeToken(token: IRToken): Uint8Array {
    const memidx = 0; // This is the only valid memory ID in the current version of WebAssembly.
    return new Uint8Array([...this.encodeOpcodeToken(token), memidx]);
  }
}

export namespace NumberEncoder {
  /**
   * Get the little-endian binary encoding of a double-precision floating-point number,
   * in the IEEE-754 specification.
   * @param n number to encode
   * @returns a unsigned-8 bit integer array
   */
  export function encodeF64Const(n: number): Uint8Array {
    let buffer = new ArrayBuffer(8);
    new DataView(buffer)
      .setFloat64(0, n, true);

    return new Uint8Array(buffer);
  }

  /**
   * Get the little-endian binary encoding of a single-precision floating-point number,
   * in the IEEE-754 specification.
   * @param n number to encode
   * @returns a unsigned-8 bit integer array
   */
  export function encodeF32Const(n: number): Uint8Array {
    let buffer = new ArrayBuffer(8);
    new DataView(buffer)
      .setFloat32(0, n, true);

    return new Uint8Array(buffer.slice(0, 4));
  }

  export function encodeI64Const(n: number | bigint): Uint8Array {
    return i64_to_leb128(n);
  }

  export function encodeI32Const(n: number | bigint): Uint8Array {
    return i32_to_leb128(n);
  }
}
