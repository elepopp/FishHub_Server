const Router = require("koa-router");
const router = new Router();
const mediaService = require("../../service/mediaService");

/**
 * @description 媒体
 * @date  2021.11.8
 * @author kamto
 */

router
  .get("/media/list", async function (ctx, next) {
    var query = ctx.request.query;
    const res = await mediaService.getMediaList(query);
    ctx.body = res;
  })
  .post("/media", async function (ctx, next) {
    let body = ctx.request.body;
    const res = await mediaService.postMedia(body);
    ctx.body = res;
  })
  .get("/media/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await mediaService.getMedia(id);
    ctx.body = res;
  })
  .put("/media/:id", async function (ctx, next) {
    let id = ctx.params.id;
    let body = ctx.request.body;
    const res = await mediaService.putMedia(id, body);
    ctx.body = res;
  })
  .delete("/media/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await mediaService.deleteMedia(id);
    ctx.body = res;
  })
  .delete("/testDelMedia/:key", async function (ctx, next) {
    let key = ctx.params.key;
    const res = await mediaService.testDelMedia(key);
    ctx.body = res;
  });

module.exports = router.routes();
