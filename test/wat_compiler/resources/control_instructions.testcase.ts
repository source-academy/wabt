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
/*


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
];
