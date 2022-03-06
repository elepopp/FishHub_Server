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
  if (ctx.url == "/adm/login") {
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
            code: 404,
            tips: "账号与密码不匹配",
            message: "账号与密码不匹配",
            data: null,
          };
        }
        return;
      } else if (checkUser.data.length == 0) {
        ctx.body = {
          code: 404,
          tips: "非法操作",
          message: "非法操作",
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
        code: 400,
        tips: "登录发生异常",
        message: "登录发生异常",
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
        if (userSecret.type != "administrator") {
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
