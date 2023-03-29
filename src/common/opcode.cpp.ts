/* eslint-disable @typescript-eslint/no-use-before-define */
// / export enum OpcodeType {
// /     #define WABT_OPCODE(rtype, type1, type2, type3, mem_size, prefix, code, Name, \
// /     text, decomp) \
// /     Name,
// /         #include "wabt/opcode.def"
// /     #undef WABT_OPCODE
// /     Invalid,
// / };

// we need non-type imports after preprocessing
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ValueType } from './type';
import { OpcodeType } from './opcode';

export namespace Opcode {
  type DataType = {
    rtype: ValueType;
    type1: ValueType;
    type2: ValueType;
    type3: ValueType;
    mem_size: number;
    prefix: number;
    code: number;
    Name: OpcodeType;
    text: string;
    decomp: string;
  };

  export function getReturnType(o: OpcodeType): ValueType {
    return opcodeData[o][0];
  }
  export function getParamTypes(o: OpcodeType): ValueType[] {
    const params = [
      opcodeData[o][1],
      opcodeData[o][2],
      opcodeData[o][3],
    ].filter((p) => p !== ValueType.___);
    return params;
  }
  export function getParamLength(o: OpcodeType): number {
    return getParamTypes(o).length;
  }
  export function getMemSize(o: OpcodeType): ValueType {
    return opcodeData[o][4];
  }
  export function getPrefix(o: OpcodeType): number {
    return opcodeData[o][5];
  }
  export function getCode(o: OpcodeType): number {
    return opcodeData[o][6];
  }
  export function getText(o: OpcodeType): string {
    return opcodeData[o][7];
  }
  export function getDecompText(o: OpcodeType): string {
    return opcodeData[o][8];
  }

  const opcodeData: Record<
  OpcodeType,
  [
    ValueType,
    ValueType,
    ValueType,
    ValueType,
    number,
    number,
    number,
    string,
    string,
  ]
  > = {
    // / #define WABT_OPCODE(rtype, type1, type2, type3, mem_size, prefix, code, Name, \
    // / text, decomp) \
    // / [OpcodeType.Name]: [ValueType.rtype, ValueType.type1, ValueType.type2, ValueType.type3, mem_size, prefix, code, text, decomp],
    // /     #include "wabt/opcode.def"
    // / #undef WABT_OPCODE
    [OpcodeType.Invalid]: [ValueType.___, ValueType.___, ValueType.___, ValueType.___, 0, 0, 0, '', ''],
  };
}
