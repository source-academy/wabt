/* eslint-disable array-element-newline */ // (array formatting)
import {
  type FunctionBody,
  type FunctionSignature,
  type ModuleExpression,
  type PureUnfoldedTokenExpression,
  type ExportExpression,
} from './ir_types';
import { ValueType } from '../common/type';
import { Token, TokenType } from '../common/token';
import { Opcode, OpcodeType } from '../common/opcode';

import { ExportType } from '../common/export_types';
import { assert } from '../common/assert';

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
    const functions = this.module.getFunctionSignatures();
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
    const { exportDeclarations } = this.module;
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
    const fnBodies = this.module.getFunctionBodies();

    const fnBodyEncodings: number[] = [];
    fnBodies.forEach((body) => {
      fnBodyEncodings.push(...this.encodeFunctionBody(body));
    });

    const sectionSize = fnBodyEncodings.length + 1;
    const fnNumber = fnBodies.length;

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
  private encodeFunctionSignature(ir: FunctionSignature): Uint8Array {
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
   * Encode the function bidt of a FunctionBody intermediate representation.
   * This function encodes a function body to be used in the "Code" (10 / 0x0a) section of a Module encoding.
   * @param ir function body to encode
   * @returns a Uint8Array binary encoding.
   */
  private encodeFunctionBody(ir: FunctionBody): Uint8Array {
    const unfoldedBody = ir.body.unfold();
    const paramNames = ir.paramNames;

    // Replace parameter names with index.
    for (let i = 0; i < unfoldedBody.tokens.length; i++) {
      const token = unfoldedBody.tokens[i];
      if (token.type === TokenType.Var) {
        const index = paramNames.indexOf(token.lexeme);
        if (index === -1) {
          // TODO proper error message
          throw new Error(
            `Parameter name not found in function body: ${JSON.stringify(
              ir,
              undefined,
              2,
            )}`,
          );
        }

        unfoldedBody.tokens[i] = this.convertVarToIndexToken(token, index);
      }
    }

    const encodedBody = this.encodePureUnfoldedTokenExpression(unfoldedBody);
    const FUNCTION_END = 0x0b;

    // The random 0 there is the local declaration count. Not yet implemented, so it is 0 for now.
    return new Uint8Array([
      encodedBody.length + 2,
      0,
      ...encodedBody,
      FUNCTION_END,
    ]);
  }

  /**
   * Encode a completely unfolded token expression (for function body)
   * @param ir a PureUnfoldedTokenExpression
   * @returns a Uint8Array binary encoding
   */
  private encodePureUnfoldedTokenExpression(
    ir: PureUnfoldedTokenExpression,
  ): Uint8Array {
    const binary: number[] = [];
    for (const [index, token] of ir.tokens.entries()) {
      if (!this.isLiteralToken(token)) {
        binary.push(...this.encodeNonLiteralToken(token));
      } else {
        const prevToken = ir.tokens[index - 1];
        binary.push(...this.encodeLiteralToken(prevToken, token));
      }
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

    function encodeExport(obj: ExportExpression): Uint8Array {
      const { exportReferenceIndex: exportIndex, exportName, exportType } = obj;
      const exportNameEncoding = [];

      for (let i = 0; i < exportName.length; i++) {
        exportNameEncoding.push(exportName.charCodeAt(i));
      }

      return new Uint8Array([
        exportName.length,
        ...exportNameEncoding,
        ExportType.getEncoding(exportType),
        exportIndex,
      ]);
    }

    const exportNum = exportExpressions.length;

    const exportEncodings: number[] = [];
    for (const exportObj of exportExpressions) {
      exportEncodings.push(...encodeExport(exportObj));
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

    throw new Error(`Unexpected token: ${token}`);
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

    if (prevToken.type === TokenType.LocalGet) {
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
      .setFloat64(0, n);
    let bytes = new Uint8Array(buffer);

    return bytes.reverse();
  }
}

// export const TEST_EXPORTS = {
//   encodeFunctionBody,
//   encodeFunctionSignature,
//   encodeExportExpressions,
//   encodePureUnfoldedTokenExpression,
//   encodeModule,
//   encodeModuleTypeSection,
//   encodeModuleImportSection,
//   encodeModuleFunctionSection,
//   encodeModuleTableSection,
//   encodeModuleMemorySection,
//   encodeModuleGlobalSection,
//   encodeModuleExportSection,
//   encodeModuleStartSection,
//   encodeModuleElementSection,
//   encodeModuleCodeSection,
//   encodeModuleDataSection,
// };
