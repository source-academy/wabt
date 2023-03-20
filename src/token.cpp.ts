import { TokenType } from './token';

export class Token {
    type: TokenType;
    lexeme: string;
    line: number;
    col: number;
    indexInSource: number;

    constructor(type: TokenType, lexeme: string, line: number, col: number, indexInSource: number) {
        this.type = type;
        this.lexeme = lexeme;
        this.line = line;
        this.col = col;
        this.indexInSource = indexInSource
    }
}

/// export enum TokenType {
/// #define WABT_TOKEN(name, string) name = string,
/// #define WABT_TOKEN_FIRST(group, first) First_##group = #first,
/// #define WABT_TOKEN_LAST(group, last) Last_##group = #last,
/// #include "wabt/token.def"
/// #undef WABT_TOKEN
/// #undef WABT_TOKEN_FIRST
/// #undef WABT_TOKEN_LAST
/// 
///   First = First_Bare,
///   Last = Last_RefKind,
/// }