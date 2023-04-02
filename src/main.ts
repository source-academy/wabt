import wabt from 'wabt';
import { Opcode, OpcodeType } from './common/opcode';
import { tokenize } from './lexer/lexer';
import { getTokenTree } from './parser/treeify';

namespace Program1 {

  //   export const text = `
  //     (module
  //         (func $main (param $lhs i32) (param $rhs i32) (result i32)
  //           local.get $lhs
  //           local.get $rhs
  //           i32.add)
  //         (export "add" (func $main))
  //     )
  //     `;
  export const text = `
(module
    (func (param $lhs f64) (param $rhs f64) (result f64)
      local.get $lhs
      local.get $rhs
      f64.add)
)
`;
  export const stripped_binary = new Uint8Array(
    [
      ...[0x0, 0x61, 0x73, 0x6d],
      ...[0x1, 0x0, 0x0, 0x0],
      ...[],
      ...[0x1, 0x7],
      ...[0x1, 0x60, 0x2, 0x7f, 0x7f, 0x1, 0x7f],
      ...[],
      ...[0x3, 0x2],
      ...[0x1, 0x0],
      ...[],
      ...[0xa, 0x9],
      ...[0x1, 0x7, 0x0, 0x20, 0x0, 0x20, 0x1, 0x6a, 0xb],
    ],
  );


}


/*
  '0',  '61', '73', '6d',
  '1',  '0',  '0',  '0',
  '1', '6',
    '1',  '60', '1',  '7f', '1',  '7f',
  '3',  '2',
    '1',  '0',
  'a',  '9', (Function section: 9 bytes)
    '1', (1 function inside section)
      '7', (function is 7 bytes long)
        '0',  '20', '0', '20', '0',  '6a', 'b', (function body)
  '0',  'd',
    '4',  '6e', '61', '6d', '65', '2',  '6',  '1',  '0',  '1',  '0',  '1', '6b',
  '0',  '10',
    '7',  '6c', '69', '6e', '6b', '69', '6e', '67', '2',  '8', '5',  '1', '0', '6',  '0', '0'


  '0',  '61', '73', '6d',
  '1',  '0',  '0',  '0',
  '1',  '7',
    '1',  '60', '2',  '7f', '7f', '1',  '7f',
  '3',  '2',
    '1', '0',
  'a',  '9',
    '1',  '7',  '0',  '20', '0',  '20', '1', '6a', 'b',
  '0',  '1d',
    '4', '6e', '61', '6d', '65',
    '1', '7',  '1',  '0',  '4',
    '6d', '61', '69', '6e', '2',
    'd', '1',  '0',  '2',  '0',
    '3',  '6c', '68', '73', '1',
    '3', '72', '68', '73',
  '0', '14',
    '7', '6c', '69', '6e', '6b',
    '69', '6e', '67', '2',  '8',
    '9',  '1',  '0',  '0',
  '0', '4',
    '6d', '61', '69', '6e'



    [
  '0',  '61', '73', '6d', '1',  '0',  '0',  '0',
  '1',
  '87', '80', '80', '80', '0',  '1',  '60', '2',  '7e',
  '7e', '1',  '7e',

  '3',  '82', '80', '80', '80', '0',
  '1',  '0',

  'a',  '8d', '80', '80', '80', '0',  '1',
  '87', '80', '80', '80', '0',

  '0',  '20', '0',  '20',
  '1',  '7c', 'b',  '0',  '94', '80', '80', '80', '0',
  '7',  '6c', '69', '6e', '6b', '69', '6e', '67', '2',
  '8',  '85', '80', '80', '80', '0',  '1',  '0',  '6',
  '0',  '0'
]
*/

// let tokens = new Lexer(program1)
//   .getAllTokens();
// let parser = new Parser(tokens);
// console.log('grouping:');
// console.log(JSON.stringify(parser.parse()
//   .treeMap((t) => t), undefined, 2));

// tokens = new Lexer(program2)
//   .getAllTokens();
// parser = new Parser(tokens);
// console.log('grouping:');
// console.log(JSON.stringify(parser.parse()
//   .treeMap((t) => t), undefined, 2));
// console.log(treeMap(parser.parse(), (t) => t.lexeme));
// wabt()
//   // eslint-disable-next-line @typescript-eslint/no-shadow
//   .then((wabt) => {
//     const bin = wabt.parseWat('', `
//     (module
//         (func (param $lhs f64) (param $rhs f64) (result f64)
//           local.get $lhs
//           local.get $rhs
//           f64.add)
//     )`)
//       .toBinary({
//         log: false,
//         canonicalize_lebs: false,
//         relocatable: true,
//         write_debug_names: false,
//       });
//     console.log(Array.from(bin.buffer)
//       .map((x) => x.toString(16)));


// const tokens = tokenize(Program1.text);
// const tree = getTokenTree(tokens);
// console.log(JSON.stringify(tree, undefined, 2));
// const ir = parser.parse();

// console.log(JSON.stringify(ir, undefined, 2));
// });

// console.log(Opcode.getParamLength(OpcodeType.F64Const));
// console.log(Opcode.getParamTypes(OpcodeType.F64Const));

/*
[
  '0',  '61', '73', '6d',
  '1',  '0',  '0',  '0',
  '1',  '85', '80', '80', '80', '0',  '1',

  '60',
    '0',
  '1',  '7c',

  '3',  '82', '80', '80', '80',
  '0',  '1',  '0',

  'a',
  '9b', F64
  '80',
  '80',
  '80',
  '0',  '1',  '95', '80', '80', '80', '0',  '0',
  'a0', '44', '0',  '0',  '0',  '0',  '0',  '0',
  'f0', '3f', '44', '0',  '0',  '0',  '0',  '0',
  '0',  'f8', '3f', 'b'
]
  */
