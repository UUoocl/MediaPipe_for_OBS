const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    handleGetOBSWSdetails: () => ipcRenderer.invoke('get-obsWSdetails')
})


var scripts = [{"source":"./webSocket_server_setting.js","type":"","async":"false"},
{"source":"./obs-ws.js","type":"","async":"false"},
{"source":"./obsConnect.js","type":"","async":"false"},
{"source":"./pose-renderer.js","type":"","async":"false"},
{"source":"./pose-module.js","type":"module","async":"false"}
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