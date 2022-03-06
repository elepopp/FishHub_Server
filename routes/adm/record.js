const Router = require("koa-router");
const router = new Router();
const recordService = require("../../service/recordService");

/**
 * @description 订单
 * @date  2021.9.10
 * @author kamto
 */

router.get("/record/list", async function (ctx, next) {
  var query = ctx.request.query;
  const res = await recordService.getAdmRecordList(query);
  ctx.body = res;
});

module.exports = router.routes();
