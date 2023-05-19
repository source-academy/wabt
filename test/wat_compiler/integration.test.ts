/* eslint-disable @typescript-eslint/dot-notation */
// This is because we use class['property'] to access private methods to do testing.
import { compile, parse } from '../../src/wat_compiler';
import { positiveControlTestCases } from './resources/control_instructions.testcase';
import { positiveFunctionTestCases } from './resources/functions.testcase';
import { positiveTestCases as positiveNumOpTestCases } from './resources/numeric_operators.testcase';
import { expect } from '@jest/globals';
import wabt from 'wabt';

describe.each([
  // [positiveFunctionTestCases, 'function test cases'],
  // [positiveNumOpTestCases, 'numeric operators'],
  [positiveControlTestCases, 'control operations'],
])('integration: encode', (testCase, testCaseLabel) => {
  test.each(testCase)(testCaseLabel, async (test) => {
    const actual = compile(parse(test));
    const expected = await wabt()
      .then(
        (wabtModule) => wabtModule.parseWat('', test)
          .toBinary({}).buffer,
      );

    console.log({ actual });
    // console.log({ expected });
    expect(actual)
      .toEqual(expected);
  });
});
