const { Router } = require("express");
const mallmodel = require("../mallmodel/mallmodel.js");
const mongoose = require("mongoose");

const router = Router();

router.get("/recommend", (req, res) => {
  let id = mongoose.Types.ObjectId("5e3fb21c1f93ad1e7cc244d4");
  mallmodel.findOne({ _id: id }, (err, data) => {
    if (!err) {
      res.send(data);
      console.log("/detail/recommend,数据查找成功");
    } else {
      console.log("/detail/recommend,数据查询失败");
    }
  });
});

router.get("/", (req, res) => {
  mallmodel.findOne(
    { iid: req.query.iid },
    { status: 0, iid: 0 },
    (err, data) => {
      if (!err) {
        if (!data) {
          res.send(null);
          console.log("数据库无此数据");
        } else {
          res.send(data);
          console.log("/detail,数据查找成功");
        }
      } else {
        console.log("/detail,数据查询失败");
      }
    }
  );
});

module.exports = router;
