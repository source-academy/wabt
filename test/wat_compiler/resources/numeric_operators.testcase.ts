const eqOperator: string = `
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

const neOperator: string = `
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
const gtOperators: string = `
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
const ltOperators = `
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

const geOperators = `
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

const leOperators = `
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

export const positiveTestCases = [
  eqOperator,
  neOperator,
  gtOperators,
  ltOperators,
  geOperators,
  leOperators,
];
