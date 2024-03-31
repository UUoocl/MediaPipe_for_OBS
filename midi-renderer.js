console.log("Document Loaded");
var setupDetails,
  sourceWidth,
  sourceHeight,
  eltWidth,
  eltHeight,
  windowID,
  sourceName,
  MPvalues;
var frameRate, FPSElement, canvasElement, IP, PORT, PW, midiOutID, midiInID, midiInIndex, midiOutIndex;
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
    midiOutID =  setupDetails.outoutID
    midiInID = setupDetails.inputID
  // await connectOBS(wss.ip,
  //   wss.port,
  //   wss.pw,
  //   )

  await connectOBS(IP,PORT,PW)
}//   navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
// }

// //Access MIDI devices
// let midi = null; // global MIDIAccess object
// var outputdev = null;

// function onMIDISuccess(midiAccess) {
//   console.log("MIDI ready!");
//   midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
//   console.log(midiAccess)
  
//   for (const entry of midiAccess.inputs) {
//     const input = entry[1];
//     console.log(
//       `Input port [type:'${input.type}']` +
//         ` id:'${input.id}'` +
//         ` manufacturer:'${input.manufacturer}'` +
//         ` name:'${input.name}'` +
//         ` version:'${input.version}'`,
//     )

//  startLoggingMIDIInput(midi) 
  
// }
// }
// function onMIDIMessage(event) {
//   console.log(event)

//   let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
//   for (const character of event.data) {
//     str += `0x${character.toString(16)} `;

//   }
//   console.log(str);
//   if(str){
    
//     document.getElementById("midi").innerHTML = str
//     //document.getElementById("midiData").innerHTML = `${event.data.0}`

// }
// }

// function startLoggingMIDIInput(midiAccess) {
//   console.log("next step")
  
//   midiAccess.inputs.forEach((entry) => {
//     console.log(entry)
//     entry.onmidimessage = onMIDIMessage;
//   });
// }

// function onMIDIFailure(msg) {
//   console.error(`Failed to get MIDI access - ${msg}`);
// }

