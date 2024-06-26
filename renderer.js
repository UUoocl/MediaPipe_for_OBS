//variables
var desktopSources = [];

const poseButton = document.getElementById("PoseButton");
const wsConnectButton = document.getElementById("WSconnectButton");
const refreshPrjButton = document.getElementById("refreshProjector");
const refreshInputButton = document.getElementById("refreshInputs");
const refreshrtcVideoButton = document.getElementById("refreshVideoRTC");
const refreshrtcAudioButton = document.getElementById("refreshAudioRTC");

let moveOffScreenButton, movePrimaryScreenButton;

//window.addEventListener('DOMContentLoaded', async () => {
loadScript();
async function loadScript() {
  setWSdefaults();

  desktopSources = await window.electronAPI.handleGetDesktopSources();
  loadProjectorOptions();
  getInputSources();
  //getMidiSources();
  loadrtcVideoOptions();
}

//Connect to OBS Web Socket Server
wsConnectButton.addEventListener("click", startWSconnection);

//refresh buttons
refreshPrjButton.addEventListener("click", ipcGetDesktopSources);
refreshInputButton.addEventListener("click", getInputSources);
//refreshMidiButton.addEventListener("click", getMidiSources);
refreshrtcVideoButton.addEventListener("click", ipcGetDesktopSources);
refreshrtcAudioButton.addEventListener("click", getInputSources);

async function setWSdefaults() {
  console.log("set OBS connection defaults");
  savedConnection = await window.electronAPI.getOBSconnection();
  console.log(savedConnection);
  console.log(typeof savedConnection);
  if (savedConnection) {
    document.getElementById("IP").value = savedConnection.websocketIP;
    document.getElementById("Port").value = savedConnection.websocketPort;
    document.getElementById("PW").value = savedConnection.websocketPassword;
  }
}

function getInputSources() {
  if (document.getElementById("audioIn")) {
    document.getElementById("audioIn").innerHTML = null;
    document.getElementById("rtcAudioSources").innerHTML = null;
  }
  console.log("audio input refresh");
  let x = document.getElementById("audioIn");
  let rtcEl = document.getElementById("rtcAudioSources");
  var option = document.createElement("option");
  var rtcOption = document.createElement("option");

  option.text = "--Please choose a source--";
  option.id = "";
  x.add(option);
  rtcEl.add(option);

  console.log("list of Audio Input Sources");
  console.log(navigator.mediaDevices.enumerateDevices());
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) => {
      if (device.kind == "audioinput") {
        //        console.log(device)
        //      console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        x = document.getElementById("audioIn");
        rtcEl = document.getElementById("rtcAudioSources");
        option = document.createElement("option");
        option.text = device.label;
        option.id = device.deviceId;
        x.add(option);
        rtcOption = document.createElement("option");
        rtcOption.text = device.label;
        rtcOption.id = device.deviceId;
        rtcEl.add(rtcOption);
      }
    });
    rtcEl.selectedIndex = 0;
  });
}

// window.addEventListener("gamepadconnected", (e) => {
//   console.log(
//     "Gamepad connected at index %d: %s. %d buttons, %d axes.",
//     e.gamepad.index,
//     e.gamepad.id,
//     e.gamepad.buttons.length,
//     e.gamepad.axes.length,
//     e
//   );

//   //console.log("list of Audio Input Sources")
//   console.log("navigator:", navigator);
//   gamepads = navigator.getGamepads();

//   //clear list of gamepads
//   if (document.getElementById("gamepad")) {
//     document.getElementById("gamepad").innerHTML = null;
//   }

//   gamepads.forEach((device) => {
//     if (device) {
//       console.log(device);
//       if (device) {
//         //      console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
//         var x = document.getElementById("gamepad");
//         var option = document.createElement("option");
//         option.text = `${device.index} ${device.id}`;
//         option.id = device.index;
//         x.add(option);
//       }
//     }
//   });
// });

async function ipcGetDesktopSources() {
  document.getElementById("projectors").innerHTML = null;
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  //console.log("Test returned:", desktopSources)
  loadProjectorOptions();
  loadrtcVideoOptions();
}

async function startWSconnection() {
  document.getElementById("WSconnectButton").style.background = "#ff0000";
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  console.log("obsConnect js called", IP, Port, PW);

  //connectOBS function in the obsConnect.js
  connectionResult = await connectOBS(IP, Port, PW);
  console.log(connectionResult.socket);
  if (connectionResult.socket) {
    document.getElementById("WSconnectButton").style.background = "#00ff00";
    var wssDetails = {
      IP: IP,
      PORT: Port,
      PW: PW,
    };
    //send websocket server connection details to OBS browser source
    await obs.call("CallVendorRequest", {
      vendorName: "obs-browser",
      requestType: "emit_event",
      requestData: {
        event_name: "ws-details",
        event_data: { wssDetails },
      },
    });
  } else {
    document.getElementById("WSconnectButton").style.background = "#ff0000";
  }

  //Save IP, Port,PW to file
  console.log("calling ipc contextBridge.");
  window.electronAPI.setOBSconnection(IP, Port, PW);
}

//Add Projector windows to the drop down list.
function loadProjectorOptions() {
  console.log("list of sources ", desktopSources);
  for (const source of desktopSources) {
    if (source.name.startsWith("Windowed Projector (Source)")) {
      var x = document.getElementById("projectors");
      var option = document.createElement("option");
      option.text = source.name.replace("Windowed Projector (Source) -", "");
      option.id = source.id;
      x.add(option);
    }
  }
}

