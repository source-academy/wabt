/**
 * Just a file to write demos and run examples on ts-node
 */
import { compile } from './index';
const program = `
(module
  (func $first_function (param) (result))
  (func $second_function (param) (result))
  (export "second" (func $second_function))
  (export "first" (func $first_function))
)
`;

const encoding = compile(program);
const instance = new WebAssembly.Instance(new WebAssembly.Module(encoding));
console.log(instance.exports);
