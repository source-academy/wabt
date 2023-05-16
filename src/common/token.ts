/* eslint-disable */
import { type Evaluable } from '../wat_compiler/ir_types';
import { assert } from './assert';
import { Opcode, type OpcodeType } from './opcode';

import { type ValueType } from './type';
export class Token implements Evaluable {
  type: TokenType;
  lexeme: string;
  line: number;
  col: number;
  indexInSource: number;
  valueType: ValueType | null;
  opcodeType: OpcodeType | null;
  constructor(
    type: TokenType,
    lexeme: string,
    line: number,
    col: number,
    indexInSource: number,
    opcodeType: OpcodeType | null = null,
    valueType: ValueType | null = null
  ) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
    this.col = col;
    this.indexInSource = indexInSource;
    this.opcodeType = opcodeType;
    this.valueType = valueType;
  }
  static EofToken(
    lexeme: string,
    line: number,
    col: number,
    indexInSource: number
  ) {
    return new Token(
      TokenType.Eof,
      lexeme,
      line,
      col,
      indexInSource,
      null,
      null
    );
  }
  isBareToken(): boolean {
    return isTokenTypeBare(this.type);
  }
  isStringToken(): boolean {
    return isTokenTypeString(this.type);
  }
  isValueToken(): boolean {
    return isTokenTypeType(this.type);
  }
  isOpcodeToken(): boolean {
    return isTokenTypeOpcode(this.type);
  }
  isOpcodeType(opcodeType: OpcodeType): boolean {
    return isTokenTypeOpcode(this.type) && this.opcodeType === opcodeType;
  }
  isLiteral(): boolean {
    return isTokenTypeLiteral(this.type);
  }
  isReference(): boolean {
    return isTokenTypeRefKind(this.type);
  }
  isBlock(): boolean {
    return isTokenTypeBlock(this.type);
  }
  getOpcodeParamLength(): number {
    assert(this.opcodeType !== null);
    return Opcode.getParamLength(this.opcodeType!);
  }
  getOpcodeEncoding(): number {
    assert(this.opcodeType !== null);
    return Opcode.getCode(this.opcodeType!);
  }
  extractName(): string {
    assert(this.type === TokenType.Text);
    return this.lexeme.slice(1, this.lexeme.length - 1);
  }
  getReturnTypes(): ValueType[] {
    if (this.opcodeType === null) {
      return [];
    }
    return [Opcode.getReturnType(this.opcodeType)];
  }
  getConsumedTypes(): ValueType[] {
    if (this.opcodeType === null) {
      return [];
    }
    return Opcode.getParamTypes(this.opcodeType);
  }
}
export function isTokenTypeBare(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return (
    token_type === TokenType.Invalid ||
    token_type === TokenType.Array ||
    token_type === TokenType.AssertException ||
    token_type === TokenType.AssertExhaustion ||
    token_type === TokenType.AssertInvalid ||
    token_type === TokenType.AssertMalformed ||
    token_type === TokenType.AssertReturn ||
    token_type === TokenType.AssertTrap ||
    token_type === TokenType.AssertUnlinkable ||
    token_type === TokenType.Bin ||
    token_type === TokenType.Item ||
    token_type === TokenType.Data ||
    token_type === TokenType.Declare ||
    token_type === TokenType.Delegate ||
    token_type === TokenType.Do ||
    token_type === TokenType.Either ||
    token_type === TokenType.Elem ||
    token_type === TokenType.Eof ||
    token_type === TokenType.Tag ||
    token_type === TokenType.Export ||
    token_type === TokenType.Field ||
    token_type === TokenType.Get ||
    token_type === TokenType.Global ||
    token_type === TokenType.Import ||
    token_type === TokenType.Invoke ||
    token_type === TokenType.Input ||
    token_type === TokenType.Local ||
    token_type === TokenType.Lpar ||
    token_type === TokenType.Memory ||
    token_type === TokenType.Module ||
    token_type === TokenType.Mut ||
    token_type === TokenType.NanArithmetic ||
    token_type === TokenType.NanCanonical ||
    token_type === TokenType.Offset ||
    token_type === TokenType.Output ||
    token_type === TokenType.Param ||
    token_type === TokenType.Ref ||
    token_type === TokenType.Quote ||
    token_type === TokenType.Register ||
    token_type === TokenType.Result ||
    token_type === TokenType.Rpar ||
    token_type === TokenType.Shared ||
    token_type === TokenType.Start ||
    token_type === TokenType.Struct ||
    token_type === TokenType.Table ||
    token_type === TokenType.Then ||
    token_type === TokenType.Type ||
    token_type === TokenType.I8X16 ||
    token_type === TokenType.I16X8 ||
    token_type === TokenType.I32X4 ||
    token_type === TokenType.I64X2 ||
    token_type === TokenType.F32X4 ||
    token_type === TokenType.F64X2
  );
}
function isTokenTypeString(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return (
    token_type === TokenType.AlignEqNat ||
    token_type === TokenType.LparAnn ||
    token_type === TokenType.OffsetEqNat ||
    token_type === TokenType.Reserved ||
    token_type === TokenType.Text ||
    token_type === TokenType.Var
  );
}
export function isTokenTypeType(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return token_type === TokenType.ValueType;
}
export function isTokenTypeOpcode(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return (
    token_type === TokenType.AtomicFence ||
    token_type === TokenType.AtomicLoad ||
    token_type === TokenType.AtomicNotify ||
    token_type === TokenType.AtomicRmw ||
    token_type === TokenType.AtomicRmwCmpxchg ||
    token_type === TokenType.AtomicStore ||
    token_type === TokenType.AtomicWait ||
    token_type === TokenType.Binary ||
    token_type === TokenType.Block ||
    token_type === TokenType.Br ||
    token_type === TokenType.BrIf ||
    token_type === TokenType.BrTable ||
    token_type === TokenType.Call ||
    token_type === TokenType.CallIndirect ||
    token_type === TokenType.CallRef ||
    token_type === TokenType.Catch ||
    token_type === TokenType.CatchAll ||
    token_type === TokenType.Compare ||
    token_type === TokenType.Const ||
    token_type === TokenType.Convert ||
    token_type === TokenType.DataDrop ||
    token_type === TokenType.Drop ||
    token_type === TokenType.ElemDrop ||
    token_type === TokenType.Else ||
    token_type === TokenType.End ||
    token_type === TokenType.GlobalGet ||
    token_type === TokenType.GlobalSet ||
    token_type === TokenType.If ||
    token_type === TokenType.Load ||
    token_type === TokenType.LocalGet ||
    token_type === TokenType.LocalSet ||
    token_type === TokenType.LocalTee ||
    token_type === TokenType.Loop ||
    token_type === TokenType.MemoryCopy ||
    token_type === TokenType.MemoryFill ||
    token_type === TokenType.MemoryGrow ||
    token_type === TokenType.MemoryInit ||
    token_type === TokenType.MemorySize ||
    token_type === TokenType.Nop ||
    token_type === TokenType.RefExtern ||
    token_type === TokenType.RefFunc ||
    token_type === TokenType.RefIsNull ||
    token_type === TokenType.RefNull ||
    token_type === TokenType.Rethrow ||
    token_type === TokenType.ReturnCallIndirect ||
    token_type === TokenType.ReturnCall ||
    token_type === TokenType.Return ||
    token_type === TokenType.Select ||
    token_type === TokenType.SimdLaneOp ||
    token_type === TokenType.SimdLoadSplat ||
    token_type === TokenType.SimdLoadLane ||
    token_type === TokenType.SimdStoreLane ||
    token_type === TokenType.SimdShuffleOp ||
    token_type === TokenType.Store ||
    token_type === TokenType.TableCopy ||
    token_type === TokenType.TableFill ||
    token_type === TokenType.TableGet ||
    token_type === TokenType.TableGrow ||
    token_type === TokenType.TableInit ||
    token_type === TokenType.TableSet ||
    token_type === TokenType.TableSize ||
    token_type === TokenType.Ternary ||
    token_type === TokenType.Throw ||
    token_type === TokenType.Try ||
    token_type === TokenType.Unary ||
    token_type === TokenType.Unreachable
  );
}
export function isTokenTypeLiteral(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return (
    token_type === TokenType.Float ||
    token_type === TokenType.Int ||
    token_type === TokenType.Nat
  );
}
export function isTokenTypeRefKind(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return (
    token_type === TokenType.Func ||
    token_type === TokenType.Extern ||
    token_type === TokenType.Exn
  );
}
export function isTokenTypeBlock(token_type: TokenType | null): boolean {
  if (token_type === null) return false;
  return (
    token_type === TokenType.Block ||
    token_type === TokenType.If ||
    token_type === TokenType.Loop
  );
}
export enum TokenType {
  Invalid = 'Invalid',
  Array = 'array',
  AssertException = 'assert_exception',
  AssertExhaustion = 'assert_exhaustion',
  AssertInvalid = 'assert_invalid',
  AssertMalformed = 'assert_malformed',
  AssertReturn = 'assert_return',
  AssertTrap = 'assert_trap',
  AssertUnlinkable = 'assert_unlinkable',
  Bin = 'bin',
  Item = 'item',
  Data = 'data',
  Declare = 'declare',
  Delegate = 'delegate',
  Do = 'do',
  Either = 'either',
  Elem = 'elem',
  Eof = 'EOF',
  Tag = 'tag',
  Export = 'export',
  Field = 'field',
  Get = 'get',
  Global = 'global',
  Import = 'import',
  Invoke = 'invoke',
  Input = 'input',
  Local = 'local',
  Lpar = '(',
  Memory = 'memory',
  Module = 'module',
  Mut = 'mut',
  NanArithmetic = 'nan:arithmetic',
  NanCanonical = 'nan:canonical',
  Offset = 'offset',
  Output = 'output',
  Param = 'param',
  Ref = 'ref',
  Quote = 'quote',
  Register = 'register',
  Result = 'result',
  Rpar = ')',
  Shared = 'shared',
  Start = 'start',
  Struct = 'struct',
  Table = 'table',
  Then = 'then',
  Type = 'type',
  I8X16 = 'i8x16',
  I16X8 = 'i16x8',
  I32X4 = 'i32x4',
  I64X2 = 'i64x2',
  F32X4 = 'f32x4',
  F64X2 = 'f64x2',
  First_Bare = 'Invalid',
  Last_Bare = 'F64X2',
  Float = 'FLOAT',
  Int = 'INT',
  Nat = 'NAT',
  First_Literal = 'Float',
  Last_Literal = 'Nat',
  AtomicFence = 'atomic.fence',
  AtomicLoad = 'ATOMIC_LOAD',
  AtomicNotify = 'ATOMIC_NOTIFY',
  AtomicRmw = 'ATOMIC_RMW',
  AtomicRmwCmpxchg = 'ATOMIC_RMW_CMPXCHG',
  AtomicStore = 'ATOMIC_STORE',
  AtomicWait = 'ATOMIC_WAIT',
  Binary = 'BINARY',
  Block = 'block',
  Br = 'br',
  BrIf = 'br_if',
  BrTable = 'br_table',
  Call = 'call',
  CallIndirect = 'call_indirect',
  CallRef = 'call_ref',
  Catch = 'catch',
  CatchAll = 'catch_all',
  Compare = 'COMPARE',
  Const = 'CONST',
  Convert = 'CONVERT',
  DataDrop = 'data.drop',
  Drop = 'drop',
  ElemDrop = 'elem.drop',
  Else = 'else',
  End = 'end',
  GlobalGet = 'global.get',
  GlobalSet = 'global.set',
  If = 'if',
  Load = 'LOAD',
  LocalGet = 'local.get',
  LocalSet = 'local.set',
  LocalTee = 'local.tee',
  Loop = 'loop',
  MemoryCopy = 'memory.copy',
  MemoryFill = 'memory.fill',
  MemoryGrow = 'memory.grow',
  MemoryInit = 'memory.init',
  MemorySize = 'memory.size',
  Nop = 'nop',
  RefExtern = 'ref.extern',
  RefFunc = 'ref.func',
  RefIsNull = 'ref.is_null',
  RefNull = 'ref.null',
  Rethrow = 'rethrow',
  ReturnCallIndirect = 'return_call_indirect',
  ReturnCall = 'return_call',
  Return = 'return',
  Select = 'select',
  SimdLaneOp = 'SIMDLANEOP',
  SimdLoadSplat = 'SIMDLOADSPLAT',
  SimdLoadLane = 'SIMDLOADLANE',
  SimdStoreLane = 'SIMDSTORELANE',
  SimdShuffleOp = 'i8x16.shuffle',
  Store = 'STORE',
  TableCopy = 'table.copy',
  TableFill = 'table.full',
  TableGet = 'table.get',
  TableGrow = 'table.grow',
  TableInit = 'table.init',
  TableSet = 'table.set',
  TableSize = 'table.size',
  Ternary = 'TERNARY',
  Throw = 'throw',
  Try = 'try',
  Unary = 'UNARY',
  Unreachable = 'unreachable',
  First_Opcode = 'AtomicFence',
  Last_Opcode = 'Unreachable',
  AlignEqNat = 'align=',
  LparAnn = 'Annotation',
  OffsetEqNat = 'offset=',
  Reserved = 'Reserved',
  Text = 'TEXT',
  Var = 'VAR',
  First_String = 'AlignEqNat',
  Last_String = 'Var',
  ValueType = 'VALUETYPE',
  First_Type = 'ValueType',
  Last_Type = 'ValueType',
  Func = 'func',
  Extern = 'extern',
  Exn = 'exn',
  First_RefKind = 'Func',
  Last_RefKind = 'Exn',
  First = First_Bare,
  Last = Last_RefKind
}
