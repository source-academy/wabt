export declare enum ValueType {
    I32 = 0,
    I64 = 1,
    F32 = 2,
    F64 = 3,
    V128 = 4,
    I8 = 5,
    I16 = 6,
    FuncRef = 7,
    ExternRef = 8,
    Reference = 9,
    Func = 10,
    Struct = 11,
    Array = 12,
    Void = 13,
    ___ = 14,
    Any = 15,
    I8U = 16,
    I16U = 17,
    I32U = 18
}
export declare namespace ValueType {
    function getValue(t: ValueType): number;
}