//Add open windows to the drop down list.
function loadrtcVideoOptions() {
  document.getElementById("rtcWindows").innerHTML = null;
  var x = document.getElementById("rtcWindows");
  var option = document.createElement("option");
  option.text = "--Please choose a source--";
  option.id = "";
  x.add(option);

  for (const source of desktopSources) {
    x = document.getElementById("rtcWindows");
    option = document.createElement("option");
    option.text = source.name;
    option.id = source.id;
    x.add(option);
  }
}

//#region Create new MediaPipe windows
var sourceInput, sourceWidth, sourceHeight;
poseButton.addEventListener("click", newPoseWindow);

async function newPoseWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  //get source name
  const OpenProjector = document.getElementById("projectors").value;
  console.log("Open Window", OpenProjector);

  //IPC message to open windows to start Media pipe
  //const OpenPose = document.getElementById('poseWindow');

  const e = document.getElementById("projectors");
  console.log(e.value);
  console.log(e.options[e.selectedIndex].text);
  const sourceName = e.value;
  const projectorID = e.options[e.selectedIndex].id;
  console.log(`${IP}, ${Port}, ${PW}, ${projectorID},${sourceName}`);

  console.log("call main", IP, Port, PW, projectorID, sourceName);
  window.electronAPI.poseWindow(IP, Port, PW, projectorID, sourceName);
}
//#endregion

//#region Create Desktop Audio windows
var sourceInput;
const desktopAudioButton = document.getElementById("audioButton");
desktopAudioButton.addEventListener("click", newAudioWindow);

async function newAudioWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  //IPC message to open windows to start Media pipe
  //const OpenDesktopAudio = document.getElementById('');

  const e = document.getElementById("audioIn");
  console.log(e.value);
  console.log(e.options[e.selectedIndex].text);
  const sourceName = e.value;
  const InputID = e.options[e.selectedIndex].id;
  console.log(`${IP}, ${Port}, ${PW}, ${InputID}`);

  console.log("call main");
  window.electronAPI.audioInputWindow(IP, Port, PW, InputID, sourceName);
}
//#endregion

//#region Create Gamepad windows
var gamepadInput;
const gamepadButton = document.getElementById("gamepadButton");
gamepadButton.addEventListener("click", newGamepadWindow);

async function newGamepadWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  //IPC message to open windows to start gamepad
  //const OpenDesktopAudio = document.getElementById('');
  console.log("call main");
  window.electronAPI.gamepadWindow(IP, Port, PW);
}
//#endregion

//#region Create Midi windows
const midiButton = document.getElementById("midiButton");
midiButton.addEventListener("click", newMidiWindow);

async function newMidiWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  //IPC message to open windows to start Media pipe
  //const OpenDesktopAudio = document.getElementById('');

  console.log(
    `${IP}, ${Port}, ${PW}`
  );
  console.log("call main");
  window.electronAPI.midiWindow(
    IP,
    Port,
    PW
  );
}
//#endregion

//#region Create OSC windows
var oscInput;
const oscButton = document.getElementById("oscButton");
oscButton.addEventListener("click", newOscWindow);

async function newOscWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  const oscIP = document.getElementById("oscIP").value;
  const oscInPORT = document.getElementById("oscInPORT").value;
  const oscOutPORT = document.getElementById("oscOutPORT").value;

  console.log(`${IP}, ${Port}, ${PW}, ${oscIP}, ${oscInPORT},${oscOutPORT}`);
  console.log("call main");
  window.electronAPI.oscWindow(IP, Port, PW, oscIP, oscInPORT, oscOutPORT);
}
//#endregion

//#region MediaPipe text sentiment window
const sentimentButton = document.getElementById("SentimentButton");
sentimentButton.addEventListener("click", newSentimentWindow);

async function newSentimentWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  console.log(`${IP}, ${Port}, ${PW}`);
  console.log("call main");
  window.electronAPI.sentimentWindow(IP, Port, PW);
}
//#endregion

//#region webRTC Video window
const rtcVideoButton = document.getElementById("rtcButton");
rtcVideoButton.addEventListener("click", newRTCWindow);

async function newRTCWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  let rtcType = "";
  //get server details
  const rtcPort = document.getElementById("rtcPort").value;
  //Get video to stream
  const v = document.getElementById("rtcWindows");
  console.log(v.value);
  console.log(v.options[v.selectedIndex].text);
  const rtcVideoId = v.options[v.selectedIndex].id;
  rtcVideoId ? (rtcType = "Video") : rtcType;

  //get audio to stream
  const a = document.getElementById("rtcAudioSources");

  const rtcAudioId = a.options[a.selectedIndex].id;
  rtcAudioId ? (rtcType = `Audio${rtcType}`) : rtcType;

  console.log(`${rtcPort}, ${rtcVideoId}`, rtcType);
  console.log("call new rtc window on main");
  if (rtcType) {
    window.electronAPI.rtcWindow(
      IP,
      Port,
      PW,
      rtcPort,
      rtcVideoId,
      rtcAudioId,
      rtcType
    );
  }
}
//#endregion

//#region ptz window
const ptzButton = document.getElementById("ptzButton");
ptzButton.addEventListener("click", newPTZWindow);

async function newPTZWindow() {
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  window.electronAPI.ptzWindow(IP, Port, PW);
}
//#endregion
