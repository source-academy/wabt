# WebAssembly Binary Text Examples

This document contains a number of examples of WebAssembly Binary Text syntax. It is intended to be used as a reference for you to hopefully write your own WebAssembly Binary Text program.

## Modules

Everything in WebAssembly is a module.

The smallest WebAssembly program is:

```wabt
(module)
```

## Sections

Modules are made up of sections.

## Function Segments

Function segments are functions. Each segment corresponds to one function.

For all numeric instructions (operations), see [here](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Numeric)
For all control flow instructions, see [here](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Control_flow)
For all variable instructions, see [here](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Variables)

### Simple Function
Here is a function that adds two numbers:
```wabt
(module
  (func $add (export "add") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
)
```

Note that WASM is a stack machine, so we use the `local.get` instruction to get the first and second parameters off the stack. Then we use the `i32.add` instruction to add them together. Alternatively, to write this function in the form of S-expressions, you can write:

```wabt
(module
  (func $add (export "add") (param i32 i32) (result i32)
    (i32.add (local.get 0) (local.get 1)))
)
```


### Functions with Local Variables
Local variables can be declared at the top of the function. Here is an example of a function with local variables.

```wabt
(module

    ;; This function (named $func) has two parameters (both f64) and two local variables (both f64).
    (func $func (param f64) (param f64) (result f64) (local f64) (local f64)
        ...
    )

    ;; Or, in a more condensed form,
    (func (param f64 f64) (result f64) (local f64 f64)
        
        local.get 0 ;; This refers to the first f64 parameter.
        local.get 3 ;; This refers to the first f64 local variable.
    )

    ;; To name parameters,
    (func (param $param f64) (result f64 f64) (local $local)
        local.get $param
        local.get $local
    )
)


(module
)
```

### Factorial Function

Here is an example factorial function:
```wabt
(module
  (func $fac (export "fac") (param f64) (result f64)
    local.get 0
    f64.const 1
    f64.lt
    if (result f64)
      f64.const 1
    else
      local.get 0
      local.get 0
      f64.const 1
      f64.sub
      ;; Call function recursively with values on stack
      call $fac
      f64.mul
    end)
)
```

#### Start Function

The *start* function is the entry point of the module (i.e. the function that is called when the module is loaded). In WebAssembly, you actually don't need a main function (since you can call functions directly from JavaScript if you need to).


### Tables & Element Segments
### Memories Segments
### Globals
### Imports
### Exports


