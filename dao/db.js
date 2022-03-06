//引入mongoose
const mongoose = require("mongoose");
const fs = require("fs");
//配置文件
const config = require("../config/index.js");

var mongoDbUri =
  "mongodb://" + config.address + ":" + config.port + "/" + config.database;

let db = mongoose.connect(mongoDbUri, {
  auth: { username: config.username, password: config.password },
  authSource: "admin",
});

mongoose.connection.on("connected", function () {
  console.log("mongoose已经成功连接上了数据库");
});

module.exports = function () {
  fs.readdirSync(__dirname + "/models").forEach((file) => {
    require(`./models/${file}`);
  });
  return db;
};
 