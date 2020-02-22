const { Router } = require("express");
const mallmodel = require("../mallmodel/mallmodel.js");
const mongoose = require("mongoose");

const router = Router();

router.get("/multidata", (req, res) => {
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

router.get("/data", (req, res) => {
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

module.exports = router;
