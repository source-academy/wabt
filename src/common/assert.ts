class AssertError extends Error {
  constructor() {
    super('Assertion Error');
  }
}

export const assert = (b: boolean) => {
  if (!b) {
    throw new AssertError();
  }
};
