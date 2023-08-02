const ref_null_func = `
(module
  (func (result funcref)
  	ref.null func
  )
)
`;
const ref_null_extern = `
(module
  (func (result externref)
  	ref.null extern
  )
)
`;
const ref_is_null = `
(module
  (func (result i32)
  	ref.null extern
    ref.is_null
  )
)
`;

export const positiveTestCases = [
  ref_null_func,
  ref_null_extern,
  ref_is_null,
];
