const { app, BrowserWindow, ipcMain, } = require('electron');
const path = require('path');
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 920,
        height: 1000,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'assets/icons/ico.png')
    });

    win.loadFile('index.html');
}


app.on('ready', () => {
    createWindow();
    ipcMain.handle('loadFileAsync', async(event) => {
        const { dialog } = require('electron');
        const SudokuImageGenerator = require("./imgGenerator");
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'sudoku_complete', extensions: ['txt'] }
            ]
        });

        if (result.filePaths.length > 0) {
            const imgGenerator = new SudokuImageGenerator(result.filePaths[0], 'sudoku.png');
            try {
                await imgGenerator.generateImage();
                return 'sudoku.png';
            } catch (err) {
                console.error('Error during image generation: ', err);
                return null;
            }
        } else {
            return null;
        }
    });
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});