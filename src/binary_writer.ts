/* eslint-disable array-element-newline */ // (array formatting)
import { type ModuleExpression } from './ir';
import { ValueType } from './type';
import assert from 'assert';

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
class BinaryWriter {
  readonly module: ModuleExpression;

  constructor(module: ModuleExpression) {
    this.module = module;
  }

  encode(): Uint8Array {
    // TODO merge using .set() function https://stackoverflow.com/questions/49129643/how-do-i-merge-an-array-of-uint8arrays
    return new Uint8Array([
      ...this.encodeModulePrefix(),
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

  private encodeModulePrefix(): number[] {
    return [
      ...[0, 'a'.charCodeAt(0), 's'.charCodeAt(0), 'm'.charCodeAt(0)], // magic number
      ...[1, 0, 0, 0], // version number
    ];
  }

  private encodeTypeSection(): number[] {
    const type_number = this.module.functionSignatures.length;

    // encode functions
    let encoded_func_sigs: number[] = this.module.functionSignatures.flatMap((sig) => [
      0x60,
      sig.paramTypes.length,
      ...sig.paramTypes.map(ValueType.getValue),
      sig.returnTypes.length,
      ...sig.returnTypes.map(ValueType.getValue),
    ]);

    const total_bytes = 1 + encoded_func_sigs.length;

    return [SectionCode.Type, total_bytes, type_number, ...encoded_func_sigs];
  }

  private encodeImportSection(): number[] {
    return [];
  }

  private encodeFunctionSection(): number[] {
    let func_length = this.module.functionSignatures.length;
    let encoded_func_decls: number[] = [
      ...this.module.functionSignatures.map((sig, i) => i),
    ];

    const total_bytes = 1 + encoded_func_decls.length;
    return [SectionCode.Function, total_bytes, func_length, ...encoded_func_decls];
  }

  private encodeTableSection(): number[] {
    return [];
  }
  private encodeMemorySection(): number[] {
    return [];
  }
  private encodeGlobalSection(): number[] {
    return [];
  }
  private encodeExportSection(): number[] {
    return [];
  }
  private encodeStartSection(): number[] {
    return [];
  }
  private encodeElementSection(): number[] {
    return [];
  }

  private encodeCodeSection(): number[] {
    let func_length = this.module.functionBodies.length;
    let encoded_func_bodies: number[][] = [
      ...this.module.functionBodies.map((body) => {
        const contents = body.body.contents;
        assert(Array.isArray(contents));
        contents.map(token => )
      }),
    ];

    return [SectionCode.Code];
  }

  private encodeDataSection(): number[] {
    return [];
  }
}
