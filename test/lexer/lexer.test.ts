// import { Lexer } from '../src/lexer/lexer';
// import { TokenType } from '../src/token';

import { outputFile } from 'fs-extra';
import { getOpcodeType, getTokenType, getType, isKeyWord } from '../../src/common/keywords';
import { tokenize } from '../../src/lexer/lexer';
import { f64_addition_sexpr, f64_addition_stack } from '../resources/program_fragments';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { Token } from '../../src/token';

// We just assume that the lexer works as long as it doesn't throw. Sorry.

test('tokenize s-expression addition', () => {
  expect(tokenize(f64_addition_sexpr.str))
    .toEqual(f64_addition_sexpr.tokens);
});
test('tokenize stack expression addition', () => {
  expect(tokenize(f64_addition_stack.str))
    .toEqual(f64_addition_stack.tokens);
});


test('tokenize opcode correctly', () => {
  expect(tokenize('f64.add')[0])
    .toEqual(plainToInstance(Token, {
      type: 'BINARY',
      lexeme: 'f64.add',
      line: 0,
      col: 0,
      indexInSource: 7,
      opcodeType: 150,
      valueType: null,
    }));
});
