const Router = require("koa-router");
const router = new Router();
const groupService = require("../../service/groupService");

/**
 * @description 统计
 * @date  2021.10.26
 * @author kamto
 */

router.get("/group/dashboard", async function (ctx, next) {
  const res = await groupService.getDashboard();
  ctx.body = res;
});

module.exports = router.routes();
