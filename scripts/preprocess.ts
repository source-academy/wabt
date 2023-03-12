import { getAllFilesFromDir, preprocess } from "./cpp";


const SOURCE_DIRS = ['./src']
const BASE_PROJECT_DIR = __dirname.slice(0, __dirname.lastIndexOf('/'))

const sourceFiles = SOURCE_DIRS.flatMap(dir => getAllFilesFromDir(dir))
const inputFiles = sourceFiles.filter(dir => /cpp\.(t|j)s$/.test(dir))
const outputFiles = inputFiles.map(file => file.replace(/.cpp.ts$/, '.ts').replace(/.cpp.js$/, '.js'));

preprocess(inputFiles, outputFiles)