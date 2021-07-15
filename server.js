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

const server = app.listen(8002, () => {
  console.log("Server is running on Port:", 8002);
});
const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);
  socket.on("message", (message) => {
    console.log(message);
    messages.push(message);
    socket.broadcast.emit("message", {
      author: message.author,
      content: message.content,
    });
  });

  socket.on("join", (nick) => {
    users.push({ userName: nick, id: socket.id });
    socket.broadcast.emit("newUser", nick);
  });

  socket.on("disconnect", () => {
    const user = users.find((item) => item.id === socket.id);
    const index = users.findIndex((item) => item.id === socket.id);
    users.splice(index, 1);
    socket.broadcast.emit("removeUser", users.userName);
  });
  console.log("I've added a listener on message and disconnect events \n");
});
