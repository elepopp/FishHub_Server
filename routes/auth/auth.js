/**
 * @description 登录 注册
 * @date  2022.3.5
 * @author kamto
 */

const url = require("url");
const authByApp = require("./authByApp");
const authByAdm = require("./authByAdm");

module.exports = async function (ctx, next) {
  const start = Date.now();
  // 如果是GET 要把 JSON化
  if (ctx.method == "GET") {

    for (var key in ctx.request.query) {
      try {
        if (ctx.request.query[key]) {
          if (
            !isNaN(JSON.parse(ctx.request.query[key])) &&
            JSON.parse(ctx.request.query[key]) < 900719925474099
          ) {
            ctx.request.query[key] = JSON.parse(ctx.request.query[key]);
          } else if (isNaN(JSON.parse(ctx.request.query[key]))) {
            ctx.request.query[key] = JSON.parse(ctx.request.query[key]);
          }
        }
      } catch (error) {
      } 
    }
  }

  if (url.parse(ctx.url).pathname.slice(0, 4) == "/adm") {
    await authByAdm(ctx, next);
  } else {
    await authByApp(ctx, next);
  }
  const ms = Date.now() - start;
  console.log(`${ctx.method} _____ ${ctx.url} _____ ${ms}ms`);
};
