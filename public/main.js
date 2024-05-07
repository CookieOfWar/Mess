import { clientChannel, serverChannel } from "./able";

const messages = document.getElementById("messages");
const textbox = document.getElementById("textbox");
const sendButton = document.getElementById("yourMessage");

var clientName = "";
var messageColor = "";

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
serverChannel.publish("connected", { name: clientName });

clientChannel.subscribe((message) => {
  switch (message.name) {
    case "newMessage":
      addMessage(message.data["text"]);
      console.log("newMessage", message.data["text"]);
      break;

    case "setClientName":
      if (clientName == "") clientName = message.data["name"];
      console.log(message);
      break;

    case "history":
      console.log(message);
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

sendButton.addEventListener("submit", (e) => {
  e.preventDefault();
  SendClick;
});

textbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    SendClick();
    console.log("Pressed Enter");
  }
});

function SendClick() {
  //serverChannel.publish("sendMessage", {
  //  text: clientName + ": " + textbox.value,
  //});
  const res = createFetch("/sendMessage", {
    text: clientName + ": " + textbox.value,
  }).then((res) => console.log(res));
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
