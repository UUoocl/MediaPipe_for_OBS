//variables 
var desktopSources = [];

const poseButton = document.getElementById('PoseButton');
const wsConnectButton = document.getElementById('WSconnectButton');
const refreshPrjButton = document.getElementById('refreshProjector');
const refreshInputButton = document.getElementById('refreshInputs');

let moveOffScreenButton, movePrimaryScreenButton;

//window.addEventListener('DOMContentLoaded', async () => {
loadScript();
async function loadScript(){
  setWSdefaults();
  //startWSconnection();
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  loadProjectorOptions();
  getInputSources();
}

async function setWSdefaults(){
  console.log("set OBS connection defaults")
  savedConnection = await window.electronAPI.getOBSconnection();
  console.log(savedConnection)
  console.log(typeof savedConnection)
  if(savedConnection){  
    document.getElementById("IP").value = savedConnection.websocketIP;
    document.getElementById("Port").value = savedConnection.websocketPort;
    document.getElementById("PW").value = savedConnection.websocketPassword;
  }
}

//Connect to OBS Web Socket Server
wsConnectButton.addEventListener("click", startWSconnection);
refreshPrjButton.addEventListener("click", ipcGetDesktopSources);
refreshInputButton.addEventListener("click", getInputSources);

function getInputSources(){ 
  document.getElementById("audioIn").innerHTML = null
  //console.log("list of Audio Input Sources")
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
          if(device.kind == "audioinput"){    
    //        console.log(device)
      //      console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
            var x = document.getElementById("audioIn");
            var option = document.createElement("option");
            option.text = device.label;
            option.id = device.deviceId;
            x.add(option);    
          }
      });
    })
}


async function ipcGetDesktopSources() {
  document.getElementById("projectors").innerHTML = null; 
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  //console.log("Test returned:", desktopSources)
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
  window.electronAPI.setOBSconnection(IP, Port, PW);
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
  const IP = document.getElementById('IP').value;
  const Port = document.getElementById('Port').value;
  const PW = document.getElementById('PW').value;

  //get source name
  const OpenProjector = document.getElementById('projectors').value;
  console.log("Open Window", OpenProjector)
  
  //IPC message to open windows to start Media pipe
  //const OpenPose = document.getElementById('poseWindow');
  
  const e = document.getElementById("projectors");
  console.log(e.value)
  console.log(e.options[e.selectedIndex].text)
  const sourceName = e.value;
  const projectorID = e.options[e.selectedIndex].id;
  console.log(`${IP}, ${Port}, ${PW}, ${projectorID},${sourceName}`);
  
  console.log("call main")
  window.electronAPI.poseWindow(IP, Port, PW, projectorID, sourceName);
}
//#endregion

//#region Create Desktop Audio windows
var sourceInput, sourceWidth, sourceHeight;
const desktopAudioButton = document.getElementById('audioButton');
desktopAudioButton.addEventListener("click", newAudioWindow);

async function newAudioWindow() {
  //get server details
  const IP = document.getElementById('IP').value;
  const Port = document.getElementById('Port').value;
  const PW = document.getElementById('PW').value;
  
  //IPC message to open windows to start Media pipe
  //const OpenDesktopAudio = document.getElementById('');
  
  const e = document.getElementById("audioIn");
  console.log(e.value)
  console.log(e.options[e.selectedIndex].text)
  const sourceName = e.value;
  const InputID = e.options[e.selectedIndex].id;
  console.log(`${IP}, ${Port}, ${PW}, ${InputID}`);
  
  console.log("call main")
  window.electronAPI.AudioInputWindow(IP, Port, PW, InputID, sourceName);
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