const Koa = require("koa");
const Router = require("koa-router");
let router = new Router();

const app = new Koa();
const db = require("./dao/db");
db();

var bodyParser = require("koa-bodyparser");
app.use(
  bodyParser({
    enableTypes: ["json", "form", "text"],
    extendTypes: {
      text: ["text/xml", "application/xml"],
    },
  })
);

const cors = require("koa2-cors");
app.use(cors());

const Auth = require("./routes/auth/auth");

app.use(async (ctx, next) => {
  // 进行验证拦截
  await Auth(ctx, next);
});

// 装载路由中间件
router.use("/adm", require("./routes/adm"));
router.use("/app", require("./routes/app"));

app.use(router.routes());

var fs = require("fs");
var result = fs.readFileSync("success.txt", "utf8");
let port = 3066; 

app.listen(port, function () {
  console.log("服务已开启:localhost:" + port);
});
