import { encode, NumberEncoder, TEST_EXPORTS } from '../src/binary_writer';
import { type FunctionExpression } from '../src/parser/ir';
import { module_with_one_simple_add_function_with_param_names } from './resources/module_program_fragments';
import { export_func_add_by_index, nested_addition_sexpr, nested_addition_stack, simple_addition_sexpr, simple_addition_stack, simple_function_sexpr_with_param_names } from './resources/program_fragments';

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

  test('Encode function signature: simple_function_sexpr_with_param_names', () => {
    const encoding = encode((simple_function_sexpr_with_param_names.ir as FunctionExpression).functionSignature);
    const expectedEncoding = simple_function_sexpr_with_param_names.minimal_binary_function_signature;
    expect(encoding)
      .toEqual(expectedEncoding);
  });

  test('Encode function body: simple_function_sexpr_with_param_names', () => {
    const encoding = encode((simple_function_sexpr_with_param_names.ir as FunctionExpression).functionBody);
    const expectedEncoding = simple_function_sexpr_with_param_names.minimal_binary_function_body;
    expect(encoding)
      .toEqual(expectedEncoding);
  });

  test('Encode exports: export_func_add_by_index', () => {
    const encoding = encode(export_func_add_by_index.ir);
    const expectedEncoding = export_func_add_by_index.minimal_binary;
    expect(encoding)
      .toEqual(expectedEncoding);
  });
});


describe('encode modules', () => {
  test('Encode type section (1): module_with_one_simple_add_function_with_param_names', () => {
    const encode_fn = TEST_EXPORTS.encodeModuleTypeSection;
    const encoding = encode_fn(module_with_one_simple_add_function_with_param_names.ir);
    const expected = module_with_one_simple_add_function_with_param_names.type_section_encoding;

    expect(encoding)
      .toEqual(expected);
  });


  test('Encode function section (3): module_with_one_simple_add_function_with_param_names', () => {
    const encode_fn = TEST_EXPORTS.encodeModuleFunctionSection;
    const encoding = encode_fn(module_with_one_simple_add_function_with_param_names.ir);
    const expected = module_with_one_simple_add_function_with_param_names.function_section_encoding;

    expect(encoding)
      .toEqual(expected);
  });


  test('Encode code section (10/0x0a): module_with_one_simple_add_function_with_param_names', () => {
    const encode_fn = TEST_EXPORTS.encodeModuleCodeSection;
    const encoding = encode_fn(module_with_one_simple_add_function_with_param_names.ir);
    const expected = module_with_one_simple_add_function_with_param_names.code_section_encoding;

    expect(encoding)
      .toEqual(expected);
  });
});
