const Router = require("koa-router");
var forums = new Router();
const fs = require("fs");
/**
 * @description 用于路由API统一管理
 * @date  2021.7.5
 * @author kamto
 */
fs.readdirSync(__dirname).forEach((file) => {
  if (file === "index.js") {
    return;
  }
  const route = require(`./${file}`);
  forums.use(route);
});

module.exports = forums.routes();
