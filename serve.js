const express = require("express");
const dbPromise = require("./db/index.js");
const homeRouter = require("./router/homeRouter.js");
const detailRouter = require("./router/detailRouter.js");
const loginRouter = require("./router/loginRouter.js");
const registerRouter = require("./router/registerRouter.js");
const profileRouter = require("./router/profileRouter");

const app = express();

app.listen(3000, err => {
  if (err) console.log("服务器连接失败");
  else console.log("服务器连接成功");
});

app.use(express.urlencoded({ extended: true }));
//

(async () => {
  //等待数据库连接好
  await dbPromise;

  app.use("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

  //路由管理
  app.use("/home", homeRouter);
  app.use("/detail", detailRouter);
  app.use("/register", registerRouter);
  app.use("/login", loginRouter);
  app.use("/profile", profileRouter);

  app.get("/src/*/*.jpg", (req, res) => {
    //为什么这里不用CORS解决跨域？难道这里发出的请求是同源的？
    //答：因为这个请求是在img标签里的src处发出的，img标签和script一样不受同源策略的限制
    res.sendFile(__dirname + req.url);
  });
})();
