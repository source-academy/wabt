/* eslint-disable @typescript-eslint/no-use-before-define */
import { type ValueType } from '../common/type';
import { Token } from '../common/token';
import { type ExportType } from '../common/export_types';

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
  functionDeclarations: FunctionExpression[] = [];

  constructor(functionDeclarations: FunctionExpression[]) {
    super();
    this.functionDeclarations = functionDeclarations;
  }

  getFunctionSignatures(): FunctionSignature[] {
    return this.functionDeclarations.map((func) => func.functionSignature);
  }

  getFunctionBodies(): FunctionBody[] {
    return this.functionDeclarations.map((func) => func.functionBody);
  }
}

export class ExportExpression extends IntermediateRepresentation {
  exportObjects: ExportObject[];

  constructor(exportObjects: ExportObject[]) {
    super();
    this.exportObjects = exportObjects;
  }
}

export class ExportObject {
  exportName: string;
  exportType: ExportType;
  exportIndex: number;

  constructor(exportName: string, exportType: ExportType, exportIndex: number) {
    this.exportName = exportName;
    this.exportType = exportType;
    this.exportIndex = exportIndex;
  }
}
/*
FUNCTIONS
*/

/**
 * Intermediate representation of function expression.
 * Note that signature and body will be encoded in different places afterward
 */
export class FunctionExpression extends IntermediateRepresentation {
  functionSignature: FunctionSignature;
  functionBody: FunctionBody;
  functionName?: string;

  constructor(paramTypes: ValueType[], returnTypes: ValueType[], paramNames: string[], body: TokenExpression, functionName?: string) {
    super();
    this.functionSignature = new FunctionSignature(paramTypes, returnTypes, paramNames);
    this.functionBody = new FunctionBody(body, paramNames);
    this.functionName = functionName;
  }
}

export class FunctionSignature {
  paramTypes: ValueType[];
  paramNames: string[];
  returnTypes: ValueType[];
  functionName?: string;

  constructor(paramTypes: ValueType[], returnTypes: ValueType[], paramNames: string[], functionName?: string) {
    this.paramTypes = paramTypes;
    this.returnTypes = returnTypes;
    this.paramNames = paramNames;
    this.functionName = functionName;
  }
}

/**
 * Intermediate representation of function body.
 * We are using a wrapper around TokenExpression because:
 *  (1) WABT function bodies have to be encoded differently from other blocks
 *  (2) WABT function bodies are in a different module section compared to other blocks.
 */
export class FunctionBody {
  body: TokenExpression;
  paramNames: string[];

  constructor(body: TokenExpression, paramNames: string[]) {
    this.body = body;
    this.paramNames = paramNames;
  }
}


/*
  EXPRESSION BODIES
*/

export type TokenExpression = OperationTree | UnfoldedTokenExpression;

/**
 * Interface indicating that the particular intermediate representation
 * may contain s-expressions, and can therefore be 'unfolded'.
 */
export interface Unfoldable {
  unfold(): PureUnfoldedTokenExpression;
}

export namespace Unfoldable {
  export function instanceOf(obj: object): obj is Unfoldable {
    return 'unfold' in obj;
  }
}

/**
 * Class representing operators and operands in an s-expression.
 */
export class OperationTree extends IntermediateRepresentation implements Unfoldable {
  operator: Token;
  operands: (Token | TokenExpression)[];

  constructor(operator: Token, operands: (Token | TokenExpression)[]) {
    super();
    this.operator = operator;
    this.operands = operands;
  }

  unfold(): PureUnfoldedTokenExpression {
    const unfoldedOperands: Token[] = this.operands.flatMap((operand) => {
      if (operand instanceof Token) {
        return [operand];
      }

      return operand.unfold().tokens;
    });

    return new PureUnfoldedTokenExpression([...unfoldedOperands, this.operator]);
  }
}

/**
 * Class representing a stack token expression. May have s-expressions inside.
 */
export class UnfoldedTokenExpression extends IntermediateRepresentation implements Unfoldable {
  tokens: (Token | OperationTree)[];

  constructor(tokens: (Token | OperationTree)[]) {
    super();
    this.tokens = tokens;
  }
  unfold(): PureUnfoldedTokenExpression {
    const unfoldedOperands: Token[] = this.tokens.flatMap((token) => {
      if (token instanceof Token) {
        return [token];
      }

      return token.unfold().tokens;
    });

    return new PureUnfoldedTokenExpression(unfoldedOperands);
  }
}

/**
 * Class representing a stack token expression. May NOT have s-expressions inside.
 */
export class PureUnfoldedTokenExpression extends IntermediateRepresentation {
  tokens: Token[];

  constructor(tokens: Token[]) {
    super();
    this.tokens = tokens;
  }
}
