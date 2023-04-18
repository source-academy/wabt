/* eslint-disable @typescript-eslint/dot-notation */
// This is because we use class['property'] to access private methods to do testing.
import { compile, parse } from '../../src/wat_compiler';
import { positiveFunctionTestCases } from './resources/function_expressions.testcase';
import { expect } from '@jest/globals';
import wabt from 'wabt';

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
