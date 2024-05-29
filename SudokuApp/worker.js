const fs = require('fs');
const { parentPort, workerData } = require('worker_threads');

const readLine = require('readline');
const fileReadStream = fs.createReadStream(workerData, { highWaterMark: 64 * 1024, encoding: 'utf8' });
const rl = readLine.createInterface({
    input: fileReadStream,
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    parentPort.postMessage(line);
});

rl.on('close', () => {
    console.log('File read complete');
    parentPort.postMessage('file-read-complete');
});


//const fileReadStream = fs.createReadStream(workerData, { highWaterMark: 64 * 1024, encoding: 'utf8' });
// fileReadStream.on('data', (chunk) => {
//     console.log(chunk.length);
//     parentPort.postMessage(chunk);
// });

// fileReadStream.on('end', () => {
//     console.log('File read complete');
//     // console.log(sudoku_file);
//     // parentPort.postMessage(sudoku_file);
// });