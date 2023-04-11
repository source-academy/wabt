import { type Token } from '../../src/common/token';
import {
  OperationTree,
  PureUnfoldedTokenExpression,
  UnfoldedTokenExpression,
  type IntermediateRepresentation,
} from '../../src/parser/ir';
import { type Tree } from '../../src/parser/tree_types';
import { simple_addition_sexpr_without_argument_bracket_fails } from './invalid_function_bodies';
import { getSampleToken as t } from './resolved_tokens';

export interface FunctionBodyTestCaseData {
  str: string;
  tokens?: Array<Token>;
  parseTree?: Tree<Token>;
  ir?: IntermediateRepresentation;
  unfolded_ir?: PureUnfoldedTokenExpression;
  minimal_binary?: Uint8Array;
}

const simple_addition_sexpr: FunctionBodyTestCaseData = {
  str: `
    (f64.add
        (f64.const 1)
        (f64.const 1.5)
        )
    `,
  tokens: [
    '(',
    'f64.add',
    '(',
    'f64.const',
    '1',
    ')',
    '(',
    'f64.const',
    '1.5',
    ')',
    ')',
  ].map(t),
  parseTree: [
    t('f64.add'),
    [t('f64.const'), t('1')],
    [t('f64.const'), t('1.5')],
  ],
  ir: new OperationTree(t('f64.add'), [
    new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    new UnfoldedTokenExpression([t('f64.const'), t('1.5')]),
  ]),
  unfolded_ir: new PureUnfoldedTokenExpression(
    ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ),
  minimal_binary: new Uint8Array([
    0x44, 0, 0, 0, 0, 0, 0, 0xf0, 0x3f, 0x44, 0, 0, 0, 0, 0, 0, 0xf8, 0x3f, 0xa0,
  ]),
};

const simple_addition_stack: FunctionBodyTestCaseData = {
  str: `
    (f64.const 1
        f64.const 1.5
        f64.add)
    `,
  tokens: ['(', 'f64.const', '1', 'f64.const', '1.5', 'f64.add', ')'].map(t),
  parseTree: ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ir: new UnfoldedTokenExpression(
    ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ),
  unfolded_ir: new PureUnfoldedTokenExpression(
    ['f64.const', '1', 'f64.const', '1.5', 'f64.add'].map(t),
  ),
  minimal_binary: new Uint8Array([
    0x44, 0, 0, 0, 0, 0, 0, 0xf0, 0x3f, 0x44, 0, 0, 0, 0, 0, 0, 0xf8, 0x3f, 0xa0,
  ]),
};

const nested_addition_stack: FunctionBodyTestCaseData = {
  str: `
      f64.const 1
      f64.const 1
      f64.add
      f64.const 1
      f64.const 1
      f64.add
      f64.add
      `,
  tokens: [
    'f64.const',
    '1',
    'f64.const',
    '1',
    'f64.add',
    'f64.const',
    '1',
    'f64.const',
    '1',
    'f64.add',
    'f64.add',
  ].map(t),
  parseTree: [
    'f64.const',
    '1',
    'f64.const',
    '1',
    'f64.add',
    'f64.const',
    '1',
    'f64.const',
    '1',
    'f64.add',
    'f64.add',
  ].map(t),
  ir: new UnfoldedTokenExpression(
    [
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.add',
    ].map(t),
  ),
  unfolded_ir: new PureUnfoldedTokenExpression(
    [
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.add',
    ].map(t),
  ),
  minimal_binary: new Uint8Array([
    0x44,
    0,
    0,
    0,
    0,
    0,
    0,
    0xf0,
    0x3f,
    0x44,
    0,
    0,
    0,
    0,
    0,
    0,
    0xf0,
    0x3f,
    0xa0,
    0x44,
    0,
    0,
    0,
    0,
    0,
    0,
    0xf0,
    0x3f,
    0x44,
    0,
    0,
    0,
    0,
    0,
    0,
    0xf0,
    0x3f,
    0xa0,
    0xa0,
  ]),
};

const nested_addition_sexpr: FunctionBodyTestCaseData = {
  str: `
    (f64.add
      (f64.add
        (f64.const 1)
        (f64.const 1)
      )
      (f64.add
        (f64.const 1)
        (f64.const 1)
      )
    )
      `,
  tokens: [
    ...['(', 'f64.add'],
    ...['(', 'f64.add'],
    ...['(', 'f64.const', '1', ')'],
    ...['(', 'f64.const', '1', ')'],
    ...[')'],
    ...['(', 'f64.add'],
    ...['(', 'f64.const', '1', ')'],
    ...['(', 'f64.const', '1', ')'],
    ')',
    ')',
  ].map(t),
  parseTree: [
    t('f64.add'),
    [t('f64.add'), [t('f64.const'), t('1')], [t('f64.const'), t('1')]],
    [t('f64.add'), [t('f64.const'), t('1')], [t('f64.const'), t('1')]],
  ],
  ir: new OperationTree(t('f64.add'), [
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ]),
    new OperationTree(t('f64.add'), [
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ]),
  ]),
  unfolded_ir: new PureUnfoldedTokenExpression(
    [
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.const',
      '1',
      'f64.const',
      '1',
      'f64.add',
      'f64.add',
    ].map(t),
  ),
  minimal_binary: new Uint8Array([
    0x44,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0xf0,
    0x3f,
    0x44,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0xf0,
    0x3f,
    0xa0,
    0x44,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0xf0,
    0x3f,
    0x44,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0xf0,
    0x3f,
    0xa0,
    0xa0,
  ]),
};

const allTestCases = [
  simple_addition_sexpr,
  simple_addition_stack,
  nested_addition_stack,
  nested_addition_sexpr,
  simple_addition_sexpr_without_argument_bracket_fails,
];

export const tokenizeTestCases = allTestCases.filter(
  (testcase) => typeof testcase.tokens !== 'undefined',
);
export const parseTreeTestCases = allTestCases.filter(
  (testcase) => typeof testcase.parseTree !== 'undefined',
);
export const irTestCases = allTestCases.filter(
  (testcase) => typeof testcase.ir !== 'undefined',
);
export const unfoldIrTestCases = allTestCases.filter(
  (testcase) => typeof testcase.unfolded_ir !== 'undefined',
);
export const minimalBinaryTestCases = allTestCases.filter(
  (testcase) => typeof testcase.minimal_binary !== 'undefined',
);
