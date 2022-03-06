const Router = require("koa-router");
const router = new Router();
const dicService = require("../../service/dicService");

/**
 * @description 字典
 * @date  2021.9.10
 * @author kamto
 */

router
  .get("/faq", async function (ctx, next) {
    const res = await dicService.getFaq();
    ctx.body = res;
  })
  .get("/getHomeOptions", async function (ctx, next) {
    const res = await dicService.getHomeOptions();
    ctx.body = res;
  })
  .get("/articleType", async function (ctx, next) {
    const res = await dicService.getArticleType();
    ctx.body = res;
  })
  .get("/articleTag", async function (ctx, next) {
    const res = await dicService.getArticleTag();
    ctx.body = res;
  })
  .get("/school", async (ctx, next) => {
    var fs = require("fs");
    var school = await new Promise((resolve) => {
      fs.readFile("./static/school.json", "utf8", function (err, data) {
        if (err) console.log(err);
        data = JSON.parse(data); //读取的值
        let result = flattenObj(data.schools);
        let resArr = [];
        for (let i in result) {
          resArr.push(result[i]);
        }
        resolve(resArr);
      });
    });

    function flattenObj(obj, tempKey, resultObj) {
      tempKey = tempKey || "";
      resultObj = resultObj || {};
      for (let key in obj) {
        var value = obj[key];
        tempKey = tempKey + key + ".";
        if (typeof value == "object") {
          flattenObj(value, tempKey, resultObj);
        } else {
          if (!tempKey.endsWith("city_name.") && !tempKey.endsWith("label.")) {
            resultObj[tempKey] = value;
          }
        }
      }
      return resultObj;
    }
    ctx.body = {
      code: 200,
      tips: "",
      message: "查询成功",
      data: school,
    };
  });

module.exports = router.routes();
