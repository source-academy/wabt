import { type Token } from '../../src/common/token';
import { type ModuleExpression } from '../../src/wat_compiler/ir_types';
import { type ParseTree } from '../../src/wat_compiler/tree_types';

import { BinaryWriter } from '../../src/wat_compiler/binary_writer';
import { getIR } from '../../src/wat_compiler/ir';
import { tokenize } from '../../src/wat_compiler/lexer';
import { getParseTree } from '../../src/wat_compiler/parser';

import { positiveFunctionTestCases } from './resources/functions.testcase';

describe.each(positiveFunctionTestCases)(
  'unit tests for function expressions',
  (testCase: string) => {
    let tokens: Token[];
    let parseTree: ParseTree;
    let IR: ModuleExpression;
    let binary: Uint8Array;
    beforeEach(() => {
      tokens = tokenize(testCase);
      parseTree = getParseTree(tokens);
      IR = getIR(parseTree) as ModuleExpression;
      binary = new BinaryWriter(IR)
        .encode();
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
    test('test encoder', () => {
      expect(binary)
        .toMatchSnapshot();
    });
  },
);
