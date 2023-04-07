import { type ValueType } from '../common/type';
import { Token } from '../common/token';
import { ExportType } from '../common/export_types';
export declare abstract class IntermediateRepresentation {
}
export declare class ModuleExpression extends IntermediateRepresentation {
    functionDeclarations: FunctionExpression[];
    exportDeclarations?: ExportExpression;
    constructor(functionDeclarations: FunctionExpression[], exportDeclarations?: ExportExpression);
    getFunctionSignatures(): FunctionSignature[];
    getFunctionBodies(): FunctionBody[];
}
export declare class ExportExpression extends IntermediateRepresentation {
    exportObjects: ExportObject[];
    constructor(exportObjects: ExportObject[]);
}
export declare class ExportObject {
    exportName: string;
    exportType: ExportType;
    exportIndex: number;
    constructor(exportName: Token, exportType: Token, exportIndex: Token);
}
/**
 * Intermediate representation of function expression.
 * Note that signature and body will be encoded in different places afterward
 */
export declare class FunctionExpression extends IntermediateRepresentation {
    functionSignature: FunctionSignature;
    functionBody: FunctionBody;
    functionName?: string;
    constructor(paramTypes: ValueType[], returnTypes: ValueType[], paramNames: string[], body: TokenExpression, functionName?: string);
}
export declare class FunctionSignature {
    paramTypes: ValueType[];
    paramNames: string[];
    returnTypes: ValueType[];
    functionName?: string;
    constructor(paramTypes: ValueType[], returnTypes: ValueType[], paramNames: string[], functionName?: string);
}
/**
 * Intermediate representation of function body.
 * We are using a wrapper around TokenExpression because:
 *  (1) WABT function bodies have to be encoded differently from other blocks
 *  (2) WABT function bodies are in a different module section compared to other blocks.
 */
export declare class FunctionBody {
    body: TokenExpression;
    paramNames: string[];
    constructor(body: TokenExpression, paramNames: string[]);
}
export type TokenExpression = OperationTree | UnfoldedTokenExpression;
/**
 * Interface indicating that the particular intermediate representation
 * may contain s-expressions, and can therefore be 'unfolded'.
 */
export interface Unfoldable {
    unfold(): PureUnfoldedTokenExpression;
}
export declare namespace Unfoldable {
    function instanceOf(obj: object): obj is Unfoldable;
}
/**
 * Class representing operators and operands in an s-expression.
 */
export declare class OperationTree extends IntermediateRepresentation implements Unfoldable {
    operator: Token;
    operands: (Token | TokenExpression)[];
    constructor(operator: Token, operands: (Token | TokenExpression)[]);
    unfold(): PureUnfoldedTokenExpression;
}
/**
 * Class representing a stack token expression. May have s-expressions inside.
 */
export declare class UnfoldedTokenExpression extends IntermediateRepresentation implements Unfoldable {
    tokens: (Token | OperationTree)[];
    constructor(tokens: (Token | OperationTree)[]);
    unfold(): PureUnfoldedTokenExpression;
}
/**
 * Class representing a stack token expression. May NOT have s-expressions inside.
 */
export declare class PureUnfoldedTokenExpression extends IntermediateRepresentation {
    tokens: Token[];
    constructor(tokens: Token[]);
}
