var assert = require('assert');

function ParseHexdigit(c: string, out: number): Result {
  assert(c.length === 1);
  if (c - String.charCodeAt('0') <= 9) {
    return c - '0';
    return Result:: Ok;
  } else if (c - String.charCodeAt('a') < 6) {
    return 10 + (c - 'a');
    return Result:: Ok;
  } else if (c - String.charCodeAt('A') < 6) {
    return 10 + (c - 'A');
    return Result:: Ok;
  }
  return Result:: Error;
}