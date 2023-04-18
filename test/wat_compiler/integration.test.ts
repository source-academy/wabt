/* eslint-disable @typescript-eslint/dot-notation */
// This is because we use class['property'] to access private methods to do testing.
import { compile, parse } from '../../src/wat_compiler';
import { BinaryWriter } from '../../src/wat_compiler/binary_writer';
import { getIR } from '../../src/wat_compiler/ir';
import { positiveFunctionTestCases } from './resources/function_expressions.testcases';
import { isTokenEqual } from '../token_comparisons';
import { expect } from '@jest/globals';
import { assemblyFunction } from '../config';
import wabt from 'wabt';

expect.addEqualityTesters([isTokenEqual]);

test.each(positiveFunctionTestCases)(
  'encode function expressions',
  async (testCase: string) => {
    const actual = compile(parse(testCase));
    const expected = await wabt()
      .then(
        (wabtModule) => wabtModule.parseWat('', testCase)
          .toBinary({}).buffer,
      );
    expect(actual)
      .toEqual(expected);
  },
);

// describe.each(moduleTestCases)('encode modules', (testCase: ModuleTestCase) => {
//   let binaryWriter: BinaryWriter;
//   beforeEach(() => {
//     binaryWriter = new BinaryWriter(testCase.ir);
//   });

//   test('Check IR', () => {
//     const ir = getIR(parse(testCase.str));
//     expect(ir)
//       .toEqual(testCase.ir);
//   });

//   test('Test encode Module Type Section', () => {
//     const encoding = binaryWriter['encodeTypeSection']();
//     expect(encoding)
//       .toEqual(testCase.type_section_encoding);
//   });

//   test('Test encode Module Import Section', () => {
//     const encoding = binaryWriter['encodeImportSection']();
//     expect(encoding)
//       .toEqual(testCase.import_section_encoding);
//   });

//   test('Test encode Module Function Section', () => {
//     const encoding = binaryWriter['encodeFunctionSection']();
//     expect(encoding)
//       .toEqual(testCase.function_section_encoding);
//   });

//   test('Test encode Module Table Section', () => {
//     const encoding = binaryWriter['encodeTableSection']();
//     expect(encoding)
//       .toEqual(testCase.table_section_encoding);
//   });

//   test('Test encode Module Memory Section', () => {
//     const encoding = binaryWriter['encodeMemorySection']();
//     expect(encoding)
//       .toEqual(testCase.memory_section_encoding);
//   });

//   test('Test encode Module Global Section', () => {
//     const encoding = binaryWriter['encodeGlobalSection']();
//     expect(encoding)
//       .toEqual(testCase.global_section_encoding);
//   });

//   test('Test encode Module Export Section', () => {
//     const encoding = binaryWriter['encodeExportSection']();
//     expect(encoding)
//       .toEqual(testCase.export_section_encoding);
//   });

//   test('Test encode Module Start Section', () => {
//     const encoding = binaryWriter['encodeStartSection']();
//     expect(encoding)
//       .toEqual(testCase.start_section_encoding);
//   });

//   test('Test encode Module Element Section', () => {
//     const encoding = binaryWriter['encodeElementSection']();
//     expect(encoding)
//       .toEqual(testCase.element_section_encoding);
//   });

//   test('Test encode Module Code Section', () => {
//     const encoding = binaryWriter['encodeCodeSection']();
//     expect(encoding)
//       .toEqual(testCase.code_section_encoding);
//   });

//   test('Test encode Module Data Section', () => {
//     const encoding = binaryWriter['encodeDataSection']();
//     expect(encoding)
//       .toEqual(testCase.data_section_encoding);
//   });

//   test('Test overall minimal encoding', () => {
//     const encoding = binaryWriter.encode();
//     expect(encoding)
//       .toEqual(testCase.minimal_module_encoding);
//   });
// });

// test.each(invalidFuncExpTestCases)(
//   'encode invalid function expression throws',
//   (testCase) => {
//     expect(() => compile(parse(testCase.str)))
//       .toThrow();
//   },
// );
