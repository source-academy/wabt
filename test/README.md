# Testing

## Testing Build Scripts
All tests for build scripts are under the [build_test](./build_test/) folder - I don't really think they should be edited unless there are any bugs/changes made to the build scripts.

## Testing WebAssembly Text (WAT) Compiler
These tests are in the [wat_compiler](./wat_compiler/) folder.

### Test Cases
The test cases for this repo can be found in the `*.testcase.ts` files. These files export an array of test cases, which are imported by the relevant `*.test.ts` files and run as parameterised tests.

### Adding Tests
To add tests, simply add a test case in the relevant `*.testcase.ts` file and append your test case to the exported array. Alternatively, you can create your own set of test cases and relevant parameterised test case.

### Unit Tests
For unit testing the lexer, parser, intermediate representations and binary writers (aka. all unit tests in the parse -> IR -> bytecode pipeline), they are tested in [`unit.test.ts`](./wat_compiler/unit.test.ts). These unit tests use Jest's [snapshot testing](https://jestjs.io/docs/snapshot-testing), mainly for ease of writing test cases. Run jest with the `-u` flag if there are any changes made (say, to the structure of IR classes) that warrants a change in these snapshots.

### Integration Tests
Integration tests are for testing the entire compilatio pipeline, in [`integration.test.ts`](./wat_compiler/integration.test.ts). These tests compare the output of the TypeScript compiler with the official wabt compiler - any differences here should be considered a bug.

