// Make ts tests like, 5x faster https://stackoverflow.com/questions/45087018/jest-simple-tests-are-slow
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
