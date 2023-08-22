import { BinaryWriter } from './binary_writer';
import { getIR } from './ir';
import { type ModuleExpression } from './ir_types';
import { tokenize } from './lexer';
import { getParseTree } from './parser';
import { type ParseTree } from './tree_types';

/**
 * Get the parse tree of a given WebAssembly Binary Text expression.
 * @param program program to parse
 * @returns a tree of string tokens.
 */
export const parse = (program: string) => getParseTree(tokenize(program));
export const compile = (parseTree: ParseTree) => {
  const ir = getIR(parseTree) as ModuleExpression;
  const binaryWriter = new BinaryWriter(ir);
  return binaryWriter.encode();
};
