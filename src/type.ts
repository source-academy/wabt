// include\wabt\type.h



import { Index } from "./basic_types";
import { WABT_UNREACHABLE } from "./config";

enum TypeEnum {
    I32 = -0x01,        // 0x7f
    I64 = -0x02,        // 0x7e
    F32 = -0x03,        // 0x7d
    F64 = -0x04,        // 0x7c
    V128 = -0x05,       // 0x7b
    I8 = -0x06,         // 0x7a  : packed-type only, used in gc and as v128 lane
    I16 = -0x07,        // 0x79  : packed-type only, used in gc and as v128 lane
    FuncRef = -0x10,    // 0x70
    ExternRef = -0x11,  // 0x6f
    Reference = -0x15,  // 0x6b
    Func = -0x20,       // 0x60
    Struct = -0x21,     // 0x5f
    Array = -0x22,      // 0x5e
    Void = -0x40,       // 0x40
    ___ = Void,         // Convenient for the opcode table in opcode.h

    Any = 0,   // Not actually specified, but useful for type-checking
    I8U = 4,   // Not actually specified, but used internally with load/store
    I16U = 6,  // Not actually specified, but used internally with load/store
    I32U = 7,  // Not actually specified, but used internally with load/store
};

type TypeVector = Type[];
function TypeVector(...args: Type[]) {
    return args;
}

export class Type {
    // Matches binary format, do not change.


    //     Type() = default;  // Provided so Type can be member of a union.
    //     Type(int32_t code)
    //         : enum_(static_cast<Enum>(code)), type_index_(kInvalidIndex) { }
    // Type(Enum e) : enum_(e), type_index_(kInvalidIndex) { }
    // Type(Enum e, Index type_index) : enum_(e), type_index_(type_index) {
    //     assert(e == TypeEnum.Reference);
    // }
    //      constexpr operator Enum() const { return enum_; }

    IsRef(): boolean {
        return this.enum_ == TypeEnum.ExternRef || this.enum_ == TypeEnum.FuncRef ||
            this.enum_ == TypeEnum.Reference;
    }

    IsReferenceWithIndex(): boolean { return this.enum_ == TypeEnum.Reference; }

    IsNullableRef(): boolean {
        // Currently all reftypes are nullable
        return this.IsRef();
    }

    GetName(): string {
        switch (this.enum_) {
            case TypeEnum.I32: return "i32";
            case TypeEnum.I64: return "i64";
            case TypeEnum.F32: return "f32";
            case TypeEnum.F64: return "f64";
            case TypeEnum.V128: return "v128";
            case TypeEnum.I8: return "i8";
            case TypeEnum.I16: return "i16";
            case TypeEnum.FuncRef: return "funcref";
            case TypeEnum.Func: return "func";
            case TypeEnum.Void: return "void";
            case TypeEnum.Any: return "any";
            case TypeEnum.ExternRef: return "externref";
            case TypeEnum.Reference:
                // return StringPrintf("(ref %d)", this.type_index_);
                return `(ref ${this.type_index_})`
            default:
                // return StringPrintf("<type_index[%d]>", this.enum_);
                return `(<type_index[${this.enum_}]>)`
        }
    }

    GetRefKindName(): string {
        switch (this.enum_) {
            case TypeEnum.FuncRef: return "func";
            case TypeEnum.ExternRef: return "extern";
            case TypeEnum.Struct: return "struct";
            case TypeEnum.Array: return "array";
            default: return "<invalid>";
        }
    }

    // Functions for handling types that are an index into the type section.
    // These are always positive integers. They occur in the binary format in
    // block signatures, e.g.
    //
    //   (block (result i32 i64) ...)
    //
    // is encoded as
    //
    //   (type $T (func (result i32 i64)))
    //   ...
    //   (block (type $T) ...)
    //
    IsIndex(): boolean { return this.enum_ >= 0; }

    GetIndex(): Index {
        assert(this.IsIndex());
        return this.enum_;
    }

    GetReferenceIndex(): Index {
        assert(this.enum_ == TypeEnum.Reference);
        return this.type_index_;
    }

    GetInlineVector(): TypeVector {
        assert(!this.IsIndex());
        switch (this.enum_) {
            case TypeEnum.Void:
                return TypeVector();

            case TypeEnum.I32:
            case TypeEnum.I64:
            case TypeEnum.F32:
            case TypeEnum.F64:
            case TypeEnum.V128:
            case TypeEnum.FuncRef:
            case TypeEnum.ExternRef:
            case TypeEnum.Reference:
                return TypeVector(this, this + 1); // Bruh seriously? This is ridiculous

            default:
                WABT_UNREACHABLE;
                return []; // satisfy ts type check 
        }
    }

    enum_: TypeEnum;
    type_index_: Index;  // Only used for for Type::Reference
};