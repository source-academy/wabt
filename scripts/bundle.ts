// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild';
import { DIST_FILE_PATH, ENTRY, OUTFILE, SOURCE_FILE_PATH } from './directories';

async function bundle_esbuild() {
  return esbuild.build({
    entryPoints: [ENTRY],
    bundle: true,
    outfile: OUTFILE,
    platform: 'node',
  });
}

export async function main() {
  await bundle_esbuild();
}
