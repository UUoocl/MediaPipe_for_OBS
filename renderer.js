//variables
var desktopSources = [];

const poseButton = document.getElementById("PoseButton");
const wsConnectButton = document.getElementById("WSconnectButton");
const refreshPrjButton = document.getElementById("refreshProjector");
const refreshInputButton = document.getElementById("refreshInputs");
const refreshMidiButton = document.getElementById("refreshMidi");

let moveOffScreenButton, movePrimaryScreenButton;

//window.addEventListener('DOMContentLoaded', async () => {
loadScript();
async function loadScript() {
  setWSdefaults();
  //startWSconnection();
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  loadProjectorOptions();
  getInputSources();
  getMidiSources();
}

//Connect to OBS Web Socket Server
wsConnectButton.addEventListener("click", startWSconnection);

//refresh buttons
refreshPrjButton.addEventListener("click", ipcGetDesktopSources);
refreshInputButton.addEventListener("click", getInputSources);
refreshMidiButton.addEventListener("click", getMidiSources);

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
  document.getElementById("audioIn").innerHTML = null;
  //console.log("list of Audio Input Sources")
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) => {
      if (device.kind == "audioinput") {
        //        console.log(device)
        //      console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        var x = document.getElementById("audioIn");
        var option = document.createElement("option");
        option.text = device.label;
        option.id = device.deviceId;
        x.add(option);
      }
    });
  });
}

function getMidiSources() {
  if(document.getElementById("MidiIn")){
  document.getElementById("MidiIn").innerHTML = null;}
  if(document.getElementById("MidiOut")){
  document.getElementById("MidiOut").innerHTML = null;}
  //console.log("list of Audio Input Sources")
  
  //Access MIDI devices
  let midi = null; // global MIDIAccess object
  function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");
    midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
    listInputsAndOutputs(midi)
  }

  function onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`);
  }

  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  //List Midi inputs and outputs
  function listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
      console.log(
        `Input port [type:'${input.type}']` +
          ` id:'${input.id}'` +
          ` manufacturer:'${input.manufacturer}'` +
          ` name:'${input.name}'` +
          ` version:'${input.version}'`,
      )
      var x = document.getElementById("midiIn");
      var option = document.createElement("option");
      option.text = input.name;
      option.id = input.id;
      x.add(option);
    }
  
    for (const entry of midiAccess.outputs) {
      const output = entry[1];
      console.log(
        `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
      );
      var x = document.getElementById("midiOut");
      var option = document.createElement("option");
      option.text = output.name;
      option.id = output.id;
      x.add(option);
    }
  }
  


}

async function ipcGetDesktopSources() {
  document.getElementById("projectors").innerHTML = null;
  desktopSources = await window.electronAPI.handleGetDesktopSources();
  //console.log("Test returned:", desktopSources)
  loadProjectorOptions();
}

async function startWSconnection() {
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  console.log("obsConnect js called", IP, Port, PW);

  //connectOBS function in the obsConnect.js
  connectionResult = await connectOBS(IP, Port, PW);
  console.log(connectionResult.socket)
  if(connectionResult.socket){
    document.getElementById("WSconnectButton").style.background='#00ff00';
  }else{document.getElementById("WSconnectButton").style.background='#ff0000';}

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

  console.log("call main");
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
  window.electronAPI.AudioInputWindow(IP, Port, PW, InputID, sourceName);
}
//#endregion

//#region Create Midi windows
var midiInput;
const midiButton = document.getElementById("midiButton");
midiButton.addEventListener("click", newMidiWindow);

async function newMidiWindow() {
  //get server details
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;

  //IPC message to open windows to start Media pipe
  //const OpenDesktopAudio = document.getElementById('');

  const In = document.getElementById("midiIn");
  console.log(In.value);
  console.log(In.options[In.selectedIndex].text);
  const inMidiName = In.value;
  const inMidiID = In.options[In.selectedIndex].id;
  const Out = document.getElementById("midiOut");
  console.log(Out.value);
  console.log(Out.options[Out.selectedIndex].text);
  const outMidiName = Out.value;
  const outMidiID = Out.options[In.selectedIndex].id;

  console.log(`${IP}, ${Port}, ${PW}, ${inMidiID}, ${inMidiName}, ${outMidiID}, ${outMidiName}`);
  console.log("call main");
  window.electronAPI.midiWindow(IP, Port, PW, inMidiID, inMidiName, outMidiID, outMidiName);
}
//#endregion


//#region Create Slide Window
const slideButton = document.getElementById("SlidesButton");
slideButton.addEventListener("click", newSlideWindow);

function newSlideWindow() {
  const IP = document.getElementById("IP").value;
  const Port = document.getElementById("Port").value;
  const PW = document.getElementById("PW").value;
  const Link = document.getElementById("Link").value;

  console.log(`${IP}, ${Port}, ${PW}, ${Link}`);

  window.electronAPI.slideWindow(IP, Port, PW, Link);
}
//#endregion
