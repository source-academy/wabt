/**
 * Just a file to write demos and run examples on ts-node
 */
import { encode } from './binary_writer';
import { tokenize } from './lexer/lexer';
import { getIntermediateRepresentation } from './parser/parser';
import { getParseTree } from './parser/parse_tree';

const programAdd = `
(module
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.add)
    (export "fn" (func 0))
)`;

const programSub = `
(module
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.sub)
    (export "fn" (func 0))
)`;

const programMul = `
(module
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.mul)
    (export "fn" (func 0))
)`;

const programDiv = `
(module
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.div)
    (export "fn" (func 0))
)`;

const programs = [programAdd, programSub, programMul, programDiv];
const encodings = programs.map((program) => encode(getIntermediateRepresentation(getParseTree(tokenize(program)))));
const modules = encodings.map((enc) => new WebAssembly.Module(enc));
const instances = modules.map((inst) => new WebAssembly.Instance(inst));

const [add, sub, mul, div]: ((arg0: number, arg1: number) => number)[]
  = instances.map((inst) => inst.exports.fn) as ((
    arg0: number,
    arg1: number
  ) => number)[];

console.log(add(2, 1));
console.log(sub(10, 5));
console.log(div(40, 6));
console.log(mul(50, 19));
