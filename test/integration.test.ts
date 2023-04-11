import { tokenize } from '../src/lexer/lexer';
import { getIntermediateRepresentation } from '../src/parser/parser';
import { getParseTree } from '../src/parser/parse_tree';
import {
  type ModuleTestCase,
  moduleTestCases,
} from './resources/module_program_fragments';

describe.each(moduleTestCases)('encode modules', (testCase: ModuleTestCase) => {
  test('Encode type section (1)', () => {});
});
