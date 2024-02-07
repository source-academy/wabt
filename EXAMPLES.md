# WebAssembly Text by Examples

This document contains a number of examples of WebAssembly Binary Text syntax. It is intended to be used as a reference for you to hopefully learn to write your own WebAssembly Text program.

This document covers the 'gist' of how to write Webssembly Text programs. For a more detailed reference of the various instructions available, please refer to the [Mozilla WebAssembly instruction reference](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference).

## Modules

Everything in WebAssembly is a module.

The smallest WebAssembly program is:

```wasm
(module)
``` 

To run it in Source Academy,
```js
import {
wcompile,
wrun
} from 'wasm';

// WebAssembly module
const program = 
`
;; an empty module. Single-line comments start with ';;'
(;
  multi-line comments starts with (; and end with ;).
  Multi-line comments can be nested.
;)

;; This module does nothing and wastes some memory space.
(module)
`;

const binary = wcompile(program);

// Run wasm module.
// We provide a linked list of imports (null since no imports), and 
// retrieve another linked list of exports (undefined since no exports).
const exports = wrun(binary, null);
```

## Writing Functions
Now that we have created a module, we can write some functions in it (and actually make it do something).

Here is a module with a function to add two numbers. Note that in all our examples, we will always use `f64` for numbers (since that is what JavaScript uses), but the other data types are `i32`, `i64` or `f32`.

```wasm
(module
  ;; Declare a function with name $add that takes in two f64 parameters and returns a f64.
  (func $add (param f64 f64) (result f64)
    ;; push the first and second parameters onto the tack
    local.get 0
    local.get 1
    ;; consume the two values on the stack and add them together
    i32.add
  )
)

;; Alternatively, this function can be written in the form of S-expressions.
(module
  ;; This time, we name the local parameters, which allow us to get them by name.
  (func $add_2 (param $first f64) (param $second f64) (result f64)
    (i32.add 
      ;; The brackets are important here, since each (local.get x) is one operand.
      (local.get $first)
      (local.get $second)
    )
  )
)
```

We now have a two functions to add two numbers! Though, we have no way of calling them yet. To call them, we need to export them.

There is also a mechanism called a 'start function' that automatically calls when the module is loaded (think of `int main()` in some langauges), but we will not be using them since it is rather difficult to get their return values or any information in the Source Academy environment.

### Calling, Importing and Exporting Functions
This section will cover how to import and export functions.

```wasm
(module
  (;
    Import a function.
    This function is imported with the name "log" from the module "console".
    The function has a name $log.
    The function takes in a single parameter of type f64.
  ;)
  (import "console" "log" (func $log (param f64)))

  ;; Export a function with name 'logIt'
  (func (export "logIt") (param f64)
    ;; Push the first parameter onto the stack.
    local.get 0
    ;; Call the "log" function with the values on stack.
    call $log
  )
)
```

To run it in Source Academy, do:
  
```js
import {
  wcompile,
  wrun
} from 'wasm';

const program = 
`
(module
  (import "console" "log" (func $log (param f64)))
  (func (export "logIt") (param f64)
    local.get 0
    call $log
  ))
`;

const binary = wcompile(program);

/*
When running the module, we provide a linked list of imports.

The linked list is of the form:
  list(
    list("module_name", "function_name", function),
    list("module_name", "function_name", function),
    ...
  )

After running the module, we get a linked list of exports.

The linked list is of the form:
  list(
    "function_name", function,
    "function_name", function,
    ...
  )
*/
const exports = wrun(binary, 
    list(
        list("console", "log", display)
        )
);

display(exports);

head(tail(exports))(26);
// This line displays 26 to the Source Academy console.
```

### Local Variables

Local variables have to be declared at the start of a function. They are declared with the `local` keyword (simipar to `param` and `result`), and can be given a name. The name is optional, but it is also recommended to give them names so that they can be accessed by name.

```wasm
(func $add (param f64 f64) (result f64) (local $loc f64)
  local.get 0
  local.get 1
  i32.add

  ;; Store the result of the addition in the local variable.
  ;; We can refer to the local variable by name.
  local.set $loc 

  ;; Push the local variable onto the stack.
  ;; We can also refer to the local variable by index
  ;; (local variables are indexed after parameters)
  local.get 2

  ;; Store the value at the top of the stack into the local variable.
  ;; However, this does not remove the value from the stack.
  local.tee $loc
)
```

### Arrays
It is with a heavy heart that I must inform you that WebAssembly does not support arrays (though, I suggest you can use multiple variables as a workaround). However, it does support memories, which is essentially one long global array (covered later).

### Control Flow

There are many control instructions.

```wasm
(module
  (func $main

    ;; no operation
    nop

    ;; issues a TRAP (stops execution). This is useful for debugging.
    unreachable

    ;; exits function
    return

    ;; These are instructions covered in the next section.
    (block $label
      (block
        (loop

          ;; branch to a label
          ;; this has different behaviour depending on the label.
          ;; When branching to a block or if/else statement, jumps to end of block.
          ;; When branchign to a loop, jumps to start of loop.
          br $label

          ;; branch to 2nd nested parent label from current block.
          br_if 2
        )
      )
    )
  )
)
```

