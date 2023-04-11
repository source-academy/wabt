/**
 * Just a file to write demos and run examples on ts-node
 */
import { compile } from './index';

const program = `
(module
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.add)
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.sub)
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.mul)
    (func (param f64) (param f64) (result f64)
        local.get 0
        local.get 1
        f64.div)
    (export "add" (func 0))
    (export "sub" (func 1))
    (export "mul" (func 2))
    (export "div" (func 3))
)`;

const encoding = compile(program);
const instance = new WebAssembly.Instance(new WebAssembly.Module(encoding));

const { add, sub, mul, div } = instance.exports;

console.log(add);
console.log(sub);
console.log(mul);
console.log(div);

// @ts-ignore
console.log(add(2, 1));
// @ts-ignore
console.log(sub(10, 5));
// @ts-ignore
console.log(div(40, 6));
// @ts-ignore
console.log(mul(50, 19));
