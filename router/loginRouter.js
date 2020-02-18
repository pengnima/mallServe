const { Router } = require("express");
const usermodel = require("../mallmodel/usermodel.js");

const router = Router();

router.post("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  let rb = req.body;
  // 1. 查找是否存在对应的 name和pass
  usermodel.findOne({ name: rb.user, password: rb.password }, (err, data) => {
    if (!err) {
      console.log(data);
      if (data != null) {
        res.send(data.uid);
      } else {
        res.send(data);
      }
    }
  });
});

module.exports = router;
