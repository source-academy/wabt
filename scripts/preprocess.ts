/**
 * Preprocess all files ending with .cpp.ts/js to .ts/js files respectively with cpp (C Preprocessor).
 */
import { readdirSync, statSync } from 'fs';
import { join, sep } from 'path';
import { promisify } from 'util';
import { } from 'child_process';
import assert from 'assert';
import { EncodingOption, outputFile, readFile } from 'fs-extra';
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

const preprocess = (inputFile: string, outputFile: string): Promise<any> => {
    return exec(`cpp -I ${INCLUDE_PATH} -P -H ${inputFile} ${outputFile}`)
}

async function removeSelfImport(filePath: string, encoding: BufferEncoding = 'utf-8') {
    const fileString = await readFile(filePath, encoding)
    const fileName = filePath.split(sep).at(-1)!

    let potentialImportNames = [fileName];
    if (fileName.endsWith('.ts')) // Technically, you can't do import x from 'file.ts', but whatever
        potentialImportNames = [fileName, fileName.slice(0, fileName.indexOf('.ts'))]
    else if (fileName.endsWith('.js'))
        potentialImportNames = [fileName, fileName.slice(0, fileName.indexOf('.js'))]

    // for regex
    potentialImportNames = potentialImportNames.map(name => name.replace(/\./g, '\\.'))

    const regexString =
        '^'
        + 'import\\s*'
        + '[^\\n]*\\s*'
        + 'from\\s*'
        + `['"]\\.\\/(${potentialImportNames.join("|")})['"]`
        + ';?$';

    console.log(regexString);
    const selfImportRegex = new RegExp(regexString, 'mg')
    console.log(fileString.replace(selfImportRegex, ''))
    return await outputFile(filePath, fileString.replace(selfImportRegex, ''))
}

export async function main() {
    let SOURCE_DIRS = ['src', 'include']
        .map(dir => join(BASE_DIR, dir))

    const sourceFiles = SOURCE_DIRS.flatMap(dir => getAllFilesFromDir(dir))
    const inputFiles = sourceFiles.filter(dir => /cpp\.(t|j)s$/.test(dir))
    const outputFiles = inputFiles.map(file => file.replace(/.cpp.ts$/, '.ts').replace(/.cpp.js$/, '.js'));

    await Promise.all(inputFiles.map((x, i) => preprocess(inputFiles[i], outputFiles[i])))
    await Promise.all(outputFiles.map(file => removeSelfImport(file)))
}

export const TEST_EXPORTS = { getAllFilesFromDir, preprocess, removeSelfImport }