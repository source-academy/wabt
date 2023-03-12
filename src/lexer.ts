import assert from 'assert';
import { TokenType } from './token';

const kEof: string = '\0';
const KEYWORDS: string[] = [];
enum ReservedChars { None, Some, Id };

// error macro in wast-lexer.cc
function ERROR(msg: string) {
    throw new Error(msg);
}

function IsDigit(c: string): boolean {
    assert(c.length === 1);
    return /\d/.test(c);
}
function IsHexDigit(c: string): boolean {
    assert(c.length === 1);
    return /[\da-f]/.test(c); // TODO: check capitalisation
}
function IsKeyword(c: string): boolean {
    assert(c.length === 1);
    return /[a-z]/.test(c);
}
function IsIdChar(c: string): boolean {
    assert(c.length === 1);
    return /[!-~]/.test(c) && '"(),;[]{}'.includes(c);
}

class WastLexer {

    public constructor(buffer: string) {

    }

    public GetToken(): Token {
        // TODO
    }

    buffer: string;
    line_: number;
    buffer_end_: number;
    line_start_: number;
    token_start_: number;
    cursor_: number;


    BareToken(token_type: TokenType): Token { };
    LiteralToken(token_type: TokenType, LiteralType): Token { };
    TextToken(token_type: TokenType, offset: number = 0): Token { };

    PeekChar(): string {
        return this.cursor_ < this.buffer_end_ ? this.buffer[this.cursor_] : kEof;
    }

    ReadChar(): string {
        return this.cursor_ < this.buffer_end_ ? this.buffer[this.cursor_++] : kEof;
    };

    MatchChar(c: string): boolean {
        assert(c.length === 1);
        if (this.PeekChar() == c) {
            this.ReadChar();
            return true;
        }
        return false;
    };

    MatchString(s: string): boolean {
        const saved_cursor_ = this.cursor_;
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (this.ReadChar() !== c) {
                this.cursor_ = saved_cursor_;
                return false;
            }
        }
        return true;
    };

    Newline(): void { // this is rather strange, so this is only called AFTER reading a newline character
        this.line_++;
        this.line_start_ = this.cursor_; // TODO: I don't understand this significance of this
    };

    ReadBlockComment(): boolean { // Returns false if EOF.
        let nesting = 1;
        while (true) {
            switch (this.ReadChar()) {
                case kEof:
                    console.error("EOF in block comment"); // TODO: how to handle this
                    return false;

                case ';':
                    if (this.MatchChar(')') && --nesting == 0)
                        return true;
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
    };

    ReadLineComment(): boolean { // Returns false if EOF.
        while (true) {
            switch (this.ReadChar()) {
                case kEof:
                    return false;

                case '\n':
                    this.Newline();
                    return true;
            }
        }
    };

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
    };

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

    // enum class ReservedChars { None, Some, Id };
    ReadReservedChars(): ReservedChars {
        let ret = ReservedChars.None;

        while (true) {
            let peek = this.PeekChar();
            if (IsIdChar(peek)) {
                this.ReadChar();
                if (ret === ReservedChars.None) {
                    ret = ReservedChars.Id
                }
            } else if (peek === '"') {
                this.GetStringToken();
                ret = ReservedChars.Some
            } else {
                break
            }
        }
        return ret;
    }

    NoTrailingReservedChars(): boolean {
        return this.ReadReservedChars() == ReservedChars.None;
    }

    ReadSign(): void {
        if (this.PeekChar() === '+' || this.PeekChar() === '-') {
            this.ReadChar();
        }
    };

    GetStringToken(): Token {
        const saved_token_start = this.token_start_;
        let has_error: boolean = false;
        let in_string: boolean = true;
        this.ReadChar();
        while (in_string) {
            switch (this.ReadChar()) {
                case kEof:
                    return this.BareToken(TokenType.Eof);

                case '\n':
                    this.token_start_ = this.cursor_ - 1;
                    ERROR("newline in string");
                    has_error = true;
                    this.Newline();
                    continue;

                case '"':
                    if (this.PeekChar() == '"') {
                        ERROR("invalid string token");
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
                                this.token_start_ = this.cursor_ - 2;
                                error();
                            }
                            break;

                        case 'u': {
                            this.token_start_ = this.cursor_ - 2;
                            if (this.ReadChar() != '{') {
                                error();
                            }

                  // Value must be a valid unicode scalar value.
                  digit: number;
                  scalar_value: number = 0;

                            while (IsHexDigit(this.PeekChar())) {
                                ParseHexdigit(this.cursor_++, digit);

                                scalar_value = (scalar_value << 4) | digit;
                                // Maximum value of a unicode code point.
                                if (scalar_value >= 0x110000) {
                                    error();
                                }
                            }

                            if (this.PeekChar() != '}') {
                                error();
                            }

                            // Scalars between 0xd800 and 0xdfff are not allowed.
                            if ((scalar_value >= 0xd800 && scalar_value < 0xe000) ||
                                this.token_start_ == this.cursor_ - 3) {
                                this.ReadChar();
                                error();
                            }
                            break;
                        }

                        default:
                            this.token_start_ = this.cursor_ - 2;
                            error();

                            function error() {
                                ERROR("bad escape \"%.*s\"",
                                    static_cast<int>(this.cursor_ - this.token_start_), this.token_start_);
                                has_error = true;
                                break;
                            }
                    }
                    break;
                }
            }
        }
        this.token_start_ = saved_token_start;
        if (has_error) {
            return Token(GetLocation(), TokenType.Invalid);
        }

        return this.TextToken(TokenType.Text);
    }

    GetNumberToken(token_type: TokenType): Token {
        if (this.ReadNum()) {
            if (this.MatchChar('.')) {
                token_type = TokenType.Float;
            }
            if (this.MatchChar('e') || this.MatchChar('E')) {
                token_type = TokenType.Float;
                this.ReadSign();
                if (!this.ReadNum()) {
                    return this.GetReservedToken();
                }
            }
            if (this.NoTrailingReservedChars()) {
                if (token_type === TokenType.Float) {
                    return this.LiteralToken(token_type, LiteralType.Float);
                } else {
                    return this.LiteralToken(token_type, LiteralType.Int);
                }
            }
        }
        return this.GetReservedToken();
    };

    GetHexNumberToken(token_type: TokenType): Token {
        if (!this.ReadHexNum())
            return this.GetReservedToken();
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

    GetInfToken(): Token {
        if (this.MatchString("inf")) {
            if (this.NoTrailingReservedChars()) {
                return this.LiteralToken(TokenType.Float, LiteralType.Infinity);
            }
            return this.GetReservedToken();
        }
        return this.GetKeywordToken();
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
        TokenInfo * info =
        Perfect_Hash.InWordSet(this.token_start_, this.cursor_ - this.token_start_);
        if (!info) {
            return this.TextToken(TokenType.Reserved);
        }
        if (IsTokenTypeBare(info -> token_type)) {
            return this.BareToken(info -> token_type);
        } else if (IsTokenTypeType(info -> token_type) ||
            IsTokenTypeRefKind(info -> token_type)) {
            return Token(GetLocation(), info -> token_type, info -> value_type);
        } else {
            assert(IsTokenTypeOpcode(info -> token_type));
            return Token(GetLocation(), info -> token_type, info -> opcode);
        }
    }
    GetReservedToken(): Token {
        this.ReadReservedChars();
        return this.TextToken(TokenType.Reserved);
    }

    source_: std.unique_ptr<LexerSource>;

    buffer_: string;
    line_: number;
    buffer_end_: number; // buffer length
    line_start_: number;
    token_start_: number;
    cursor_: number;
}