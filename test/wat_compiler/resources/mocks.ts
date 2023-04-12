import { compile, parse } from '../../../src';
import { BinaryWriter } from '../../../src/wat_compiler/binary_writer';
import { getIR } from '../../../src/wat_compiler/ir';
import { type ModuleExpression } from '../../../src/wat_compiler/ir_types';

export const mockBinaryWriter = new BinaryWriter(
  getIR(parse('(module)')) as ModuleExpression,
);
