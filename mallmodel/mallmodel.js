let mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema({
  //没有约束，则无法CURD，找到的数据无法.result等等
  result: Object
});

const mallmodel = mongoose.model("supermalls", schema);

module.exports = mallmodel;
