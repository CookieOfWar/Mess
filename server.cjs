const path = require("path");
const express = require("express");
//const socket = require("socket.io");
const http = require("http");
//const { Server } = require("socket.io");
const Ably = require("ably");

const app = express();
const server = http.createServer(app);
//const io = new Server(server);
const port = 3001;

var history = [];
var colors = ["rgba(73, 158, 255, 0.53)", "rgba(234, 73, 255, 0.53)"];

app.use(express.static(path.resolve(__dirname, "dist")));
app.use(express.json());

//app.get("/", (req, res) => {
//  res.sendFile(path.resolve(__dirname, "index.html"));
//});

//Ably
const key = "3JcURg.fOPmbg:efBqHXpjjaogZHqRcPvOOsPuiyJJt7y0UCTcQwI_GAA";
const realtime = new Ably.Realtime(key);
var serverChannel = realtime.channels.get("server-ch");
var clientChannel = realtime.channels.get("client-ch");
//console.log(serverChannel, clientChannel);
clientChannel.publish("update", { time: Date.now() });
//

app.post("/sendMessage", (req, res) => {
  //console.log(req);
  clientChannel.publish("newMessage", { text: req.body["text"] });
  res.send({ benis: "true!!!" });
});

serverChannel.subscribe((message) => {
  switch (message.name) {
    case "connected":
      if (message.data["name"] == "") {
        giveNameNRestoreHistory();
      } else clientChannel.publish("history", { history: history });
      break;
    case "sendMessage":
      history.push(message);
      if (history.length > 10) {
        history.shift();
      }
      console.log(message.data["text"]);
      clientChannel.publish("newMessage", { text: message.data["text"] });
      break;

    default:
      console.log(message);
      break;
  }
});

function giveNameNRestoreHistory() {
  fetch("https://random-word-form.herokuapp.com/random/adjective")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data1) => {
      fetch("https://random-word-form.herokuapp.com/random/noun")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data2) => {
          console.log(data1[0] + " " + data2[0]);
          clientChannel.publish("setClientName", {
            name: data1[0] + " " + data2[0],
          });
          clientChannel.publish("history", { history: history });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  console.log(`new user connected: ${data1[0] + " " + data2[0]}`);
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/privet", (req, res) => {
  res.send({ benis: "true!!!" });
});

module.exports = app;
