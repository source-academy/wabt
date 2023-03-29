// import { Lexer } from '../src/lexer/lexer';
// import { TokenType } from '../src/token';

import { getTokenTree } from '../../src/parser/treeify';
import { TokenTree } from '../../src/parser/tree_types';
import { f64_addition_sexpr, f64_addition_stack } from '../resources/program_fragments';



test('tree-ify s-expression addition', () => {
  console.log(TokenTree.getStringArrayRepr(getTokenTree(f64_addition_sexpr.tokens)));
  expect(TokenTree.getStringArrayRepr(getTokenTree(f64_addition_sexpr.tokens)))
    .toEqual(f64_addition_sexpr.tokenTreeStr);
});
// test('tree-ify stack expression addition', () => {
//   expect(Tree.treeMap(getTokenTree(f64_addition_stack.tokens), (t) => t.lexeme))
//     .toEqual(f64_addition_stack.tokenTreeStr);
// });
