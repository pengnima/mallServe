const { Router } = require("express");
const usermodel = require("../mallmodel/usermodel.js");
const jwt = require("jsonwebtoken");

//作为密钥
const secret = "this is a secret";

const router = Router();

router.post("/check", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let rb = req.body;
  let tokenDecode = null;
  let refreshTokenDecode = null;

  let c1 = checkToken(rb.token, secret).then(decode => {
    tokenDecode = decode;
  });
  let c2 = null;
  if (rb.refreshToken != "") {
    c2 = checkToken(rb.refreshToken, secret).then(decode => {
      refreshTokenDecode = decode;
    });
  }

  Promise.all([c1, c2]).then(() => {
    console.log(tokenDecode, refreshTokenDecode);
    res.send({ tokenDecode, refreshTokenDecode });
  });
});

router.post("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let rb = req.body;

  // 1. 查找是否存在对应的 name和pass
  usermodel.findOne({ name: rb.user, password: rb.password }, (err, data) => {
    if (!err) {
      //console.log(data);
      if (data != null) {
        //检测 keep 是否为true(为true，生成一个短期token，一个长期token，为false只生成一个短期token，并且在前端用sessionStorage保存)
        //1. 生成token
        let payload = {
          uid: data.uid
        };

        let obj = createToken(payload, secret, rb.isKeep);
        // obj.uid = data.uid;
        res.send(obj);
      } else {
        res.send(data);
      }
    }
  });
});

module.exports = router;

function checkToken(token, secret) {
  return new Promise((reslove, reject) => {
    jwt.verify(token, secret, (err, decode) => {
      if (!err) {
        console.log(decode);
        reslove(decode);
      } else {
        console.log(err.message, "这里吗");
        reject();
      }
    });
  });
}

function createToken(payload, secret, isKeep) {
  let refreshToken = null;
  // 2小时
  let token = jwt.sign(payload, secret, {
    expiresIn: "2h"
  });

  // 7天
  if (isKeep === "true") {
    refreshToken = jwt.sign(payload, secret, {
      expiresIn: "7d"
    });
  }
  return { token, refreshToken };
}
