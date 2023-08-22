// const local_set_get = `
// (module
//   (func $main (result i32)
//     (local $var i32)
//     (local.set $var (i32.const 10))
//     local.get $var
//   )
// )
// `;

const local_set_get = `
(module
  (func $main (result i32)
    (local $var i32)
    i32.const 10
    local.set $var
    local.get $var
  )
)
`;

const local_tee = `
(module
  (func $main (result i32)
    (local $var i32)
    (i32.const 10)
    local.tee $var
  )
)
`;

const global_get = `
(module
  (global $one i32 (i32.const 10))
  (global $two i32 (i32.const 10))
  (func $main (result i32)
    global.get $one
    global.get $two
    i32.add
  )
)
`;

const global_set_get = `
(module
  (global $var (mut i32) (i32.const 0))
  (func $main (result i32)
    i32.const 10
    global.set $var
    global.get $var
  )
)
`;

export const positiveTestCases = [
  local_set_get,
  local_tee,
  global_get,
  global_set_get,
];
