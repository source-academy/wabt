import { Lexer, tokenize } from "../src/lexer"
import { TokenType } from "../src/token";

test("lexer", () => {
    let program = `
    (func (param i32) (param f32) (local f64)
        local.get 0
        local.get 1
        local.get 2) 
    `


    console.log(tokenize(program));
    expect(true).toBe(true)
})