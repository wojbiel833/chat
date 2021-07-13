const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

app.get("/", (req, res) => {
  res.render("index");
});

const server = app.listen(8000, () => {
  console.log("Server is running on Port:", 8000);
});
const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);
  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
    socket.broadcast.emit("newUser", {
      author: userName,
      content: messageContent,
    });
  });
  socket.on("join", (nick) => users.push(nick));
  socket.on("disconnect", () => {
    console.log("Oh, socket " + socket.id + " has left");
    users.splice(socket.id, 1);
    socket.on("removeUser", (nick) => {
      if (socket.id) users.splice(socket.id, 1);
    });
  });
  console.log("I've added a listener on message and disconnect events \n");
});
