const path = require("path");
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

var history = [];
var colors = ['rgba(73, 158, 255, 0.53)', 'rgba(234, 73, 255, 0.53)'];

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
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
          socket.emit("setClientName", data1[0] + " " + data2[0]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  console.log(`new user connected: ${socket.id}`);

  socket.emit("history", history);

  socket.on("sendMessage", (message) => {
    //console.log(message);
    history.push(message);
    if (history.length > 10) {
      history.shift();
    }
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/send", (req, res) => {
  console.log(req.body);
});
