const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  }
});

let usermodel = mongoose.model("users", schema);
module.exports = usermodel;
