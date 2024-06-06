const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {

    loadFileAsync: () => {
        return ipcRenderer.invoke('loadFileAsync');
    },

    onFileLoaded: (callback) => {
        ipcRenderer.on('file-loaded', (event, sudoku) => {
            callback(sudoku);
        });
    },

    
    listenFileLoaded: () => {
        ipcRenderer.send('listen-file-loaded');
    },
    
});