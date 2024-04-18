const { app, BrowserWindow, ipcMain, } = require('electron');
require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
});



let sudoku_file;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 470,
        height: 520,
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


ipcMain.on('zoom-in', (event) => {
    const webContents = event.sender;
    const currentZoom = webContents.getZoomFactor();
    webContents.setZoomFactor(currentZoom + 0.1);
});

ipcMain.on('zoom-out', (event) => {
    const webContents = event.sender;
    const currentZoom = webContents.getZoomFactor();
    webContents.setZoomFactor(currentZoom - 0.1);
});

ipcMain.on('reset-zoom', (event) => {
    const webContents = event.sender;
    webContents.setZoomFactor(1);
});