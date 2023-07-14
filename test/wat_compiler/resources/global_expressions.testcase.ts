const i32_global = `
(module
  (global $glob i32 (i32.const 0))
)
`;
const i64_global = `
(module
  (global $glob i64 (i64.const 0))
)
`;
const f32_global = `
(module
  (global $glob f32 (f32.const 0))
)
`;
const f64_global = `
(module
  (global $glob f64 (f64.const 0))
)
`;
const externref_global = `
(module
  (global $glob externref (ref.null extern))
)
`;
const funcref_func_global = `
(module
  (func $func)
  (global $glob funcref (ref.func $func))
)
`;
const funcref_null_global = `
(module
  (func $func)
  (global $glob funcref (ref.func 0))
)
`;

export const positiveTestCases = [
  i32_global,
  i64_global,
  f32_global,
  f64_global,
  externref_global,
  funcref_func_global,
  funcref_null_global,
];
