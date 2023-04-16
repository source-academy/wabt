// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild';
import {
  DIST_FILE_PATH,
  ENTRY,
  OUTFILE,
  SOURCE_FILE_PATH,
} from './directories';
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);

async function bundle_esbuild() {
  return esbuild.build({
    entryPoints: [ENTRY],
    bundle: true,
    outfile: OUTFILE,
    platform: 'node',
  });
}

async function bundle_types() {
  await exec('yarn tsc -p bundle.tsconfig.json');
}

export async function main() {
  await bundle_esbuild();
  await bundle_types();
}
