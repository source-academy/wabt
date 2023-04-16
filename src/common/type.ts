export enum ValueType {
  I32, // 0x7f
  I64, // 0x7e
  F32, // 0x7d
  F64, // 0x7c
  V128, // 0x7b
  I8, // 0x7a  : packed-type only, used in gc and as v128 lane
  I16, // 0x79  : packed-type only, used in gc and as v128 lane
  FuncRef, // 0x70
  ExternRef, // 0x6f
  Reference, // 0x6b
  Func, // 0x60
  Struct, // 0x5f
  Array, // 0x5e
  Void, // 0x40
  ___, // Convenient for the opcode table in opcode.h
  Any, // Not actually specified, but useful for type-checking
  I8U, // Not actually specified, but used internally with load/store
  I16U, // Not actually specified, but used internally with load/store
  I32U, // Not actually specified, but used internally with load/store
}

export namespace ValueType {
  export function getValue(t: ValueType): number {
    switch (t) {
      case ValueType.I32:
        return 0x7f; // 0x7f
      case ValueType.I64:
        return 0x7e; // 0x7e
      case ValueType.F32:
        return 0x7d; // 0x7d
      case ValueType.F64:
        return 0x7c; // 0x7c
      case ValueType.V128:
        return 0x7b; // 0x7b
      case ValueType.I8:
        return 0x7a; // 0x7a  : packed-type only, used in gc and as v128 lane
      case ValueType.I16:
        return 0x79; // 0x79  : packed-type only, used in gc and as v128 lane
      case ValueType.FuncRef:
        return 0x70; // 0x70
      case ValueType.ExternRef:
        return 0x6f; // 0x6f
      case ValueType.Reference:
        return 0x6b; // 0x6b
      case ValueType.Func:
        return 0x60; // 0x60
      case ValueType.Struct:
        return 0x5f; // 0x5f
      case ValueType.Array:
        return 0x5e; // 0x5e
      case ValueType.Void:
        return 0x40; // 0x40
      case ValueType.___:
        return -0x40; // Convenient for the opcode table in opcode.h
      case ValueType.Any:
        return 0; // Not actually specified, but useful for type-checking
      case ValueType.I8U:
        return 4; // Not actually specified, but used internally with load/store
      case ValueType.I16U:
        return 6; // Not actually specified, but used internally with load/store
      case ValueType.I32U:
        return 7; // Not actually specified, but used internally with load/store
    }
    throw new Error('Unexpected Value Type');
  }
}
