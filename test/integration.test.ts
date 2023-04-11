import {
  type ModuleTestCase,
  moduleTestCases,
} from './resources/module_program_fragments';

describe.each(moduleTestCases)('encode modules', (testCase: ModuleTestCase) => {
  test('Encode type section (1)', () => {});
});
