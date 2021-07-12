const express = require("express");
const path = require("path");

const app = express();

const messages = [];

app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
