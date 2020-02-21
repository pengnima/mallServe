const jwt = require("jsonwebtoken");

let payload = {
  uid: "777sq"
};

let secret = "this is a secret";

let token = jwt.sign(payload, secret, {
  expiresIn: "1s"
});

setTimeout(() => {
  jwt.verify(token, secret, (err, decode) => {
    if (!err) {
      payload = decode;
      console.log(decode);
    } else {
      console.log(err.name);
      let str = new Buffer.from(token.split(".")[1], "base64");
      console.log(JSON.parse(str.toString()));
    }
  });
}, 2000);

// delete payload.exp;
// delete payload.iat;
// let token2 = jwt.sign(payload, secret, {
//   expiresIn: "2d"
// });
// console.log(token2);
// jwt.verify(token2, secret, (err, decode) => {
//   if (!err) {
//     console.log(decode);
//   }
// });

// console.log(token);
