const Router = require("koa-router");
const router = new Router();
const commentService = require("../../service/commentService");

/**
 * @description 媒体
 * @date  2021.11.8
 * @author kamto
 */

router
  .get("/comment/list", async function (ctx, next) {
    var query = ctx.request.query;
    const res = await commentService.getCommentList(query);
    ctx.body = res;
  })
  .post("/comment", async function (ctx, next) {
    let body = ctx.request.body;
    body.user_id = ctx.user_id;
    const res = await commentService.postComment(body);
    ctx.body = res;
  });

module.exports = router.routes();
