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
    limits ::= n:u32 (32-bit unsigned integer) or n: u32 m: u32
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

const empty_elem = `
(module
	(elem)
)
`;

const empty_elem_funcref = `
(module
	(elem funcref)
)
`;
const empty_named_elem_funcref = `
(module
	(elem $elem funcref)
)
`;
const empty_elem_externref = `
(module
	(elem externref)
)
`;

const elem_prod_one_0 = `
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
`;
const elem_prod_one_1 = `
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
`;

// const elem_prod_two_0 = `
// (module
//   (elem
//     (table 0)
//   	funcref
//     (item (ref.func 0))
//     (item (ref.func $two))
//   )
//   (table 0 funcref)
//   (func $one)
//   (func $two)
// )
// `;
const elem_prod_two_empty = `
(module
  (elem
    (table 0)
    (offset (i32.const 0))
  )
  (table 0 funcref)
)
`;
const elem_prod_two_0 = `
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
`;
const elem_prod_two_1 = `
(module
  (elem
    (table 0)
    (offset i32.const 0)
  	funcref
    (item (ref.func 0))
    (item (ref.func $two))
  )
  (table 0 funcref)
  (func $one)
  (func $two)
)
`;
const elem_prod_two_2 = `
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
`;

const elem_prod_three_empty = `
(module
  (elem declare)
)
`;
const elem_prod_three_0 = `
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
`;
const elem_prod_three_1 = `
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
`;

const elem_prod_one_abbr_one_0 = `
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
`;
const elem_prod_one_abbr_one_1 = `
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
`;


const elem_prod_two_abbr_one_0 = `
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
`;
const elem_prod_two_abbr_one_1 = `
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
`;
const elem_prod_three_0_abbr = `
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
`;
const elem_prod_three_1_abbr = `
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
`;
const elem_prod_two_abbr_two_0 = `
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
`;
const elem_prod_two_abbr_two_1 = `
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
`;
const elem_prod_two_abbr_one_two_0 = `
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
`;
const elem_prod_two_abbr_one_two_1 = `
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
`;

const table_prod_one_funcref_0 = `
(module
	(table 1 funcref)
)
`;
const table_prod_one_funcref_1 = `
(module
	(table 1 funcref)
)
`;
const table_prod_one_externref_0 = `
(module
	(table 1 externref)
)
`;
const table_prod_one_externref_1 = `
(module
	(table 1 externref)
)
`;

const table_prod_one_abbr_one = `
(module
	(table funcref
  	(elem (item))
  )

  (func $one)
  (func $two)
)
`;

/*
This is a bug in the official parser, it should be able to parse this.
correct is (elem (item $one) (item 1))
(module
	(table funcref
  	(elem (item) $one 1)
  )

  (func $one)
  (func $two)
)

*/

const table_prod_one_abbr_two = `
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
`;

const table_prod_one_inline_import = `
(module
  (table $table (import "table" "table") 2 funcref)
)
`;

const table_prod_one_inline_export_0 = `
(module
  (table $table (export "table") 2 funcref)
)
`;
const table_prod_one_inline_export_1 = `
(module
	(table (export "table") 1 funcref)
)
`;
const table_prod_one_inline_export_2 = `
(module
	(table (export "table") 1 externref)
)
`;
const table_prod_one_inline_export_3 = `

(module
	(table (export "table") funcref
  	(elem (item))
  )

  (func $one)
  (func $two)
)
`;
const table_prod_one_inline_export_4 = `
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
`;

/*
Table and elem (function) instructions
*/

const table_get_index = `
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
`;

const table_get_var = `
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
`;

const table_set_var = `
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
`;

const table_set_index = `
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
`;

const table_size_index = `
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
`;
const table_size_var = `
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
`;
const table_grow_var = `
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
`;
const table_grow_index = `
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
`;
const table_fill_var = `
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
`;
const table_fill_index = `
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
`;

const table_copy_0 = `
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
`;
const table_copy_1 = `
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
`;
const table_init_index = `
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
`;
const table_init_var = `
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
`;

const elem_drop_var = `
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
`;
const elem_drop_index = `
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
`;

export const positiveTestCases = [
  empty_elem,
  empty_elem_funcref,
  empty_named_elem_funcref,
  empty_elem_externref,
  elem_prod_one_0,
  elem_prod_one_1,
  elem_prod_two_empty,
  elem_prod_two_0,
  elem_prod_two_1,
  elem_prod_two_2,
  elem_prod_three_empty,
  elem_prod_three_0,
  elem_prod_three_1,
  elem_prod_one_abbr_one_0,
  elem_prod_one_abbr_one_1,
  elem_prod_two_abbr_one_0,
  elem_prod_two_abbr_one_1,
  elem_prod_three_0_abbr,
  elem_prod_three_1_abbr,
  elem_prod_two_abbr_two_0,
  elem_prod_two_abbr_two_1,
  elem_prod_two_abbr_one_two_0,
  elem_prod_two_abbr_one_two_1,
  table_prod_one_funcref_0,
  table_prod_one_externref_0,
  table_prod_one_funcref_1,
  table_prod_one_externref_1,
  table_prod_one_abbr_one,
  table_prod_one_abbr_two,
  table_prod_one_inline_import,
  table_prod_one_inline_export_0,
  table_prod_one_inline_export_1,
  table_prod_one_inline_export_2,
  // table_prod_one_inline_export_3,
  // table_prod_one_inline_export_4,
  table_get_index,
  table_get_var,
  table_set_var,
  table_set_index,
  table_size_index,
  table_size_var,
  table_grow_var,
  table_grow_index,
  table_fill_var,
  table_fill_index,
  table_copy_0,
  table_copy_1,
  table_init_index,
  table_init_var,
  elem_drop_var,
  elem_drop_index,
];
