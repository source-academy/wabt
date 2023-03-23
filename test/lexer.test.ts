import { Lexer } from '../src/lexer';
import { TokenType } from '../src/token';

test('lexer', () => {
  let program1 = `
    (func (param i32) (param f32) (local f64)
        local.get 0
        local.get 1
        local.get 2) 
    `;
  let program2 = `;; This code is for demonstration and not part of a larger app
    (if (local.get $bool_i32)
     (then
     ;; do something if $bool_i32 is not 0
     ;; nop is a "no operation" opcode.
     nop ;; I use it to stand in for code that would actually do something.
     )
     (else
     ;; do something if $bool_i32 is 0
     nop
     )`;

  console.log(new Lexer(program1)
    .getAllTokens());
  console.log(new Lexer(program2)
    .getAllTokens());
  expect(true)
    .toBe(true);
});
