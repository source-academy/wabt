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

const store_instruction_stack = `
(module
	(memory 1)

  (func
  	i32.const 1
  	i32.const 2
    i32.store
  )
)
`;

const store_instruction_sexpr = `
(module
	(memory 1)
  (func
    (i32.store (i32.const 2) (i32.const 1))
  )
)
`;

const load_instruction_stack = `
(module
	(memory 1)
	(func (result i32)
	  i32.const 0
	  i32.load
	)
)
`;

const load_instruction_sexpr = `
(module
	(memory 1)
	(func (result i32)
	  (i32.load (i32.const 0))
	)
)
`;

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

Store:
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Store
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Load
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Grow
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Size
*/

export const positiveTestCases = [
  basic_zero_page_memory,
  basic_one_page_memory,
  basic_two_page_memory,
  basic_init_zero_max_three_page_memory,
  named_memory,
  named_memory_export,
	 named_memory_function_export,
//   store_instruction_stack,
//   store_instruction_sexpr,
//   load_instruction_stack,
//   load_instruction_sexpr,
//   grow_instruction_stack,
//   grow_instruction_sexpr,
//   size_instruction,
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
