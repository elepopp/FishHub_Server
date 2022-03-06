const userDao = require("../dao/userDao"); //引入
let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具
const { validatePhone, validateEmail } = require("../util/check");

const getUserList = async (query) => {
  var sort = {
    updateTime: -1,
  };
  var skip = query.pageNum * query.pageSize - query.pageSize;
  var limit = query.pageSize;
  delete query["sort"];
  delete query["pageNum"];
  delete query["pageSize"];

  const reg = new RegExp(query.keyword, "i"); //不区分大小写
  var filter = {
    $and: [
      // 多字段同时匹配
      { pages: { $lte: query.maxPages || 10000, $gte: query.minPages || 1 } }, //  页数
      { price: { $lte: query.maxPrice || 10000, $gte: query.minPrice || 0 } }, // 价格
    ],
    $or: [
      //多条件，数组
      { nickname: { $regex: reg } },
    ],
  };
  if (query.type) {
    filter.$and = [{ type: query.type }];
  }
  let res = await userDao.getUserList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((user) => {
      user.BeautifyCreateTime = util.getBeautifyTime(user.createTime);
      user.BeautifyUpdateTime = util.getBeautifyTime(user.updateTime);
      user.createTime = moment(user.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      user.updateTime = moment(user.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const postUser = async (data) => {
  let res = await userDao.postUser(data);
  return res;
};

const postUsers = async (data) => {
  let res = await userDao.postUsers(data);
  return res;
};

const getUser = async (user_id) => {
  let res = await userDao.getUser(user_id);
  return res;
};

const putUserAratar = async (user_id, data) => {
  if (!data.avatar) {
    return {
      code: 400,
      message: "设置失败",
      tips: "头像不可设置为空",
      data: null,
    };
  }

  let res = await userDao.putUser(user_id, {
    avatar: data.avatar,
    password: new Date().getTime(),
  });
  return res;
};

const putUser = async (user_id, data) => {
  if (data.phone && !validatePhone(data.phone)) {
    return {
      code: 400,
      message: "手机号格式错误",
      tips: "手机号格式错误",
      data: null,
    };
  }
  if (data.email && !validateEmail(data.email)) {
    return {
      code: 400,
      message: "邮箱格式错误",
      tips: "邮箱格式错误",
      data: null,
    };
  }
  if (!data.username) {
    return {
      code: 400,
      message: "用户名不能为空",
      tips: "用户名不能为空",
      data: null,
    };
  }
  if (!data.password) {
    return {
      code: 400,
      message: "密码不能为空",
      tips: "密码不能为空",
      data: null,
    };
  }
  if (data.username) {
    let checkUserByUsername = await userDao.checkUser({
      _filter: {
        $and: [
          {
            username: data.username,
          },
        ],
      },
    });
    if (
      checkUserByUsername.data.length == 1 &&
      checkUserByUsername.data[0]._id.toString() != user_id
    ) {
      return {
        code: 400,
        message: "用户名已存在",
        tips: "用户名已存在",
        data: null,
      };
    } else if (checkUserByUsername.data.length > 1) {
      return {
        code: 500,
        message: "用户名异常",
        tips: "用户名异常",
        data: checkUserByUsername,
      };
    }
  }

  if (data.phone) {
    let checkUserByUsername = await userDao.checkUser({
      _filter: {
        $and: [
          {
            phone: data.phone,
          },
        ],
      },
    });
    if (
      checkUserByUsername.data.length == 1 &&
      checkUserByUsername.data[0]._id.toString() != user_id
    ) {
      return {
        code: 400,
        message: "手机号已存在",
        tips: "手机号已存在",
        data: null,
      };
    } else if (checkUserByUsername.data.length > 1) {
      return {
        code: 500,
        message: "手机号异常",
        tips: "手机号异常",
        data: checkUserByUsername,
      };
    }
  }

  if (data.email) {
    let checkUserByUsername = await userDao.checkUser({
      _filter: {
        $and: [
          {
            email: data.email,
          },
        ],
      },
    });
    if (
      checkUserByUsername.data.length == 1 &&
      checkUserByUsername.data[0]._id.toString() != user_id
    ) {
      return {
        code: 400,
        message: "邮箱已存在",
        tips: "邮箱已存在",
        data: null,
      };
    } else if (checkUserByUsername.data.length > 1) {
      return {
        code: 500,
        message: "邮箱异常",
        tips: "邮箱异常",
        data: checkUserByUsername,
      };
    }
  }

  let res = await userDao.putUser(user_id, data);
  return res;
};

const deleteUser = async (user_id) => {
  let res = await userDao.deleteUser(user_id);
  return res;
};

const checkUser = async (data) => {
  var filter = {
    $and: [],
  };
  if (data.phone) {
    filter.$and.push({
      phone: data.phone,
    });
  } else if (data.email) {
    filter.$and.push({
      email: data.email,
    });
  } else {
    filter.$and.push({
      username: data.username,
    });
  }

  let res = await userDao.checkUser({ _filter: filter });
  return res;
};

const checkUserByGithub = async (id) => {
  var filter = {
    $and: [{ github_id: id }],
  };

  let res = await userDao.checkUser({ _filter: filter });
  return res;
};

const checkUserByWx = async (id) => {
  var filter = {
    $and: [{ wx_openid: id }],
  };

  let res = await userDao.checkUser({ _filter: filter });
  return res;
};

module.exports = {
  getUserList,
  postUser,
  postUsers,
  getUser,
  putUser,

  deleteUser,
  checkUser,
  checkUserByGithub,
  checkUserByWx,
  putUserAratar,
}; //暴露
