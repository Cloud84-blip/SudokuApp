const { app, BrowserWindow, ipcMain, } = require('electron');
const events = require('events');
const eventEmitter = new events.EventEmitter();
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});
let win;
let first_line = false;

function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 820,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            enableRemoteModule: false
        }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(createWindow);


ipcMain.handle('loadFile', async() => {
    const { dialog } = require('electron');
    const fs = require('fs');
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'sudoku_complete', extensions: ['txt'] }
        ]
    });

    sudoku_file = fs.readFileSync(result.filePaths[0], 'utf8');
    return sudoku_file;
});

ipcMain.handle('loadFileAsync', async() => {
    const { Worker } = require('worker_threads');
    const { dialog } = require('electron');
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'sudoku_complete', extensions: ['txt'] }
        ]
    });
    let sudoku_file;

    const worker = new Worker(__dirname + '/worker.js', { workerData: { path: result.filePaths[0], firstLineOnly: true } });
    worker.on('message', (data) => {
        if (!first_line) {
            console.log(data)
            eventEmitter.emit('first-line', data);
            first_line = true;
        } else {
            sudoku_file += data;
            eventEmitter.emit('file-loaded', sudoku_file);
        }
    });

    worker.on('exit', () => {
        console.log('Worker thread exited');
    });


    const worker_2 = new Worker(__dirname + "/worker.js", { workerData: { path: result.filePaths[0], firstLineOnly: false } });

    worker_2.on('message', (data) => {
        sudoku_file += data;
    });
    
    worker_2.on('exit', () => {
        console.log('Worker_2 thread exited');
        eventEmitter.emit('file-loaded', sudoku_file);
    });
});

ipcMain.on('listen-file-loaded', (event) => {
    eventEmitter.on('file-loaded', (sudoku) => {
        event.sender.send('file-loaded', sudoku);
    });
});

ipcMain.on('listen-first-line', (event) => {
    eventEmitter.on('first-line', (sudoku) => {
        event.sender.send('first-line', sudoku);
    });
});