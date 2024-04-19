const { contextBridge, ipcRenderer } = require("electron");
("use strict");
var { Client, Server, Message } = require("node-osc");
const OBSWebSocket = require("obs-websocket-js").default;

contextBridge.exposeInMainWorld("electronAPI", {
  handleGetOBSWSdetails: () => ipcRenderer.invoke("get-obsWSdetails"),
  createOCSserver: (IP, PORT, PW, oscIP, oscInPORT, oscOutPORT) =>
    createOCSserver(IP, PORT, PW, oscIP, oscInPORT, oscOutPORT),
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

//createOCSserver
async function createOCSserver(
  websocketIP,
  websocketPort,
  websocketPassword,
  oscIP,
  oscInPORT,
  oscOutPORT
) {
  /*
   *connect to OBS web socket server
   */
  const obs = new OBSWebSocket(websocketIP, websocketPort, websocketPassword);
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

  /*
   *Create OSC Server In Port
   */
  console.log(typeof oscInPORT, typeof oscIP);
  console.log(oscInPORT, oscIP);

  var oscServer = new Server(oscInPORT, oscIP);

  oscServer.on("listening", () => {
    console.log("OSC Server is listening.");
  });

  oscServer.on("message", (msg) => {
    console.log(`Message: ${msg}`);
    window.document.getElementById("messages").innerHTML = `${msg} <br> ${
      window.document.getElementById("messages").innerHTML
    }`;
    sendToOBS(msg, obs);
  });

  /*
   *Create OSC Client Out Port
   *message from OBS to Zoom
   */
  const client = new Client(oscIP, oscOutPORT);
  console.log(client, oscIP, oscOutPORT, oscInPORT);

  obs.on("CustomEvent", function (event) {
    console.log(event);
    if (event.event_name === "OSC-out") {
      const message = new Message(event.address);
      if (Object.hasOwn(event, 'arg1')) {
        message.append(event.arg1);
        console.log(message);
      }
      if (Object.hasOwn(event, 'arg2')) {
        message.append(event.arg2);
        console.log(message);
      }
      if (Object.hasOwn(event, 'arg3')) {
        message.append(event.arg3);
        console.log(message);
      }
      if (Object.hasOwn(event, 'arg4')) {
        message.append(event.arg4);
        console.log(message);
      }
      if (Object.hasOwn(event, 'arg5')) {
        message.append(event.arg5);
        console.log(message);
      }
      if (Object.hasOwn(event, 'arg6')) {
        message.append(event.arg6);
        console.log(message);
      }
      if (Object.hasOwn(event, 'arg7')) {
        message.append(event.arg7);
        console.log(message);
      }
      console.log(message)
      client.send(message, (err) => {
        if (err) {
          console.error(new Error(err));
        }
      });
      //client.send(`${event.command} "${event.data}"`)
    }
  });

  /*
   *Forward In Port messages to OBS
   */

  function sendToOBS(msg, obs) {
    console.log("sending message:", JSON.stringify(msg));
    const webSocketMessage = JSON.stringify(msg);
    //send results to OBS Browser Source
    obs.call("CallVendorRequest", {
      vendorName: "obs-browser",
      requestType: "emit_event",
      requestData: {
        event_name: "osc-message",
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
