const express = require("express");
const path = require("path");

const app = express();

app.listen(4000, err => {
  if (err) console.log("服务器连接失败");
  else console.log("服务器连接成功");
});

app.use(express.static(path.join(__dirname, "./dist")));
app.use(express.urlencoded({ extended: true }));

app.get("/home", (req, res) => {
  res.redirect("/");
});
app.get("/", (req, res) => {
  console.log(path.join(__dirname, "./dist/index.html"));
  res.sendFile(path.join("./index.html"));
});
