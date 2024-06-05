const fs = require('fs');
const { parentPort, workerData } = require('worker_threads');

const readLine = require('readline');
const fileReadStream = fs.createReadStream(workerData.path, { highWaterMark: 64 * 1024, encoding: 'utf8' });
const rl = readLine.createInterface({
    input: fileReadStream,
    crlfDelay: Infinity
});
let firstLineRed = false;
let data = '';

rl.on('line', (line) => {
    if (!firstLineRed && !line.includes("=")) {
        parentPort.postMessage(line.split(" ").length);
        firstLineRed = true;
        if (workerData.firstLineOnly) {
            rl.close();
        }
    }
    if (!line.includes("=")) {
        data += line;
        console.log(line)
    }
});

rl.on('close', () => {
    console.log('File read complete');
    parentPort.postMessage(data);
    process.exit(0);
});