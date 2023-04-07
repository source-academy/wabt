const args = process.argv.slice(2);

const PREPROCESSOR_FLAG = '--preprocess';
const BUNDLE_FLAG = '--bundle';
const WATCH_FLAG = '--watch';

if (args.includes(PREPROCESSOR_FLAG) && args.includes(WATCH_FLAG)) {
  // For now, running every second will do...
  const run = () => {
    console.clear();
    console.log('Running preprocessor...');
  };

  setInterval(run, 1000);
} else if (args.includes(PREPROCESSOR_FLAG)) {
  require('./preprocess')
    .main();
}

if (args.includes(BUNDLE_FLAG)) {
  require('./preprocess')
    .main();
  require('./bundle')
    .main();
}
