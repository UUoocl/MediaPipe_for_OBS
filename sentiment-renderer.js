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

setup()
//window.addEventListener("DOMContentLoaded", async () => {

async function setup(){

  //get obs ws socket details
  setupDetails = await window.electronAPI.handleGetOBSWSdetails();
  console.log("IPC connect details")
  IP = setupDetails.websocketIP
  PORT = setupDetails.websocketPort
  PW =  setupDetails.websocketPassword
    
  await connectOBS(IP,PORT,PW)





};

async function ExportToOBS() {}