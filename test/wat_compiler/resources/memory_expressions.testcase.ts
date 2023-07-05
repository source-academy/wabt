/*
Positive test cases:
(module
 (memory 0)
)

(module
 (memory 1)
)

(module
 (memory 2)
)

(module
 (memory 1 1)
)

(module
 (memory 1 5)
)

Store:
(module
	(memory 1)

  (func
  	i32.const 1
  	i32.const 2
    i32.store
  )
)
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Store
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Load
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Grow
https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/Memory/Size

*/

/*
Negative test cases:
max pages >= initial pages
(module
 (memory 2 1)
)

Only one memory block allowed
(module
 (memory 1)
 (memory 1)
)

 */
