const messages = document.getElementById("messages");
const textbox = document.getElementById("textbox");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", SendClick);
textbox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    SendClick();
  }
});

function SendClick() {
  const message = document.createElement("li");
  message.innerText = textbox.value;
  messages.appendChild(message);
  textbox.value = "";
}
