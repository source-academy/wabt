/**
 * Preprocess all files ending with .cpp.ts/js to .ts/js files respectively with cpp (C Preprocessor).
 */
import { readdirSync, statSync } from 'fs';
import { join, sep } from 'path';
import { promisify } from 'util';
import { outputFile, readFile, readFileSync, remove, writeFile } from 'fs-extra';
import { INCLUDE_PATH, SOURCE_FILE_PATH } from './directories';
const exec = promisify(require('child_process').exec);

const getAllFilesFromDir = (directory: string): string[] => {
    if (statSync(directory).isFile())
        return [directory]
    return readdirSync(directory)
        .map((file) => join(directory, file))
        .flatMap((subdirectory) => getAllFilesFromDir(subdirectory));
}

/**
 * Preprocess c++ macros.
 * Macros are in the format: /// #macro
 * Note that any /// will be stripped before the preprocessor for macro processing.
 * @param inputFilePath input file to process
 * @param outputFilePath output file for postprocesed file
 * @param encoding optional encoding for file (default = utf-8)
 * @returns a Promise that is resolved when the preprocessing is done.
 */
const preprocess = async (inputFilePath: string, outputFilePath: string, encoding: BufferEncoding = 'utf-8'): Promise<any> => {
    const tempFilePath = inputFilePath + '.temp';

    const originalFileString = readFileSync(inputFilePath, encoding)
    const newFileString = originalFileString.replace(/^\/{3,}\s*/gm, '')

    await outputFile(tempFilePath, newFileString)
    await exec(`cpp -I ${INCLUDE_PATH} -P -H ${tempFilePath} ${outputFilePath}`)
    return remove(tempFilePath)
}

/**
 * Removes import from the same file. The logic here is that if you define an enum in example.cpp.ts,
 * You will import type definitions from example.ts, but when example.cpp.ts is preprocessed into example.ts,
 * we need to remove the import statement in example.cpp.ts
 * @param filePath File to remove imports from
 * @param encoding encoding (default = utf-8)
 * @returns a Promise that resolves when the operation is done.
 */
async function removeSelfImport(filePath: string, encoding: BufferEncoding = 'utf-8'): Promise<void> {
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

    const selfImportRegex = new RegExp(regexString, 'mg')
    return await outputFile(filePath, fileString.replace(selfImportRegex, ''))
}

export async function main() {
    const sourceFiles = getAllFilesFromDir(SOURCE_FILE_PATH)
    const inputFiles = sourceFiles.filter(dir => /cpp\.(t|j)s$/.test(dir))
    const outputFiles = inputFiles.map(file => file.replace(/.cpp.ts$/, '.ts').replace(/.cpp.js$/, '.js'));

    await Promise.all(inputFiles.map((x, i) => preprocess(inputFiles[i], outputFiles[i])))
    await Promise.all(outputFiles.map(file => removeSelfImport(file)))
}

export const TEST_EXPORTS = { getAllFilesFromDir, preprocess, removeSelfImport }