const Router = require("koa-router");
const router = new Router();
const orderService = require("../../service/orderService");

/**
 * @description 订单
 * @date  2021.9.10
 * @author kamto
 */

router
  .get("/order/list", async function (ctx, next) {
    var query = ctx.request.query;
    query.user_id = ctx.user_id;
    const res = await orderService.getOrderList(query);
    ctx.body = res;
  })
  .get("/order/:id", async function (ctx, next) {
    // id = out_trade_no
    let id = ctx.params.id;
    const res = await orderService.getOrder(id);
    ctx.body = res;
  });

module.exports = router.routes();
