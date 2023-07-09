/*
import ::= ('import' name name importdesc)
importdesc ::=   (func id? typeuse)
                |(table id? tabletype)
                |(memory id? memtype)
                |(global id? globaltype)
(module
	(import "console" "log" (func $cl (param i32)))
)
(module
	(import "tb1" "tb2" (table $tb 0 funcref))
)
(module
	(import "memory" "mem" (memory 1))
)
(module
	(import "memory" "mem" (memory 1 5))
)
(module
	(import "global" "glob" (global i32))
)
*/
