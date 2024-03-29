const { contextBridge, ipcRenderer } = require('electron')

var windowId, Sources;
var scripts = ["./webSocket_server_setting.js",
              "./obs-ws.js",
              "./obsConnect.js",
              "./renderer.js"]

window.addEventListener('DOMContentLoaded', async () => { 
  scripts.forEach(script => {
    const scriptElem = document.createElement('script');
    scriptElem.src = script 
    scriptElem.async = false;
    scriptElem.onload = () => {
      console.log(`${script} Script loaded successfuly`);
    };
    scriptElem.onerror = () => {
      console.log(`${script} Error occurred while loading script`);
    };
    document.body.appendChild(scriptElem);
  });
})

contextBridge.exposeInMainWorld('electronAPI', {
  slideWindow: (IP, Port, PW, Link) => ipcRenderer.send('open-slide-window', IP, Port, PW, Link),
  //cameraWindow: (CameraID) => ipcRenderer.send('open-camera-window', CameraID),
  poseWindow: (IP, Port, PW, projectorID, sourceName) => ipcRenderer.send('open-pose-window',IP, Port, PW, projectorID, sourceName),
  //segmentationWindow: () => ipcRenderer.send('open-segmentation-window'),
  //getCameraId: () => ipcRenderer.send('get-cameras'),
  //moveWindowsOffScreen: () => ipcRenderer.send('move-windows-off-screen'),
  ///moveWindowsToPrimaryScreen: () => ipcRenderer.send('move-windows-to-primary-screen'),
  //getSources: () => getSource(),
  handleGetDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  OBSconnection: (IP, Port, PW) => ipcRenderer.send('set-obs-connection', IP, Port, PW)
  //obsConnect: () => obsConnect(), 
  //invokeGetSources: () => ipcRenderer.invoke('handleGetSources'),
  //myInvokableIpc: () => ipcRenderer.invoke('handleInvoke')
    // ...
})