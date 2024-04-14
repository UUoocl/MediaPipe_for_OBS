const webRTCConfig = { iceServers: [] };
const webRTCConnection = {};
var scripts = [];

/**
 * The websocket connection to the server
 * @type {WebSocket}
 */
let webSocket = null;

/**
 * The WebConnection
 * @type {WebConnection}
 */
let connection = null;

function sendToWebSocket({ id, action, data }) {
  const json = {
    id,
    action,
    data,
  };
  webSocket.send(JSON.stringify(json));
}

function initialize() {
  const debug = false;
  if (debug) {
    webSocket = new WebSocket(`ws://127.0.0.1:${parseInt(location.port) + 1}`);
  }

  const connectionDiv = document.getElementById("connection");
  const hostButton = document.getElementById("hostButton");
  const joinButton = document.getElementById("joinButton");

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.get("isHost");
  if (searchParams.get("isHost")) {
    connectionDiv.classList.add("hide");
    connect(true);
  } else {
    connectionDiv.classList.add("hide");
    connect(false);
  }
}

/**
 * Connect to the server
 * @param {bool} asHost
 */
async function connect(asHost) {
  webSocket = new WebSocket(`ws://127.0.0.1:${parseInt(location.port) + 1}`);

  // Create the peer connection and listen for the connected event
  connection = new WebConnection();
  console.log("connection", connection);
  connection.addEventListener("connected", (e) => {});
  connection.addEventListener("signal", (e) => {
    sendToWebSocket(e.detail);
  });
  connection.addEventListener("display", (e) => {});
  connection.addEventListener("log", (e) => {
    webSocket.send(`log: id:${connection.id} ${e.detail}`);
  });

  // Forward websocket signalling messages to the connection
  webSocket.onopen = (e) => {
    connection.create(asHost);
    if (!asHost) {
      // Request any host info
      webSocket.send("request");
    }
  };
  webSocket.onclose = (e) => {};
  webSocket.onerror = (e) => {};
  webSocket.onmessage = (e) => {
    var json = JSON.parse(e.data);
    switch (json.action) {
      case "offer":
        if (json.id !== connection.id) {
          connection.onOffer(json.id, json.data);
        }
        break;

      case "candidate":
        if (json.id !== connection.id) {
          connection.onIceCandidate(json.id, json.data);
        }
        break;

      case "answer":
        if (json.id !== connection.id) {
          connection.onAnswer(json.id, json.data);
        }
        break;

      case "desc":
        if (json.id !== connection.id) {
          connection.onDesc(json.id, json.data);
        }
        break;
    }
  };

}

async function loadScripts() {
    console.log("loadScripts started")
    //load scripts
    const searchParams = new URLSearchParams(window.location.search);
    const sketch = searchParams.get("p5");
    console.log("sketch", sketch);
    if(sketch){
    scripts = [
      //{"source":"lib/p5.js","type":"","async":false},
      //{"source":"lib/p5.sound.js","type":"","async":false},
      { source: `sketch/${sketch}.js`, type: "", async: false },
    ];
    

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
}
}

window.onerror = (e) => {
  if (webSocket) {
    webSocket.send("log: " + e);
  }
};
console.log(connection);

window.addEventListener("DOMContentLoaded", (event) => {
    initialize()
    console.log(event)
          //after loading Audio and Video start client scripts
          loadScripts;
          loadScripts();
});
