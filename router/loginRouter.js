const { Router } = require("express");
const usermodel = require("../mallmodel/usermodel.js");
const userInformodel = require("../mallmodel/userInformodel.js");
const jwt = require("jsonwebtoken");

//作为密钥
const secret = "this is a secret";

const router = Router();

router.post("/quit", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let rb = req.body;

  let newObj = {
    token: rb.token.split(".")[2],
    refreshToken: rb.refreshToken.split(".")[2]
  };
  updateInfor(rb.uid, newObj)
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    });
});

/**
 * 检测函数
 * */
router.post("/check", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let rb = req.body;
  let tokenDecode = null;
  let refreshTokenDecode = null;
  let obj = {
    isExpire: false,
    newToken: ""
  };
  let rt = rb.token.split(".")[2];

  // 检测短期的token
  let c1 = checkToken(rb.token, secret)
    .then(decode => {
      tokenDecode = decode;
    })
    .catch(err => {
      //token过期了也会掉入catch中，会导致 tokenDecode 无法取得正确的payload。
      tokenDecode = catchErr(err.message, rb.token);
    });

  //检测长期的token
  let c2 = null;
  if (rb.refreshToken != "") {
    c2 = checkToken(rb.refreshToken, secret)
      .then(decode => {
        refreshTokenDecode = decode;
      })
      .catch(err => {
        refreshTokenDecode = catchErr(err.message, rb.refreshToken);
      });
  }

  //检测完2个token之后才执行
  Promise.all([c1, c2]).then(() => {
    //1. 判断 token是否被篡改
    if (refreshTokenDecode == "err" || tokenDecode == "err") {
      obj.isExpire = true;
      console.log("可能被篡改了");
      res.send(obj);
    } else {
      //1.5  判断是否是注销的token
      userInformodel.findOne({ uid: tokenDecode.uid }, (err, data) => {
        if (!err) {
          if (rt == data.uToken.token || rt == data.uToken.refreshToken) {
            console.log("可能被截取了token，重新登录吧");
            res.send({ isExpire: true, newToken: "" });
          } else {
            console.log("和注销的token不同，可过");
            if (tokenDecode.exp * 1000 < Date.now()) {
              console.log("过期了");

              //3. 判断是否有长期token，且长期token是否到期
              if (
                refreshTokenDecode &&
                refreshTokenDecode.exp * 1000 > Date.now()
              ) {
                delete tokenDecode.exp;
                delete tokenDecode.iat;
                obj.newToken = createToken(tokenDecode, secret, "false").token; //新token
                console.log("整了个新Token");
              } else {
                // 无长期token 或 长期token到期，那么就真正判定为 过期
                obj.isExpire = true;
              }
            }
            res.send(obj);
          }
        }
      });

      //2. 没被篡改，那再判断 短期token是否到期
    }
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
        res.send(obj);
      } else {
        res.send(data);
      }
    }
  });
});

module.exports = router;
//更新infor表
function updateInfor(uid, obj) {
  return new Promise((reslove, reject) => {
    userInformodel.updateOne(
      { uid },
      { $set: { uToken: obj } },
      (err, data) => {
        if (!err) {
          reslove();
        } else {
          reject();
        }
      }
    );
  });
}

//检测
function checkToken(token, secret) {
  return new Promise((reslove, reject) => {
    jwt.verify(token, secret, (err, decode) => {
      if (!err) {
        reslove(decode);
      } else {
        reject(err);
      }
    });
  });
}

//创建
function createToken(payload, secret, isKeep) {
  let refreshToken = null;
  // 1小时
  let token = jwt.sign(payload, secret, {
    expiresIn: "1h"
  });

  // 7天
  if (isKeep === "true") {
    refreshToken = jwt.sign(payload, secret, {
      expiresIn: "7d"
    });
  }
  return { token, refreshToken };
}

//抓取错误并返回数据
function catchErr(err, tokenName) {
  if (err != "jwt expired") {
    return "err";
  } else {
    return JSON.parse(
      new Buffer.from(tokenName.split(".")[1], "base64").toString()
    );
  }
}
