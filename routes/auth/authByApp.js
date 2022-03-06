/**
 * @description 登录 注册
 * @date  2021.5.9
 * @author kamto
 */

const url = require("url");
const jwtUtil = require("./jwt");
const { validatePhone, validateEmail } = require("../../util/check");

const userService = require("../../service/userService");

module.exports = async function (ctx, next) {
  // 过滤路径参数
  var avoidTheLogin = [
    "/app/wxPay/isPaySuccess",
    "/app/faq",
    "/app/school",
    "/app/school",
    "/app/goods/list",
    "/app/article/list",
    "/app/getHomeOptions",
    "/app/articleTag",
    "/app/articleType",
    "/app/comment/list",
    "/app/github/login",
    "/app/github/callback",
    "/app/wx/open",
    "/app/wx/loginQrcode",
    "/app/wx/checkLogin",
  ];

  if (
    ((url.parse(ctx.url).pathname.indexOf("/app/user/operation") >= 0 ||
      url.parse(ctx.url).pathname.indexOf("/app/goods/") >= 0 ||
      url.parse(ctx.url).pathname.indexOf("/app/user/") >= 0 ||
      url.parse(ctx.url).pathname.indexOf("/app/article/") >= 0) &&
      !ctx.headers.authorization) ||
    url.parse(ctx.url).pathname.indexOf("/tools/") >= 0 ||
    avoidTheLogin.indexOf(url.parse(ctx.url).pathname) >= 0
  ) {
    // 免登录
    await next();
  } else if (ctx.url == "/app/login") {
    const account = ctx.request.body.account;
    const password = ctx.request.body.password;
    let data = {
      phone: "",
      email: "",
      username: "",
      password: password,
    };

    if (validatePhone(account)) {
      data.phone = account;
    } else if (validateEmail(account)) {
      data.email = account;
    } else {
      data.username = account;
    }
    var checkUser = await userService.checkUser(data);
    if (checkUser.code == 200) {
      if (checkUser.data.length == 1) {
        if (checkUser.data[0].password === data.password) {
          let userSecret = {
            user_id: checkUser.data[0]._id,
            type: checkUser.data[0].type,
          };
          let token = jwtUtil.createToken(userSecret);
          ctx.body = {
            code: 200,
            tips: "登录成功",
            message: "成功",
            data: {
              token: token,
            },
          };
        } else {
          ctx.body = {
            code: 400,
            tips: "账号和密码不匹配",
            message: "账号和密码不匹配",
            data: "",
          };
        }

        return;
      } else if (checkUser.data.length == 0) {
        ctx.body = {
          code: 404,
          tips: "该账号不存在",
          message: "该账号不存在",
          data: null,
        };
        return;
      } else {
        ctx.body = {
          code: 400,
          tips: "登录发生异常",
          message: "用户数发送异常",
          data: checkUser,
        };
        return;
      }
    } else {
      ctx.body = {
        code: 500,
        tips: "登录发生异常",
        message: "登录发生异常",
        data: checkUser,
      };
      return;
    }
  } else if (ctx.url == "/app/regsiter") {
    const account = ctx.request.body.account;
    const password = ctx.request.body.password;
    const school = ctx.request.body.school;
    let data = {
      phone: "",
      email: "",
      username: "",
      type: "general",
      password: password,
      school: school,
      avatar: `https://tngeek-app-1255310647.cos.ap-guangzhou.myqcloud.com/public/avatar/avatar_${
        Math.floor(Math.random() * (13 - 1)) + 1
      }.png`,
    };

    if (validatePhone(account)) {
      data.phone = account;
    } else if (validateEmail(account)) {
      data.email = account;
    } else {
      data.username = account;
    }

    if (!account || !password) {
      ctx.body = {
        code: 400,
        tips: "账号或密码不能为空",
        message: "账号或密码不能为空",
        data: "",
      };
      return;
    }
    if (!school) {
      ctx.body = {
        code: 400,
        tips: "请填写学校",
        message: "请填写学校",
        data: "",
      };
      return;
    }

    var checkUser = await userService.checkUser(data);
    if (checkUser.code == 200) {
      if (checkUser.data.length == 1) {
        ctx.body = {
          code: 404,
          tips: "该账号已存在",
          message: "该账号已存在",
          data: null,
        };
        return;
      } else if (checkUser.data.length == 0) {
        // 注册
        await userService.postUser(data).then((res) => {
          if (res.code === 200) {
            // 生成token
            let userSecret = {
              user_id: res.data[0]._id,
              type: res.data[0].type,
            };
            let token = jwtUtil.createToken(userSecret);
            ctx.body = {
              code: 200,
              tips: "注册成功",
              message: "成功",
              data: {
                token: token,
              },
            };
          }
        });
      } else {
        ctx.body = {
          code: 500,
          tips: "账号数异常",
          message: "账号数异常",
          data: checkUser,
        };
      }
      return;
    } else {
      ctx.body = {
        code: 500,
        tips: "注册发生异常",
        message: "注册发生异常",
        data: checkUser,
      };
      return;
    }
  } else {
    let token = ctx.headers.authorization;
    if (!token) {
      ctx.body = {
        code: 401,
        tips: "token不能为空",
        message: "token不能为空",
        data: "",
      };
      return;
    } else {
      try {
        let userSecret = jwtUtil.verifyToken(token);
        ctx.user_id = require("mongodb").ObjectID(userSecret.user_id);
        if (userSecret.type != "general") {
          ctx.body = {
            code: 403,
            tips: "无权限",
            message: "无权限",
            data: userSecret.type,
          };
          return;
        }
        try {
          await next();
        } catch (error) {
          console.log(error);
          ctx.body = {
            code: 500,
            tips: "发送未知错误",
            message: "发送未知错误",
            data: error,
          };
          return;
        }
      } catch {
        ctx.body = {
          code: 401,
          tips: "用户token失效，请检查token",
          message: "用户token失效，请检查token",
          data: "",
        };
        return;
      }
    }
  }
};
