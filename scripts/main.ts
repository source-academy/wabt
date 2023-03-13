import { watch, WatchListener } from "fs-extra";
import { BASE_DIR } from "./directories";

const args = process.argv.slice(2)

const PREPROCESSOR_FLAG = '-P';
const WATCH_FLAG = '--watch'
if (args.includes(PREPROCESSOR_FLAG) && args.includes(WATCH_FLAG)) {
    // For now, running every second will do...
    const run = () => {
        require('./preprocess').main()
        console.clear();
        console.log('Running preprocessor...')
    }

    setInterval(run, 1000);

} else if (args.includes(PREPROCESSOR_FLAG)) {
    require('./preprocess').main();
}
