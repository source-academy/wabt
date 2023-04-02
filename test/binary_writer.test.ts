import { encode, NumberEncoder } from '../src/binary_writer';
import { nested_addition_sexpr, nested_addition_stack, simple_addition_sexpr, simple_addition_stack } from './resources/program_fragments';

describe('Encode const numbers', () => {
  test('encode 1.0 (f64)', () => {
    const encoding = NumberEncoder.encodeF64Const(1);
    const expectedEncoding = new Uint8Array([0, 0, 0, 0, 0, 0, 0xf0, 0x3f]);
    expect(encoding)
      .toEqual(expectedEncoding);
  });

  test('encode 1.5 (f64)', () => {
    const encoding = NumberEncoder.encodeF64Const(1.5);
    const expectedEncoding = new Uint8Array([0, 0, 0, 0, 0, 0, 0xf8, 0x3f]);
    expect(encoding)
      .toEqual(expectedEncoding);
  });
});

describe('Encode program fragments', () => {
  test('Encode simple_addition_sexpr', () => {
    const encoding = encode(simple_addition_sexpr.ir);
    const expectedEncoding = simple_addition_sexpr.minimal_binary;
    expect(encoding)
      .toEqual(expectedEncoding);
  });


  test('Encode simple_addition_stack', () => {
    const encoding = encode(simple_addition_stack.ir);
    const expectedEncoding = simple_addition_stack.minimal_binary;
    expect(encoding)
      .toEqual(expectedEncoding);
  });


  test('Encode nested_addition_stack', () => {
    const encoding = encode(nested_addition_stack.ir);
    const expectedEncoding = nested_addition_stack.minimal_binary;
    expect(encoding)
      .toEqual(expectedEncoding);
  });


  test('Encode nested_addition_sexpr', () => {
    const encoding = encode(nested_addition_sexpr.ir);
    const expectedEncoding = nested_addition_sexpr.minimal_binary;
    expect(encoding)
      .toEqual(expectedEncoding);
  });
});
