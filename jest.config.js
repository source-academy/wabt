/** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   globals: {
//     "ts-jest": {
//       isolatedModules: true,
//     }
//   }
// };

// Make ts tests like, 5x faster https://stackoverflow.com/questions/45087018/jest-simple-tests-are-slow
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["esbuild-jest"],
  }
}