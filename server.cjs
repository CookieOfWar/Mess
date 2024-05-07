const {adjectives, nouns} = require("./adjNnouns.cjs");

const path = require("path");
const express = require("express");
const http = require("http");
const Ably = require("ably");

const app = express();
const server = http.createServer(app);
const port = 3000;

var history = [];
const colors = [
  "rgba(73, 158, 255, 0.53)",
  "rgba(234, 73, 255, 0.53)",
  "rgba(255, 73, 137, 0.53)",
  "rgba(73, 255, 97, 0.53)",
  "rgba(73, 255, 200, 0.53)",
  "rgba(73, 203, 255, 0.53)",
];

const commands=[
	"/cls",
	"/clearHistory",
	
]

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
//clientChannel.publish("update", { time: Date.now() });
//

//app.post("/sendMessage", (req, res) => {
//  clientChannel.publish("newMessage", { text: req.body["text"] });
//});

serverChannel.subscribe((message) => {
  switch (message.name) {
    case "connected":
      if (message.data["name"] == "") {
        giveNameNRestoreHistory();
      } 
			else clientChannel.publish("history", { history: history });
      break;
    case "sendMessage":
			if (message.data["text"].startsWith("/")) {
				applyCommands(message.data["text"].str.substring(1));
			}
      history.push(message.data["text"]);
      if (history.length > 10) {
        history.shift();
      }
			console.log(message);
      clientChannel.publish("newMessage", { text: message.data["text"], color: message.data["color"] });
      break;

    default:
      console.log(message);
      break;
  }
});

function giveNameNRestoreHistory() {
  data1 = adjectives[getRandInt(0, adjectives.length)];
  data2 = nouns[getRandInt(0, nouns.length)];
  clientChannel.publish("setClientName", {
    name: data1 + " " + data2,
    color: colors[getRandInt(0, colors.length)],
  });
  //console.log("history", history.data);
  clientChannel.publish("history", { history: history });

  console.log(`new user connected: ${data1 + " " + data2}`);
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;

function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function applyCommands(command){
	switch(command){
		case "cls":
			clientChannel.publish("cls");
			break;
		case "clearHistory":
			history = [];
			break;
	}
}