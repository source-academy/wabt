import { ValueType } from '../../src/common/type';
import {
  EmptyTokenExpression,
  ExportExpression,
  FunctionExpression,
  ModuleExpression,
  UnfoldedTokenExpression,
} from '../../src/wat2wasm/ir_types';
import { getSampleToken as t } from './resolved_tokens';

export interface ModuleTestCase {
  str: string;
  ir: ModuleExpression;
  type_section_encoding: Uint8Array;
  import_section_encoding: Uint8Array;
  function_section_encoding: Uint8Array;
  table_section_encoding: Uint8Array;
  memory_section_encoding: Uint8Array;
  global_section_encoding: Uint8Array;
  export_section_encoding: Uint8Array;
  start_section_encoding: Uint8Array;
  element_section_encoding: Uint8Array;
  code_section_encoding: Uint8Array;
  data_section_encoding: Uint8Array;
  minimal_module_encoding: Uint8Array;
}

const PREFIX = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);

const module_with_one_simple_add_function_with_param_names: ModuleTestCase = {
  str: `
  (module
    (func (param $lhs i32) (param $rhs i32) (result i32)
      local.get $lhs
      local.get $rhs
      i32.add))
      `,
  ir: new ModuleExpression(
    new FunctionExpression(
      [ValueType.I32, ValueType.I32],
      [ValueType.I32],
      ['$lhs', '$rhs'],
      new UnfoldedTokenExpression(
        ['local.get', '$lhs', 'local.get', '$rhs', 'i32.add'].map(t),
      ),
    ),
  ),
  type_section_encoding: new Uint8Array([
    0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
  ]),
  function_section_encoding: new Uint8Array([0x03, 0x02, 0x01, 0x00]),
  export_section_encoding: new Uint8Array([]),
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
  import_section_encoding: new Uint8Array(),
  table_section_encoding: new Uint8Array(),
  memory_section_encoding: new Uint8Array(),
  global_section_encoding: new Uint8Array(),
  start_section_encoding: new Uint8Array(),
  element_section_encoding: new Uint8Array(),
  data_section_encoding: new Uint8Array(),
};

