import { tokenize } from '../../src/lexer/lexer';
import { getTokenTree } from '../../src/parser/treeify';
import { TokenTree } from '../../src/parser/tree_types';
import { f64_addition_sexpr, f64_addition_stack } from '../resources/program_fragments';



// test('tree-ify s-expression addition', () => {
//   console.log(TokenTree.getStringArrayRepr(getTokenTree(f64_addition_sexpr.tokens)));
//   expect(TokenTree.getStringArrayRepr(getTokenTree(f64_addition_sexpr.tokens)))
//     .toEqual(f64_addition_sexpr.tokenTreeStr);
// });
// test('tree-ify stack expression addition', () => {
//   expect(TokenTree.treeMap(getTokenTree(f64_addition_stack.tokens), (t) => t.lexeme))
//     .toEqual(f64_addition_stack.tokenTreeStr);
// });

// test('tree-ify basic addition', () => {
//   expect(TokenTree.treeMap(getTokenTree(f64_addition_stack.tokens), (t) => t.lexeme))
//     .toEqual(f64_addition_stack.tokenTreeStr);
// });

test('avoid making stack expressions trees', () => {
  const str = `
    f64.const 1
    f64.const 1
    f64.add
    f64.const 1
    f64.const 1
    f64.add
    f64.add
    `;

  const expected = [
    'f64.const',
    '1',
    'f64.const',
    '1',
    'f64.add',
    'f64.const',
    '1',
    'f64.const',
    '1',
    'f64.add',
    'f64.add',
  ];

  expect(TokenTree.getStringArrayRepr(getTokenTree(tokenize(str))))
    .toEqual(expected);
});

test('parse expressions trees', () => {
  const str = `
    (f64.add
        (f64.add
            f64.const 1
            f64.const 1)
        (f64.add
            f64.const 1
            f64.const 1)))
    `;

  const expected = [
    ['f64.add',
      ['f64.add', 'f64.const', '1', 'f64.const', '1'],
      ['f64.add', 'f64.const', '1', 'f64.const', '1']],
  ];

  expect(TokenTree.getStringArrayRepr(getTokenTree(tokenize(str))))
    .toEqual(expected);
});
