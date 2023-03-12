import { Type } from "./type";

// Combination of \include\wabt\token.h and \src\token.cc
var assert = require('assert');


function IsTokenTypeBare(token_type: TokenType): boolean {
    return token_type >= TokenType.First_Bare &&
        token_type <= TokenType.Last_Bare;
}
  
  function IsTokenTypeString(token_type: TokenType): boolean {
    return token_type >= TokenType.First_String &&
        token_type <= TokenType.Last_String;
}
  
  function IsTokenTypeType(token_type: TokenType): boolean {
    return token_type == TokenType.ValueType;
}
  
  function IsTokenTypeOpcode(token_type: TokenType): boolean {
    return token_type >= TokenType.First_Opcode &&
        token_type <= TokenType.Last_Opcode;
}
  
  function IsTokenTypeLiteral(token_type: TokenType): boolean {
    return token_type >= TokenType.First_Literal &&
        token_type <= TokenType.Last_Literal;
}
  
  function IsTokenTypeRefKind(token_type: TokenType): boolean {
    return token_type >= TokenType.First_RefKind &&
        token_type <= TokenType.Last_RefKind;
}

export class Token {

    constructor() { } // minimal constructor for other constructors
    // Token() : token_type_(TokenType::Invalid) {}

    static constructor1(): Token {
        let x = new Token();
        x.token_type_ = TokenType.Invalid

        return x;
    }
    // Token::Token(Location loc, TokenType token_type)
    static constructor2(loc: Location, token_type: TokenType): Token {
        let x = new Token();
        x.loc = loc;
        x.token_type_ = token_type;
        assert(IsTokenTypeBare(x.token_type_));
        return x;
    }

    // Token::Token(Location loc, TokenType token_type, Type type)
    static constructor3(loc: Location, token_type: TokenType, type: Type): Token {
        let x = new Token();
        x.loc = loc;
        x.token_type_ = token_type;
        x.type_ = type; // Construct(type_, type);
        // assert(HasType());
        return x;
    }

    // Token::Token(Location loc, TokenType token_type, std::string_view text)
    static constructor4(loc: Location, token_type: TokenType, text: string): Token {
        let x = new Token();
        x.loc = loc;
        x.token_type_ = token_type;
        x.text_ = text;
        // assert(HasText());
        // Construct(text_, text);
        return x;
    }

    // Token::Token(Location loc, TokenType token_type, Opcode opcode)
    static constructor5(loc: Location, token_type: TokenType, opcode: Opcode): Token {
        let x = new Token();
        x.loc = loc;
        x.token_type_ = token_type;
        x.opcode_ = opcode;
        // assert(HasOpcode());
        // Construct(opcode_, opcode);
        return x;
    }

    // Token::Token(Location loc, TokenType token_type, const Literal& literal)
    static constructor6(loc: Location, token_type: TokenType, literal: Literal): Token {
        let x = new Token();
        x.loc = loc;
        x.token_type_ = token_type;
        x.literal_ = literal;
        // assert(HasLiteral());
        // Construct(literal_, literal);
        return x;
    }


    loc: Location;

    token_type(): TokenType { return this.token_type_; }

    HasText(): boolean { return IsTokenTypeString(this.token_type_); }
    HasType(): boolean {
        return IsTokenTypeType(this.token_type_) || IsTokenTypeRefKind(this.token_type_);
    }
    HasOpcode(): boolean { return IsTokenTypeOpcode(this.token_type_); }
    HasLiteral(): boolean { return IsTokenTypeLiteral(this.token_type_); }

    text(): string {
        assert(this.HasText());
        return this.text_;
    }

    type(): Type {
        assert(this.HasType());
        return this.type_;
    }

    opcode(): Opcode {
        assert(this.HasOpcode());
        return this.opcode_;
    }

    literal(): Literal {
        assert(this.HasLiteral());
        return this.literal_;
    }

    to_string(): string {
        if (IsTokenTypeBare(this.token_type_)) {
            return GetTokenTypeName(this.token_type_);
        } else if (this.HasLiteral()) {
            return this.literal_.text;
        } else if (this.HasOpcode()) {
            return this.opcode_.GetName();
        } else if (this.HasText()) {
            return this.text_;
        } else if (IsTokenTypeRefKind(this.token_type_)) {
            return this.type_.GetRefKindName();
        } else {
            assert(this.HasType());
            return this.type_.GetName();
        }
    }
    to_string_clamp(max_length: number): string {
        let s: string = this.to_string();
        if (s.length > max_length) {
            return s.substr(0, max_length - 3) + "...";
        } else {
            return s;
        }
    }

    //    private:
    token_type_: TokenType;

    // union {
    text_: string;
    type_: Type;
    opcode_: Opcode;
    literal_: Literal;
    // };
}

function GetTokenTypeName(type: TokenType): string {
    return TokenType[type];
}

