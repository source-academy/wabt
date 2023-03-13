/**
 * Preprocess all files ending with .cpp.ts/js to .ts/js files respectively with cpp (C Preprocessor).
 */
import { readdirSync, statSync } from 'fs';
import { join, sep } from 'path';
import { promisify } from 'util';
import { } from 'child_process';
import assert from 'assert';

const exec = promisify(require('child_process').exec);

const getAllFilesFromDir = (directory: string): string[] => {
    if (statSync(directory).isFile())
        return [directory]
    return readdirSync(directory)
        .map((file) => join(directory, file))
        .flatMap((subdirectory) => getAllFilesFromDir(subdirectory));
}

const BASE_DIR = __dirname.slice(0, __dirname.lastIndexOf(sep))
const INCLUDE_PATH = join(BASE_DIR, 'include');
const preprocess = (inputFiles: string[], outputFiles: string[]) => {
    assert(inputFiles.length === outputFiles.length);
    return Promise.all(
        inputFiles.map((val, i) =>
            exec(`cpp -I ${INCLUDE_PATH} -P -H ${inputFiles[i]} ${outputFiles[i]}`))
    )
}

function removeSelfImport(filename: string) {

}

export function main() {
    let SOURCE_DIRS = ['src', 'include']
        .map(dir => join(BASE_DIR, dir))

    const sourceFiles = SOURCE_DIRS.flatMap(dir => getAllFilesFromDir(dir))
    const inputFiles = sourceFiles.filter(dir => /cpp\.(t|j)s$/.test(dir))
    const outputFiles = inputFiles.map(file => file.replace(/.cpp.ts$/, '.ts').replace(/.cpp.js$/, '.js'));

    preprocess(inputFiles, outputFiles)
}

export const TEST_EXPORTS = {getAllFilesFromDir, preprocess, removeSelfImport}