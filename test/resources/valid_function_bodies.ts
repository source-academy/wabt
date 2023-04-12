import { type Token } from '../../src/common/token';
import {
  OperationTree,
  PureUnfoldedTokenExpression,
  UnfoldedTokenExpression,
  type IntermediateRepresentation,
} from '../../src/wat_compiler/ir_types';
import { type Tree } from '../../src/wat_compiler/tree_types';
import { getSampleToken as t } from './resolved_tokens';

export interface FunctionBodyTestCaseData {
  str: string;
  parseTree: Tree<Token>;
  ir: IntermediateRepresentation;
  unfolded_ir: PureUnfoldedTokenExpression;
  minimal_binary: Uint8Array;
}

const simple_addition_sexpr: FunctionBodyTestCaseData = {
  str: `
    (f64.add
        (f64.const 1)
        (f64.const 1.5)
        )
    `,
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

export const validTestCases = [
  simple_addition_sexpr,
  simple_addition_stack,
  nested_addition_stack,
  nested_addition_sexpr,
  // simple_addition_sexpr_without_argument_bracket_fails,
];
