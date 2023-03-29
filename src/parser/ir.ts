/* eslint-disable @typescript-eslint/no-use-before-define */
import { type ProgramTree } from '../parser_1/parser';
import { type Token } from '../token';
import { type ValueType } from '../common/type';
import assert from 'assert';
import { type OpcodeType } from '../common/opcode';

export abstract class IntermediateRepresentation {

}

export class ModuleExpression extends IntermediateRepresentation {
  /*
    Sections in modules:
      0  Custom (unused)
      1  Type (Function Signatures)
      2  Import
      3  Function (Function )
      4  Table
      5  Memory
      6  Global
      7  Export
      8  Start
      9  Element
      10 Code
      11 Data
      12 DataCount
  */

  // Type Section
  functionSignatures: FunctionSignature[] = [];

  // Func Section
  functionBodies: FunctionBody[] = [];

  constructor(body: IntermediateRepresentation[]) {
    super();

    body.forEach((node) => {
      if (node instanceof FunctionExpression) {
        this.functionSignatures.push(node.signature);
        this.functionBodies.push(node.body);
      }
    });
  }
}

/**
 * Intermediate representation of function expression.
 * Note that signature and body will be encoded in different places afterward
 */
export class FunctionExpression extends IntermediateRepresentation {
  signature: FunctionSignature;
  body: FunctionBody;

  constructor(signature: FunctionSignature, body: FunctionBody) {
    super();
    this.signature = signature;
    this.body = body;
  }
}

export class FunctionSignature {
  paramTypes: ValueType[];
  paramNames: string[];
  returnTypes: ValueType[];

  constructor(paramTypes: ValueType[], paramNames: string[], returnTypes: ValueType[]) {
    this.paramTypes = paramTypes;
    this.paramNames = paramNames;
    this.returnTypes = returnTypes;
  }
}

/**
 * Intermediate representation of function body.
 * We are using a wrapper around ProgramTree because:
 *  (1) WABT function bodies have to be encoded differently from other blocks (e.g. start/end blocks)
 *  (2) WABT function bodies are in a different module section compared to other blocks.
 */
export class FunctionBody {
  body: UnfoldedTokenSequence;

  constructor(body: IntermediateRepresentation) {
    assert(body instanceof UnfoldedTokenSequence);
    this.body = body;
  }
}

export class OperationTree extends IntermediateRepresentation {
  private operator: OpcodeType;
  private operands: Token[];

  constructor(operator: OpcodeType, operands: Token[]) {
    super();
    this.operator = operator;
    this.operands = operands;
  }
}
