export enum Type {
  I32,        // 0x7f
  I64,        // 0x7e
  F32,        // 0x7d
  F64,        // 0x7c
  V128,       // 0x7b
  I8,         // 0x7a  : packed-type only, used in gc and as v128 lane
  I16,        // 0x79  : packed-type only, used in gc and as v128 lane
  FuncRef,    // 0x70
  ExternRef,  // 0x6f
  Reference,  // 0x6b
  Func,       // 0x60
  Struct,     // 0x5f
  Array,      // 0x5e
  Void,       // 0x40
  ___,         // Convenient for the opcode table in opcode.h
  Any,   // Not actually specified, but useful for type-checking
  I8U,   // Not actually specified, but used internally with load/store
  I16U,  // Not actually specified, but used internally with load/store
  I32U,  // Not actually specified, but used internally with load/store
};

export function getValue(t: Type) {
  switch (t) {
    case Type.I32: return -0x01;        // 0x7f
    case Type.I64: return -0x02;        // 0x7e
    case Type.F32: return -0x03;        // 0x7d
    case Type.F64: return -0x04;        // 0x7c
    case Type.V128: return -0x05;       // 0x7b
    case Type.I8: return -0x06;         // 0x7a  : packed-type only, used in gc and as v128 lane
    case Type.I16: return -0x07;        // 0x79  : packed-type only, used in gc and as v128 lane
    case Type.FuncRef: return -0x10;    // 0x70
    case Type.ExternRef: return -0x11;  // 0x6f
    case Type.Reference: return -0x15;  // 0x6b
    case Type.Func: return -0x20;       // 0x60
    case Type.Struct: return -0x21;     // 0x5f
    case Type.Array: return -0x22;      // 0x5e
    case Type.Void: return -0x40;       // 0x40
    case Type.___: return -0x40;        // Convenient for the opcode table in opcode.h
    case Type.Any: return 0;   // Not actually specified, but useful for type-checking
    case Type.I8U: return 4;   // Not actually specified, but used internally with load/store
    case Type.I16U: return 6;  // Not actually specified, but used internally with load/store
    case Type.I32U: return 7;  // Not actually specified, but used internally with load/store
  }
  
};