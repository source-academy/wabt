import { type OpcodeType } from './opcode';
import { TokenType } from './token';
import { type ValueType } from './type';
export declare class Token {
    type: TokenType;
    lexeme: string;
    line: number;
    col: number;
    indexInSource: number;
    valueType: ValueType | null;
    opcodeType: OpcodeType | null;
    constructor(type: TokenType, lexeme: string, line: number, col: number, indexInSource: number, opcodeType?: OpcodeType | null, valueType?: ValueType | null);
    static EofToken(lexeme: string, line: number, col: number, indexInSource: number): Token;
    isBareToken(): boolean;
    isStringToken(): boolean;
    isValueToken(): boolean;
    isOpcodeToken(): boolean;
    isOpcodeType(opcodeType: OpcodeType): boolean;
    isLiteral(): boolean;
    isReference(): boolean;
    getOpcodeParamLength(): number;
    getOpcodeEncoding(): number;
}
export declare function isTokenTypeBare(token_type: TokenType | null): boolean;
export declare function isTokenTypeType(token_type: TokenType | null): boolean;
export declare function isTokenTypeOpcode(token_type: TokenType | null): boolean;
export declare function isTokenTypeLiteral(token_type: TokenType | null): boolean;
export declare function isTokenTypeRefKind(token_type: TokenType | null): boolean;
