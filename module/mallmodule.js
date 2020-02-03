let mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema({
  //约束
  returnCode: String,
  success: Boolean
});

const mallmodel = mongoose.model("supermalls", schema);

module.exports = mallmodel;
