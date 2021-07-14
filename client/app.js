// Socket
const socket = io();

socket.on("message", ({ author, content }) => addMessage(author, content));
socket.on("join", ({ nick, id }) => login(nick));
socket.on("newUser", ({ userName }) =>
  addMessage({
    author: userName,
    content: `${userName} has joined the conversation!`,
  })
);
socket.on("removeUser", (userName) =>
  addMessage({
    author: userName,
    content: `${userName} has left the conversation... :(`,
  })
);

// Functionality--------------------------------------
const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");

const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = "";

// Login form
const login = function (e) {
  e.preventDefault();

  const userNameInput = document.getElementById("username").value;

  if (userNameInput == "") alert("You need to pass User Name");
  else {
    userName = userNameInput;
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  }
};

messagesSection.classList.remove("show");

loginForm.addEventListener("submit", login);

// Add message form

function addMessage(author, content) {
  const message = document.createElement("li");
  message.classList.add("message");
  message.classList.add("message--received");
  if (author === userName) message.classList.add("message--self");
  message.innerHTML = `
      <h3 class="message__author">${userName === author ? "You" : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
  messagesList.appendChild(message);
}

const sendMessage = function (e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (messageContentInput == "") {
    alert("You can't send an empty message");
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit("message", { author: userName, content: messageContent });
    messageContentInput.value = "";
  }
};

addMessageForm.addEventListener("submit", sendMessage);
addMessageForm.addEventListener("newUser", sendMessage);
