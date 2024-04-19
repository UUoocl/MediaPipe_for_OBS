//const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();

async function connectOBS(websocketIP, websocketPort, websocketPassword) {
  //Get the Server details

  //send the server details to the main.js

  //connect to OBS web socket server
  try {
    const {
      obsWebSocketVersion,
      negotiatedRpcVersion
    } = await obs.connect(`ws://${websocketIP}:${websocketPort}`, websocketPassword, {
      rpcVersion: 1
    });
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
    //document.title = "connection set";
  } catch (error) {
    console.error('Failed to connect', error.code, error.message);
  }
  obs.on('error', err => {
    console.error('Socket error:', err)
  })
  console.log(`ws://${websocketIP}:${websocketPort}`)
  return obs;
}