const Router = require("koa-router");
const router = new Router();
const goodsService = require("../../service/goodsService");

/**
 * @description 作品
 * @date  2021.9.10
 * @author kamto
 */

router
  .get("/goods/list", async function (ctx, next) {
    var query = ctx.request.query;
    const res = await goodsService.getGoodsList(query);
    ctx.body = res;
  })
  .post("/goods", async function (ctx, next) {
    let body = ctx.request.body;
    const res = await goodsService.postGoods(body);
    ctx.body = res;
  })
  .get("/goods/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await goodsService.getGoods(id);
    ctx.body = res;
  })
  .put("/goods/:id", async function (ctx, next) {
    let id = ctx.params.id;
    let body = ctx.request.body;
    const res = await goodsService.putGoods(id, body);
    ctx.body = res;
  })
  .delete("/goods/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await goodsService.deleteGoods(id);
    ctx.body = res;
  })
  .get("/goods/:id/getDownloadUrl", async (ctx, next) => {
    let goods_id = ctx.params.id;

    const res = await goodsService.getGoodsUrl({
      goods_id: goods_id,
    });
    ctx.body = res;
  });

module.exports = router.routes();
