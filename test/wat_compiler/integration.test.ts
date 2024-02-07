/* eslint-disable @typescript-eslint/dot-notation */
// This is because we use class['property'] to access private methods to do testing.
import { compile, parse, getIR } from '../../src/wat_compiler';
import { positiveControlTestCases } from './resources/control_instructions.testcase';
import { positiveFunctionTestCases } from './resources/functions.testcase';
import { positiveTestCases as positiveNumOpTestCases } from './resources/numeric_operators.testcase';
import { positiveTestCases as positiveStartSectionTestCases } from './resources/start_expression.testcase';
import { positiveTestCases as positiveMemorySectionTestCases } from './resources/memory_data_expressions.testcase';
import { positiveTestCases as positiveGlobalSectionTestCases } from './resources/global_expressions.testcase';
import { positiveTestCases as positiveImportSectionTestCases } from './resources/import_expressions.testcase';
import { positiveTestCases as positiveReferencenTestCases } from './resources/reference_instructions.testcase';
import { positiveTestCases as positiveVariableTestCases } from './resources/variable_instructions.testcase';
import { positiveTestCases as positiveTableElemTestCases } from './resources/table_element_expressions.testcase';
import { expect } from '@jest/globals';
import wabt from 'wabt';

describe.each([
  [positiveFunctionTestCases, 'function test cases'],
  [positiveNumOpTestCases, 'numeric operators'],
  [positiveControlTestCases, 'control operations'],
  [positiveStartSectionTestCases, 'start expression'],
  [positiveMemorySectionTestCases, 'memory expressions'],
  [positiveGlobalSectionTestCases, 'global expressions'],
  [positiveImportSectionTestCases, 'import expressions'],
  [positiveReferencenTestCases, 'reference expressions'],
  [positiveVariableTestCases, 'variable expressions'],
  [positiveTableElemTestCases, 'table element expressions'],
])('integration: encode', (testCase, testCaseLabel) => {
  test.each(testCase)(testCaseLabel, async (test) => {
    const actual = compile(getIR(parse(test)));
    const expected = await wabt()
      .then(
        (wabtModule) => wabtModule.parseWat('', test)
          .toBinary({}).buffer,
      );

    console.log({ actual });
    console.log({ expected });
    expect(actual)
      .toEqual(expected);
  });
});
