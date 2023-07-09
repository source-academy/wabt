// COMPARISON OPERATORS
namespace Comparison {
  export const eqOperator: string = `
(module
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.eq
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.eq
  )
  (func (result i32)
    f32.const 1.6
    f32.const 1.6
    f32.eq
  )
  (func (result i32)
    f64.const 0
    f64.const 0
    f64.eq
  )
)
`;

  export const neOperator: string = `
(module
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.ne
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.ne
  )
  (func (result i32)
    f32.const 0
    f32.const 0
    f32.ne
  )
  (func (result i32)
    f64.const 0
    f64.const 0
    f64.ne
  ) 
)
`;
  export const gtOperators: string = `
  (module
    (func (result i32)
      i64.const 0
      i64.const 0
      i64.gt_s
    )
    (func (result i32)
      i32.const 0
      i32.const 0
      i32.gt_u
    )
    (func (result i32)
      i64.const 0
      i64.const 0
      i64.gt_u
    )
    (func (result i32)
      i32.const 0
      i32.const 0
      i32.gt_s
    )
    (func (result i32)
      f32.const 0
      f32.const 0
      f32.gt
    )
    (func (result i32)
      f64.const 0
      f64.const 0
      f64.gt
    )
  )
`;
  export const ltOperators = `
(module
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.lt_u
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.lt_u
  )
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.lt_s
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.lt_s
  )
  (func (result i32)
    f32.const 0
    f32.const 0
    f32.lt
  )
  (func (result i32)
    f64.const 0
    f64.const 0
    f64.lt
  )
)`;

  export const geOperators = `
(module
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.ge_u
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.ge_u
  )
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.ge_s
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.ge_s
  )
  (func (result i32)
    f32.const 0
    f32.const 0
    f32.ge
  )
  (func (result i32)
    f64.const 0
    f64.const 0
    f64.ge
  )
)`;

  export const leOperators = `
(module
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.le_u
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.le_u
  )
  (func (result i32)
    i32.const 0
    i32.const 0
    i32.le_s
  )
  (func (result i32)
    i64.const 0
    i64.const 0
    i64.le_s
  )
  (func (result i32)
    f32.const 0
    f32.const 0
    f32.le
  )
  (func (result i32)
    f64.const 0
    f64.const 0
    f64.le
  )
)`;
}

namespace Conversion {
  export const i64_extend_i32_s = `
  (module
    (func $main (result i64)
      i32.const 10
      i64.extend_i32_s
    )
  )
  `;
  export const i64_extend_i32_u = `
  (module
    (func $main (result i64)
      i32.const 10
      i64.extend_i32_u
    )
  )
  `;
  export const i32_wrap_i64 = `(module
    (func $main (result i32)
      i64.const 10
      i32.wrap_i64
    )
  )
  `;
  export const f64_promote_f32 = `
  (module
    (func $main (result f64)
      f32.const 10
      f64.promote_f32
    )
  )
  `;
  export const f32_demote_f64 = `
  (module
    (func $main (result f32)
      f64.const 10.5
      f32.demote_f64
    )
  )
  `;
  export const f32_convert_i32_s = `
  (module
    (func $main (result f32)
      i32.const 10
      f32.convert_i32_s
    )
  )
  `;
  export const f32_convert_i32_u = `
  (module
    (func $main (result f32)
      i32.const 10
      f32.convert_i32_u
    )
  )
  `;
  export const f32_convert_i64_s = `
  (module
    (func $main (result f32)
      i64.const 10
      f32.convert_i64_s
    )
  )
  `;
  export const f32_convert_i64_u = `
  (module
    (func $main (result f32)
      i64.const 10
      f32.convert_i64_u
    )
  )
  `;
  export const f64_convert_i32_s = `
  (module
    (func $main (result f64)
      i32.const 10
      f64.convert_i32_s
    )
  )
  `;
  export const f64_convert_i32_u = `
  (module
    (func $main (result f64)
      i32.const 10
      f64.convert_i32_u
    )
  )
  `;
  export const f64_convert_i64_s = `
  (module
    (func $main (result f64)
      i64.const 10
      f64.convert_i64_s
    )
  )
  `;
  export const f64_convert_i64_u = `
  (module
    (func $main (result f64)
      i64.const 10
      f64.convert_i64_u
    )
  )
  `;
  export const i32_trunc_f32_s = `
  (module
    (func $main (result i32)
      f32.const 10
      i32.trunc_f32_s
    )
  )
  `;
  export const i32_trunc_f32_u = `
  (module
    (func $main (result i32)
      f32.const 10
      i32.trunc_f32_u
    )
  )
  `;
  export const i32_trunc_f64_s = `
  (module
    (func $main (result i32)
      f64.const 10
      i32.trunc_f64_s
    )
  )
  `;
  export const i32_trunc_f64_u = `
  (module
    (func $main (result i32)
      f64.const 10
      i32.trunc_f64_u
    )
  )
  `;
  export const i64_trunc_f32_s = `
  (module
    (func $main (result i64)
      f32.const 10
      i64.trunc_f32_s
    )
  )
  `;
  export const i64_trunc_f32_u = `
  (module
    (func $main (result i64)
      f32.const 10
      i64.trunc_f32_u
    )
  )
  `;
  export const i64_trunc_f64_s = `
  (module
    (func $main (result i64)
      f64.const 10
      i64.trunc_f64_s
    )
  )
  `;
  export const i64_trunc_f64_u = `
  (module
    (func $main (result i64)
      f64.const 10
      i64.trunc_f64_u
    )
  )
  `;
  export const i32_reinterpret_f32 = `
  (module
    (func $main (result i32)
      f32.const 10
      i32.reinterpret_f32
    )
  )
  `;
  export const i64_reinterpret_f64 = `
  (module
    (func $main (result i64)
      f64.const 10
      i64.reinterpret_f64
    )
  )
  `;
  export const f32_reinterpret_i32 = `
  (module
    (func $main (result i32)
      f32.const 10
      f32.reinterpret_i32
    )
  )
  `;
  export const f64_reinterpret_i64 = `
  (module
    (func $main (result f64)
      i64.const 10
      f64.reinterpret_i64
    )
  )
  `;
}
namespace FloatingPoint {
  // Skipped: https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Numeric
}
namespace Bitwise {
  // Skipped: https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Numeric
}

export const positiveTestCases = [
  Comparison.eqOperator,
  Comparison.neOperator,
  Comparison.gtOperators,
  Comparison.ltOperators,
  Comparison.geOperators,
  Comparison.leOperators,
];
