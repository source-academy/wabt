// eslint-disable-next-line complexity
export function parseHexdigit(c: string): number {
  assert(c.length === 1);
  switch (c) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      return Number.parseInt(c);
    case 'a':
    case 'A':
      return 10;
    case 'B':
    case 'b':
      return 11;
    case 'C':
    case 'c':
      return 12;
    case 'D':
    case 'd':
      return 13;
    case 'E':
    case 'e':
      return 14;
    case 'F':
    case 'f':
      return 15;
  }
  throw new Error(`Invalid HexDigit: ${c}`);
}

export enum LiteralType {
  Int,
  Float,
  Hexfloat,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Infinity,
  Nan,
}
