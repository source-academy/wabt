import { compile } from '../src';
import { invalidTestCases as invalidFuncExpTestCases } from './resources/function_expressions';
import {
  type ModuleTestCase,
  moduleTestCases,
} from './resources/module_program_fragments';

describe.each(moduleTestCases)('encode modules', (testCase: ModuleTestCase) => {
  test('Encode type section (1)', () => {});
});

test.each(invalidFuncExpTestCases)(
  'encode invalid function expression throws',
  (testCase) => {
    expect(() => compile(testCase.str))
      .toThrow();
  },
);
