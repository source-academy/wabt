/*
MEMORY

DATA
data ::= ('data' id? datastring)
        | ('data' id? memuse ('offset' expr) datastring)

datastring ::= string
memuse = ('memory' memidx)

Abbreviations
(instr) = ('offset' instr)
\eps = (memory 0) (may be omitted)

(module
	(data "Hello")
	(data "Hellod")
	(data "Hellosd")
)

*/


const basic_zero_page_memory = `
(module
	(memory 0)
)
`;

const basic_one_page_memory = `
(module
	(memory 1)
)
`;

const basic_two_page_memory = `
(module
	(memory 1)
)
`;

const basic_init_zero_max_three_page_memory = `
(module
	(memory 0 3)
)
`;

const named_memory = `
(module
	(memory $memory 1)
)
`;

const named_memory_export = `
(module
	(memory $memory 1)
	(export "memory" (memory $memory))
)
`;

const named_memory_function_export = `
(module
	(memory $memory 1)
	(func $func)
	(export "memory" (memory $memory))
	(export "func" (func $func))
)
`;

/*

(module
  (memory $mem 1 5)
  (data $data "hello")
)

(module
  (memory $mem 1 5)
  (data $data (memory 0) (offset i32.const 3) "hello")
)

(module
  (memory $mem 1 5)
  (data $data (memory $mem) (offset i32.const 3) "hello")
)

(module
  (memory $mem 1 5)
  (data $data (offset i32.const 3) "hello")
)

(module
  (memory $mem 1 5)
  (data $data (i32.const 3) "hello")
)

*/

const i32store_instruction_stack = `
(module
	(memory 1)

  (func
  	i32.const 1
  	i32.const 2
    i32.store
  )
)
`;

const i32store_instruction_sexpr = `
(module
	(memory 1)
  (func
    (i32.store (i32.const 2) (i32.const 1))
  )
)
`;

const i64store = `
(module
	(memory 1)

  (func
  	i32.const 4
  	i64.const 3
    i64.store
  )
)
`;

const f32store = `
(module
	(memory 1)

  (func
  	i32.const 4
  	f32.const 3
    f32.store
  )
)
`;

const f64store = `
(module
	(memory 1)

  (func
  	i32.const 4
  	f64.const 3
    f64.store
  )
)
`;

const i32store8 = `
(module
	(memory 1)

  (func
  	i32.const 4
  	i32.const 3
    i32.store8
  )
)
`;

const i32store16 = `
(module(module
	(memory
	(data "Hello")	
)
)
  )
)
`;

const i64store8 = `
(module
	(memory 1)

  (func
  	i32.const 4
  	i64.const 3
    i64.store8
  )
)
`;

const i64store16 = `
(module
	(memory 1)

  (func
  	i32.const 4
  	i64.const 3
    i64.store16
  )
)
`;

const i64store32 = `
(module
	(memory 1)

  (func
  	i32.const 4
  	i64.const 3
    i64.store32
  )
)
`;

const i32load_instruction_stack = `
(module
	(memory 1)
	(func (result i32)
	  i32.const 0
	  i32.load
	)
)
`;

const i32load_instruction_sexpr = `
(module
	(memory 1)
	(func (result i32)
	  (i32.load (i32.const 0))
	)
)
`;

const i64load = `
(module
	(memory 1)

  (func
    i32.const 0
    i64.load
    drop
  )
)`;

const f32load = `
(module
	(memory 1)

  (func
    i32.const 0
    f32.load
    drop
  )
)`;

const f64load = `
(module
	(memory 1)

  (func
    i32.const 0
    i64.load
    drop
  )
)
`;

const i32load8_s = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i32.load8_s
		drop
	)
)`;

const i32load8_u = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i32.load8_u
		drop
	)
)`;

const i32load16_s = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i32.load16_s
		drop
	)
)`;

const i32load16_u = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i32.load16_u
		drop
	)
)`;

const i64load8_s = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i64.load8_s
		drop
	)
)`;

const i64load8_u = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i64.load8_u
		drop
	)
)`;

const i64load16_s = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i64.load16_s
		drop
	)
)`;

const i64load16_u = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i64.load16_u
		drop
	)
)`;

const i64load32_s = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i64.load32_s
		drop
	)
)`;

const i64load32_u = `
(module 
	(memory 1)
	(func 
		i32.const 0
		i64.load32_u
		drop
	)
)`;


const grow_instruction_stack = `
(module
	(memory 1 2)
	(func (result i32)
	  i32.const 1
		memory.grow
	)
)
`;

const grow_instruction_sexpr = `
(module
	(memory 1 2)
	(func (result i32)
		memory.grow (i32.const 1)
	)
)
`;

const size_instruction = `
(module
	(memory 1)
	(func (result i32)
		memory.size
	)
)
`;

/*
(module
  	(memory
  	(data "Hello")
  )
)
*/


export const positiveTestCases = [
  basic_zero_page_memory,
  basic_one_page_memory,
  basic_two_page_memory,
  basic_init_zero_max_three_page_memory,
  named_memory,
  named_memory_export,
  named_memory_function_export,
  i32store_instruction_stack,
  i32store_instruction_sexpr,
  i64store,
  f32store,
  f64store,
  i32store8,
  i32store16,
  i64store8,
  i64store16,
  i64store32,
  i32load_instruction_stack,
  i32load_instruction_sexpr,
  i64load,
  f32load,
  f64load,
  i32load8_s,
  i32load8_u,
  i32load16_s,
  i32load16_u,
  i64load8_s,
  i64load8_u,
  i64load16_s,
  i64load16_u,
  i64load32_s,
  i64load32_u,
  grow_instruction_stack,
  grow_instruction_sexpr,
  size_instruction,
];

const invalid_two_memory_block = `
(module
	(memory 1)
	(memory 1)
)
`;

const invalid_max_lower_than_init_block = `
(module
	(memory 3 2)
)
`;

export const negativeTestCases = [
  invalid_two_memory_block,
  invalid_max_lower_than_init_block,
];
