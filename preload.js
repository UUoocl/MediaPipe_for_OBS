const { contextBridge, ipcRenderer } = require('electron')

var windowId, Sources;

contextBridge.exposeInMainWorld('electronAPI', {
  //slideWindow: (IP, Port, PW, Link) => ipcRenderer.send('open-slide-window', IP, Port, PW, Link),
  //cameraWindow: (CameraID) => ipcRenderer.send('open-camera-window', CameraID),
  poseWindow: (IP, Port, PW, projectorID, sourceName) => ipcRenderer.send('open-pose-window',IP, Port, PW, projectorID, sourceName),
  //segmentationWindow: () => ipcRenderer.send('open-segmentation-window'),
  //getCameraId: () => ipcRenderer.send('get-cameras'),
  //moveWindowsOffScreen: () => ipcRenderer.send('move-windows-off-screen'),
  ///moveWindowsToPrimaryScreen: () => ipcRenderer.send('move-windows-to-primary-screen'),
  //getSources: () => getSource(),
  handleGetSources: () => ipcRenderer.invoke('get-sources')
  //obsConnect: () => obsConnect(), 
  //invokeGetSources: () => ipcRenderer.invoke('handleGetSources'),
  //myInvokableIpc: () => ipcRenderer.invoke('handleInvoke')
    // ...
})