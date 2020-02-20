const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

let payload = {
  uid: "777sq"
};
let secret = "this is a secret";
let token = jwt.sign(payload, secret, {
  expiresIn: "1d"
});

jwt.verify(token, secret, (err, decode) => {
  if (!err) {
    console.log(decode.exp);
  } else {
    console.log(err.message);
  }
});

console.log(token);

console.log(Date.now());
