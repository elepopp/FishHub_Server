function isString(arg) {
  return arg && typeof arg == "string";
}

function isNumber(arg) {
  return arg && typeof arg == "number" && !isNaN(arg);
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) == "[object Array]";
}

function isObject(arg) {
  return Object.prototype.toString.call(arg) == "[object Object]";
}

function isEmpty(arg) {
  return Object.keys(arg).length === 0;
}

function validatePhone(phone) {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
  return reg.test(phone);
}

function validateEmail(email) {
  const reg = new RegExp(
    "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
  );
  return reg.test(email);
}
// 导出模块
module.exports = {
  isString,
  isNumber,
  isArray,
  isObject,
  isEmpty,
  validatePhone,
  validateEmail,
};
