class AssertError extends Error {
  constructor(assertionMessage: string) {
    super(`Assertion Error: ${assertionMessage}`);
  }
}

export const assert = (b: boolean, assertionMessage?: string) => {
  if (!b) {
    throw new AssertError(assertionMessage ?? '');
  }
};
