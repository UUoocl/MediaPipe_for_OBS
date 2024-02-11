const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    handleGetOBSWSdetails: () => ipcRenderer.invoke('get-obsWSdetails')
})
