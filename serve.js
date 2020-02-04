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
    let id;
    if (req.hostname.indexOf("localhost") != -1) {
      id = mongoose.Types.ObjectId("5e37c0331f93ad260c84ce12");
    } else {
      id = mongoose.Types.ObjectId("5e3963d81f93ad08cc481072");
    }
    //findOne返回的是对象
    mallmodel.findOne({ _id: id }, (err, data) => {
      if (!err) {
        //console.log(data);
        res.send(data);
        console.log("/home/multidata,数据查找成功");
      } else {
        console.log("/home/multidata,数据查询失败");
      }
    });
  });

  app.get("/home/data", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    mallmodel.findOne(
      { sort: req.query.type, page: Number(req.query.page) },
      (err, data) => {
        if (!err) {
          //console.log(data);
          res.send(data);
          console.log("/home/data数据查找成功");
        } else {
          console.log("/home/data数据查询失败");
        }
      }
    );
  });

  app.get("/src/*/*.jpg", (req, res) => {
    //为什么这里不用CORS解决跨域？难道这里发出的请求是同源的？
    //答：因为这个请求是在img标签里的src处发出的，img标签和script一样不受同源策略的限制
    res.sendFile(__dirname + req.url);
  });
})();
