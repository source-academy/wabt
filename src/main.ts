/**
 * Just a file to write demos and run examples on ts-node
 */
import { compile } from './index';
const program = `
(module
  (func (export "add") (param f64) (param f64) (result f64)
      local.get 0
      local.get 1
      f64.add)
  (func (export "sub") (param f64) (param f64) (result f64)
      local.get 0
      local.get 1
      f64.sub)
  (func (export "mul") (param f64) (param f64) (result f64)
      local.get 0
      local.get 1
      f64.mul)
  (func (export "div") (param f64) (param f64) (result f64)
      local.get 0
      local.get 1
      f64.div)
) 
`;

const encoding = compile(program);
const instance = new WebAssembly.Instance(new WebAssembly.Module(encoding));

const { add, sub, mul, div } = instance.exports;

// @ts-ignore
console.log(add(1, 12));
// @ts-ignore
console.log(sub(1, 12));
// @ts-ignore
console.log(mul(1, 12));
// @ts-ignore
console.log(div(1, 12));
