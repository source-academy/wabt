import { encode } from '../src/binary_writer';
import { tokenize } from '../src/lexer/lexer';
import { getIntermediateRepresentation } from '../src/parser/parser';
import { getTokenTree } from '../src/parser/treeify';
import { module_with_exported_add_function_no_names, module_with_one_simple_add_function_with_param_names } from './resources/module_program_fragments';

test('assemble module_with_one_simple_add_function_with_param_names', () => {
  const expected_encoding = module_with_one_simple_add_function_with_param_names.minimal_module_encoding;
  const encoding = encode(getIntermediateRepresentation(getTokenTree(tokenize(module_with_one_simple_add_function_with_param_names.str))));
  expect(encoding)
    .toEqual(expected_encoding);
});

test('assemble module_with_exported_add_function_no_names', () => {
  const expected_encoding = module_with_exported_add_function_no_names.minimal_module_encoding;
  const ir = getIntermediateRepresentation(getTokenTree(tokenize(module_with_exported_add_function_no_names.str)));
  const encoding = encode(ir);

  expect(encoding)
    .toEqual(expected_encoding);
});
