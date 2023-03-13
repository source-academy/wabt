import { OpcodeType } from "./opcode"
import { Type } from "./type";

///#if 0
    `
///#endif
// Opcode enumerations.
//
// NOTE: this enum does not match the binary encoding.
//
export enum OpcodeType {
    #define WABT_OPCODE(rtype, type1, type2, type3, mem_size, prefix, code, Name, \
    text, decomp) \
    Name = code,
    #include "wabt/opcode.def"
    #undef WABT_OPCODE
    Invalid = 'invalid',
};
///#if 0
`
///#endif

// // Static opcode objects.
// #define WABT_OPCODE(rtype, type1, type2, type3, mem_size, prefix, code, Name, \
//     text, decomp)                                             \
// export const Opcode Name##_Opcode;
// #include "wabt/opcode.def"
// #undef WABT_OPCODE

class Opcode {

    constructor() { }
    static constructor1(e: OpcodeType) {
        this.enum_ = e;
    }

    Enum(): operator {
        return this.enum_;
    }

    static FromCode(uint32_t): Opcode;
    static FromCode(uint8_t prefix, uint32_t code): Opcode;
    HasPrefix(): boolean { return GetInfo().prefix != 0; }
    GetPrefix(): number { return GetInfo().prefix; }
    GetCode(): number { return GetInfo().code; }
    GetLength(): number { return GetBytes().size(); }
    GetName(): string { return GetInfo().name; }
    GetDecomp(): string {
        return * GetInfo().decomp ? GetInfo().decomp : GetInfo().name;
    }
Type GetResultType() const { return GetInfo().result_type; }
Type GetParamType1() const { return GetInfo().param_types[0]; }
Type GetParamType2() const { return GetInfo().param_types[1]; }
Type GetParamType3() const { return GetInfo().param_types[2]; }
Type GetParamType(int n) const { return GetInfo().param_types[n - 1]; }
Address GetMemorySize() const { return GetInfo().memory_size; }

// Get the byte sequence for this opcode, including prefix.
std:: vector < uint8_t > GetBytes() const ;

// Get the lane count of an extract/replace simd op.
uint32_t GetSimdLaneCount() const ;

// Return 1 if |alignment| matches the alignment of |opcode|, or if
// |alignment| is WABT_USE_NATURAL_ALIGNMENT.
bool IsNaturallyAligned(Address alignment) const ;

// If |alignment| is WABT_USE_NATURAL_ALIGNMENT, return the alignment of
// |opcode|, else return |alignment|.
Address GetAlignment(Address alignment) const ;

static bool IsPrefixByte(uint8_t byte) {
    return byte == kMathPrefix || byte == kThreadsPrefix || byte == kSimdPrefix;
}

bool IsEnabled(const Features& features) const ;
bool IsInvalid() const { return enum_ >= Invalid; }

private:
static constexpr uint32_t kMathPrefix = 0xfc;
static constexpr uint32_t kThreadsPrefix = 0xfe;
static constexpr uint32_t kSimdPrefix = 0xfd;

struct Info {
    const char* name;
    const char* decomp;
  Type result_type;
  Type param_types[3];
  Address memory_size;
  uint8_t prefix;
  uint32_t code;
  uint32_t prefix_code;  // See PrefixCode below. Used for fast lookup.
};

static uint32_t PrefixCode(uint8_t prefix, uint32_t code) {
    if (code >= (1 << MAX_OPCODE_BITS)) {
        // Clamp to (2^bits - 1), since we know that it is an invalid code.
        code = (1 << MAX_OPCODE_BITS) - 1;
    }
    return (prefix << MAX_OPCODE_BITS) | code;
}

// The Opcode struct only stores an enumeration (Opcode::Enum) of all valid
// opcodes, densely packed. We want to be able to store invalid opcodes as
// well, for display to the user. To encode these, we use PrefixCode() to
// generate a uint32_t of the prefix/code pair, then negate the value so it
// doesn't overlap with the valid enum values. The negation is done using
// `~code + 1` since prefix_code is unsigned, and MSVC warns if you use - on
// an unsigned value.
//
// | 0             | Opcode::Invalid         | INT32_MAX+1    UINT32_MAX |
// |---------------|-------------------------|---------------------------|
// | valid opcodes |      unused space       |      invalid opcodes      |
//
static Enum EncodeInvalidOpcode(uint32_t prefix_code) {
  Enum result = static_cast<Enum>(~prefix_code + 1);
    assert(result >= Invalid);
    return result;
}

static void DecodeInvalidOpcode(Enum e,
    uint8_t * out_prefix,
    uint32_t * out_code) {
  uint32_t prefix_code = ~static_cast<uint32_t>(e) + 1;
  * out_prefix = prefix_code >> MAX_OPCODE_BITS;
  * out_code = prefix_code & 0xff;
}

Info GetInfo() const ;
static Info infos_[];

Enum enum_;
};

// static
inline Opcode Opcode:: FromCode(uint32_t code) {
    return FromCode(0, code);
}

// static
inline Opcode Opcode:: FromCode(uint8_t prefix, uint32_t code) {
uint32_t prefix_code = PrefixCode(prefix, code);

    if (WABT_LIKELY(prefix_code < WABT_ARRAY_SIZE(WabtOpcodeCodeTable))) {
  uint32_t value = WabtOpcodeCodeTable[prefix_code];
        // The default value in the table is 0. That's a valid value, but only if
        // the code is 0 (for nop).
        if (WABT_LIKELY(value != 0 || code == 0)) {
            return Opcode(static_cast<Enum>(value));
        }
    }

    return Opcode(EncodeInvalidOpcode(prefix_code));
}

}  // namespace wabt