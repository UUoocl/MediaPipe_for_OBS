console.log("Document Loaded");
var setupDetails,
  sourceWidth,
  sourceHeight,
  eltWidth,
  eltHeight,
  windowID,
  sourceName,
  MPvalues;
var frameRate, FPSElement, canvasElement, IP, PORT, PW;
var now;
var then = Date.now();
var interval;
var delta;

loadRenderer();
//window.addEventListener("DOMContentLoaded", async () => {
async function loadRenderer() {
  
  //add paragraph element
  var domElement = document.createElement("p");
  document.body.prepend(domElement);

  //get obs ws socket details
  setupDetails = await window.electronAPI.handleGetOBSWSdetails();
  console.log("IPC connect details");
  console.log(setupDetails)
    IP = setupDetails.websocketIP
    PORT = setupDetails.websocketPort
    PW =  setupDetails.websocketPassword



  await connectOBS(IP,PORT,PW)
}

