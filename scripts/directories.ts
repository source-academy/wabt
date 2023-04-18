import { join, sep } from 'path';

export const BASE_DIR = __dirname.slice(0, __dirname.lastIndexOf(sep));
export const INCLUDE_PATH = join(BASE_DIR, 'wabt/include');
export const SOURCE_FILE_PATH = join(BASE_DIR, 'src');
export const DIST_FILE_PATH = join(BASE_DIR, 'dist');
export const TEST_DIR = join(BASE_DIR, 'test');

export const ENTRY = join(SOURCE_FILE_PATH, 'index.ts');
export const OUTFILE = join(BASE_DIR, 'index.js');
