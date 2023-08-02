/*
import ::= ('import' name name importdesc)
importdesc ::=   (func id? typeuse)
                |(table id? tabletype)
                |(memory id? memtype)
                |(global id? globaltype)


*/

const func_import = `
(module
  (import "console" "log" (func $cl (param i32)))
)
`;
const table_import = `
(module
	(import "tb1" "tb2" (table $tb 0 funcref))
)
`;
const memory_import = `
(module
	(import "memory" "mem" (memory 1))
)
`;
const memory_with_limit_import = `
(module
	(import "memory" "mem" (memory 1 5))
)
`;
const global_import = `
(module
	(import "global" "glob" (global i32))
)
`;

export const positiveTestCases = [
  func_import,
  // table_import,
  memory_import,
  memory_with_limit_import,
  global_import,
];
