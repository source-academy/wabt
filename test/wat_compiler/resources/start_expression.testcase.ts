/*
(module
  (start $a)
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
)

(module
  (start $b)
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
)

(module
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
  (start $a)
)

(module
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
  (start $e)
)


(module
  (start 0)
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
)

(module
  (start 4)
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
)

(module
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
  (start 0)
)

(module
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
  (start 4)
)


*/


/*
Negative test cases:
(module
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
  (start $f)
)

(module
  (func $a)
  (func $b)
  (func $c)
  (func $d)
  (func $e)
  (start 6)
)
*/
