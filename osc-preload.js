const { contextBridge, ipcRenderer } = require("electron");
("use strict");
var { Server } = require("node-osc");
const OBSWebSocket = require("obs-websocket-js").default;

contextBridge.exposeInMainWorld("electronAPI", {
  handleGetOBSWSdetails: () => ipcRenderer.invoke("get-obsWSdetails"),
  createOCSserver: (IP, PORT, PW, oscIP, oscPORT) =>
    createOCSserver(IP, PORT, PW, oscIP, oscPORT),
});

var scripts = [
  // { source: "./obs-ws.js", type: "", async: false },
  //{ source: "./obsConnect.js", type: "", async: false },
  { source: "./osc-renderer.js", type: "", async: false },
];
//Insert javascript
window.addEventListener("DOMContentLoaded", async () => {
  scripts.forEach((script) => {
    const scriptElem = document.createElement("script");
    scriptElem.src = script.source;
    scriptElem.async = script.async;
    if (script.type) {
      scriptElem.type = script.type;
    }
    scriptElem.onload = () => {
      console.log(`${script.source} Script loaded successfuly`);
    };
    scriptElem.onerror = () => {
      console.log(`${script.source} Error occurred while loading script`);
    };
    document.body.appendChild(scriptElem);
  });
});

//createOCSserver()
async function createOCSserver(
  websocketIP,
  websocketPort,
  websocketPassword,
  oscIP,
  oscPORT
) {
  const obs = new OBSWebSocket(websocketIP, websocketPort, websocketPassword);
  //connect to OBS web socket server
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      `ws://${websocketIP}:${websocketPort}`,
      websocketPassword,
      {
        rpcVersion: 1,
      }
    );
    console.log(
      `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    );
    //document.title = "connection set";
  } catch (error) {
    console.error("Failed to connect", error.code, error.message);
  }
  obs.on("error", (err) => {
    console.error("Socket error:", err);
  });
  console.log(`ws://${websocketIP}:${websocketPort}`);

  //async function createOCSserver() {
  console.log(typeof oscPORT, typeof oscIP);
  console.log(oscPORT, oscIP);
  var oscServer = new Server(oscPORT, oscIP);

  oscServer.on("listening", () => {
    console.log("OSC Server is listening.");
  });

  oscServer.on("message", (msg) => {
    console.log(`Message: ${msg}`);
    window.document.body.innerHTML += `${msg} <br>`;
    sendToOBS(msg, obs);
  });
  
  function sendToOBS(msg, obs) {
    console.log("sending message:",JSON.stringify(msg));
    const webSocketMessage = JSON.stringify(msg);
    //send results to OBS Browser Source
    obs.call("CallVendorRequest", {
      vendorName: "obs-browser",
      requestType: "emit_event",
      requestData: {
        event_name: "midi-message",
        event_data: { webSocketMessage },
      },
    });

    //send results to Advanced Scene Switcher
    obs.call("CallVendorRequest", {
      vendorName: "AdvancedSceneSwitcher",
      requestType: "AdvancedSceneSwitcherMessage",
      requestData: {
        message: webSocketMessage,
      },
    });
  }
}
