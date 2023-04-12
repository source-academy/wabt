import { NumberEncoder, TEST_EXPORTS } from '../src/wat2wasm/binary_writer';

import { validTestCases as tc1 } from './resources/valid_function_bodies';
import { validTestCases as tc2 } from './resources/function_expressions';
import { validTestCases as tc3 } from './resources/export_expressions';
import {
  type ModuleTestCase,
  moduleTestCases,
} from './resources/module_program_fragments';
import { expect } from '@jest/globals';
import { isTokenEqual } from './resources/resolved_tokens';
import { parse } from '../src/wat2wasm';
import { getIR } from '../src/wat2wasm/ir';

const {
  encodeFunctionBody,
  encodeFunctionSignature,
  encodeExportExpressions,
  encodePureUnfoldedTokenExpression,
  encodeModule,
  encodeModuleTypeSection,
  encodeModuleImportSection,
  encodeModuleFunctionSection,
  encodeModuleTableSection,
  encodeModuleMemorySection,
  encodeModuleGlobalSection,
  encodeModuleExportSection,
  encodeModuleStartSection,
  encodeModuleElementSection,
  encodeModuleCodeSection,
  encodeModuleDataSection,
} = TEST_EXPORTS;

test.each(tc1)('test encode function body expressions', (testCase) => {
  const encoding = encodePureUnfoldedTokenExpression(testCase.unfolded_ir!);
  const expectedEncoding = testCase.minimal_binary;
  expect(encoding)
    .toEqual(expectedEncoding);
});

describe('Encode function expresions', () => {
  test.each(tc2)('test encode function expression signature', (testCase) => {
    const encoding = encodeFunctionSignature(testCase.ir.functionSignature);
    const expectedEncoding = testCase.minimal_binary_function_signature;
    expect(encoding)
      .toEqual(expectedEncoding);
  });

  test.each(tc2)('test encode function expression body', (testCase) => {
    const encoding = encodeFunctionBody(testCase.ir.functionBody);
    const expectedEncoding = testCase.minimal_binary_function_body;
    expect(encoding)
      .toEqual(expectedEncoding);
  });
});

test.each(tc3)('test encode encode expressions', (testCase) => {
  const encoding = encodeExportExpressions(testCase.ir);
  const expectedEncoding = testCase.minimal_binary;
  expect(encoding)
    .toEqual(expectedEncoding);
});

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

describe.each(moduleTestCases)(
  'encode module sections',
  (testCase: ModuleTestCase) => {
    test('Check intermediate representation', () => {
      expect(getIR(parse(testCase.str)))
        .toEqual(testCase.ir);
    });
    test('Encode type_section', () => {
      expect(encodeModuleTypeSection(testCase.ir))
        .toEqual(
          testCase.type_section_encoding,
        );
    });
    test('Encode import_section', () => {
      expect(encodeModuleImportSection(testCase.ir))
        .toEqual(
          testCase.import_section_encoding,
        );
    });
    test('Encode function_section', () => {
      expect(encodeModuleFunctionSection(testCase.ir))
        .toEqual(
          testCase.function_section_encoding,
        );
    });
    test('Encode table_section', () => {
      expect(encodeModuleTableSection(testCase.ir))
        .toEqual(
          testCase.table_section_encoding,
        );
    });
    test('Encode memory_section', () => {
      expect(encodeModuleMemorySection(testCase.ir))
        .toEqual(
          testCase.memory_section_encoding,
        );
    });
    test('Encode global_section', () => {
      expect(encodeModuleGlobalSection(testCase.ir))
        .toEqual(
          testCase.global_section_encoding,
        );
    });
    test('Encode export_section', () => {
      expect(encodeModuleExportSection(testCase.ir))
        .toEqual(
          testCase.export_section_encoding,
        );
    });
    test('Encode start_section', () => {
      expect(encodeModuleStartSection(testCase.ir))
        .toEqual(
          testCase.start_section_encoding,
        );
    });
    test('Encode element_section', () => {
      expect(encodeModuleElementSection(testCase.ir))
        .toEqual(
          testCase.element_section_encoding,
        );
    });
    test('Encode code_section', () => {
      expect(encodeModuleCodeSection(testCase.ir))
        .toEqual(
          testCase.code_section_encoding,
        );
    });
    test('Encode data_section', () => {
      expect(encodeModuleDataSection(testCase.ir))
        .toEqual(
          testCase.data_section_encoding,
        );
    });
    test('Encode minimal_module', () => {
      expect(encodeModule(testCase.ir))
        .toEqual(
          testCase.minimal_module_encoding,
        );
    });
  },
);

expect.addEqualityTesters([isTokenEqual]);
