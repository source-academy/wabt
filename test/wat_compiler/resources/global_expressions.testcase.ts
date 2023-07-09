/*
(module
  (global $glob i32 (i32.const 0))
)
(module
  (global $glob i64 (i64.const 0))
)
(module
  (global $glob f32 (f32.const 0))
)
(module
  (global $glob f64 (f64.const 0))
)
(module
  (global $glob externref (ref.null extern))
)
(module
  (func $func)
  (global $glob funcref (ref.func $func))
)
(module
  (func $func)
  (global $glob funcref (ref.func 0))
)
*/
