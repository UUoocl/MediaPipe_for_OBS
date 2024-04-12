console.log("Document Loaded");
__electronLog.info('Log from the renderer');
var setupDetails,
  sourceWidth,
  sourceHeight,
  eltWidth,
  eltHeight,
  windowID,
  sourceName,
  MPvalues;
var frameRate, FPSElement, canvasElement, IP, PORT, PW, sourceName;

async function updateFPS() {
  console.log("FPS changed", windowID);
  frameRate = document.getElementById("FPS").value;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: windowID,
        maxFrameRate: frameRate,
      },
    },
  });
  handleStream(stream);
}
setup()
//window.addEventListener("DOMContentLoaded", async () => {
async function setup(){
document.getElementById("FPS").addEventListener("change", updateFPS);
  //read FPS input
  frameRate = document.getElementById("FPS").value;

  //add video element
  var domElement = document.createElement("video");
  domElement.setAttribute("playsinline", "");
  domElement.setAttribute("id", "projector");
  document.body.prepend(domElement);

  //add canvas element
  canvasElement = document.createElement("canvas");
  canvasElement.setAttribute("class", "output_canvas");
  canvasElement.setAttribute("id", "output_canvas");
  canvasElement.setAttribute(
    "style",
    "position: absolute; left: 0px; top: 0px;"
  );

  document.body.prepend(canvasElement);

  //get obs ws socket details
  setupDetails = await window.electronAPI.handleGetOBSWSdetails();
  console.log("IPC connect details", setupDetails)
  IP = setupDetails.websocketIP
  PORT = setupDetails.websocketPort
  PW =  setupDetails.websocketPassword
  sourceName =  setupDetails.sourceName
  
  await connectOBS(IP,PORT,PW)

  //get source width and Height
  console.log("get ");
  sourceInput = await obs.call("GetInputSettings", {
    inputName: sourceName,
  });
  console.log(sourceInput.inputSettings.resolution);
  console.log(sourceInput.inputSettings.resolution.includes("x"));
  //get source width and height for windows
  if (sourceInput.inputSettings.resolution.includes("x")) {
    const resolution = sourceInput.inputSettings.resolution.split("x");
    sourceWidth = resolution[0];
    sourceHeight = resolution[1];
  }
  //get video source width and height MacOS
  else {
    sourceWidth = JSON.parse(sourceInput.inputSettings.resolution).width;
    sourceHeight = JSON.parse(sourceInput.inputSettings.resolution).height;
  }
  console.log(sourceInput, sourceHeight, sourceWidth);

  //get projector window ID
  windowID = setupDetails.windowID;

  //check if text source exists to store MediaPipe values
  //sourceName = setupDetails.sourceName;

  //
  const sourceList = await obs.call("GetInputList", {
    inputKind: "text_gdiplus_v2",
  });
  console.log(sourceList);

  //start desktopcapture stream
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: windowID,
        maxFrameRate: frameRate,
      },
    },
  });
  console.log(stream);
  stream.getTracks().forEach(function (track) {
    console.log(track.getSettings());
  });
  handleStream(stream);
};

function handleStream(stream) {
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.play();
  console.log(video.srcObject);
  //const video = document.querySelector('video')
  var v = document.getElementById("projector");

  v.addEventListener(
    "loadedmetadata",
    function (e) {
      (eltWidth = this.videoWidth), (eltHeight = this.videoHeight);
      console.log(`width: ${eltWidth}`);
      console.log(`height: ${eltHeight}`);
      canvasElement.setAttribute("width", eltWidth);
      canvasElement.setAttribute("height", eltHeight);
    },
    false
  );
}

async function ExportToOBS() {}