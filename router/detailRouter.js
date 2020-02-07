const { Router } = require("express");
const mallmodel = require("../mallmodel/mallmodel.js");

const router = Router();

router.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
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
