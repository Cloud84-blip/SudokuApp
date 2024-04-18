const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    loadFile: () => {
        return ipcRenderer.invoke('loadFile');
    },
    zoomIn: () => ipcRenderer.send('zoom-in'),
    zoomOut: () => ipcRenderer.send('zoom-out'),
    resetZoom: () => ipcRenderer.send('reset-zoom'),
    getZoomFactor: () => webFrame.getZoomFactor()
});