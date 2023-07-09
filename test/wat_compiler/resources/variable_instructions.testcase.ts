/*
(module
  (func $main (result i32)
    (local $var i32)
    (local.set $var (i32.const 10))
    local.get $var
  )
)

(module
  (func $main (result i32)
    (local $var i32)
    (i32.const 10)
    local.tee $var
  )
)

(module
  (global $one i32 (i32.const 10))
  (global $two i32 (i32.const 10))
  (func $main (result i32)
    global.get $one
    global.get $two
    i32.add
  )
)

(module
  (global $var (mut i32) (i32.const 0))
  (func $main (result i32)
    i32.const 10
    global.set $var
    global.get $var
  )
)
*/
