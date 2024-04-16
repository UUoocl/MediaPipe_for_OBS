const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    handleGetOBSWSdetails: () => ipcRenderer.invoke('get-obsWSdetails'),
    handleRunPTZcommand: (cmd) => ipcRenderer.invoke('run-ptz-command-line',cmd)
})

var scripts = [
{"source":"./obs-ws.js","type":"","async":false},
{"source":"./obsConnect.js","type":"","async":false},
{"source":"./ptz-renderer.js","type":"","async":false},
              ]
//Insert javascript into pose.html
window.addEventListener('DOMContentLoaded', async () => { 
    scripts.forEach(script => {
        const scriptElem = document.createElement('script');
        scriptElem.src = script.source; 
        scriptElem.async = script.async;
        if(script.type){scriptElem.type = script.type;}
        scriptElem.onload = () => {
        console.log(`${script.source} Script loaded successfuly`);
        };
        scriptElem.onerror = () => {
        console.log(`${script.source} Error occurred while loading script`);
        };
        document.body.appendChild(scriptElem);
    });
    
    })