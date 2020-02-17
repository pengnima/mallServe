const { Router } = require("express");
const usermodel = require("../mallmodel/usermodel.js");

const router = Router();

router.post("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  // 1. 查找是否存在对应的 name和pass
});

module.exports = router;
