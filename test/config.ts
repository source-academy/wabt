import wabt from 'wabt';
import { compile, parse } from '../src/wat_compiler';

const USE_OFFICIAL = false;

export const assemblyFunction: (
  program: string
) => Promise<Uint8Array> = async (program: string) => (USE_OFFICIAL
  ? (await wabt()).parseWat('', program)
    .toBinary({}).buffer
  : compile(parse(program)));
