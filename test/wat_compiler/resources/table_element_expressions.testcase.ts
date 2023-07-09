/*
Productions:
elem ::=
    ('elem' id? elemlist)
    ('elem' id? ('table tableidx) ('offset' expr) elemlist)
    ('elem' id? 'declare' elemlist)

elemlist ::= reftype elemexpr*
elemexpr ::= ('item' expr)
expr ::= 'ref.is_null' reftype | 'ref.func' funcidx

reftype ::= funcref | externref

Abbreviations:
    expr = ('item' expr)
    expr = ('offset' expr)


Table:
    table ::= ('table' id? tabletype)
    tabletype ::= limits reftype
    limits ::= n:u32 (32-bit unsigned integer)
    reftype := 'funcref' | 'externref'


Abbreviations:
    ('table' id? reftype ('elem' elemexpr*)) =  ('table' id? reftype)
                                                            ('elem' ('table' id) ('i32.const' '0') reftype elemexpr*)
    ('table' id? reftype ('elem' funcidx*)) =   ('table' id? reftype)
                                                            ('elem' ('table' id) ('i32.const' '0') func funcidx*)

Inline import/export declaration:
    ('table' id 'import' name1 name2) tabletype) = ('import' name1 name2 ('table' id? tabletype))
    ('table' id ('export' name) ...) = ('export' name ('table' id)) ('table' id ... )


Notes:
this does not work? Is this a bug?
(module
	(table funcref
  	(elem (item func.ref 0))
  )

  (func $one)
  (func $two)
)

*/
// elem_prod_one
/*
(module
	(elem)
)

(module
	(elem funcref)
)

(module
	(elem $elem funcref)
)

(module
	(elem externref)
)

(module
  (elem funcref
    (item ref.func $two)
    (item ref.func $three)
    (item ref.func 0)
  )

  (func $one)
  (func $two)
  (func $three)
)

(module
  (elem $elem funcref
    (item ref.func $two)
    (item ref.func 2)
    (item ref.func $one)
  )

  (func $one)
  (func $two)
  (func $three)
)
*/
// elem_prod_two
/*
(module
  (elem
    (table 0)
  	funcref
    (item (ref.func 0))
    (item (ref.func $two))
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

(module
  (elem
    (table 0)
    (offset (i32.const 0))
  	funcref
    (item (ref.func 0))
    (item (ref.func $two))
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

(module
  (elem
    (offset (i32.const 0))
  	funcref
    (item (ref.func 0))
    (item (ref.func $two))
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)
*/
// elem_prod_three
/*

(module
  (elem declare funcref
    (item ref.func $two)
    (item ref.func $three)
    (item ref.func 0)
  )

  (func $one)
  (func $two)
  (func $three)
)

(module
  (elem $elem declare funcref
    (item ref.func $two)
    (item ref.func 2)
    (item ref.func $one)
  )

  (func $one)
  (func $two)
  (func $three)
)
*/
// elem_prod_one_abbr_one
/*
(module
  (elem funcref
    (ref.func $two)
    (ref.func $three)
    (ref.func 0)
  )

  (func $one)
  (func $two)
  (func $three)
)

(module
  (elem $elem funcref
    (ref.func $two)
    (ref.func 2)
    (ref.func $one)
  )

  (func $one)
  (func $two)
  (func $three)
)
*/
// elem_prod_two_abbr_one
/*
(module
  (elem
    (table 0)
  	funcref
    (ref.func 0)
    (ref.func $two)
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

(module
  (elem
    (table 0)
    (offset (i32.const 0))
  	funcref
    (ref.func 0)
    (ref.func $two)
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

(module
  (elem
    (offset (i32.const 0))
  	funcref
    (ref.func 0)
    (ref.func $two)
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

*/
// elem_prod_three
/*

(module
  (elem declare funcref
    (ref.func $two)
    (ref.func $three)
    (ref.func 0)
  )

  (func $one)
  (func $two)
  (func $three)
)

(module
  (elem $elem declare funcref
    (ref.func $two)
    (ref.func 2)
    (ref.func $one)
  )

  (func $one)
  (func $two)
  (func $three)
)
*/

// elem_prod_two_abbr_two
/*
(module
  (elem
    (table 0)
    (i32.const 0)
  	funcref
    (item (ref.func 0))
    (item (ref.func $two))
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

(module
  (elem
    (i32.const 0)
  	funcref
    (item (ref.func 0))
    (item (ref.func $two))
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)
*/

// elem_prod_two_abbr_one_two
/*
(module
  (elem
    (table 0)
    (i32.const 0)
  	funcref
    (ref.func 0)
    (ref.func $two)
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)

(module
  (elem
    (i32.const 0)
  	funcref
    (ref.func 0)
    (ref.func $two)
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)
*/

// table_prod_one
/*
(module
	(table 1 funcref)
)

(module
	(table 1 externref)
)
*/
// table_prod_one_abbr_one
/*
(module
	(table funcref
  	(elem (item))
  )

  (func $one)
  (func $two)
)


*/
// table_prod_one_abbr_two
/*

(module
	(table funcref
  	(elem
      $one
      $two
      0
    )
  )

  (func $one)
  (func $two)
)
*/
// table_prod_one_inline_import
/*
(module
  (table $table (import "table" "table") 2 funcref)
)
*/
// table_prod_one_inline_export
/*
(module
  (table $table (export "table") 2 funcref)
)

(module
	(table (export "table") 1 funcref)
)

(module
	(table (export "table") 1 externref)
)

(module
	(table (export "table") funcref
  	(elem (item))
  )

  (func $one)
  (func $two)
)

(module
	(table (export "table") funcref
  	(elem
      $one
      $two
      0
    )
  )

  (func $one)
  (func $two)
)
*/


/*
Table and elem (function) instructions
*/
/*
table.get
(module
  (table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 1
  	table.get 0
    drop
  )
)

(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 1
  	table.get $table
    drop
  )
)
*/

/*
table.set
(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 1
    ref.func $one
  	table.set $table
  )
)
(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 1
    ref.func $one
  	table.set 0
  )
)
*/
/*
table.size
(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main (result i32)
  	table.size 0
  )
)

(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main (result i32)
  	table.size $table
  )
)
*/
/*
table.grow
(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main (result i32)
    ref.func $one
    i32.const 2
  	table.grow $table
  )
)

(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main (result i32)
    ref.func 1
    i32.const 2
  	table.grow 0
  )
)

*/
/*
(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 2
    ref.func 1
    i32.const 5
  	table.fill $table
  )
)

(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 2
    ref.func 1
    i32.const 5
  	table.fill 0
  )
)
*/
/*

(module
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 2
    i32.const 5
    i32.const 3
  	table.copy $table $table
  )
)


(module
  (table $table2 4 funcref)
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 2
    i32.const 5
    i32.const 3
  	table.copy $table $table2
  )
)
*/
/*
table.init

(module
  (elem $elem)
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 0
    i32.const 1
    i32.const 2
    table.init 0 0
  )
)

(module
  (elem $elem)
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    i32.const 0
    i32.const 1
    i32.const 2
    table.init $table $elem
  )
)
*/
/*
(module
  (elem $elem)
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    elem.drop $elem
  )
)

(module
  (elem $elem)
  (table $table funcref
    (elem
      0
      $one
      1
      $one
      $two
      0
  	)
  )

  (func $one)
  (func $two)

  (func $main
    elem.drop 0
  )
)
*/
