const kEof = '\0';

import {
  IsTokenTypeBare as isTokenTypeBare,
  IsTokenTypeOpcode as isTokenTypeOpcode,
  IsTokenTypeRefKind as isTokenTypeRefKind,
  IsTokenTypeType as isTokenTypeType,
  Token,
  TokenType,
} from './token';
import assert from 'assert';
import { ParseHexdigit as parseHexdigit } from './literal';
import { LiteralType } from './literal';
import { isKeyWord } from './keywords.cpp';
import { getOpcodeType, getTokenType, getType } from './keywords';

enum ReservedChars {
  None,
  Some,
  Id,
}

function isDigit(c: string) {
  assert(c.length === 1);
  return /[0-9]/u.test(c);
}
function isHexDigit(c: string) {
  assert(c.length === 1);
  return /[0-9a-f]/iu.test(c);
}
function isKeyword(c: string) {
  assert(c.length === 1);
  return /a-z/u.test(c);
}
function isIdChar(c: string) {
  assert(c.length === 1);
  return /[!-~]/u.test(c) && /[^"(),;=[\]{}]/u.test(c);
}

export class Lexer {
  private readonly source: string;
  private readonly tokens: Token[];
  private start: number;
  private cursor: number;
  private line: number;
  private col: number;
  private token_start: number;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.cursor = 0;
    this.line = 0;
    this.col = 0;
    this.token_start = 0;
  }

  getAllTokens(): Token[] {
    let tokens = [];
    while (true) {
      const token = this.getToken();
      if (token.type === TokenType.Eof) break;
      tokens.push(token);
    }
    return tokens;
  }
  // eslint-disable-next-line complexity
  getToken(): Token {
    while (true) {
      this.token_start = this.cursor;
      switch (this.peekChar()) {
        case kEof:
          return this.bareToken(TokenType.Eof);

        case '(':
          if (this.matchString('(;')) {
            if (this.readBlockComment()) {
              continue;
            }
            return this.bareToken(TokenType.Eof);
          }
          if (this.matchString('(@')) {
            this.getIdToken();
            // offset=2 to skip the "(@" prefix
            return this.textToken(TokenType.LparAnn, 2);
          }
          this.readChar();
          return this.bareToken(TokenType.Lpar);

          break;

        case ')':
          this.readChar();
          return this.bareToken(TokenType.Rpar);

        case ';':
          if (this.matchString(';;')) {
            if (this.readLineComment()) {
              continue;
            }
            return this.bareToken(TokenType.Eof);
          }
          this.readChar();
          throw new Error('unexpected char');
          continue;

          break;

        case ' ':
        case '\t':
        case '\r':
        case '\n':
          this.readWhitespace();
          continue;

        case '"':
          return this.getStringToken();

        case '+':
        case '-':
          this.readChar();
          switch (this.peekChar()) {
            case 'i':
              return this.getInfToken();

            case 'n':
              return this.getNanToken();

            case '0':
              return this.matchString('0x')
                ? this.getHexNumberToken(TokenType.Int)
                : this.getNumberToken(TokenType.Int);
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
              return this.getNumberToken(TokenType.Int);

            default:
              return this.getReservedToken();
          }
          break;

        case '0':
          return this.matchString('0x')
            ? this.getHexNumberToken(TokenType.Nat)
            : this.getNumberToken(TokenType.Nat);

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          return this.getNumberToken(TokenType.Nat);

        case '$':
          return this.getIdToken();

        case 'a':
          return this.getNameEqNumToken('align=', TokenType.AlignEqNat);

        case 'i':
          return this.getInfToken();

        case 'n':
          return this.getNanToken();

        case 'o':
          return this.getNameEqNumToken('offset=', TokenType.OffsetEqNat);

        default:
          if (isKeyword(this.peekChar())) {
            return this.getKeywordToken();
          }
          if (isIdChar(this.peekChar())) {
            return this.getReservedToken();
          }
          this.readChar();
          throw new Error('unexpected char');
          continue;
      }
    }
  }

  peekChar(): string {
    return this.cursor < this.source.length ? this.source[this.cursor] : kEof;
  }

  readChar(): string {
    return this.cursor < this.source.length ? this.source[this.cursor++] : kEof;
  }

  matchChar(c: string): boolean {
    assert(c.length === 1);
    if (this.peekChar() === c) {
      this.readChar();
      return true;
    }
    return false;
  }

  matchString(s: string): boolean {
    const saved_cursor = this.cursor;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (this.readChar() !== c) {
        this.cursor = saved_cursor;
        return false;
      }
    }
    return true;
  }

  newline() {
    this.line++;
    this.cursor++;
    this.col = 0;
  }

  noTrailingReservedChars(): boolean {
    return this.readReservedChars() === ReservedChars.None;
  }

  readReservedChars() {
    let ret = ReservedChars.None;
    while (true) {
      let peek = this.peekChar();
      if (isIdChar(peek)) {
        this.readChar();
        if (ret === ReservedChars.None) {
          ret = ReservedChars.Id;
        }
      } else if (peek === '"') {
        this.getStringToken();
        ret = ReservedChars.Some;
      } else {
        break;
      }
    }
    return ret;
  }

  readBlockComment(): boolean {
    let nesting = 1;
    while (true) {
      switch (this.readChar()) {
        case kEof:
          throw new Error('EOF in block comment');
          return false;

        case ';':
          if (this.matchChar(')') && --nesting === 0) {
            return true;
          }
          break;

        case '(':
          if (this.matchChar(';')) {
            nesting++;
          }
          break;

        case '\n':
          this.newline();
          break;
      }
    }
  }

  readLineComment(): boolean {
    while (true) {
      switch (this.readChar()) {
        case kEof:
          return false;

        case '\n':
          this.newline();
          return true;
      }
    }
  }

  readWhitespace(): void {
    while (true) {
      switch (this.peekChar()) {
        case ' ':
        case '\t':
        case '\r':
          this.readChar();
          break;

        case '\n':
          this.readChar();
          this.newline();
          break;

        default:
          return;
      }
    }
  }

  readSign(): void {
    // TODO: this really doesn't return anything?
    if (this.peekChar() === '+' || this.peekChar() === '-') {
      this.readChar();
    }
  }

  readNum(): boolean {
    if (isDigit(this.peekChar())) {
      this.readChar();
      return this.matchChar('_') || isDigit(this.peekChar())
        ? this.readNum()
        : true;
    }
    return false;
  }

  readHexNum(): boolean {
    if (isHexDigit(this.peekChar())) {
      this.readChar();
      return this.matchChar('_') || isHexDigit(this.peekChar())
        ? this.readHexNum()
        : true;
    }
    return false;
  }

  bareToken(token_type: TokenType): Token {
    return new Token(token_type, '', this.line, this.col, this.cursor);
  }

  // TODO: need to do something with literal_type
  literalToken(token_type: TokenType, literal_type: LiteralType): Token {
    // return Token(GetLocation(), token_type, Literal(literal_type, GetText()));
    return new Token(
      token_type,
      this.getText(),
      this.line,
      this.col,
      this.cursor,
    );
  }

  textToken(token_type: TokenType, offset: number = 0): Token {
    return new Token(
      token_type,
      this.getText(offset),
      this.line,
      this.col,
      this.cursor,
    );
  }

  getText(offset: number = 0): string {
    return this.source.slice(this.token_start + offset, this.cursor);
  }

  getReservedToken(): Token {
    this.readReservedChars();
    return this.textToken(TokenType.Reserved);
  }

  // eslint-disable-next-line complexity
  getStringToken(): Token {
    const saved_token_start = this.token_start;
    let has_error: boolean = false;
    let in_string: boolean = true;
    this.readChar();
    while (in_string) {
      switch (this.readChar()) {
        case kEof:
          return this.bareToken(TokenType.Eof);

        case '\n':
          this.token_start = this.cursor - 1;
          throw new Error('newline in string');
          has_error = true;
          this.newline();
          continue;

        case '"':
          if (this.peekChar() === '"') {
            throw new Error('invalid string token');
            has_error = true;
          }
          in_string = false;
          break;

        case '\\': {
          switch (this.readChar()) {
            case 't':
            case 'n':
            case 'r':
            case '"':
            case "'":
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
            case 'F': // Hex byte escape.
              if (isHexDigit(this.peekChar())) {
                this.readChar();
              } else {
                this.token_start = this.cursor - 2;
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }
              break;

            case 'u': {
              this.token_start = this.cursor - 2;
              if (this.readChar() !== '{') {
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }

              // Value must be a valid unicode scalar value.
              let digit: number;
              let scalar_value: number = 0;

              while (isHexDigit(this.peekChar())) {
                digit = parseHexdigit(this.source[this.cursor++]);

                scalar_value = (scalar_value << 4) | digit;
                // Maximum value of a unicode code point.
                if (scalar_value >= 0x110000) {
                  throw new Error(`bad escape "%.*s"${this.getText}`);
                  has_error = true;
                }
              }

              if (this.peekChar() !== '}') {
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }

              // Scalars between 0xd800 and 0xdfff are not allowed.
              if (
                (scalar_value >= 0xd800 && scalar_value < 0xe000)
                || this.token_start === this.cursor - 3
              ) {
                this.readChar();
                throw new Error(`bad escape "%.*s"${this.getText}`);
                has_error = true;
              }
              break;
            }

            default:
              this.token_start = this.cursor - 2;
              throw new Error(`bad escape "%.*s"${this.getText}`);
              has_error = true;
          }
          break;
        }
      }
    }
    this.token_start = saved_token_start;
    if (has_error) {
      return new Token(
        TokenType.Invalid,
        this.getText(),
        this.line,
        this.col,
        this.cursor,
      );
    }

    return this.textToken(TokenType.Text);
  }

  getNumberToken(token_type: TokenType): Token {
    if (this.readNum()) {
      if (this.matchChar('.')) {
        token_type = TokenType.Float;
        if (isDigit(this.peekChar()) && !this.readNum()) {
          return this.getReservedToken();
        }
      }
      if (this.matchChar('e') || this.matchChar('E')) {
        token_type = TokenType.Float;
        this.readSign();
        if (!this.readNum()) {
          return this.getReservedToken();
        }
      }
      if (this.noTrailingReservedChars()) {
        if (token_type === TokenType.Float) {
          return this.literalToken(token_type, LiteralType.Float);
        }
        return this.literalToken(token_type, LiteralType.Int);
      }
    }
    return this.getReservedToken();
  }

  getHexNumberToken(token_type: TokenType): Token {
    if (this.readHexNum()) {
      if (this.matchChar('.')) {
        token_type = TokenType.Float;
        if (isHexDigit(this.peekChar()) && !this.readHexNum()) {
          return this.getReservedToken();
        }
      }
      if (this.matchChar('p') || this.matchChar('P')) {
        token_type = TokenType.Float;
        this.readSign();
        if (!this.readNum()) {
          return this.getReservedToken();
        }
      }
      if (this.noTrailingReservedChars()) {
        if (token_type === TokenType.Float) {
          return this.literalToken(token_type, LiteralType.Hexfloat);
        }
        return this.literalToken(token_type, LiteralType.Int);
      }
    }
    return this.getReservedToken();
  }

  getInfToken(): Token {
    if (this.matchString('inf')) {
      if (this.noTrailingReservedChars()) {
        return this.literalToken(TokenType.Float, LiteralType.Infinity);
      }
      return this.getReservedToken();
    }
    return this.getKeywordToken();
  }

  getNanToken(): Token {
    if (this.matchString('nan')) {
      if (this.matchChar(':')) {
        if (
          this.matchString('0x')
          && this.readHexNum()
          && this.noTrailingReservedChars()
        ) {
          return this.literalToken(TokenType.Float, LiteralType.Nan);
        }
      } else if (this.noTrailingReservedChars()) {
        return this.literalToken(TokenType.Float, LiteralType.Nan);
      }
    }
    return this.getKeywordToken();
  }

  getNameEqNumToken(name: string, token_type: TokenType): Token {
    if (this.matchString(name)) {
      if (this.matchString('0x')) {
        if (this.readHexNum() && this.noTrailingReservedChars()) {
          return this.textToken(token_type, name.length);
        }
      } else if (this.readNum() && this.noTrailingReservedChars()) {
        return this.textToken(token_type, name.length);
      }
    }
    return this.getKeywordToken();
  }

  getIdToken(): Token {
    this.readChar();
    if (this.readReservedChars() === ReservedChars.Id) {
      return this.textToken(TokenType.Var);
    }

    return this.textToken(TokenType.Reserved);
  }

  getKeywordToken(): Token {
    this.readReservedChars();
    const text = this.getText();

    if (!isKeyWord(text)) {
      return this.textToken(TokenType.Reserved);
    }
    const tokenType = getTokenType(text);
    const valueType = getType(text);
    const opcodeType = getOpcodeType(text);
    if (isTokenTypeBare(tokenType)) {
      return this.bareToken(tokenType!);
    }
    if (isTokenTypeType(tokenType) || isTokenTypeRefKind(tokenType)) {
      return new Token(tokenType, text, this.line, this.col, this.cursor, undefined, valueType);
      // return new Token(GetLocation(), tokenType, valueType);
    }
    console.log({ tokenType });
    console.log({ text });
    assert(isTokenTypeOpcode(tokenType));
    return new Token(tokenType, text, this.line, this.col, this.cursor, opcodeType);
    // return new Token(GetLocation(), tokenType, opcodeType);
  }
}
