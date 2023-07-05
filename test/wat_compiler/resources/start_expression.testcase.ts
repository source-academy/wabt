const positive_named_start_section_before_func_1 = `
(module
    (start $a)
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
  )
`;
const positive_named_start_section_before_func_2 = `
(module
    (start $b)
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
  )
`;
const positive_named_start_section_after_func_1 = `
(module
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
    (start $a)
  )
`;
const positive_named_start_section_after_func_2 = `
(module
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
    (start $e)
  )
  `;

const positive_indexed_start_section_before_func_1 = `
(module
    (start 0)
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
)
`;
const positive_indexed_start_section_before_func_2 = `
(module
    (start 4)
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
  )
`;
const positive_indexed_start_section_after_func_1 = `
(module
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
    (start 0)
  )
`;
const positive_indexed_start_section_after_func_2 = `
(module
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
    (start 4)
  )
`;

const negative_incorrect_function_name = `
(module
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
    (start $f)
  )
`;

const negative_invalid_function_index = `
(module
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
    (start 6)
  )
`;

const negative_multiple_start_section = `
(module
    (start $a)
    (start $b)
    (func $a)
    (func $b)
    (func $c)
    (func $d)
    (func $e)
  )
  `;

export const positiveTestCases = [
  positive_named_start_section_before_func_1,
  positive_named_start_section_before_func_2,
  positive_named_start_section_after_func_1,
  positive_named_start_section_after_func_2,
  positive_indexed_start_section_before_func_1,
  positive_indexed_start_section_before_func_2,
  positive_indexed_start_section_after_func_1,
  positive_indexed_start_section_after_func_2,
];

export const negativeTestCases = [
  negative_incorrect_function_name,
  negative_invalid_function_index,
  negative_multiple_start_section,
];
