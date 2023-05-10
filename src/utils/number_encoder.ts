import assert from 'assert';
import { TEST_EXPORTS } from '../../scripts/preprocess';
/* eslint-disable no-bitwise */
// We need bitwise operations, well, because we are dealing with bitwise encoding.

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

// function u32_to_leb128
// function i32_to_leb128
// function u64_to_leb128
// function i64_to_leb128

export const NUMBER_ENCODER_TEST_EXPORTS = {
  unsigned_number_to_leb128,
  unsigned_bigint_to_leb128,
};
