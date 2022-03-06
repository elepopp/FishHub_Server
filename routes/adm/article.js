const Router = require("koa-router");
const router = new Router();
const articleService = require("../../service/articleService");

/**
 * @description 作品
 * @date  2021.9.10
 * @author kamto
 */

router
  .get("/article/list", async function (ctx, next) {
    var query = ctx.request.query;
    const res = await articleService.getArticleList(query);
    ctx.body = res;
  })
  .post("/article", async function (ctx, next) {
    let body = ctx.request.body;
    body.user_id = ctx.user_id;
    const res = await articleService.postArticle({
      data: body,
    });
    ctx.body = res;
  })
  .get("/article/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await articleService.getArticle(id);
    ctx.body = res;
  })
  .put("/article/:id", async function (ctx, next) {
    let id = ctx.params.id;
    let body = ctx.request.body;
    const res = await articleService.putArticle({
      id: id,
      data: body,
    });
    ctx.body = res;
  })
  .delete("/article/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await articleService.deleteArticle(id);
    ctx.body = res;
  });

module.exports = router.routes();
