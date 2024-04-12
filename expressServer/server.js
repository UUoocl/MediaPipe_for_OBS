const path = require("path");

// ELECTRON-EXPRESS-QUICK-START: allows server.js to load when electron is ready
module.exports = (paramPort) => {
  const express = require("express");
  const app = express();
  const port = paramPort;
  const WebSocketServer = require("ws").Server;
  
  // Create the websocket signaling server
  const wsList = [];
  const wsMessages = [];
  const wss = new WebSocketServer({ port: port + 1 });
  wss.on("connection", function (ws) {
    wsList.push(ws);
    
    ws.on("close", function () {
      wsList.splice(wsList.indexOf(ws), 1);
    });
    
    ws.on("message", function (message) {
      const msg = message.toString();
      
      if (msg[0] === "l") {
        // Log the message
        console.log(msg);
      } else if (msg[0] === "r") {
        // On a request for host info, just fire any cached messages
        while (wsMessages.length > 0) {
          const msg = wsMessages.pop();
          for (var i = 0; i < wsList.length; i++) {
            wsList[i].send(msg);
          }
        }
      } else {
        if (wsList.length < 2) {
          // No client, so cache the messages
          wsMessages.push(msg);
        } else {
          // Broadcast messages
          for (var i = 0; i < wsList.length; i++) {
            wsList[i].send(msg);
          }
        }
      }
    });
  });
  
// Create the http server to serve the html files
  console.log(__dirname);
  app.use(express.static(path.join(__dirname, "public")));
  
  app.get("/", (req, res) => {
       res.send(`ExpressJS on http://localhost:${port}`)
  });
  
  app.locals.title = 'My App'
  app.listen(port, "localhost", () =>
  console.log(`server.js app listening on port ${port}!`)
);
};
