const Router = require("koa-router");
const router = new Router();
const dicService = require("../../service/dicService");

/**
 * @description 字典
 * @date  2021.9.10
 * @author kamto
 */

router
  .get("/dic/list", async function (ctx, next) {
    var query = ctx.request.query;
    const res = await dicService.getDicList(query);
    ctx.body = res;
  })
  .post("/dic", async function (ctx, next) {
    let body = ctx.request.body;
    const res = await dicService.postDic(body);
    ctx.body = res;
  })
  .get("/dic/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await dicService.getDic(id);
    ctx.body = res;
  })
  .put("/dic/:id", async function (ctx, next) {
    let id = ctx.params.id;
    let body = ctx.request.body;
    const res = await dicService.putDic(id, body);
    ctx.body = res;
  })
  .delete("/dic/:id", async function (ctx, next) {
    let id = ctx.params.id;
    const res = await dicService.deleteDic(id);
    ctx.body = res;
  })
  .delete("/testDelDic/:key", async function (ctx, next) {
    let key = ctx.params.key;
    const res = await dicService.testDelDic(key);
    ctx.body = res;
  });

module.exports = router.routes();
