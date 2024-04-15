const { contextBridge, ipcRenderer } = require('electron')

var windowId, Sources;
var scripts = [
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
  poseWindow: (IP, Port, PW, projectorID, sourceName) => ipcRenderer.send('open-pose-window',IP, Port, PW, projectorID, sourceName),
  audioInputWindow: (IP, Port, PW, InputID,sourceName) => ipcRenderer.send('open-audioinput-window',IP, Port, PW, InputID,sourceName),
  midiWindow: (IP, Port, PW, inMidiID, inMidiName, outMidiID, outMidiName) => ipcRenderer.send('open-midi-window',IP, Port, PW, inMidiID, inMidiName, outMidiID, outMidiName),
  gamepadWindow: (IP, Port, PW, gamepadID, gamepadName) => ipcRenderer.send('open-gamepad-window',IP, Port, PW, gamepadID, gamepadName),
  oscWindow: (IP, Port, PW, oscIP, oscInPORT,oscOutPORT) => ipcRenderer.send('open-osc-window',IP, Port, PW, oscIP, oscInPORT,oscOutPORT),
  sentimentWindow: (IP, Port, PW) => ipcRenderer.send('open-sentiment-window',IP, Port, PW),
  rtcWindow: (rtcPort, rtcVideoId, rtcAudioId, rtcType) => ipcRenderer.send('open-rtc-window',rtcPort, rtcVideoId, rtcAudioId, rtcType),
  ptzWindow: (IP, Port, PW) => ipcRenderer.send('open-ptz-window',IP, Port, PW),

  handleGetDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  setOBSconnection: (IP, Port, PW) => ipcRenderer.send('set-obs-connection', IP, Port, PW),
  getOBSconnection: () => ipcRenderer.invoke('get-obs-connection')
  
})