/**
 * Test cases for control instructions.
 * Instructions are:
 *  instr ::= . . .
 *  | nop
 *  | unreachable
 *  | block blocktype instr * end
 *  | loop blocktype instr * end
 *  | if blocktype instr * else instr * end
 *  | br labelidx
 *  | br_if labelidx
 *  | br_table vec(labelidx ) labelidx
 *  | return
 *  | call funcidx
 *  | call_indirect tableidx typeidx
 */

const nop_operation = '(module (func nop) )';
const unreachable_operation = '(module (func unreachable) )';
const block_statment = `
(module
    (func
        (block $my_block
            nop
        )
    )    
)
`;

const empty_explicit_block = `
(module
    (func 
      (block (param) (result)
          
      )
    )
  )
`;

const block_one_param = `
(module
  (func (result i32)
    i32.const 0
    (block (param i32) (result i32)
    )
  )
)
`;

// Note: same type as function
const block_one_result = `
(module
  (func
    (block (param) (result i32)
      i32.const 0    	
    )
    drop
  )
)
`;

const block_multiple_result = `
(module
    (func
        i32.const 1
        (block (param i32) (result i32 i32)
            i32.const 0
        )
        drop
        drop
    )
)
`;

const break_with_index_0 = `
(module
  (func
    (block
    	br 0
    )
  )
)
`;

const break_with_index_1 = `
(module
  (func
    (block
      (block
        br 1
      )
    )
  )
)
`;

const break_with_name_1 = `
(module
  (func
    (block $one
      (block $two
        br $one
      )
    )
  )
  (func
    (block $one
      (block $two
        br $two
      )
    )
  )
)`;

const return_operation = `
(module
  (func (result i32)
    i32.const 10
    i32.const 90
    return
  )
)
`;

const select_simple = `
(module
  (func $select_simple (result i32)
    i32.const 10
    i32.const 20
    i32.const 0
    select
  )
)
`;

const select_simple_alt_syntax = `
(module
  (func $select_simple (result i32)
    i32.const 10
    i32.const 20
    i32.const 0
    select (result i32)
  )
)
`;

const select_externref = `
(module  
  (func $select_externref (param $value externref) (param $condition i32) (result externref)
    ;; this is "select t", the explicitly typed variant
    ref.null extern
    local.get $value
    local.get $condition
    select (result externref)
  )
)
`;

const basic_if_then = `
(module
  (func
    i32.const 0
    (if
      (then
        i32.const 1
        drop
      )
    )
  )
)
`;

const basic_if_else = `
(module
  (func
    i32.const 0
    (if
      (then
        i32.const 1
        drop
      )
      (else
        i32.const 0
        drop
      )
    )
  )
)
`;

const if_else_with_single_result = `
(module
  (func (result i32 i32)
    i32.const 0
    (if (result i32)
      (then
        i32.const 1
      )
      (else
        i32.const 0
      )
    )
  i32.const 1
  )
)
`;

const if_else_with_single_param_result = `
(module
  (func (result i32 i32)
    i32.const 0
    i32.const 0
    i32.const 0
    (if (param i32) (result i32)
      (then
        i32.const 1
        drop
      )
      (else
        i32.const 0
        drop
      )
    )
  )
)
`;

const nested_loop_break_outer = `
(module
  (func
  	(loop $outer
      (loop $inner
      	br $outer
      )
    )
  )
)`;
const nested_loop_break_inner = `
(module
  (func
  	(loop $outer
      (loop $inner
      	br $inner
      )
    )
  )
)`;
/*

(module
  (func
  	(loop $outer
      (loop $inner
      	i32.const 0
        br_if $outer
      )
    )
  )
)

(module
  (func
  	(loop $outer
      (loop $inner
      	i32.const 0
        br_if $inner
      )
    )
  )
)

(module
  (func (result i32 i32)
  	(loop (result i32)
      	i32.const 0
      (loop (param i32) (result i32)
      )
    )
    i32.const 1
  )
)
*/

export const positiveControlTestCases = [
  nop_operation,
  unreachable_operation,
  block_statment,
  empty_explicit_block,
  block_one_param,
  block_one_result,
  block_multiple_result,
  break_with_index_0,
  break_with_index_1,
  break_with_name_1,
  return_operation,
  select_simple,
  select_simple_alt_syntax,
  select_externref,
  basic_if_then,
  basic_if_else,
  if_else_with_single_result,
  if_else_with_single_param_result,
  // nested_loop_break_outer,
  // nested_loop_break_inner,
];
