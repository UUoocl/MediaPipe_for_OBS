//variables 
var desktopSources = [];

const poseButton = document.getElementById('PoseButton');
const wsConnectButton = document.getElementById('WSconnectButton');
const refreshButton = document.getElementById('refreshProjector');


let moveOffScreenButton, movePrimaryScreenButton;

//window.addEventListener('DOMContentLoaded', async () => {
loadScript();
async function loadScript(){
  setWSdefaults();
  startWSconnection();
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  loadProjectorOptions();
}

function setWSdefaults(){
  if(wss.pw){  
    document.getElementById("IP").value = wss.ip;
    document.getElementById("Port").value = wss.port;
    document.getElementById("PW").value = wss.pw;
  }
}

//Connect to OBS Web Socket Server
wsConnectButton.addEventListener("click", startWSconnection);
refreshButton.addEventListener("click", ipcGetDesktopSources);

async function ipcGetDesktopSources() {
  document.getElementById("projectors").innerHTML = null; 
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  console.log("Test returned:", desktopSources)
  loadProjectorOptions();
}

async function startWSconnection() {
  const IP = document.getElementById('IP').value;
  const Port = document.getElementById('Port').value;
  const PW = document.getElementById('PW').value;
  console.log("obsConnect js called", IP, Port, PW)
  //connectOBS function in the obsConnect.js
  connectOBS(IP, Port, PW);
  //Save IP, Port,PW to file
  console.log("calling ipc contextBridge.")
  window.electronAPI.OBSconnection(IP, Port, PW);
}

//Add Projector windows to the drop down list. 
function loadProjectorOptions() {
  console.log("list of sources ", desktopSources)
  for (const source of desktopSources) {
    if (source.name.startsWith("Windowed Projector (Source)")) {
      var x = document.getElementById("projectors");
      var option = document.createElement("option");
      option.text = source.name.replace("Windowed Projector (Source) -", "");
      option.id = source.id;
      x.add(option);
    };
  }
}

//#region Create new MediaPipe windows
var sourceInput, sourceWidth, sourceHeight;
poseButton.addEventListener("click", newPoseWindow);

async function newPoseWindow() {
  //get server details
  const IP = wss.ip  //document.getElementById('IP').value;
  const Port = wss.port //document.getElementById('Port').value;
  const PW = wss.pw //document.getElementById('PW').value;

  //get source name
  const OpenProjector = document.getElementById('projectors').value;
  console.log("Open Window", OpenProjector)
  
  //IPC message to open windows to start Media pipe
  const OpenPose = document.getElementById('poseWindow');
  
  var e = document.getElementById("projectors");
  console.log(e.value)
  console.log(e.options[e.selectedIndex].text)
  var sourceName = e.value;
  var projectorID = e.options[e.selectedIndex].id;
  console.log(`${IP}, ${Port}, ${PW}, ${projectorID},${sourceName}`);
  
  console.log("call main")
  window.electronAPI.poseWindow(IP, Port, PW, projectorID, sourceName);
}
//#endregion

//#region Create Slide Window
const slideButton = document.getElementById('SlidesButton');
slideButton.addEventListener("click", newSlideWindow);

function newSlideWindow() {
  const IP = document.getElementById('IP').value;
  const Port = document.getElementById('Port').value;
  const PW = document.getElementById('PW').value;
  const Link = document.getElementById('Link').value;
  
  console.log(`${IP}, ${Port}, ${PW}, ${Link}`);  

  window.electronAPI.slideWindow(IP, Port, PW, Link);
}
//#endregion