const Router = require("koa-router");
const router = new Router();
const userService = require("../../service/userService");

/**
 * @description 订单
 * @date  2021.9.10
 * @author kamto
 */

router
  .get("/user/list", async function (ctx, next) {
    var query = ctx.request.query;
    const res = await userService.getUserList(query);
    ctx.body = res;
  })
  .get("/user/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await userService.getUser(id);
    ctx.body = res;
  })
  .post("/user", async function (ctx, next) {
    let data = ctx.request.body;
    const res = await userService.postUser(data);
    ctx.body = res;
  });

module.exports = router.routes();
