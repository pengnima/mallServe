const { Router } = require("express");
const mallmodel = require("../mallmodel/mallmodel.js");

const router = Router();

router.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  mallmodel.findOne({ iid: req.query.iid }, (err, data) => {
    if (!err) {
      console.log(data.result);
      res.send(data);
      console.log("/detail,数据查找成功");
    } else {
      console.log("/detail,数据查询失败");
    }
  });
});

module.exports = router;
