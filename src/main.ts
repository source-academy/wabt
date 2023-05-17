/**
 * Just a file to write demos and run examples on ts-node
 */
import { compile } from './index';
import { BinaryWriter } from './wat_compiler/binary_writer';
import { getIR } from './wat_compiler/ir';
import {
  type BlockExpression,
  type ModuleExpression,
} from './wat_compiler/ir_types';
import { tokenize } from './wat_compiler/lexer';
import { getParseTree } from './wat_compiler/parser';
import { ParseTree } from './wat_compiler/tree_types';
const program = `
(module
    (func
        (block $my_block
            nop
        )
    )    
)
`;

const programFragment = `
(block $my_block
    nop
)
`;

const tokens = tokenize(program);
// console.log(tokens);
const parseTree = getParseTree(tokens);
// console.log(JSON.stringify(parseTree, undefined, 2));
const ir = getIR(parseTree) as ModuleExpression;
// console.log(ir);
// console.log(JSON.stringify(ir, undefined, 2));
console.log(ir.functions[0].body.body);
console.log((ir.functions[0].body.body as BlockExpression).unfold());
const encoding = new BinaryWriter(ir)
  .encode();
console.log(encoding);
// const program = `
// (module
//   (func (export "add") (param f64) (param f64) (result f64)
//       local.get 0
//       local.get 1
//       f64.add)
//   (func (export "sub") (param f64) (param f64) (result f64)
//       local.get 0
//       local.get 1
//       f64.sub)
//   (func (export "mul") (param f64) (param f64) (result f64)
//       local.get 0
//       local.get 1
//       f64.mul)
//   (func (export "div") (param f64) (param f64) (result f64)
//       local.get 0
//       local.get 1
//       f64.div)
// )
// `;

// const encoding = compile(program);
// const instance = new WebAssembly.Instance(new WebAssembly.Module(encoding));

// const { add, sub, mul, div } = instance.exports;

// // @ts-ignore
// console.log(add(1, 12));
// // @ts-ignore
// console.log(sub(1, 12));
// // @ts-ignore
// console.log(mul(1, 12));
// // @ts-ignore
// console.log(div(1, 12));
