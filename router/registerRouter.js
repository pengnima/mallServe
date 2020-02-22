const { Router } = require("express");
const usermodel = require("../mallmodel/usermodel.js");
const userInformodel = require("../mallmodel/userInformodel.js");

const router = Router();

router.post("/", (req, res) => {
  let rb = req.body;
  // 0表示没被占，1表示用户名被占，10表示邮箱被占，11表示都被占
  let obj = {
    success: false,
    status: 0
  };
  // 1.检查和数据库信息是否有冲突

  let f1 = findData({ name: rb.user }).then(data => {
    if (data != null) {
      obj.status += 1;
    }
  });
  let f2 = findData({ email: rb.email }).then(data => {
    if (data != null) {
      obj.status += 10;
    }
  });

  Promise.all([f1, f2]).then(() => {
    if (obj.status === 0) {
      //创建账号
      createData(rb.user, rb.email, rb.password).then(data => {
        //创建Infor表
        createInfor(data.name, data.uid).then(() => {
          obj.success = true;
          console.log(obj);
          res.send(obj);
        });
      });
    } else {
      //失败
      // console.log(obj);
      res.send(obj);
    }
  });
});

/**
 * 一些函数
 */
function findData(name) {
  return new Promise((resolve, reject) => {
    usermodel.findOne(name, (err, data) => {
      if (!err) {
        //console.log(data);
        resolve(data);
      } else {
        console.log("查找失败");
        reject();
      }
    });
  });
}

function createData(name, email, password) {
  return new Promise((resolve, reject) => {
    usermodel.create(
      { name, email, password, uid: Date.now().toString(16) },
      (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          console.log("创建Token失败");
          reject();
        }
      }
    );
  });
}

function createInfor(name, uid) {
  return new Promise((reslove, reject) => {
    userInformodel.create({ name, uid }, (err, data) => {
      if (!err) {
        reslove();
      } else {
        console.log("创建失败");
        reject();
      }
    });
  });
}

module.exports = router;
