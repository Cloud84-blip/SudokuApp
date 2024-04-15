const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loadFile: () => {
        return ipcRenderer.invoke('loadFile');
    },
});