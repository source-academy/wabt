const args = process.argv.slice(2)

const PREPROCESSOR_FLAG = '-P';
if (args.includes(PREPROCESSOR_FLAG)) {
    require('./preprocess').main();
}
