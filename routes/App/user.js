const Router = require("koa-router");
const router = new Router();
const recordService = require("../../service/recordService");
const userService = require("../../service/userService");

/**
 * @description 用户行为
 * @date  2021.3.13
 * @author kamto
 */

router
  .post("/user/operation", async (ctx, next) => {
    let body = ctx.request.body;
    body.user_id = ctx.user_id;
    const res = await recordService.postRecord(body);
    ctx.body = res;
  })
  // 用户取消行为
  .delete("/user/operation/:id", async (ctx, next) => {
    var goods_id = ctx.params.id;
    var user_id = ctx.user_id;
    const res = await recordService.deleteRecordByUser({
      user_id: user_id,
      goods_id: goods_id,
    });
    ctx.body = res;
  })
  .get("/user/operation/list", async (ctx, next) => {
    var query = ctx.request.query;
    query.user_id = ctx.user_id;
    var res = {};
    res = await recordService.getUserRecordList(query);
    ctx.body = res;
  })
  .get("/user/operation/group", async (ctx, next) => {
    var user_id = ctx.user_id;
    var res = await recordService.getRecordGroup(user_id);
    ctx.body = res;
  })
  .put("/user", async (ctx, next) => {
    let data = ctx.request.body;
    let user_id = ctx.user_id;
    const res = await userService.putUser(user_id, data);
    ctx.body = res;
  })
  .put("/user/updateAratar", async (ctx, next) => {
    let data = ctx.request.body;
    let user_id = ctx.user_id;
    const res = await userService.putUserAratar(user_id, data);
    ctx.body = res;
  })
  .get("/user", async (ctx, next) => {
    let user_id = ctx.user_id;
    const res = await userService.getUser(user_id);
    ctx.body = res;
  })
  .get("/user/:id", async (ctx, next) => {
    let user_id = require("mongodb").ObjectID(ctx.params.id);
    const res = await userService.getUser(user_id);
    ctx.body = res;
  });

module.exports = router.routes();
