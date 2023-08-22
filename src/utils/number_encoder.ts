import { assert } from '../common/assert';
/* eslint-disable no-bitwise */
// We need bitwise operations, well, because we are dealing with bitwise encoding.

const UINT32_LIMITS = [0, BigInt(4294967295)];
const INT32_LIMITS = [-2147483647, 2147483647];
const UINT64_LIMITS = [0, (BigInt(2) << BigInt(64)) - BigInt(1)];
const INT64_LIMITS = [
  BigInt(1) - (BigInt(2) << BigInt(63)),
  (BigInt(2) << BigInt(63)) - BigInt(1),
];

function unsigned_number_to_leb128(value: number) {
  assert(value >= 0);
  const result: number[] = [];
  do {
    let byte = value & 0x7f;
    value >>= 7;
    if (value !== 0) {
      // more bytes to come
      byte |= 0x80;
    }

    result.push(byte);
  } while (value !== 0);

  return new Uint8Array(result);
}

function unsigned_bigint_to_leb128(value: bigint) {
  assert(value >= 0);
  const result: number[] = [];
  do {
    let byte = Number(value & BigInt(0x7f));
    value >>= BigInt(7);
    if (value !== BigInt(0)) {
      // more bytes to come
      byte |= 0x80;
    }

    result.push(byte);
  } while (value !== BigInt(0));

  return new Uint8Array(result);
}

function signed_number_to_leb128(value: number) {
  const negative = value < 0;
  const result: number[] = [];
  while (true) {
    let byte = value & 0x7f;
    value >>= 7;
    if (
      (value === 0 && (byte & 0x40) === 0)
      || (value === -1 && (byte & 0x40) !== 0)
    ) {
      result.push(byte);
      break;
    }

    // more bytes to come
    byte |= 0x80;
    result.push(byte);
  }

  return new Uint8Array(result);
}

function signed_bigint_to_leb128(value: bigint) {
  const result: number[] = [];
  while (true) {
    let byte = Number(value & BigInt(0x7f));
    value >>= BigInt(7);
    if (
      (value === BigInt(0) && (byte & 0x40) === 0)
      || (value === BigInt(-1) && (byte & 0x40) !== 0)
    ) {
      result.push(byte);
      break;
    }

    // more bytes to come
    byte |= 0x80;
    result.push(byte);
  }

  return new Uint8Array(result);
}

// export function u32_to_leb128(value: number | bigint): Uint8Array {
//   assert(
//     value >= UINT32_LIMITS[0] && BigInt(value) <= UINT32_LIMITS[1],
//     `number is out of range: ${value}`,
//   );
//   return typeof value === 'number'
//     ? unsigned_number_to_leb128(value)
//     : unsigned_bigint_to_leb128(value);
// }

export function i32_to_leb128(value: number | bigint): Uint8Array {
  assert(
    value >= INT32_LIMITS[0] && value <= INT32_LIMITS[1],
    `number is out of range: ${value}`,
  );
  return typeof value === 'number'
    ? signed_number_to_leb128(value)
    : signed_bigint_to_leb128(value);
}

// export function u64_to_leb128(value: number | bigint): Uint8Array {
//   assert(
//     value >= UINT64_LIMITS[0] && BigInt(value) <= UINT64_LIMITS[1],
//     `number is out of range: ${value}`,
//   );
//   return typeof value === 'number'
//     ? unsigned_number_to_leb128(value)
//     : unsigned_bigint_to_leb128(value);
// }

export function i64_to_leb128(value: number | bigint): Uint8Array {
  assert(
    BigInt(value) >= INT64_LIMITS[0] && BigInt(value) <= INT64_LIMITS[1],
    `number is out of range: ${value}`,
  );
  return typeof value === 'number'
    ? signed_number_to_leb128(value)
    : signed_bigint_to_leb128(value);
}

export const NUMBER_ENCODER_TEST_EXPORTS = {
  unsigned_number_to_leb128,
  unsigned_bigint_to_leb128,
  signed_number_to_leb128,
  signed_bigint_to_leb128,
};
