import { clientChannel, serverChannel } from "./able";

const messages = document.getElementById("messages");
const textbox = document.getElementById("textbox");
const sendButton = document.getElementById("sendButton");

var clientName = "";
var messageColor = "";
var enabledNotifications = true;

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

window.onload = () => {
  // if (!localStorage.getItem("client")) {
  //   localStorage.setItem("client", Date.now());
  // }
};
serverChannel.publish("connected", { name: clientName });

clientChannel.subscribe((message) => {
  switch (message.name) {
    case "newMessage":
      addMessage(message.data["text"], message.data["color"]);
      console.log("newMessage", message.data["text"]);
      break;

    case "setClientName":
      if (clientName == "") {
        clientName = message.data["name"];
        messageColor = message.data["color"];
      }
      break;

    case "history":
      //console.log(message.data["history"]);
      if (messages.children.length == 0) {
        for (let i = 0; i < message.data["history"].length; i++) {
          addMessage(message.data["history"][i]);
        }
      }
      break;

    case "cls":
      console.log("emptiness");
      while (messages.firstChild) messages.removeChild(messages.firstChild);
      break;

    default:
      //console.log(message);
      break;
  }
});
//

sendButton.addEventListener("click", (e) => {
  // e.preventDefault();
  if ("serviceWorker" in navigator) {
    Notification.requestPermission().then((permissionResult) => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        if (permissionResult === "granted") {
          console.log("granted");
          registration.showNotification("My first notification", {
            body: "More details about this notification",
          });
        }
      });
    });
  }
  if (textbox.value != "") SendClick();
});

textbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (textbox.value != "") SendClick();

    //console.log("Pressed Enter");
  }
});

function SendClick() {
  serverChannel.publish("sendMessage", {
    text: clientName + ": " + textbox.value,
    tbValue: `${textbox.value}`.trim(),
    color: messageColor,
    name: clientName,
  });
  //const res = createFetch("/sendMessage", {
  //  text: clientName + ": " + textbox.value,
  //}).then((res) => console.log(res));
  textbox.value = "";
}

function addMessage(messageText, nameColor) {
  const message = document.createElement("li"); // style='color: ${'rgba(73, 158, 255, 0.53)'}
  message.innerHTML =
    `<span class='highlight' style='color: ${nameColor}'>` +
    messageText.substring(0, messageText.indexOf(":")) +
    "</span>" +
    ": " +
    messageText.substring(messageText.indexOf(":") + 1);
  messages.appendChild(message);
  if (messages.children.length > 10) {
    messages.removeChild(messages.firstChild);
  }
}
