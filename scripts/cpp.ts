/**
 * Preprocess all files ending with .cpp.ts/js to .ts/js files respectively with cpp (C Preprocessor).
 */
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import child_process from 'child_process';
import { promisify } from 'util';
import { } from 'child_process';

const exec = promisify(child_process.exec);
import assert from 'assert';


export const getAllFilesFromDir = (directory: string): string[] => {
    if (statSync(directory).isFile())
        return [directory]
    return readdirSync(directory)
        .map((file) => join(directory, file))
        .flatMap((subdirectory) => getAllFilesFromDir(subdirectory));
}

export const preprocess = (inputFiles: string[], outputFiles: string[]) => {
    assert(inputFiles.length === outputFiles.length);
    return Promise.all(
        inputFiles.map((val, i) =>
            exec(`cpp -P -H ${inputFiles[i]} ${outputFiles[i]}`))
    )
}
