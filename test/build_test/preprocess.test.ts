// import { writeFileSync, unlink } from 'fs';
// import { writeFile } from 'fs/promises'
import { outputFile, readFileSync, remove } from 'fs-extra'
import { join } from 'path';
import { getAllFilesFromDir, preprocess } from '../../scripts/cpp';

describe('detect nested files', () => {
    const FILE_SUFFIX = '.1234';
    const FILE_PATHS = ['a', 'a/b', 'a/b/c', 'a/b/c/d']
        .map(x => join(__dirname, x))
        .map(x => x + FILE_SUFFIX);

    beforeAll(() =>
        Promise.all(FILE_PATHS.map(filePath => outputFile(filePath, 'test')))
    )

    afterAll(() => {
        const TO_REMOVE = [`a${FILE_SUFFIX}`, 'a/']
            .map(x => join(__dirname, x))
        Promise.all(TO_REMOVE.map(filePath => remove(filePath)))
    })

    test('test getting nested files', () => {
        const files = getAllFilesFromDir(__dirname).filter(x => x.endsWith(FILE_SUFFIX));
        expect(files.sort()).toEqual(FILE_PATHS.sort())
    })
})

describe('preprocess macros', () => {
    const INPUT_FILE = join(__dirname, 'test_input.js');
    const OUTPUT_FILE = join(__dirname, 'test_output.js');
    const INCLUDE_FILE = join(__dirname, 'test.txt');

    test('#include macro', async () => {
        const INCLUDE_TEXT = 'include_test';
        await Promise.all([
            outputFile(INPUT_FILE, '#include "test.txt"'),
            outputFile(INCLUDE_FILE, INCLUDE_TEXT)
        ])
        await preprocess([INPUT_FILE], [OUTPUT_FILE]);
        const result_text = readFileSync(OUTPUT_FILE, "utf-8");
        expect(result_text.trim()).toEqual(INCLUDE_TEXT);
    })

    afterAll(() => {
        Promise.all([
            remove(INPUT_FILE),
            remove(OUTPUT_FILE),
            remove(INCLUDE_FILE),
        ])
    })
})