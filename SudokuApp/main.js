const { app, BrowserWindow, ipcMain } = require('electron');
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});

let sudoku_file;


function createWindow() {
    let win = new BrowserWindow({
        width: 470,
        height: 520,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    win.loadFile('index.html');
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