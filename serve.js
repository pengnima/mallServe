const express = require("express");
const dbPromise = require("./db/index.js");
const mallmodel = require("./mallmodel/mallmodel.js");
const mongoose = require("mongoose");

const app = express();

app.listen(3000, err => {
  if (err) console.log("服务器连接失败");
  else console.log("服务器连接成功");
});

app.use(express.urlencoded({ extended: true }));

(async () => {
  //等待数据库连接好
  await dbPromise;

  app.get("/home/multidata", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    //查找数据库里的data
    //{ _id: ObjectId("5e37c0331f93ad260c84ce12") }
    let id = mongoose.Types.ObjectId("5e37c0331f93ad260c84ce12");
    mallmodel.find({ _id: id }, (err, data) => {
      if (!err) {
        //console.log(data);
        res.send(data);
        console.log("数据查找成功");
      } else {
        console.log("数据查询失败");
      }
    });
  });

  app.get("/src/*/*.jpg", (req, res) => {
    //为什么这里不用CORS解决跨域？难道这里发出的请求是同源的？
    //答：因为这个请求是在img标签里的src处发出的，img标签和script一样不受同源策略的限制
    res.sendFile(__dirname + req.url);
  });
})();
