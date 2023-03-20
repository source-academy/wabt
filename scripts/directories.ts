import { join, sep } from 'path';

export const BASE_DIR = __dirname.slice(0, __dirname.lastIndexOf(sep))
export const INCLUDE_PATH = join(BASE_DIR, 'wabt/include');
export const SOURCE_FILE_PATH = join(BASE_DIR, 'src');