#### Block Statements
A block statement is a sequence of instructions that can be branched to. It is declared with the `block` keyword. A branch (`br`) instruction jumps to the end of the block.

```wasm
(module
  (func $main
    ;; This is a block of code.
    (block $block_name
      ;; Break out of the current block.
      br

      ;; Break out of the block called $block_name.
      ;; Useful for nested blocks.
      br $block_name
    )
  )
)
```

Blocks can also ahve type annotations, similar to functions.

```wasm
(module
  (func $main (result f32)
    i32.const 0
    ;; This is a block of code.
    ;; When we enter this block, there is an i32 value on the stack.
    ;; When we exit this block, there is an f64 value on the stack.
    (block $block_name (param i32) (result f32)
      ;; Reinterpret bytes of i32 as f32.
      f32.reinterpret_i32
    )
  )
)
```

#### If-Else Statements 
If-else statements are declared with the `if` keyword. They are similar to block statements, but they have a condition that determines whether to execute the block or not.

```wasm
(module
  (func $main (result i32)
    ;; change to positive number (true) if you want to run the if block
    i32.const 0 
    (if (result i32)
      (then
        i32.const 1
      )
      (else
        i32.const 0
      )
    )
  )
)
```

#### Loops
Loops are declared with the `loop` keyword. They are similar to block statements, but the branch (`br`) command jumps to the start of the loop. The loop does not repeat on its own.

```wasm
(module
  (func $main
    (loop $my_loop
      // Set to 0 to disable the loop.
      i32.const 1
      // repeat the loop by checking the first value on the stack.
      br_if 0
    )
  )
)
```

### Globals

Globals are variables that live in the global scope of the module. They are declared with the `global` keyword. Each global variable has a type, and can be marked mutable or immutable.

Global variables can be accessed with the `global.get` and `global.set` instructions.

```wasm
(module
  ;; Declare a global variable with name $my_global.
  ;; The global variable is of type f64.
  ;; The global variable is mutable.
  (global $my_global (mut f64) (f64.const 0))

  ;; Declare a global variable with name $my_global_2.
  ;; The global variable is of type f64.
  ;; The global variable is immutable.
  (global $my_global_2 f64 (f64.const 0))

  (func $use_globals
    ;; Get the value of the global variable $my_global and push it onto the stack.
    global.get $my_global

    ;; drop value on stack
    drop

    ;; push 10 onto the stack
    f64.const 10

    ;; Set the value of the global variable $my_global.
    ;; Alternatively, you can use the variable index.
    ;;  global.set 0
    global.set $my_global

    ;; Get the value of the global variable $my_global_2 and push it onto the stack.
    global.get $my_global_2

    ;; Set the value of the global variable $my_global_2.
    ;; This will cause a compilation error since $my_global_2 is immutable.
    global.set $my_global_2
  )
)
```

### Tables & Element Segments

Tables are arrays of references (functions, or external references). They are declared with the `table` keyword. Each table is declared with a minimum number of elements, and an optional maximum number of elements.

On the other hand, elements are declared with the `elem` keyword. Each element segment is declared with a table index, and a list of references to put into the table. Think of elements as a way to initialize the table.

#### Basic Table Declaration
```wasm
(module
  ;; Declare a table of functions with a minimum of 1 elements.
  (table 1 funcref)

  ;; Declare a table of functions with a minimum of 1 elements and a maximum of 2 elements.
  (table $tb 1 2 funcref)

  ;; Declare a table of external references with a minimum of 2 element and no maximum.
  (table 2 externref)
)
```

#### Passive Element Declaration
A passive element segment is an element segment that does not do anything at initialisation.
```wasm
(module
  ;; Declare an element segment with four functions inside.
  (elem funcref
    (item ref.func $two)
    (item ref.func $three)
    ;; You can also omit the 'item'
    (ref.func 0)
    (ref.func $one)
  )

  (func $one)
  (func $two)
  (func $three)
)
```

#### Active Element Declaration
There are three ways to declare the element segment of a table.
- Passive: The element segment is declared in the module, but is not used.
- Active: The element segment is declared in the module, and is used to initialize the table when the module is loaded.
- Declarative: The element segment is not declared in the module, but is declared in the host environment (e.g. JavaScript).

Since the last method will not be used in Source Academy, we will not cover it here. 

Here is an active element segment declaration:
```wasm
(module
  ;; table declaration
  (table 1 funcref)
  ;; Element declaration
  (elem funcref
    ;; Mark this element segment as active:
    ;;   Initialise table at index 0.
    ;;   Populate table with offset 0 (start at 0).
    (table 0)
    (offset (i32.const 0))

    (ref.func $two)
    (ref.func $three)
    (ref.func 0)
    (ref.func $one)
  )

  (func $one)
  (func $two)
  (func $three)
)
```

Here are some abbreviations of the same declaration:
```wasm
...
  ;; table declaration
  (table 1 funcref)
  ;; Element declaration
  (elem funcref
    (table 0)
    ;; The offset clause may be omitted
    (i32.const 0)
...


...
  ;; table declaration
  (table 1 funcref)
  ;; Element declaration
  (elem funcref
    ;; We can omit the table declaration, and this defaults to table index 0.
    ;; (table 0) - commented out
    (offset i32.const 0)
...
```

