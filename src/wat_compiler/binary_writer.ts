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

/**
 * Get
 * @param ir
 * @returns
 */
export function encodeModule(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([
    ...[0, 'a'.charCodeAt(0), 's'.charCodeAt(0), 'm'.charCodeAt(0)], // magic number
    ...[1, 0, 0, 0], // version number
    ...encodeModuleTypeSection(ir),
    ...encodeModuleImportSection(ir),
    ...encodeModuleFunctionSection(ir),
    ...encodeModuleTableSection(ir),
    ...encodeModuleMemorySection(ir),
    ...encodeModuleGlobalSection(ir),
    ...encodeModuleExportSection(ir),
    ...encodeModuleStartSection(ir),
    ...encodeModuleElementSection(ir),
    ...encodeModuleCodeSection(ir),
    ...encodeModuleDataSection(ir),
  ]);
}

function encodeModuleTypeSection(ir: ModuleExpression): Uint8Array {
  const functions = ir.getFunctionSignatures();

  const numTypes = functions.length;

  let funcSignatureEncodings: number[] = [];
  functions.map(encodeFunctionSignature)
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

function encodeModuleImportSection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}

function encodeModuleFunctionSection(ir: ModuleExpression): Uint8Array {
  const functions = ir.getFunctionSignatures();
  const num_fns = functions.length;
  const section_size = num_fns + 1;

  const function_indices = Array(num_fns)
    .keys();
  return new Uint8Array([
    SectionCode.Function,
    section_size,
    num_fns,
    ...function_indices,
  ]);
}
function encodeModuleTableSection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}
function encodeModuleMemorySection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}
function encodeModuleGlobalSection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}
function encodeModuleExportSection(ir: ModuleExpression): Uint8Array {
  const { exportDeclarations } = ir;
  if (typeof exportDeclarations === 'undefined') {
    return new Uint8Array([]);
  }
  const exportEncoding = encodeExportExpressions(exportDeclarations);
  const sectionLength = exportEncoding.length;
  return new Uint8Array([SectionCode.Export, sectionLength, ...exportEncoding]);
}
function encodeModuleStartSection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}
function encodeModuleElementSection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}
function encodeModuleCodeSection(ir: ModuleExpression): Uint8Array {
  const fnBodies = ir.getFunctionBodies();

  const fnBodyEncodings: number[] = [];
  fnBodies.forEach((body) => {
    fnBodyEncodings.push(...encodeFunctionBody(body));
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
function encodeModuleDataSection(ir: ModuleExpression): Uint8Array {
  return new Uint8Array([]);
}
/**
 * Encode a completely unfolded token expression
 * @param ir a PureUnfoldedTokenExpression
 * @returns a Uint8Array binary encoding
 */
function encodePureUnfoldedTokenExpression(
  ir: PureUnfoldedTokenExpression,
): Uint8Array {
  const binary: number[] = [];
  for (const [index, token] of ir.tokens.entries()) {
    if (!isLiteralToken(token)) {
      binary.push(...encodeNonLiteralToken(token));
    } else {
      const prevToken = ir.tokens[index - 1];
      binary.push(...encodeLiteralToken(prevToken, token));
    }
  }
  return new Uint8Array(binary);
}

/**
 * Encode an export expression.
 * TODO this does not work for multiple exports.
 * @param exportExpression export expression to encode
 */
function encodeExportExpressions(
  exportExpression: ExportExpression[],
): Uint8Array {
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

  const exportNum = exportExpression.length;

  const exportEncodings: number[] = [];
  for (const exportObj of exportExpression) {
    exportEncodings.push(...encodeExport(exportObj));
  }

  return new Uint8Array([exportNum, ...exportEncodings]);
}

/**
 * Encode the function signature of a FunctionSignature intermediate representation.
 * This function encodes a function signature to be used in the "Type" (1) section of a Module encoding.
 * @param ir function signature to encode
 * @returns a Uint8Array binary encoding.
 */
function encodeFunctionSignature(ir: FunctionSignature): Uint8Array {
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
function encodeFunctionBody(ir: FunctionBody): Uint8Array {
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

      unfoldedBody.tokens[i] = convertVarToIndexToken(token, index);
    }
  }

  const encodedBody = encodePureUnfoldedTokenExpression(unfoldedBody);
  const FUNCTION_END = 0x0b;

  // The random 0 there is the local declaration count. Not yet implemented, so it is 0 for now.
  return new Uint8Array([
    encodedBody.length + 2,
    0,
    ...encodedBody,
    FUNCTION_END,
  ]);
}

function convertVarToIndexToken(varToken: Token, index: number): Token {
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
function isLiteralToken(token: Token): boolean {
  return token.type === TokenType.Nat || token.type === TokenType.Float;
}

/**
 * Encode an individual token.
 * @param token token to encode
 * @returns a Uint8Array of binary encodings.
 */
function encodeNonLiteralToken(token: Token): Uint8Array {
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
function encodeLiteralToken(prevToken: Token, token: Token): Uint8Array {
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

export const TEST_EXPORTS = {
  encodeFunctionBody,
  encodeFunctionSignature,
  encodeExportExpressions,
  encodePureUnfoldedTokenExpression,
  encodeModule,
  encodeModuleTypeSection,
  encodeModuleImportSection,
  encodeModuleFunctionSection,
  encodeModuleTableSection,
  encodeModuleMemorySection,
  encodeModuleGlobalSection,
  encodeModuleExportSection,
  encodeModuleStartSection,
  encodeModuleElementSection,
  encodeModuleCodeSection,
  encodeModuleDataSection,
};
