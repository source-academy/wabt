# WABT-Parser

## Note on Preprocessor
- This project uses the C Preprocessor to preprocess certain TypeScript files.

### Running the Preprocessor
- To run the preprocessor, do `yarn run preprocess` or `yarn run cpp`.

### Macro Directives
- Since macro directives such as `#include "something"` are not valid TypeScript/JavaScript, they prefixed with a triple-forward slash `///#include "something"`. Triple slashes will be stripped from the source files before preprocessing, so take note not to use them as comments.
