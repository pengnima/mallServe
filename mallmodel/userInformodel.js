const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  uid: {
    type: String,
    required: true
  },
  //购买的商品，数组里存放对象，对象包括：商品的IID，商品的state(是否付款，发货，收货，评价)
  buyItem: {
    type: Array,
    default: []
  },
  cartItem: {
    type: Array,
    default: []
  },
  uImg: {
    type: String,
    default: "assets/img/profile/avatar.svg"
  },
  //该用户的token(只记录token的第三部分即可)
  uToken: {
    type: Object,
    default: {
      token: null,
      refreshToken: null
    }
  }
});

let userInformodel = mongoose.model("user_infors", schema);

module.exports = userInformodel;
