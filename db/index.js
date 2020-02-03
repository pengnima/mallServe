let mongoose = require("mongoose");
const DB_URL = "localhost:27017";
const DB_NAME = "mymall";

mongoose.set("useCreateIndex", true);
const dbPromise = new Promise((resolve, reject) => {
  mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on("open", err => {
    if (err) {
      console.log("数据库打开失败");
      reject();
    } else {
      console.log(`位于 ${DB_URL} 的 ${DB_NAME} 数据库打开成功`);
      resolve();
    }
  });
});

module.exports = dbPromise;
