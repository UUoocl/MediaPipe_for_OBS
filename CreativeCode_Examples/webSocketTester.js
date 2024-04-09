window.addEventListener("pose-landmarks", function (event) {
    //console.log("message received: ",event)
    document.getElementById("poseResults").innerText=JSON.stringify(event.detail.poseLandmarkerResult)
  });


  window.addEventListener("sentimentResult", function (event) {
    //console.log("sentiment received: ",event)
    document.getElementById("sentimentResult").innerText=JSON.stringify(event.detail.result)
  });

  window.addEventListener("audio-input", function (event) {
    //console.log("audio received: ",event)
    document.getElementById("audioFFT").innerText=JSON.stringify(event.detail)
  });

  window.addEventListener("midi-message", function (event) {
    //console.log("midi received: ",event)
    document.getElementById("midiMessage").innerText=JSON.stringify(event.detail)
  });

  window.addEventListener("gamepad-message", function (event) {
    //console.log("gamepad-message received: ",event)
    document.getElementById("gamepad-message").innerText=JSON.stringify(event.detail.webSocketMessage)
  });

  window.addEventListener("osc-message", function (event) {
    console.log("osc-message received: ",event)
    document.getElementById("osc-message").innerText=JSON.stringify(event.detail.webSocketMessage)
  });

  document.getElementById("gamepad-message").innerText="hello"