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
} from './ir_types';
import { ValueType } from '../common/type';
import { Token, TokenType } from '../common/token';
import { Opcode, OpcodeType } from '../common/opcode';

import { ExportType } from '../common/export_types';
import { assert } from '../common/assert';
import { i64_to_leb128, i32_to_leb128 } from '../utils/number_encoder';

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
    return new Uint8Array([]);
  }

  private encodeGlobalSection(): Uint8Array {
    return new Uint8Array([]);
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
    return new Uint8Array([]);
  }
  private encodeElementSection(): Uint8Array {
    return new Uint8Array([]);
  }

  private encodeCodeSection(): Uint8Array {
    const fnExps = this.module.functions;

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
      return this.encodeUnfoldedTokenExpression(expr, fn);
    }

    throw new Error(`${JSON.stringify(expr, undefined, 2)}`);
  }

  private encodeUnfoldedTokenExpression(
    unfoldedTokenExpr: UnfoldedTokenExpression,
    fnExpr: FunctionExpression,
  ): Uint8Array {
    const result: number[] = [];
    for (let i = 0; i < unfoldedTokenExpr.expr.length; i++) {
      let currentExpr = unfoldedTokenExpr.expr[i];
      let prevExpr = unfoldedTokenExpr.expr[i - 1];

      if (currentExpr instanceof Token) {
        if (currentExpr.type === TokenType.Var) {
          result.push(fnExpr.resolveVariableIndex(currentExpr.lexeme));
        } else if (prevExpr instanceof Token) {
          result.push(...this.encodeToken(currentExpr, prevExpr));
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

  private encodeToken(
    token: Token,
    prevToken: Token | undefined = undefined,
  ): Uint8Array {
    if (!this.isLiteralToken(token)) {
      return this.encodeNonLiteralToken(token);
    }
    if (typeof prevToken === 'undefined') {
      throw new Error(`Unable to encode ${token}`);
    }
    return this.encodeLiteralToken(prevToken, token);
  }

  private encodeUnfoldedBlockExpression(
    ir: UnfoldedBlockExpression,
    fnExpr: FunctionExpression,
  ): Uint8Array {
    const binary: number[] = [
      ...this.encodeUnfoldedTokenExpression(ir, fnExpr),
    ];

    if (
      ir.signature.paramTypes.length === 0
      && ir.signature.returnTypes.length === 0
    ) {
      // Empty block type
      binary.splice(1, 0, 0x40);
    } else {
      // Else, query block type
      binary.splice(1, 0, this.module.resolveGlobalTypeIndex(ir.signature));
    }
    return new Uint8Array(binary);
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
        exportReferenceIndex = this.module.resolveGlobalExpressionIndex(
          exportReferenceName!,
        );
      }
      exportEncodings.push(ExportType.getEncoding(exportType));
      exportEncodings.push(exportReferenceIndex);
    }

    return new Uint8Array([exportNum, ...exportEncodings]);
  }

  // Tokens

  private convertVarToIndexToken(varToken: Token, index: number): Token {
    assert(Number.isInteger(index));
    assert(index >= 0);

    return new Token(
      TokenType.Nat,
      index.toString(),
      varToken.line,
      varToken.col,
      varToken.indexInSource,
      null,
      null,
    );
  }

  private isLiteralToken(token: Token): boolean {
    return token.type === TokenType.Nat || token.type === TokenType.Float;
  }

  /**
   * Encode an individual token.
   * @param token token to encode
   * @returns a Uint8Array of binary encodings.
   */
  private encodeNonLiteralToken(token: Token): Uint8Array {
    if (token.isValueToken()) {
      return new Uint8Array([ValueType.getValue(token.valueType!)]);
    }

    if (token.isOpcodeToken()) {
      return new Uint8Array([Opcode.getCode(token.opcodeType!)]);
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token, undefined, 2)}`);
  }

  /**
   * Encode a literal token.
   * We need to know the previous token to determine the type of the current token.
   * @param prevToken previous token
   * @param token token
   */
  private encodeLiteralToken(prevToken: Token, token: Token): Uint8Array {
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

    // TODO custom error
    throw new Error(
      `Unsuppored literal token type: [${JSON.stringify(
        prevToken,
        undefined,
        2,
      )}, ${JSON.stringify(token, undefined, 2)}]`,
    );
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
