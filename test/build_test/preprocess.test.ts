import {
  outputFile,
  outputFileSync,
  readFileSync,
  remove,
  removeSync,
} from 'fs-extra';

import { join } from 'path';
import { TEST_EXPORTS } from '../../scripts/preprocess';
const { getAllFilesFromDir, preprocess, removeSelfImport } = TEST_EXPORTS;

describe('detect nested files', () => {
  const FILE_SUFFIX = '.1234';
  const FILE_PATHS = ['a', 'a/b', 'a/b/c', 'a/b/c/d']
    .map((x) => join(__dirname, x))
    .map((x) => x + FILE_SUFFIX);

  beforeAll(() => Promise.all(FILE_PATHS.map((filePath) => outputFile(filePath, 'test'))));

  afterAll(() => {
    const TO_REMOVE = [`a${FILE_SUFFIX}`, 'a/'].map((x) => join(__dirname, x));
    Promise.all(TO_REMOVE.map((filePath) => remove(filePath)));
  });

  test('test getting nested files', () => {
    const files = getAllFilesFromDir(__dirname)
      .filter((x) => x.endsWith(FILE_SUFFIX));
    expect(files.sort())
      .toEqual(FILE_PATHS.sort());
  });
});

describe('preprocess macros', () => {
  const INPUT_FILE_NAME = 'test_input_1';
  const INPUT_FILE_PATH = join(__dirname, `${INPUT_FILE_NAME}.ts`);
  const OUTPUT_FILE_PATH = join(__dirname, 'test_output.ts');
  const INCLUDE_FILE_PATH = join(__dirname, 'test.txt');

  const FILES = [INPUT_FILE_PATH, OUTPUT_FILE_PATH, INCLUDE_FILE_PATH];

  // TODO: async-ify this, async has some issues it seems
  beforeEach(() => {
    FILES.forEach((file) => outputFileSync(file, ''));
  });

  // // TODO: async-ify this, async has some issues it seems
  afterEach(() => {
    FILES.forEach((file) => removeSync(file));
  });

  test('#include macro', async () => {
    const INCLUDE_TEXT = 'include_test';
    await Promise.all([
      outputFile(INPUT_FILE_PATH, '/// #include "test.txt"'),
      outputFile(INCLUDE_FILE_PATH, INCLUDE_TEXT),
    ]);
    await preprocess(INPUT_FILE_PATH, OUTPUT_FILE_PATH);
    const result_text = readFileSync(OUTPUT_FILE_PATH, 'utf-8');
    expect(result_text.trim())
      .toEqual(INCLUDE_TEXT);
  });

  test('remove import from self', async () => {
    const EXPECTED_CONTENTS = 'test_12345';
    const INPUT_FILE_CONTENTS
      = `import {x, from, ${INPUT_FILE_NAME}} from './${INPUT_FILE_NAME}'\n`
      + `${EXPECTED_CONTENTS}`;
    await outputFile(INPUT_FILE_PATH, INPUT_FILE_CONTENTS);
    await removeSelfImport(INPUT_FILE_PATH);

    expect(readFileSync(INPUT_FILE_PATH, 'utf-8')
      .trimStart())
      .toEqual(
        EXPECTED_CONTENTS,
      );
  });

  test('does not remove import from same file name, one directory down', async () => {
    const INPUT_FILE_CONTENTS = `import {x, from, ${INPUT_FILE_NAME}} from '../${INPUT_FILE_NAME}'\ntest_12345`;
    await outputFile(INPUT_FILE_PATH, INPUT_FILE_CONTENTS);
    await removeSelfImport(INPUT_FILE_PATH);

    expect(readFileSync(INPUT_FILE_PATH, 'utf-8'))
      .toEqual(INPUT_FILE_CONTENTS);
  });
});
