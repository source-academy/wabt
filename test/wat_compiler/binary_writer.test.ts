/* eslint-disable @typescript-eslint/dot-notation */
// Need this to do class['private_property'] for testing.
import {
  BinaryWriter,
  NumberEncoder,
} from '../../src/wat_compiler/binary_writer';

import { validTestCases as tc1 } from './resources/valid_function_bodies';
import { validTestCases as tc2 } from './resources/function_expressions';
import { validTestCases as tc3 } from './resources/export_expressions';
import {
  type ModuleTestCase,
  moduleTestCases,
} from './resources/module_program_fragments';
import { expect } from '@jest/globals';
import { parse } from '../../src/wat_compiler';
import { getIR } from '../../src/wat_compiler/ir';
import { isTokenEqual } from '../token_comparisons';
import { mockBinaryWriter } from './resources/mocks';

test.each(tc1)('test encode function body expressions', (testCase) => {
  const encoding = mockBinaryWriter['encodePureUnfoldedTokenExpression'](
    testCase.unfolded_ir!,
  );
  const expectedEncoding = testCase.minimal_binary;
  expect(encoding)
    .toEqual(expectedEncoding);
});

describe('Encode function expresions', () => {
  test.each(tc2)('test encode function expression signature', (testCase) => {
    const encoding = mockBinaryWriter['encodeFunctionSignature'](
      testCase.ir.functionSignature,
    );
    const expectedEncoding = testCase.minimal_binary_function_signature;
    expect(encoding)
      .toEqual(expectedEncoding);
  });

  test.each(tc2)('test encode function expression body', (testCase) => {
    const encoding = mockBinaryWriter['encodeFunctionBody'](testCase.ir);
    const expectedEncoding = testCase.minimal_binary_function_body;
    expect(encoding)
      .toEqual(expectedEncoding);
  });
});

test.each(tc3)('test encode encode expressions', (testCase) => {
  const encoding = mockBinaryWriter['encodeExportExpressions'](testCase.ir);
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
    let binaryWriter: BinaryWriter;
    beforeEach(() => {
      binaryWriter = new BinaryWriter(testCase.ir);
    });
    test('Check intermediate representation', () => {
      expect(getIR(parse(testCase.str)))
        .toEqual(testCase.ir);
    });
    test('Encode type_section', () => {
      expect(binaryWriter['encodeTypeSection']())
        .toEqual(
          testCase.type_section_encoding,
        );
    });
    test('Encode import_section', () => {
      expect(binaryWriter['encodeImportSection']())
        .toEqual(
          testCase.import_section_encoding,
        );
    });
    test('Encode function_section', () => {
      expect(binaryWriter['encodeFunctionSection']())
        .toEqual(
          testCase.function_section_encoding,
        );
    });
    test('Encode table_section', () => {
      expect(binaryWriter['encodeTableSection']())
        .toEqual(
          testCase.table_section_encoding,
        );
    });
    test('Encode memory_section', () => {
      expect(binaryWriter['encodeMemorySection']())
        .toEqual(
          testCase.memory_section_encoding,
        );
    });
    test('Encode global_section', () => {
      expect(binaryWriter['encodeGlobalSection']())
        .toEqual(
          testCase.global_section_encoding,
        );
    });
    test('Encode export_section', () => {
      expect(binaryWriter['encodeExportSection']())
        .toEqual(
          testCase.export_section_encoding,
        );
    });
    test('Encode start_section', () => {
      expect(binaryWriter['encodeStartSection']())
        .toEqual(
          testCase.start_section_encoding,
        );
    });
    test('Encode element_section', () => {
      expect(binaryWriter['encodeElementSection']())
        .toEqual(
          testCase.element_section_encoding,
        );
    });
    test('Encode code_section', () => {
      expect(binaryWriter['encodeCodeSection']())
        .toEqual(
          testCase.code_section_encoding,
        );
    });
    test('Encode data_section', () => {
      expect(binaryWriter['encodeDataSection']())
        .toEqual(
          testCase.data_section_encoding,
        );
    });
    test('Encode minimal_module', () => {
      expect(binaryWriter.encode())
        .toEqual(testCase.minimal_module_encoding);
    });
  },
);

expect.addEqualityTesters([isTokenEqual]);
