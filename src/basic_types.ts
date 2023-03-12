// include\wabt\base-types.h
export type Index = number; // uint32_t;    // An index into one of the many index spaces.
export type Address = number; // uint64_t;  // An address or size in linear memory.
export type Offset = number; // size_t;     // An offset into a host's file or memory buffer.

export const kInvalidAddress: Address = ~0;
export const kInvalidIndex: Index = ~0;
export const kInvalidOffset: Offset = ~0;