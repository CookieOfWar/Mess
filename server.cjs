const path = require("path");
const express = require("express");
const http = require("http");
const Ably = require("ably");

const app = express();
const server = http.createServer(app);
const port = 3001;

var history = [];
const noun = ["Big"];
const adjectives = ["Penis"];
var colors = ["rgba(73, 158, 255, 0.53)", "rgba(234, 73, 255, 0.53)"];

/**
 * НЕ МЕНЯТЬ СЦУККО
 */
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(express.json());

//Ably
const key = "3JcURg.fOPmbg:efBqHXpjjaogZHqRcPvOOsPuiyJJt7y0UCTcQwI_GAA";
const realtime = new Ably.Realtime(key);
var serverChannel = realtime.channels.get("server-ch");
var clientChannel = realtime.channels.get("client-ch");
clientChannel.publish("update", { time: Date.now() });
//

app.post("/sendMessage", (req, res) => {
  clientChannel.publish("newMessage", { text: req.body["text"] });
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
  data1 = noun[0];
  data2 = adjectives[0];
  clientChannel.publish("setClientName", {
    name: "Посос", //data1 + " " + data2,
  });
  console.log("history", history);
  clientChannel.publish("history", { history: history });

  console.log(`new user connected: ${data1[0] + " " + data2[0]}`);
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
