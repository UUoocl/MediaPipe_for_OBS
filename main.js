const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron/main')
const path = require('path')
const log = require('electron-log');
const fs = require('fs'); 
const Server = require('node-osc');

//macOS microphone permission
const { systemPreferences } = require('electron')
const microphone = systemPreferences.askForMediaAccess('microphone');


//#region log file
//Create log file of Pose landmarks
console.log = log.log;

log.transports.console.format = '[{h}:{i}:{s}.{ms}] {text}';
log.transports.console.level = 'error';

log.transports.file.format = '[{h}:{i}:{s}.{ms}] {text}';
log.transports.file.maxSize = 5242880;

log.transports.file.archiveLog = (file) => {
  file = file.toString();
  const info = path.parse(file);
  let currentDate = new Date().toJSON().slice(0, 19).replaceAll(":","_")
  try {
    fs.renameSync(file, path.join(info.dir, info.name + currentDate + info.ext));
  } catch (e) {
    console.warn('Could not rotate log', e);
  }
};

log.initialize();

log.info('Log from the main process');
//#endregion

//window variables
let mainWindow, poseWindow, audioWindow, midiWindow, gamepadWindow, oscWindow, sentimentWindow;
var windowSetup, source;
var webSocketDetails = {
      "websocketIP": "",
      "websocketPort": "",
      "websocketPassword": ""
};

//#region When app starts Create main window
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//#endregion

//#region create main window
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    x: 0,
    y: 0,
    title: __dirname,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  //mainWindow.loadFile('revealIndex.html')
  //mainWindow.loadFile('customindex.html')
  //mainWindow.loadFile('obsIndex.html')
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}
//#endregion

//#region Open-Pose-windows
ipcMain.on('open-pose-window', (event, IP, Port, PW, projectorID, sourceName) => {
  console.log("main received IPC")
  poseWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    x: 100,
    y: 100,
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'default',
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'pose-preload.js')
    }
  })

  windowSetup = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW,
    windowID: projectorID,
    sourceName: sourceName
  };
  //console.log(windowSetup)
  poseWindow.loadFile('pose.html');
})
//#endregion

//#region Open-audioinput-windows
ipcMain.on('open-audioinput-window', (event, IP, Port, PW, inputID,sourceName) => {
  console.log("main received IPC")
  audioWindow = new BrowserWindow({
    width: 400,
    height: 400,
    x: 200,
    y: 100,
    title: sourceName,
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'default',
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'audioInput-preload.js')
    }
  })

  windowSetup = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW,
    inputID: inputID
  };
  //console.log(windowSetup)
  audioWindow.loadFile('audioInput.html');
  //poseWindow.webContents.openDevTools()
})
//#endregion

//#region Open-gamepad-windows
ipcMain.on('open-gamepad-window', (event, IP, Port, PW, gamepadID, gamepadName) => {
  console.log("main received gamepad IPC")
  gamepadWindow = new BrowserWindow({
    width: 1000,
    height: 400,
    x: 200,
    y: 100,
    title: gamepadName,
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'default',
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'gamepad-preload.js')
    }
  })

  windowSetup = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW,
    gamepadID: gamepadID,
    gamepadName: gamepadName
  };
  //console.log(windowSetup)
  gamepadWindow.loadFile('gamepad.html');
  //poseWindow.webContents.openDevTools()
})
//#endregion

//#region Open-midi-windows
ipcMain.on('open-midi-window', (event, IP, Port, PW, inMidiID, inMidiName, outMidiID, outMidiName) => {
  console.log("main received IPC")
  midiWindow = new BrowserWindow({
    width: 400,
    height: 400,
    x: 200,
    y: 100,
    title: inMidiName,
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'default',
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'midi-preload.js')
    }
  })

  windowSetup = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW,
    inputID: inMidiID,
    inputName: inMidiName,
    outputID: outMidiID,
    outputName: outMidiName
  };
  //console.log(windowSetup)
  midiWindow.loadFile('midi.html');
  //poseWindow.webContents.openDevTools()
})
//#endregion

//#region Open-osc-windows
ipcMain.on('open-osc-window', (event, IP, Port, PW, oscPORT, oscIP) => {
  console.log("main received osc window IPC")
  oscWindow = new BrowserWindow({
    width: 400,
    height: 400,
    x: 200,
    y: 100,
    title: "osc window",
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'default',
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'osc-preload.js')
    }
  })

  windowSetup = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW,
    oscPORT: oscPORT,
    oscIP: oscIP
  };
  //console.log(windowSetup)
  oscWindow.loadFile('osc.html');
  oscWindow.webContents.openDevTools()
})
//#endregion

//#region Open-sentiment-windows
ipcMain.on('open-sentiment-window', (event, IP, Port, PW) => {
  console.log("main received sentiment IPC")
  sentimentWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    x: 100,
    y: 100,
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'default',
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'sentiment-preload.js')
    }
  })

  windowSetup = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW
  };
  //console.log(windowSetup)
  sentimentWindow.loadFile('sentiment.html');
  sentimentWindow.webContents.openDevTools()

})
//#endregion

//#region IPC APIs
//Send websocket and projector window to renderer
ipcMain.handle('get-obsWSdetails', async () => {
  console.log("sending window details to a new window")
  console.log(windowSetup)
  return windowSetup;
})

//#region IPC send desktop sources list to main window
ipcMain.handle('get-desktop-sources', async () => {
  console.log('getting sources with handler')
  var results = []; 
  results = await desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    return sources.map(source => {
      source.name;
      return source;
    });
  });
  //console.log(results)
 return results;
  //map example
  //console.log(results.map((result) => [result.name, result.id]));
})
//#endregion

//#region IPC set OBS connection
ipcMain.on('set-obs-connection', async (event, IP, Port, PW ) => {
  console.log('setting OBS Connection')
  
  webSocketDetails = {
    websocketIP: IP,
    websocketPort: Port,
    websocketPassword: PW
  };
  console.log(webSocketDetails.websocketIP,webSocketDetails.websocketPort,webSocketDetails.websocketPassword)
  //write to file
  let sData = JSON.stringify(webSocketDetails)
  const userpath = app.getPath('userData')
  fs.writeFileSync(`${userpath}/webSocket_server_setting.txt`,sData)

})

ipcMain.handle('get-obs-connection', async (event) => {
  console.log("set OBS connection defaults")
  const userpath = app.getPath('userData')
  console.log(userpath)
  //console.log(fs.exists(`${userpath}/webSocket_server_setting.txy`))
  if(fs.existsSync(`${userpath}/webSocket_server_setting.txt`)){
    let dt = fs.readFileSync(`${userpath}/webSocket_server_setting.txt`)
    let data = JSON.parse(dt)
    console.log(data)
    return data
  }
})

ipcMain.on('wsConnect', (event) => {
  console.log("sending websocket details to new window") 
  console.log(webSocketDetails )
  event.returnValue = webSocketDetails
})
//#endregion
