import { Token } from '../src/common/token';

/**
 * Equality comparison for two tokesn that ignore token's column/line/index in source.
 * To be used as a Jest comparison.
 */
export function isTokenEqual(a: Token, b: Token) {
  if (!(a instanceof Token) || !(b instanceof Token)) {
    return undefined;
  }
  return (
    a.lexeme === b.lexeme
    && a.opcodeType === b.opcodeType
    && a.valueType === b.valueType
    && a.type === b.type
  );
}
