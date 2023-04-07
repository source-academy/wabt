import { OpcodeType } from './opcode';
import { TokenType } from './token';
import { ValueType } from './type';
export declare function isKeyWord(str: string): boolean;
export declare function getType(str: string): ValueType | null;
export declare function getTokenType(str: string): TokenType;
export declare function getOpcodeType(str: string): OpcodeType | null;
