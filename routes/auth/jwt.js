/**
 * @description 创建和验证token
 * @date  2022.3.5
 * @author kamto 
 */

const jwt = require("jsonwebtoken");
//撒盐，加密时候混淆 
const secret = "fish_hub";

function createToken(userSecret) {
  return jwt.sign(userSecret, secret, {
    //Token有效时间 单位s
    expiresIn: 60 * 60 * 24 * 30,
  });
}

//验证Token
function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  createToken,
  verifyToken,
};
