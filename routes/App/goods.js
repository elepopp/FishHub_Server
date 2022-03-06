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
  .get("/goods/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await goodsService.getGoodsByUser({
      id: id,
      user_id: ctx.user_id,
    });
    ctx.body = res;
  })
  .get("/goods/:id/getDownloadUrl", async (ctx, next) => {
    let user_id = ctx.user_id;
    let goods_id = ctx.params.id; 

    const res = await goodsService.getGoodsUrlByUser({
      user_id: user_id,
      goods_id: goods_id,
    });

    ctx.body = res;
  });
module.exports = router.routes();
