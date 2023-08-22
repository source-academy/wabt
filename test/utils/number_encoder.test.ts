/* eslint-disable no-bitwise */
import {
  NUMBER_ENCODER_TEST_EXPORTS,
  i32_to_leb128,
  i64_to_leb128,
} from '../../src/utils/number_encoder';
const { unsigned_number_to_leb128, unsigned_bigint_to_leb128 }
  = NUMBER_ENCODER_TEST_EXPORTS;

describe('test unsigned_number_to_leb128', () => {
  const testcases: [number, Uint8Array][] = [
    [0, new Uint8Array([0x00])],
    [1, new Uint8Array([0x01])],
    [624485, new Uint8Array([0xe5, 0x8e, 0x26])],
    [2147483647, new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x07])],
    // [2147483648, new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x08])],
  ];

  test.each(testcases)('encode', (input, expected) => {
    expect(unsigned_number_to_leb128(input))
      .toEqual(expected);
  });
});

describe('test unsigned_bigint_to_leb128', () => {
  const testcases: [bigint, Uint8Array][] = [
    [BigInt(0), new Uint8Array([0x00])],
    [BigInt(1), new Uint8Array([0x01])],
    [BigInt(2147483647), new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x07])],
    [BigInt(2147483648), new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x08])],
    [
      BigInt(4000000000000000000n),
      new Uint8Array([0x80, 0x80, 0xc0, 0xec, 0xe9, 0xd9, 0xb6, 0xc1, 0x37]),
    ],
  ];

  test.each(testcases)('encode', (input, expected) => {
    expect(unsigned_bigint_to_leb128(input))
      .toEqual(expected);
  });
});

describe('test i32_to_leb128', () => {
  const invalid_cases = [-2147483648, 2147483648];
  const valid_cases: [number | bigint, Uint8Array][] = [
    [1, new Uint8Array([0x01])],
    [10, new Uint8Array([0x0a])],
    [100000000, new Uint8Array([0x80, 0xc2, 0xd7, 0x2f])],
    [1000000000, new Uint8Array([0x80, 0x94, 0xeb, 0xdc, 0x03])],
    [2147483647, new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x07])],
    [-1, new Uint8Array([0x7f])],
    [-10, new Uint8Array([0x76])],
    [-100000000, new Uint8Array([0x80, 0xbe, 0xa8, 0x50])],
    [-1000000000, new Uint8Array([0x80, 0xec, 0x94, 0xa3, 0x7c])],
    [-2147483647, new Uint8Array([0x81, 0x80, 0x80, 0x80, 0x78])],
  ];

  test.each(invalid_cases)('invalid cases', (value: number | bigint) => {
    expect(() => i32_to_leb128(value))
      .toThrow();
  });

  test.each(valid_cases)(
    'valid cases',
    (value: number | bigint, expected: Uint8Array) => {
      expect(i32_to_leb128(value))
        .toEqual(expected);
    },
  );
});
// describe('test u64_to_leb128', () => {
//   const invalid = [-1, BigInt(2) << BigInt(64)];
// });
describe('test i64_to_leb128', () => {
  const invalid_cases = [-BigInt(2) << BigInt(63), BigInt(2) << BigInt(63)];
  const valid_cases: [number | bigint, Uint8Array][] = [
    [1, new Uint8Array([0x01])],
    [10, new Uint8Array([0x0a])],
    [100000000, new Uint8Array([0x80, 0xc2, 0xd7, 0x2f])],
    [1000000000, new Uint8Array([0x80, 0x94, 0xeb, 0xdc, 0x03])],
    [2147483647, new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x07])],
    [-1, new Uint8Array([0x7f])],
    [-10, new Uint8Array([0x76])],
    [-100000000, new Uint8Array([0x80, 0xbe, 0xa8, 0x50])],
    [-1000000000, new Uint8Array([0x80, 0xec, 0x94, 0xa3, 0x7c])],
    [-2147483647, new Uint8Array([0x81, 0x80, 0x80, 0x80, 0x78])],
    [
      9223372036854775807n,
      new Uint8Array([
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00,
      ]),
    ],
    [
      -9223372036854775807n,
      new Uint8Array([
        0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x7f,
      ]),
    ],
  ];

  test.each(invalid_cases)('invalid cases', (value: number | bigint) => {
    expect(() => i64_to_leb128(value))
      .toThrow();
  });

  test.each(valid_cases)(
    'valid cases',
    (value: number | bigint, expected: Uint8Array) => {
      expect(i64_to_leb128(value))
        .toEqual(expected);
    },
  );
});
