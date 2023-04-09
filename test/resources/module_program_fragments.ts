import { type Token } from '../../src/common/token';
import { ValueType } from '../../src/common/type';
import {
  FunctionExpression,
  UnfoldedTokenExpression,
  ModuleExpression,
  ExportExpression,
  ExportObject,
} from '../../src/parser/ir';
import { type ParseTree, Tree } from '../../src/parser/tree_types';
import { getSampleToken as t } from './resolved_tokens';

export interface ModuleTestCase {
  str: string;
  tokens: Token[];
  parseTree: ParseTree;
  ir: ModuleExpression;
  type_section_encoding: Uint8Array;
  function_section_encoding: Uint8Array;
  export_section_encoding?: Uint8Array;
  code_section_encoding: Uint8Array;
  minimal_module_encoding: Uint8Array;
}

export const module_with_one_simple_add_function_with_param_names: ModuleTestCase
  = {
    str: `
  (module
    (func (param $lhs i32) (param $rhs i32) (result i32)
      local.get $lhs
      local.get $rhs
      i32.add))
      `,
    tokens: [
      ...['(', 'module'],
      ...[
        '(',
        'func',
        '(',
        'param',
        '$lhs',
        'i32',
        ')',
        '(',
        'param',
        '$rhs',
        'i32',
        ')',
        '(',
        'result',
        'i32',
        ')',
      ],
      ...['local.get', '$lhs'],
      ...['local.get', '$rhs'],
      ...['i32.add', ')', ')'],
    ].map(t),

    parseTree: Tree.treeMap(
      [
        'module',
        [
          'func',
          ['param', '$lhs', 'i32'],
          ['param', '$rhs', 'i32'],
          ['result', 'i32'],
          'local.get',
          '$lhs',
          'local.get',
          '$rhs',
          'i32.add',
        ],
      ],
      t,
    ),
    ir: new ModuleExpression([
      new FunctionExpression(
        [ValueType.I32, ValueType.I32],
        [ValueType.I32],
        ['$lhs', '$rhs'],
        new UnfoldedTokenExpression(
          ['local.get', '$lhs', 'local.get', '$rhs', 'i32.add'].map(t),
        ),
      ),
    ]),
    type_section_encoding: new Uint8Array([
      0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
    ]),
    function_section_encoding: new Uint8Array([0x03, 0x02, 0x01, 0x00]),
    code_section_encoding: new Uint8Array([
      0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b,
    ]),
    minimal_module_encoding: new Uint8Array([
      0x00,
      0x61,
      0x73,
      0x6d,
      0x01,
      0x00,
      0x00,
      0x00,
      0x01,
      0x07,
      0x01,
      0x60,
      0x02,
      0x7f,
      0x7f,
      0x01,
      0x7f,
      0x03,
      0x02,
      0x01,
      0x00,
      0x0a,
      0x09,
      0x01,
      0x07,
      0x00,
      0x20,
      0x00,
      0x20,
      0x01,
      0x6a,
      0x0b,
    ]),
  };

export const module_with_exported_add_function_no_names: ModuleTestCase = {
  str: `
  (module
    (func (param f64) (param f64) (result f64)
      local.get 0
      local.get 0
      f64.add)
    (export "add" (func 0))
  )
  `,
  tokens: [
    ...['(', 'module'],
    ...[
      '(',
      'func',
      '(',
      'param',
      'f64',
      ')',
      '(',
      'param',
      'f64',
      ')',
      '(',
      'result',
      'f64',
      ')',
    ],
    ...['local.get', '0'],
    ...['local.get', '0'],
    ...['f64.add', ')'],
    ...['(', 'export', '"add"', '(', 'func', '0', ')', ')'],
    ...[')'],
  ].map(t),
  parseTree: Tree.treeMap(
    [
      'module',
      [
        'func',
        ['param', 'f64'],
        ['param', 'f64'],
        ['result', 'f64'],
        'local.get',
        '0',
        'local.get',
        '0',
        'f64.add',
      ],
      ['export', '"add"', ['func', '0']],
    ],
    t,
  ),
  ir: new ModuleExpression(
    [
      new FunctionExpression(
        [ValueType.F64, ValueType.F64],
        [ValueType.F64],
        [],
        new UnfoldedTokenExpression(
          ['local.get', '0', 'local.get', '0', 'f64.add'].map(t),
        ),
      ),
    ],
    new ExportExpression([new ExportObject(t('"add"'), t('func'), t('0'))]),
  ),

  type_section_encoding: new Uint8Array([
    0x01, // section code
    0x07, // section size
    0x01, // num types
    0x60, // func
    0x02, // num params
    0x7c, // f64
    0x7c, // f64
    0x01, // num results
    0x7c, // f64
  ]),
  function_section_encoding: new Uint8Array([
    0x03, // section code
    0x02, // section size
    0x01, // num functions
    0x00, // function 0 signature index
  ]),
  export_section_encoding: new Uint8Array([
    0x07, // section code
    0x07, // section size
    0x01, // num exports
    0x03, // string length
    ...[0x61, 0x64, 0x64], // export name ("add")
    0x00, // export kind
    0x00, // export func index
  ]),
  code_section_encoding: new Uint8Array([
    0x0a, // section code
    0x09, // section size
    0x01, // num functions
    // function body 0
    0x07, // func body size
    0x00, // local decl count
    0x20, // local.get
    0x00, // local index
    0x20, // local.get
    0x00, // local index
    0xa0, // f64.add
    0x0b, // end
  ]),
  minimal_module_encoding: new Uint8Array([
    0x00,
    0x61,
    0x73,
    0x6d,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01,
    0x07,
    0x01,
    0x60,
    0x02,
    0x7c,
    0x7c,
    0x01,
    0x7c,
    0x03,
    0x02,
    0x01,
    0x00,
    0x07,
    0x07,
    0x01,
    0x03,
    0x61,
    0x64,
    0x64,
    0x00,
    0x00,
    0x0a,
    0x09,
    0x01,
    0x07,
    0x00,
    0x20,
    0x00,
    0x20,
    0x00,
    0xa0,
    0x0b,
  ]),
};
