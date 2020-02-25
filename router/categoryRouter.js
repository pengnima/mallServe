const { Router } = require("express");
const categorymodel = require("../mallmodel/categorymodel.js");

const router = Router();

router.get("/info", (req, res) => {
  console.log(req.query);
  categorymodel.findOne({ maitKey: req.query.maitKey }, (err, data) => {
    if (!err) {
      if (data) {
        console.log("获取分类详情数据成功");
        res.send(data);
      }
    } else {
      console.log("数据库查询失败");
      res.send(false);
    }
  });
});

router.get("/", (req, res) => {
  categorymodel.findOne({ code: 1 }, (err, data) => {
    if (!err) {
      if (data) {
        console.log("获取分类数据成功");
        res.send(data);
      }
    } else {
      console.log("数据库查询失败");
      res.send(false);
    }
  });
});

module.exports = router;
