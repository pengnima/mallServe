const { Router } = require("express");
const userInformodel = require("../mallmodel/userInformodel");

const router = Router();

router.get("/", (req, res) => {
  let rq = req.query;
  let uid = rq.uid;
  let obj = {
    success: false,
    data: null
  };

  userInformodel.findOne({ uid }, (err, data) => {
    if (!err) {
      if (!data) {
        console.log("没找到数据");
        res.send(obj);
      } else {
        obj.success = true;
        obj.data = data;
        res.send(obj);
      }
    } else {
      console.log("出错了");
      res.send(obj);
    }
  });
});

module.exports = router;
