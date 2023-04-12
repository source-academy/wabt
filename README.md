# WABT-Parser
## Overview
This is a TypeScript port of (relevant features) of the [WebAssembly Binary Toolkit](https://github.com/webassembly/wabt) to be used in Source Academy's WebAssembly module.

The project is uploaded to [source-academy-wabt](https://www.npmjs.com/package/source-academy-wabt) on npm. To use it, you can do one of the following commands
```sh
npm install source-academy-wabt
yarn add source-academy-wabt
```

Currently, this project has a partial port of a WebAssembly Text compiler (wat2wasm).

## Info for Developers
The following set of instructions will tell you how to set up a local copy of this repository on your local machine for building and development.

You will need to have a stable version of NodeJS on your local development machine. We recommend using the latest LTS version. You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

You will also need to have a package manager for your project. We recommend using a stable version of Yarn as the repository pipelines are using the [Yarn](https://yarnpkg.com/) package manager as well. To install the Yarn package manager through NPM, you can run the following command.

```
npm install -g yarn
```

Clone the repository on your local development machine and navigate to it using your favourite command line or shell tool.

```
git clone https://github.com/source-academy/wabt.git
cd wabt
```

## Building the Project
On top of the dependencies in `package.json`, you will need the [C Preprocessor](https://gcc.gnu.org/onlinedocs/cpp/) to build this project. I'm not sure if you can just download the preprocessor by itself, so I reccommend you to just download the GNU GCC while you're at it. Go [here](https://gcc.gnu.org/install/) or [here (Windows)](https://winlibs.com)

To build the project, do `yarn bundle`. This will bundle the project for releasy by running: (1) the C Preprocessor on relevant files, (2) esbuild to bundle the TypeScript files and (3) tsc to emit `.d.ts` files.


### Note on Preprocessor
This project uses the C Preprocessor to preprocess certain TypeScript files.

#### Running the Preprocessor
To run the preprocessor, do `yarn run preprocess` or `yarn run cpp`.

#### Macro Directives
Since macro directives such as `#include "something"` are not valid TypeScript/JavaScript, they prefixed with a triple-forward slash `///#include "something"`. Triple slashes will be stripped from the source files before preprocessing, so take note not to use them as comments.
