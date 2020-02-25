let mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema({
  //没有约束，则无法CURD，找到的数据无法.result等等
  code: Number,
  list: Array,
  maitKey: Number
});

const categorymodel = mongoose.model("categorys", schema);

module.exports = categorymodel;
