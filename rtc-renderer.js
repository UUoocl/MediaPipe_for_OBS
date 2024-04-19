console.log("Document Loaded");
var setupDetails, IP, PORT, PW, rtcID, rtcVideoId, rtcAudioId, rtcType;

let peerConnection = new RTCPeerConnection();

let localStream;
let offer, answer;

loadRenderer();
async function loadRenderer() {
  //get obs ws socket details
  setupDetails = await window.electronAPI.handleGetOBSWSdetails();
  console.log("IPC connect details");

  IP = setupDetails.websocketIP;
  PORT = setupDetails.websocketPort;
  PW = setupDetails.websocketPassword;
  rtcID = setupDetails.rtcClientID;
  rtcVideoId = setupDetails.rtcVideoId;
  rtcAudioId = setupDetails.rtcAudioId;
  rtcType = setupDetails.rtcType;
  document.getElementById("clientInfo").innerText = `Sending ${rtcType} to client ID "${rtcID}"`
  await connectOBS(IP, PORT, PW);

  var wssDetails = {
    IP: IP,
    PORT: PORT,
    PW: PW,
  };
  const event_name = `ws-details-for-client-${rtcID}`;
  console.log(event_name);
  await obs.call("CallVendorRequest", {
    vendorName: "obs-browser",
    requestType: "emit_event",
    requestData: {
      event_name: event_name,
      event_data: { wssDetails },
    },
  });

  //listen for answer message
  obs.on("CustomEvent", function (event) {
    console.log("rtc answer", event);
    if (event.event_name === `rtc-answer-${rtcID}`) {
      let answer = JSON.parse(event.event_data.answerMessage);
      if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
      }
    }
  });

  obs.on("CustomEvent", function (event) {
    console.log("wss response", event);
    if (event.event_name === `client-connected-${rtcID}`) {
      init();
    }
  });
}

async function init() {
  //let init = async () => {
  //get a video stream
  if (rtcType.includes("Video")) {
    console.log("Video stream");
    console.log(navigator.mediaDevices.getSupportedConstraints());
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: rtcVideoId,
        },
      },
    });
    //add video track to host
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }

  //add audio stream
  if (rtcType.includes("Audio")) {
    console.log("Audio stream");
    var localAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: rtcAudioId },
      video: false,
    });

    //add audio track to host
    localAudioStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localAudioStream);
    });
  }

//  document.getElementById("user-1").srcObject = localStream;

  createOffer();
}

//createOffer
let createOffer = async () => {
  peerConnection.onicecandidate = async (event) => {
    //Event that fires off when a new offer ICE candidate is created
    if (event.candidate) {
      console.log("create offer", offer);

      const offerMessage = JSON.stringify(peerConnection.localDescription);
      await obs.call("CallVendorRequest", {
        vendorName: "obs-browser",
        requestType: "emit_event",
        requestData: {
          event_name: `rtc-offer-${rtcID}`,
          event_data: { offerMessage },
        },
      });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
};