Lastly, we can also declare an element segment *inline* inside a table declaration.

When using an inline active element, the element declaration is nested inside the table declaration. Furthermore, the table size is omitted (follows number of elements) and the element type is omitted (follows table type).
```wasm
(module
  ;; table declaration
  (table funcref
    ;; Inline element declaration.
    ;; Notice that this is nested in the table declaration.
    (elem
      (ref.func $two)
      (ref.func $three)
      (ref.func 0)
      (ref.func $one)
    )
  )

  (func $one)
  (func $two)
  (func $three)
)
```

#### Table and Element Instructions

Note that all indices are of type `i32`.

Every instruction below also have their own S-expression variants, but the reader should be familiar enough at this point to be able to figure them out on their own.

```wasm
(module
  ;; table and element declaration
  (table $table funcref
    (elem
      (ref.func $two)
      (ref.func $three)
      (ref.func 0)
      (ref.func $one)
    )
  )

  ;; Another table with initial capacity 4
  (table $table2 4 funcref)

  ;; A passive element segment
  (elem $passive_elem funcref
    (ref.func $one)
    (ref.func $two)
  )
  
  ;; Some functions to populate table and element segments
  (func $one)
  (func $two)
  (func $three)



  (func $main
  
  ;; Get first item of table
  i32.const 0
  table.get $table

  drop ;; drop item on stack

  ;; Set second item of table to function $two
  i32.const 1
  ref.func $two
  table.set $table

  ;; Get size of table and push it onto the stack (type i32)
  table.size $table

  drop ;; drop item on stack

  ;; Grow size of table by 4
  ;; For new entries, initialise them with function $two
  ;; This pushes the previous size of the table onto the stack (or -1 if failure)
  ref.func $two
  i32.const 4
  table.grow $table

  drop ;; drop item on stack

  ;; Fill indices 1 to 4 with function $one.
  i32.const 1
  ref.func $one
  i32.const 4
  table.fill $table

  ;; Copy elements from table $table to table $table2.
  ;; Destination: index 0 of table2
  ;; Source: index 1-3 of table
  i32.const 0
  i32.const 1
  i32.const 3
  table.copy $table $table2

  ;; Initialise the contents of a table with a passive element segment
  ;; Destination: index 0 of table
  ;; Source: index 1-3 of element segment
  i32.const 0
  i32.const 1
  i32.const 3
  table.init $table2 $passive_elem

  ;; Drop the passive element segment
  ;; After this, element section cannot be used anymore.
  ;; Meant to be used as an optimisation hint.
  elem.drop $passive_elem
  
  )
)
```

### Imports

Imported functions can be used by the module. They are declared with the `import` keyword. Each import has a module name, a function name, and a function type.

```wasm
(module
  ;; Import a function with name $log from the module "console".
  ;; The function has a name $log.
  ;; The function takes in a single parameter of type f64.
  (import "console" "log" (func $log (param f64)))

  (func $main
    ;; push the first parameter onto the stack.
    local.get 0
    ;; call the "log" function with the values on stack.
    call $log
  )
)
```

### Exports

Exported functions can be used by the host environment. They are declared with the `export` keyword. Each export has a function name, and a function type.

```wasm
(module
  ;; Declare a function with name $add that takes in two f64 parameters and returns a f64.
  (func $add (param f64 f64) (result f64)
    ;; push the first and second parameters onto the tack
    local.get 0
    local.get 1
    ;; consume the two values on the stack and add them together
    i32.add

```

### Memory Segments

Memory is a linear array of bytes. Think of it as the 'heap' memory of the module. It is declared with the `memory` keyword. 

Each memory segment is declared with a minimum number of pages, and an optional maximum number of pages. Eash WebAssembly page is 65,536 bytes.

Note that you can only declare one memory segment in each module.

All memory load and store instructions take in two arguments: an index and an optional bit alignment. The index is the index of the memory segment to access. The bit alignment is the number of bits to align the memory access to. For example, if the bit alignment is 2^3, then the memory access will be aligned to 8 bits (1 byte).

```wasm
(module
  ;; Declare a memory segment with a minimum of 1 page and a maximum of 2 pages.
  (memory 1 2)

  ;; Declare a memory segment with a minimum of 1 page and no maximum.
  (memory 1)

  (func $main
    ;; Grow memory size by 1 page
    (memory.grow (i32.const 1))
    ;; Alternative stack-based syntax
    i32.const 1
    memory.grow

    ;; Get current memory size
    memory.size
    drop

    ;; Get f64 at index 0
    f64.load
    drop

    ;; Get f64 at index 1
    (f64.load (i32.const 1))
    drop

    ;; Get f64 at index 1 with bit alignment 2^3
    (f64.load (i32.const 1) (i32.const 3))
    drop

    ;; Store f64 constant 1 at index 0
    f64.const 0 ;; index
    f64.const 1 ;; number to store
    f64.store

  )
)
```
