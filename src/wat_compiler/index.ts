import { ValueType } from '../common/type';
import { BinaryWriter } from './binary_writer';
import { getIR as _getIR } from './ir';
import { FunctionSignature, ImportExpression, type ModuleExpression } from './ir_types';
import { tokenize } from './lexer';
import { getParseTree } from './parser';
import { type ParseTree } from './tree_types';

/**
 * Get the parse tree of a given WebAssembly Binary Text expression.
 * @param program program to parse
 * @returns a tree of string tokens.
 */
export const parse = (program: string) => getParseTree(tokenize(program));
export const getIR = (parseTree: ParseTree) => _getIR(parseTree);
export const compile = (ir: ModuleExpression) => {
  const binaryWriter = new BinaryWriter(ir);
  return binaryWriter.encode();
};

/*
  Functions for dynamic imports
*/
export const I32 = ValueType.I32;
export const I64 = ValueType.I64;
export const F32 = ValueType.F32;
export const F64 = ValueType.F64;

// trunk-ignore(eslint/@typescript-eslint/no-unused-vars)
export const createFunctionImport = (importModule: string, importName: string, functionName: string, paramTypes: ValueType[], returnTypes: ValueType[]) => {
  for (const type of paramTypes) {
    if (type !== I32 && type !== I64 && type !== F32 && type !== F64) {
      throw new Error(`Invalid function param type: Expected I32, I64, F32, or F64. Got: ${type}`);
    }
  }
  for (const type of returnTypes) {
    if (type !== I32 && type !== I64 && type !== F32 && type !== F64) {
      throw new Error(`Invalid function return type: Expected I32, I64, F32, or F64. Got: ${type}`);
    }
  }
  return ImportExpression.functionImport(importModule, importName, new FunctionSignature(functionName, null, paramTypes, [null], returnTypes, [], []));
};
