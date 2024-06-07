const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {

    loadFileAsync: () => {
        return ipcRenderer.invoke('loadFileAsync');
    }    
});