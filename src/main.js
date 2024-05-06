import io from "socket.io-client";

const messages = document.getElementById("messages");
const textbox = document.getElementById("textbox");
const sendButton = document.getElementById("sendButton");

var clientName = "";
const socket = io();

async function createFetch(api, body) {
  return fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => {
    return res.json();
  });
}

// Ably
const key = "3JcURg.fOPmbg:efBqHXpjjaogZHqRcPvOOsPuiyJJt7y0UCTcQwI_GAA";
const realtime = new Ably.Realtime(key);
var serverChannel = realtime.channels.get("server-ch");
var clientChannel = realtime.channels.get("client-ch");

serverChannel.publish("connected", { name: clientName });

clientChannel.subscribe((message) => {
  switch (message.name) {
    case "newMessage":
      addMessage(message.data["text"]);
      break;

    case "setClientName":
      if (clientName == "") clientName = message.data["name"];
      break;

    case "history":
      console.log(message.data["history"]);
      for (let i = 0; i < message.data["history"].length; i++) {
        addMessage(message.data["history"][i].data["text"]);
      }
      break;

    default:
      console.log(message);
      break;
  }
});
//

sendButton.addEventListener("click", SendClick);

textbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    SendClick();
  }
});

async function SendClick() {
  serverChannel.publish("sendMessage", {
    text: clientName + ": " + textbox.value,
  });
  textbox.value = "";
}

function addMessage(messageText) {
  const message = document.createElement("li"); // style='color: ${'rgba(73, 158, 255, 0.53)'}
  message.innerHTML =
    `<span class='highlight' '>` +
    messageText.substring(0, messageText.indexOf(":")) +
    "</span>" +
    ": " +
    messageText.substring(messageText.indexOf(":") + 1);
  messages.appendChild(message);
  if (messages.children.length > 10) {
    messages.removeChild(messages.firstChild);
  }
}

/* Old with IO
//Send button & Enter
sendButton.addEventListener("click", SendClick);

textbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    SendClick();
  }
});

socket.on("setClientName", (name) => {
  //console.log("yes");
  clientName = name;
});

//Function to send message on server
async function SendClick() {
  socket.emit("sendMessage", clientName + ": " + textbox.value);
  textbox.value = "";
  //const response = await createFetch("/send", {
  //  message: textbox.value,
  //});
}

socket.on("newMessage", (message) => {
  //console.log(message);
  addMessage(message);
});

socket.on("history", (history) => {
  console.log(history);
  for (let i = 0; i < history.length; i++) {
    addMessage(history[i]);
  }
});

function addMessage(messageText) {
  const message = document.createElement("li"); // style='color: ${'rgba(73, 158, 255, 0.53)'}
  message.innerHTML =
    `<span class='highlight' '>` +
    messageText.substring(0, messageText.indexOf(":")) +
    "</span>" +
    ": " +
    messageText.substring(messageText.indexOf(":") + 1);
  messages.appendChild(message);
  if (messages.children.length > 10) {
    messages.removeChild(messages.firstChild);
  }
}
*/
