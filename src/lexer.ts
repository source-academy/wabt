/*
* Full disclosure: The general structure of this file is adapted from my own
* Rust implementation of a scanner
* https://github.com/Fidget-Spinner/crafting_interpreters/blob/main/rust/src/scanner.rs.
* That is in turn is adapted from the Java code written by the excellent book,
* "Crafting Interpreters" https://craftinginterpreters.com/scanning.html.
* Said book's copyright is under Robert Nystrom.
* I've included the MIT license that code snippets from
* the book is licensed under down below. See
* https://github.com/munificent/craftinginterpreters/blob/master/LICENSE
*
* The changes I've made: I have rewritten basically everything from scratch.
* Only the method names and overall method APIs
* are the same. Their internal behaviors are quite different as the scanner
* in the book parses a JS-like language, not Python.
*
* - The book was written in Java. I have written this in TypeScript.
* - The scanner supports a whitespace significant language now.
* - Also added support for column numbers for better error messages in the future.
* - Also added better errors.
* - Also added forbidden identifiers.
*
*
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to
    deal in the Software without restriction, including without limitation the
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
* */

const kEof = "\0";

import { IsTokenTypeBare, IsTokenTypeOpcode, IsTokenTypeRefKind, IsTokenTypeType, Token, TokenType } from './token'
import assert from 'assert'
import { ParseHexdigit } from './literal.cpp';
import { LiteralType } from './literal';
import { isKeyWord } from './keywords.cpp';
import { getOpcodeType, getTokenType, getType } from './keywords';

enum ReservedChars { None, Some, Id };

