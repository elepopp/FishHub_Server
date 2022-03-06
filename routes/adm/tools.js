const Router = require("koa-router");
const router = new Router();
const userService = require("../../service/userService");
const articleService = require("../../service/articleService");
const commentService = require("../../service/commentService");

/**
 * @description 模拟数据
 * @date  2022.01.05
 * @author kamto
 */

router
  .post("/tools/addArticleByRedBook", async function (ctx, next) {
    let body = ctx.request.body;
    const res = await articleService.postArticle({
      data: body,
    });
    ctx.body = res;
  })
  .post("/tools/addCommentByRedBook", async function (ctx, next) {
    let body = ctx.request.body;
    const res = await commentService.postComments(body);
    ctx.body = res;
  })
  .post("/tools/addUserByRedBook", async function (ctx, next) {
    let body = ctx.request.body;
    const res = await userService.postUsers(body);
    ctx.body = res;
  }); 

module.exports = router.routes();
  