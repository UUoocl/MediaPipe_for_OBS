//variables 
var desktopSources = [];

const button = document.getElementById('SubmitButton');
const wsButton = document.getElementById('WSconnectButton');

let moveOffScreenButton, movePrimaryScreenButton;

window.addEventListener('DOMContentLoaded', async () => {
  startWSconnection();
  desktopSources = await window.electronAPI.handleGetSources();
  loadOptions();
})

//Connect to OBS Web Socket Server
wsButton.addEventListener("click", ipcGetSources);

async function ipcGetSources() {
  desktopSources = await window.electronAPI.handleGetSources();
  console.log("Test returned:", desktopSources)
  loadOptions();
}

async function startWSconnection() {
  const IP = document.getElementById('IP').value;
  const Port = document.getElementById('Port').value;
  const PW = document.getElementById('PW').value;
  console.log("obsConnect js called")
  connectOBS(IP, Port, PW);
}

//Add Projector windows to the drop down list. 
function loadOptions() {
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

//Create new MediaPipe windows
var sourceInput, sourceWidth, sourceHeight;
button.addEventListener("click", newWindow);

async function newWindow() {
  //get server details
  const IP = document.getElementById('IP').value;
  const Port = document.getElementById('Port').value;
  const PW = document.getElementById('PW').value;

  //get source name
  const OpenProjector = document.getElementById('projectors').value;
  console.log("Open Window", OpenProjector)
  console.log("Window Pose ", poseWindow.checked)

  //IPC message to open windows to start Media pipe
  const OpenPose = document.getElementById('poseWindow');
  const OpenSegmentation = document.getElementById('segmentationWindow');
  console.log("OpenPose", poseWindow.checked)

  var e = document.getElementById("projectors");
  console.log(e.value)
  console.log(e.options[e.selectedIndex].text)
  var sourceName = e.value;
  var projectorID = e.options[e.selectedIndex].id;
  console.log(`${IP}, ${Port}, ${PW}, ${projectorID},${sourceName}`);

  if (poseWindow.checked) {
    console.log("call main")
    window.electronAPI.poseWindow(IP, Port, PW, projectorID, sourceName);
  }
}