handleGetPTZ();
async function handleGetPTZ() {
  var now;
  var then = Date.now();
  var interval;
  var delta;
  var pt, p, t, z, ptzMessage, IP, PORT, PW;
  function updateFPS() {
    console.log("FPS changed");
    frameRate = document.getElementById("FPS").value;
    interval = 1000 / frameRate;
  }

  loadRenderer();
  async function loadRenderer() {
    //get obs ws socket details
    setupDetails = await window.electronAPI.handleGetOBSWSdetails();
    console.log("IPC connect details");
    console.log(
      setupDetails.websocketIP,
      setupDetails.websocketPort,
      setupDetails.websocketPassword,
      setupDetails.inputID
    );
    IP = setupDetails.websocketIP;
    PORT = setupDetails.websocketPort;
    PW = setupDetails.websocketPassword;

    await connectOBS(IP, PORT, PW);
  }

  //window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("FPS").addEventListener("change", updateFPS);
  //read FPS input
  frameRate = document.getElementById("FPS").value;
  interval = 1000 / frameRate;

  async function draw() {
    //console.log("draw started");
    drawVisual = requestAnimationFrame(draw);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
      pt = await window.electronAPI.handleRunPTZcommand(
        "/Applications/Utilities/uvc-util -I 0 -o pan-tilt-abs"
      );
      pt = JSON.parse(pt);
      if (Object.hasOwn(pt, "pan")) {
        // -- Insta360 min and max pan -500000 to +500000.  Scaled to 0-100
        // -- OBSBOT Tiny 2 min and max pan -450000 to +450000.  Scaled to 0-100
        p = Math.floor(((Number(pt.pan) + 450000) / 900000) * 100);
        // -- Insta360 min and max tilt -300000 to +300000.  Scaled to 0-100
        t = Math.floor(((Number(pt.tilt) + 300000) / 600000) * 100);
      }

      z = await window.electronAPI.handleRunPTZcommand(
        "/Applications/Utilities/uvc-util -I 0 -g zoom-abs"
      );
      z = JSON.parse(z);
      document.getElementById(
        "ptzData"
      ).innerHTML = `<p>Pan: ${p}, Tilt: ${t}, zoom:${z["zoom-abs "]}`;

      const ptzMessage = `"pan":${p},"tilt":${t},"zoom":${z["zoom-abs "]}`;
      //send results to OBS Browser Source
      obs.call("CallVendorRequest", {
        vendorName: "obs-browser",
        requestType: "emit_event",
        requestData: {
          event_name: "ptz-position-message",
          event_data: { ptzMessage },
        },
      });

      //send results to Advanced Scene Switcher
      const AdvancedSceneSwitcherMessage = JSON.stringify(ptzMessage);
      obs.call("CallVendorRequest", {
        vendorName: "AdvancedSceneSwitcher",
        requestType: "AdvancedSceneSwitcherMessage",
        requestData: {
          message: ptzMessage,
        },
      });

      then = now - (delta % interval);
    }
  }
  draw();
}
