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
            sandbox: true
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
    const { dialog } = require('electron');
    const SudokuImageGenerator = require("./imgGenerator");
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'sudoku_complete', extensions: ['txt'] }
        ]
    });
    const imgGenerator = new SudokuImageGenerator(result.filePaths[0], 'sudoku.png');
    imgGenerator.generateImage();

    eventEmitter.emit('file-loaded', "sudoku.png");
});

ipcMain.on('listen-file-loaded', (event) => {
    eventEmitter.on('file-loaded', (sudoku_img_path) => {
        event.sender.send('file-loaded', sudoku_img_path);
    });
});
