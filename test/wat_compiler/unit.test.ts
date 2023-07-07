import { type Token } from '../../src/common/token';
import { type ModuleExpression } from '../../src/wat_compiler/ir_types';
import { type ParseTree } from '../../src/wat_compiler/tree_types';

import { BinaryWriter } from '../../src/wat_compiler/binary_writer';
import { getIR } from '../../src/wat_compiler/ir';
import { tokenize } from '../../src/wat_compiler/lexer';
import { getParseTree } from '../../src/wat_compiler/parser';

import { positiveFunctionTestCases } from './resources/functions.testcase';
import { positiveTestCases as positiveNumOpTestCases } from './resources/numeric_operators.testcase';
import { positiveControlTestCases } from './resources/control_instructions.testcase';
import { positiveTestCases as positiveStartSectionTestCases } from './resources/start_expression.testcase';
import { positiveTestCases as positiveMemorySectionTestCases } from './resources/memory_expressions.testcase';

describe.each([
  [positiveFunctionTestCases, 'function expressions'],
  [positiveNumOpTestCases, 'numeric operations'],
  [positiveControlTestCases, 'control operations'],
  [positiveStartSectionTestCases, 'start expression'],
  [positiveMemorySectionTestCases, 'memory expressions'],
])('snapshot tests', (testCases, testCaseLabel) => {
  describe.each(testCases)(`${testCaseLabel}`, (testCase: string) => {
    let tokens: Token[];
    let parseTree: ParseTree;
    let IR: ModuleExpression;
    // let binary: Uint8Array;
    beforeEach(() => {
      tokens = tokenize(testCase);
      parseTree = getParseTree(tokens);
      IR = getIR(parseTree) as ModuleExpression;
      // binary = new BinaryWriter(IR)
      //   .encode();
    });
    test('test lexer', () => {
      expect(tokens)
        .toMatchSnapshot();
    });
    test('test parse tree', () => {
      expect(parseTree)
        .toMatchSnapshot();
    });
    test('test intermediate representation', () => {
      expect(IR)
        .toMatchSnapshot();
    });
    // test('test encoder', () => {
    //   expect(binary)
    //     .toMatchSnapshot();
    // });
  });
});
