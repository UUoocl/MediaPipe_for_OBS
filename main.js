const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron/main')
const path = require('path')

let mainWindow, poseWindow, segmentationWindow;

var windowSetup, source;

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

//#region create main window
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    x: 0,
    y: 0,
    title: __dirname,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}
//#endregion



//#region IPC send desktop sources list to main window
ipcMain.handle('get-sources', async () => {
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

//#region Open-New-windows

ipcMain.on('open-pose-window', (event, IP, Port, PW, projectorID, sourceName) => {
  console.log("main received IPC")
  poseWindow = new BrowserWindow({
    width: 300,
    height: 300,
    x: 100,
    y: 100,
    frame: true,
    resizable: true,
    //roundedCorners: false,
    movable: true,
    titleBarOverlay: false,
    transparent: false,
    titleBarStyle: 'customButtonsOnHover',
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


//#region IPC APIs
ipcMain.handle('get-obsWSdetails', async () => {
  console.log("sending websocket and projector window details to new window")
  return windowSetup;
})

//#endregion