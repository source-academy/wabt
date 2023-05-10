import { NUMBER_ENCODER_TEST_EXPORTS } from '../../src/utils/number_encoder';
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
      BigInt(4000000000000000000),
      new Uint8Array([0x80, 0x80, 0xc0, 0xec, 0xe9, 0xd9, 0xb6, 0xc1, 0x37]),
    ],
  ];
  test.each(testcases)('encode', (input, expected) => {
    expect(unsigned_bigint_to_leb128(input))
      .toEqual(expected);
  });
});
