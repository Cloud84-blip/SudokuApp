const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loadFile: () => {
        return ipcRenderer.invoke('loadFile');
    },

    loadFileAsync: () => {
        return ipcRenderer.invoke('loadFileAsync');
    },

    onFileLoaded: (callback) => {
        ipcRenderer.on('file-loaded', (event, sudoku) => {
            callback(sudoku);
        });
    },

    onFirstLineLoaded: (callback) => {
        ipcRenderer.on('first-line', (event, line) => {
            callback(line);
        });
    },

    listenFileLoaded: () => {
        ipcRenderer.send('listen-file-loaded');
    },

    listenFirstLine: () => {
        ipcRenderer.send('first-line');
    },

    zoomIn: () => ipcRenderer.send('zoom-in'),
    zoomOut: () => ipcRenderer.send('zoom-out'),
    resetZoom: () => ipcRenderer.send('reset-zoom'),
    getZoomFactor: () => webFrame.getZoomFactor()
});