export enum TokenType {
    /* Tokens with no additional data (i.e. bare). */
    'Invalid' = "Invalid",
    'Array' = "array",
    'AssertException' = "assert_exception",
    'AssertExhaustion' = "assert_exhaustion",
    'AssertInvalid' = "assert_invalid",
    'AssertMalformed' = "assert_malformed",
    'AssertReturn' = "assert_return",
    'AssertTrap' = "assert_trap",
    'AssertUnlinkable' = "assert_unlinkable",
    'Bin' = "bin",
    'Item' = "item",
    'Data' = "data",
    'Declare' = "declare",
    'Delegate' = "delegate",
    'Do' = "do",
    'Either' = "either",
    'Elem' = "elem",
    'Eof' = "EOF",
    'Tag' = "tag",
    'Export' = "export",
    'Field' = "field",
    'Get' = "get",
    'Global' = "global",
    'Import' = "import",
    'Invoke' = "invoke",
    'Input' = "input",
    'Local' = "local",
    'Lpar' = "(",
    'Memory' = "memory",
    'Module' = "module",
    'Mut' = "mut",
    'NanArithmetic' = "nan=arithmetic",
    'NanCanonical' = "nan=canonical",
    'Offset' = "offset",
    'Output' = "output",
    'Param' = "param",
    'Ref' = "ref",
    'Quote' = "quote",
    'Register' = "register",
    'Result' = "result",
    'Rpar' = ")",
    'Shared' = "shared",
    'Start' = "start",
    'Struct' = "struct",
    'Table' = "table",
    'Then' = "then",
    'Type' = "type",
    'I8X16' = "i8x16",
    'I16X8' = "i16x8",
    'I32X4' = "i32x4",
    'I64X2' = "i64x2",
    'F32X4' = "f32x4",
    'F64X2' = "f64x2",
    'First_Bare' = 'Invalid',
    'Last_Bare' = 'F64X2',

    /* Tokens with Literal data. */
    'Float' = "FLOAT",
    'Int' = "INT",
    'Nat' = "NAT",
    'First_Literal' = 'Float',
    'Last_Literal' = 'Nat',

    /* Tokens with Opcode data. */
    'AtomicFence' = "atomic.fence",
    'AtomicLoad' = "ATOMIC_LOAD",
    'AtomicNotify' = "ATOMIC_NOTIFY",
    'AtomicRmw' = "ATOMIC_RMW",
    'AtomicRmwCmpxchg' = "ATOMIC_RMW_CMPXCHG",
    'AtomicStore' = "ATOMIC_STORE",
    'AtomicWait' = "ATOMIC_WAIT",
    'Binary' = "BINARY",
    'Block' = "block",
    'Br' = "br",
    'BrIf' = "br_if",
    'BrTable' = "br_table",
    'Call' = "call",
    'CallIndirect' = "call_indirect",
    'CallRef' = "call_ref",
    'Catch' = "catch",
    'CatchAll' = "catch_all",
    'Compare' = "COMPARE",
    'Const' = "CONST",
    'Convert' = "CONVERT",
    'DataDrop' = "data.drop",
    'Drop' = "drop",
    'ElemDrop' = "elem.drop",
    'Else' = "else",
    'End' = "end",
    'GlobalGet' = "global.get",
    'GlobalSet' = "global.set",
    'If' = "if",
    'Load' = "LOAD",
    'LocalGet' = "local.get",
    'LocalSet' = "local.set",
    'LocalTee' = "local.tee",
    'Loop' = "loop",
    'MemoryCopy' = "memory.copy",
    'MemoryFill' = "memory.fill",
    'MemoryGrow' = "memory.grow",
    'MemoryInit' = "memory.init",
    'MemorySize' = "memory.size",
    'Nop' = "nop",
    'RefExtern' = "ref.extern",
    'RefFunc' = "ref.func",
    'RefIsNull' = "ref.is_null",
    'RefNull' = "ref.null",
    'Rethrow' = "rethrow",
    'ReturnCallIndirect' = "return_call_indirect",
    'ReturnCall' = "return_call",
    'Return' = "return",
    'Select' = "select",
    'SimdLaneOp' = "SIMDLANEOP",
    'SimdLoadSplat' = "SIMDLOADSPLAT",
    'SimdLoadLane' = "SIMDLOADLANE",
    'SimdStoreLane' = "SIMDSTORELANE",
    'SimdShuffleOp' = "i8x16.shuffle",
    'Store' = "STORE",
    'TableCopy' = "table.copy",
    'TableFill' = "table.full",
    'TableGet' = "table.get",
    'TableGrow' = "table.grow",
    'TableInit' = "table.init",
    'TableSet' = "table.set",
    'TableSize' = "table.size",
    'Ternary' = "TERNARY",
    'Throw' = "throw",
    'Try' = "try",
    'Unary' = "UNARY",
    'Unreachable' = "unreachable",
    'First_Opcode' = 'AtomicFence',
    'Last_Opcode' = 'Unreachable',

    /* Tokens with string data. */
    'AlignEqNat' = "align=",
    'LparAnn' = "Annotation",
    'OffsetEqNat' = "offset=",
    'Reserved' = "Reserved",
    'Text' = "TEXT",
    'Var' = "VAR",
    'First_String' = 'AlignEqNat',
    'Last_String' = 'Var',

    /* Tokens with Type data. */
    'ValueType' = "VALUETYPE",
    'First_Type' = 'ValueType',
    'Last_Type' = 'ValueType',

    /* Tokens with Type data, but are reference kinds. */
    'Func' = "func",
    'Extern' = "extern",
    'Exn' = "exn",
    'First_RefKind' = 'Func',
    'Last_RefKind' = 'Exn',

}