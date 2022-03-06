const Router = require("koa-router");
const router = new Router();
const querystring = require("querystring");
let request = require("request");
const userService = require("../../service/userService");
const jwtUtil = require("../auth/jwt");

let callbackUrl = "https://fish.tngeek.com/loginSuccess";

let getGithubToken = function (params) {
  return new Promise(function (resolve, reject) {
    request(
      {
        url: `https://github.com/login/oauth/access_token`,
        method: "POST",
        timeout: 20000000,
        json: true,
        headers: {
          "content-type": "application/json",
        },
        body: params,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve({ code: 200, token: body.access_token });
        } else {
          resolve({ code: 400, error: error });
        }
      }
    );
  });
};
// 获取github用户信息
let getGithubUser = function (access_token) {
  return new Promise(function (resolve, reject) {
    request(
      {
        url: `https://api.github.com/user`,
        method: "GET",
        timeout: 20000000,
        headers: {
          Authorization: "token " + access_token,
          "User-Agent": "GeekLogin",
        },
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve({ code: 200, user: JSON.parse(response.body) });
        } else {
          resolve({ code: 400, error: error });
        }
      }
    );
  });
};

// GitHub登录参数配置；配置授权应用生成的Client ID和Client Secret
const config = {
  client_id: "715e47079ad34bed166d",
  client_secret: "375d033b8cb26ebcf09d93847b893997524afcb4",
};

router
  .get("/github/login", async function (ctx, next) {
    // 重定向到GitHub认证接口，并配置参数
    let path =
      "https://github.com/login/oauth/authorize?client_id=" + config.client_id;
    // 转发到授权服务器
    ctx.redirect(path);
    return;
  })
  .get("/github/callback", async function (ctx, next) {
    console.log("callback...");

    // 服务器认证成功，回调带回认证状态code
    const code = ctx.query.code;
    const params = {
      client_id: config.client_id,
      client_secret: config.client_secret,
      code: code,
    };

    const res_access_token = await getGithubToken(params);
    if (res_access_token.code == 400) {
      ctx.body = {
        code: 400,
        tips: "登录出错" + res_access_token.error,
        message: res_access_token.error,
      };
      return;
    }
    const githubUserInfo = await getGithubUser(res_access_token.token);
    if (githubUserInfo.code == 400) {
      ctx.body = {
        code: 400,
        tips: "登录出错" + githubUserInfo.error,
        message: githubUserInfo.error,
      };
      return;
    }

    var checkUser = await userService.checkUserByGithub(githubUserInfo.user.id);
    if (checkUser.code == 200) {
      if (checkUser.data.length == 1) {
        let userSecret = {
          user_id: checkUser.data[0]._id,
          type: checkUser.data[0].type,
        };
        let token = jwtUtil.createToken(userSecret);
        // 转发到授权成功链接
        ctx.redirect(callbackUrl + "?token=" + token);
        return;
      } else {
        // 注册

        let userInfo = {
          nickname: githubUserInfo.user.login,
          github_id: githubUserInfo.user.id,
          username: githubUserInfo.user.login,
          avatar: githubUserInfo.user.avatar_url,
          email: githubUserInfo.user.email,
          company: githubUserInfo.user.company,
          location: githubUserInfo.user.location,
          description: githubUserInfo.user.bio,
          blog: githubUserInfo.user.blog,
          github_url: githubUserInfo.user.url,
        };

        await userService.postUser(userInfo).then((res) => {
          if (res.code === 200) {
            // 生成token
            let userSecret = {
              user_id: res.data[0]._id,
              type: res.data[0].type,
            };
            let token = jwtUtil.createToken(userSecret);
            // 转发到授权成功链接
            ctx.redirect(callbackUrl + "?token=" + token);
          }
        });
      }
    }
  });

module.exports = router.routes();
