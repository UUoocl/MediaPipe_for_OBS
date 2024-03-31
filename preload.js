const { contextBridge, ipcRenderer } = require('electron')

var windowId, Sources;
var scripts = [
              "./obs-ws.js",
              "./obsConnect.js",
              "./gamecontroller.min.js",
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
  audioInputWindow: (IP, Port, PW, InputID,sourceName) => ipcRenderer.send('open-audioinput-window',IP, Port, PW, InputID,sourceName),
  midiWindow: (IP, Port, PW, inMidiID, inMidiName, outMidiID, outMidiName) => ipcRenderer.send('open-midi-window',IP, Port, PW, inMidiID, inMidiName, outMidiID, outMidiName),
  gamepadWindow: (IP, Port, PW, gamepadID, gamepadName) => ipcRenderer.send('open-gamepad-window',IP, Port, PW, gamepadID, gamepadName),
  //segmentationWindow: () => ipcRenderer.send('open-segmentation-window'),
  //getCameraId: () => ipcRenderer.send('get-cameras'),
  //moveWindowsOffScreen: () => ipcRenderer.send('move-windows-off-screen'),
  ///moveWindowsToPrimaryScreen: () => ipcRenderer.send('move-windows-to-primary-screen'),
  //getSources: () => getSource(),
  handleGetDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  setOBSconnection: (IP, Port, PW) => ipcRenderer.send('set-obs-connection', IP, Port, PW),
  getOBSconnection: () => ipcRenderer.invoke('get-obs-connection')
  //obsConnect: () => obsConnect(), 
  //invokeGetSources: () => ipcRenderer.invoke('handleGetSources'),
  //myInvokableIpc: () => ipcRenderer.invoke('handleInvoke')
    // ...
})