const module_with_exported_add_function_no_names: ModuleTestCase = {
  str: `
  (module
    (func (param f64) (param f64) (result f64)
      local.get 0
      local.get 0
      f64.add)
    (export "add" (func 0))
  )
  `,
  ir: new ModuleExpression(
    new FunctionExpression(
      [ValueType.F64, ValueType.F64],
      [ValueType.F64],
      [null, null],
      new UnfoldedTokenExpression(
        ['local.get', '0', 'local.get', '0', 'f64.add'].map(t),
      ),
    ),
    new ExportExpression(t('"add"'), t('func'), t('0')),
  ),
  type_section_encoding: new Uint8Array([
    0x01,
    0x07,
    0x01,
    0x60,
    0x02,
    0x7c,
    0x7c,
    0x01,
    0x7c, // f64
  ]),
  function_section_encoding: new Uint8Array([
    0x03,
    0x02,
    0x01,
    0x00, // function 0 signature index
  ]),
  export_section_encoding: new Uint8Array([
    0x07,
    0x07,
    0x01,
    0x03,
    ...[0x61, 0x64, 0x64],
    0x00,
    0x00, // export func index
  ]),
  code_section_encoding: new Uint8Array([
    0x0a,
    0x09,
    0x01,

    // function body 0
    0x07,
    0x00,
    0x20,
    0x00,
    0x20,
    0x00,
    0xa0,
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
  import_section_encoding: new Uint8Array(),
  table_section_encoding: new Uint8Array(),
  memory_section_encoding: new Uint8Array(),
  global_section_encoding: new Uint8Array(),
  start_section_encoding: new Uint8Array(),
  element_section_encoding: new Uint8Array(),
  data_section_encoding: new Uint8Array(),
};

const module_with_two_exports: ModuleTestCase = {
  str: `
  (module
    (func (param ) (result f64)
      f64.const 0)
    (func (param ) (result f64)
      f64.const 1)
    (export "0" (func 0))
    (export "1" (func 1))
  )`,
  ir: new ModuleExpression(
    new FunctionExpression(
      [],
      [ValueType.F64],
      [],
      new UnfoldedTokenExpression([t('f64.const'), t('0')]),
    ),
    new FunctionExpression(
      [],
      [ValueType.F64],
      [],
      new UnfoldedTokenExpression([t('f64.const'), t('1')]),
    ),
    new ExportExpression(t('"0"'), t('func'), t('0')),
    new ExportExpression(t('"1"'), t('func'), t('1')),
  ),
  type_section_encoding: new Uint8Array([
    0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7c,
  ]),
  function_section_encoding: new Uint8Array([0x03, 0x03, 0x02, 0x00, 0x00]),
  export_section_encoding: new Uint8Array([
    0x07, 0x09, 0x02, 0x01, 0x30, 0x00, 0x00, 0x01, 0x31, 0x00, 0x01,
  ]),
  code_section_encoding: new Uint8Array([
    0x0a,
    0x19,
    0x02,
    0x0b,
    0x00,
    0x44,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x0b,
    0x0b,
    0x00,
    0x44,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0xf0,
    0x3f,
    0x0b,
  ]),
  minimal_module_encoding: new Uint8Array([
    ...PREFIX,
    ...[0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7c],
    ...[0x03, 0x03, 0x02, 0x00, 0x00],
    ...[0x07, 0x09, 0x02, 0x01, 0x30, 0x00, 0x00, 0x01, 0x31, 0x00, 0x01],
    ...[
      0x0a,
      0x19,
      0x02,
      0x0b,
      0x00,
      0x44,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x0b,
      0x0b,
      0x00,
      0x44,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0xf0,
      0x3f,
      0x0b,
    ],
  ]),
  import_section_encoding: new Uint8Array(),
  table_section_encoding: new Uint8Array(),
  memory_section_encoding: new Uint8Array(),
  global_section_encoding: new Uint8Array(),
  start_section_encoding: new Uint8Array(),
  element_section_encoding: new Uint8Array(),
  data_section_encoding: new Uint8Array(),
};

// const function_exports_by_name: ModuleTestCase = {
//   str: `
//   (module
//     (func $first_function (param) (result))
//     (func $second_function (param) (result))
//     (export "second" (func $second_function))
//     (export "first" (func $first_function))
//   )`,
//   ir: new ModuleExpression(
//     // prettier-ignore
//     new FunctionExpression([], [], [], new EmptyTokenExpression(), '$first_function'),
//     // prettier-ignore
//     new FunctionExpression([], [], [], new EmptyTokenExpression(), '$second_function'),
//     new ExportExpression(t('"second"'), t('func'), t('$second_function')),
//     new ExportExpression(t('"first"'), t('func'), t('$first_function')),
//   ),
//   type_section_encoding: new Uint8Array([0x01, 0x04, 0x01, 0x60, 0x00, 0x00]),
//   import_section_encoding: new Uint8Array(),
//   function_section_encoding: new Uint8Array([0x03, 0x03, 0x02, 0x00, 0x00]),
//   table_section_encoding: new Uint8Array(),
//   memory_section_encoding: new Uint8Array(),
//   global_section_encoding: new Uint8Array(),
//   export_section_encoding: new Uint8Array([
//     0x07,
//     0x12,
//     0x02,
//     0x06,
//     ...[0x73, 0x65, 0x63, 0x6f, 0x6e, 0x64],
//     0x00,
//     0x01,
//     0x05,
//     ...[0x66, 0x69, 0x72, 0x73, 0x74],
//     0x00,
//     0x00,
//   ]),
//   start_section_encoding: new Uint8Array(),
//   element_section_encoding: new Uint8Array(),
//   code_section_encoding: new Uint8Array([
//     0x0a, 0x07, 0x02, 0x02, 0x00, 0x0b, 0x02, 0x00, 0x0b,
//   ]),
//   data_section_encoding: new Uint8Array(),
//   minimal_module_encoding: new Uint8Array([
//     ...PREFIX,
//     ...[0x01, 0x04, 0x01, 0x60, 0x00, 0x00],
//     ...[0x03, 0x03, 0x02, 0x00, 0x00],
//     ...[
//       0x07,
//       0x12,
//       0x02,
//       0x06,
//       ...[0x73, 0x65, 0x63, 0x6f, 0x6e, 0x64],
//       0x00,
//       0x01,
//       0x05,
//       ...[0x66, 0x69, 0x72, 0x73, 0x74],
//       0x00,
//       0x00,
//     ],
//     ...[0x0a, 0x07, 0x02, 0x02, 0x00, 0x0b, 0x02, 0x00, 0x0b],
//   ]),
// };

export const moduleTestCases = [
  module_with_one_simple_add_function_with_param_names,
  module_with_exported_add_function_no_names,
  module_with_two_exports,
  // function_exports_by_name,
];
