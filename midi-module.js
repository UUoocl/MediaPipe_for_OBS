// Enable WEBMIDI.js and trigger the onEnabled() function when ready
WebMidi.enable()
  .then(onEnabled)
  .catch((err) => alert(err));

// Function triggered when WEBMIDI.js is ready
function onEnabled() {
  // Display available MIDI input devices
  if (WebMidi.inputs.length < 1) {
    document.body.innerHTML += "No device detected.";
  } else {
    WebMidi.inputs.forEach((device, index) => {
    
      console.log(device.id , midiInID,device.id == midiInID);
      if (device.id == midiInID) {
        //midiInIndex = index;
        addDeviceListener(index);
      }
      document.body.innerHTML += `${index}: ${device.name} <br>`;
    });
  }
  // const mySynth = WebMidi.inputs[0];
  // // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")

  // mySynth.channels[1].addListener("noteon", e => {
  //   document.body.innerHTML+= `${e.note.name} <br>`;
  // });

  // Listen to 'midi message' events on channels 1, 2 and 3 of the selected input MIDI device
  function addDeviceListener(index) {
    //const mySynth = WebMidi.getInputById(midiInID);
    //console.log(mySynth);
    WebMidi.inputs[index].addListener(
      "midimessage",(e) => sendMidiMessage(e),
      { channels: [1, 2, 3] }
    );

    //send message to OBS Browser and Advanced Scene Switcher
    function sendMidiMessage(e){
        document.body.innerHTML += `${e} <br>`;
        console.log(JSON.stringify(e.message));
        const webSocketMessage = JSON.stringify(e.message)
    //send results to OBS Browser Source
     obs.call("CallVendorRequest", {
        vendorName: "obs-browser",
        requestType: "emit_event",
        requestData: {
          event_name: "midi-message",
          event_data: { webSocketMessage},
        },
      });
      
      //send results to Advanced Scene Switcher
      obs.call("CallVendorRequest", {
        vendorName: "AdvancedSceneSwitcher",
        requestType: "AdvancedSceneSwitcherMessage",
        requestData: {
          "message": webSocketMessage,
        },
      });
      }
    }
}