function IsDigit(c: string) {
    assert(c.length == 1)
    return /[0-9]/.test(c);
}
function IsHexDigit(c: string) {
    assert(c.length == 1)
    return /[0-9a-f]/i.test(c);
}
function IsKeyword(c: string) {
    assert(c.length == 1)
    return /a-z/.test(c);
}
function IsIdChar(c: string) {
    assert(c.length == 1)
    return /[!-~]/.test(c) && /[^\"\(\)\,\;\=\[\]\{\}]/.test(c);
}
export class Tokenizer {
    private readonly source: string;
    private readonly tokens: Token[];
    private start: number;
    private cursor: number;
    private line: number;
    private col: number;
    private token_start: number

    constructor(source: string) {
        this.source = source;
        this.tokens = []
        this.start = 0;
        this.cursor = 0;
        this.line = 0;
        this.col = 0;
        this.token_start = 0;
    }

    getToken() {
        while (true) {
            this.token_start = this.cursor;
            switch (this.PeekChar()) {
                case kEof:
                    return this.BareToken(TokenType.Eof);

                case '(':
                    if (this.MatchString("(;")) {
                        if (this.ReadBlockComment()) {
                            continue;
                        }
                        return this.BareToken(TokenType.Eof);
                    } else if (this.MatchString("(@")) {
                        this.GetIdToken();
                        // offset=2 to skip the "(@" prefix
                        return this.TextToken(TokenType.LparAnn, 2);
                    } else {
                        this.ReadChar();
                        return this.BareToken(TokenType.Lpar);
                    }
                    break;

                case ')':
                    this.ReadChar();
                    return this.BareToken(TokenType.Rpar);

                case ';':
                    if (this.MatchString(";;")) {
                        if (this.ReadLineComment()) {
                            continue;
                        }
                        return this.BareToken(TokenType.Eof);
                    } else {
                        this.ReadChar();
                        throw new Error("unexpected char");
                        continue;
                    }
                    break;

                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    this.ReadWhitespace();
                    continue;

                case '"':
                    return this.GetStringToken();

                case '+':
                case '-':
                    this.ReadChar();
                    switch (this.PeekChar()) {
                        case 'i':
                            return this.GetInfToken();

                        case 'n':
                            return this.GetNanToken();

                        case '0':
                            return this.MatchString("0x") ? this.GetHexNumberToken(TokenType.Int)
                                : this.GetNumberToken(TokenType.Int);
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            return this.GetNumberToken(TokenType.Int);

                        default:
                            return this.GetReservedToken();
                    }
                    break;

                case '0':
                    return this.MatchString("0x") ? this.GetHexNumberToken(TokenType.Nat)
                        : this.GetNumberToken(TokenType.Nat);

                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    return this.GetNumberToken(TokenType.Nat);

                case '$':
                    return this.GetIdToken();

                case 'a':
                    return this.GetNameEqNumToken("align=", TokenType.AlignEqNat);

                case 'i':
                    return this.GetInfToken();

                case 'n':
                    return this.GetNanToken();

                case 'o':
                    return this.GetNameEqNumToken("offset=", TokenType.OffsetEqNat);

                default:
                    if (IsKeyword(this.PeekChar())) {
                        return this.GetKeywordToken();
                    } else if (IsIdChar(this.PeekChar())) {
                        return this.GetReservedToken();
                    } else {
                        this.ReadChar();
                        throw new Error("unexpected char");
                        continue;
                    }
            }
        }
    }

    PeekChar(): string {
        return this.cursor < this.source.length ? this.source[this.cursor] : kEof;
    }

    ReadChar(): string {
        return this.cursor < this.source.length ? this.source[this.cursor++] : kEof;
    }

    MatchChar(c: string): boolean {
        assert(c.length == 1);
        if (this.PeekChar() == c) {
            this.ReadChar();
            return true;
        }
        return false;
    }

    MatchString(s: string): boolean {
        const saved_cursor = this.cursor;
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (this.ReadChar() != c) {
                this.cursor = saved_cursor;
                return false;
            }
        }
        return true;
    }

    ReadBlockComment(): boolean {
        let nesting = 1;
        while (true) {
            switch (this.ReadChar()) {
                case kEof:
                    throw new Error("EOF in block comment");
                    return false;

                case ';':
                    if (this.MatchChar(')') && --nesting == 0) {
                        return true;
                    }
                    break;

                case '(':
                    if (this.MatchChar(';')) {
                        nesting++;
                    }
                    break;

                case '\n':
                    this.Newline();
                    break;
            }
        }
    }

    ReadLineComment(): boolean {
        while (true) {
            switch (this.ReadChar()) {
                case kEof:
                    return false;

                case '\n':
                    this.Newline();
                    return true;
            }
        }
    }


    ReadWhitespace(): void {
        while (true) {
            switch (this.PeekChar()) {
                case ' ':
                case '\t':
                case '\r':
                    this.ReadChar();
                    break;

                case '\n':
                    this.ReadChar();
                    this.Newline();
                    break;

                default:
                    return;
            }
        }
    }


    GetStringToken(): Token {
        const saved_token_start = this.token_start;
        let has_error: boolean = false;
        let in_string: boolean = true;
        this.ReadChar();
        while (in_string) {
            switch (this.ReadChar()) {
                case kEof:
                    return this.BareToken(TokenType.Eof);

                case '\n':
                    this.token_start = this.cursor - 1;
                    throw new Error("newline in string");
                    has_error = true;
                    this.Newline();
                    continue;

                case '"':
                    if (this.PeekChar() == '"') {
                        throw new Error("invalid string token");
                        has_error = true;
                    }
                    in_string = false;
                    break;

                case '\\': {
                    switch (this.ReadChar()) {
                        case 't':
                        case 'n':
                        case 'r':
                        case '"':
                        case '\'':
                        case '\\':
                            // Valid escape.
                            break;

                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':  // Hex byte escape.
                            if (IsHexDigit(this.PeekChar())) {
                                this.ReadChar();
                            } else {
                                this.token_start = this.cursor - 2;
                                throw new Error("bad escape \"%.*s\"" + this.GetText);
                                has_error = true;
                            }
                            break;

                        case 'u': {
                            this.token_start = this.cursor - 2;
                            if (this.ReadChar() != '{') {
                                throw new Error("bad escape \"%.*s\"" + this.GetText);
                                has_error = true;
                            }

                            // Value must be a valid unicode scalar value.
                            let digit: number;
                            let scalar_value: number = 0;

                            while (IsHexDigit(this.PeekChar())) {
                                digit = ParseHexdigit(this.source[this.cursor++]);

                                scalar_value = (scalar_value << 4) | digit;
                                // Maximum value of a unicode code point.
                                if (scalar_value >= 0x110000) {
                                    throw new Error("bad escape \"%.*s\"" + this.GetText);
                                    has_error = true;
                                }
                            }

                            if (this.PeekChar() != '}') {
                                throw new Error("bad escape \"%.*s\"" + this.GetText);
                                has_error = true;
                            }

                            // Scalars between 0xd800 and 0xdfff are not allowed.
                            if ((scalar_value >= 0xd800 && scalar_value < 0xe000) ||
                                this.token_start == this.cursor - 3) {
                                this.ReadChar();
                                throw new Error("bad escape \"%.*s\"" + this.GetText);
                                has_error = true;
                            }
                            break;
                        }

                        default:
                            this.token_start = this.cursor - 2;
                            throw new Error("bad escape \"%.*s\"" + this.GetText);
                            has_error = true;
                    }
                    break;
                }
            }
        }
        this.token_start = saved_token_start;
        if (has_error) {
            return new Token(TokenType.Invalid, this.GetText(), this.line, this.col, this.cursor);
        }

        return this.TextToken(TokenType.Text);
    }

    Newline() {
        this.line++;
        this.cursor++;
        this.col = 0;
    }


    GetNumberToken(token_type: TokenType): Token {
        if (this.ReadNum()) {
            if (this.MatchChar('.')) {
                token_type = TokenType.Float;
                if (IsDigit(this.PeekChar()) && !this.ReadNum()) {
                    return this.GetReservedToken();
                }
            }
            if (this.MatchChar('e') || this.MatchChar('E')) {
                token_type = TokenType.Float;
                this.ReadSign();
                if (!this.ReadNum()) {
                    return this.GetReservedToken();
                }
            }
            if (this.NoTrailingReservedChars()) {
                if (token_type == TokenType.Float) {
                    return this.LiteralToken(token_type, LiteralType.Float);
                } else {
                    return this.LiteralToken(token_type, LiteralType.Int);
                }
            }
        }
        return this.GetReservedToken();
    }

    GetHexNumberToken(token_type: TokenType): Token {
        if (this.ReadHexNum()) {
            if (this.MatchChar('.')) {
                token_type = TokenType.Float;
                if (IsHexDigit(this.PeekChar()) && !this.ReadHexNum()) {
                    return this.GetReservedToken();
                }
            }
            if (this.MatchChar('p') || this.MatchChar('P')) {
                token_type = TokenType.Float;
                this.ReadSign();
                if (!this.ReadNum()) {
                    return this.GetReservedToken();
                }
            }
            if (this.NoTrailingReservedChars()) {
                if (token_type == TokenType.Float) {
                    return this.LiteralToken(token_type, LiteralType.Hexfloat);
                } else {
                    return this.LiteralToken(token_type, LiteralType.Int);
                }
            }
        }
        return this.GetReservedToken();
    }

    GetInfToken(): Token {
        if (this.MatchString("inf")) {
            if (this.NoTrailingReservedChars()) {
                return this.LiteralToken(TokenType.Float, LiteralType.Infinity);
            }
            return this.GetReservedToken();
        }
        return this.GetKeywordToken();
    }

    NoTrailingReservedChars(): boolean {
        return this.ReadReservedChars() == ReservedChars.None;
    }

    GetNanToken(): Token {
        if (this.MatchString("nan")) {
            if (this.MatchChar(':')) {
                if (this.MatchString("0x") && this.ReadHexNum() && this.NoTrailingReservedChars()) {
                    return this.LiteralToken(TokenType.Float, LiteralType.Nan);
                }
            } else if (this.NoTrailingReservedChars()) {
                return this.LiteralToken(TokenType.Float, LiteralType.Nan);
            }
        }
        return this.GetKeywordToken();
    }

    GetNameEqNumToken(name: string, token_type: TokenType): Token {
        if (this.MatchString(name)) {
            if (this.MatchString("0x")) {
                if (this.ReadHexNum() && this.NoTrailingReservedChars()) {
                    return this.TextToken(token_type, name.length);
                }
            } else if (this.ReadNum() && this.NoTrailingReservedChars()) {
                return this.TextToken(token_type, name.length);
            }
        }
        return this.GetKeywordToken();
    }

    GetIdToken(): Token {
        this.ReadChar();
        if (this.ReadReservedChars() == ReservedChars.Id) {
            return this.TextToken(TokenType.Var);
        }

        return this.TextToken(TokenType.Reserved);
    }

    GetKeywordToken(): Token {
        this.ReadReservedChars();
        const text = this.GetText();
        
        if (!isKeyWord(text)) {
            return this.TextToken(TokenType.Reserved);
        }
        const tokenType = getTokenType(text);
        const valueType = getType(text);
        const opcodeType = getOpcodeType(text);
        if (IsTokenTypeBare(tokenType)) {
            return this.BareToken(tokenType!);
        } else if (IsTokenTypeType(tokenType) ||
            IsTokenTypeRefKind(tokenType)) {
            return new Token(tokenType!, text, this.line, this.col, this.cursor);
            // return new Token(GetLocation(), tokenType, valueType);
        } else {
            assert(IsTokenTypeOpcode(tokenType));
            return new Token(tokenType!, text, this.line, this.col, this.cursor);
            // return new Token(GetLocation(), tokenType, opcodeType);
        }
    }

    ReadReservedChars() {
        let ret = ReservedChars.None;
        while (true) {
            let peek = this.PeekChar();
            if (IsIdChar(peek)) {
                this.ReadChar();
                if (ret == ReservedChars.None) {
                    ret = ReservedChars.Id;
                }
            } else if (peek == '"') {
                this.GetStringToken();
                ret = ReservedChars.Some;
            } else {
                break;
            }
        }
        return ret;
    }

    ReadSign() {
        if (this.PeekChar() == '+' || this.PeekChar() == '-') {
            this.ReadChar();
        }
    }

    ReadNum(): boolean {
        if (IsDigit(this.PeekChar())) {
            this.ReadChar();
            return this.MatchChar('_') || IsDigit(this.PeekChar()) ? this.ReadNum() : true;
        }
        return false;
    }

    ReadHexNum(): boolean {
        if (IsHexDigit(this.PeekChar())) {
            this.ReadChar();
            return this.MatchChar('_') || IsHexDigit(this.PeekChar()) ? this.ReadHexNum() : true;
        }
        return false;
    }

    BareToken(token_type: TokenType): Token {
        return new Token(token_type, "", this.line, this.col, this.cursor);
    }

    // TODO: need to do something with literal_type
    LiteralToken(token_type: TokenType, literal_type: LiteralType): Token {
        // return Token(GetLocation(), token_type, Literal(literal_type, GetText()));
        return new Token(token_type, this.GetText(), this.line, this.col, this.cursor);
    }

    TextToken(token_type: TokenType, offset: number = 0): Token {
        return new Token(token_type, this.GetText(offset), this.line, this.col, this.cursor);
    }

    GetText(offset: number = 0): string {
        return this.source.slice(this.token_start + offset, this.cursor + 1)
    }

    GetReservedToken(): Token {
        this.ReadReservedChars();
        return this.TextToken(TokenType.Reserved);
    }

}