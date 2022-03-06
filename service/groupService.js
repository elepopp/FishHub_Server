const groupDao = require("../dao/groupDao"); //引入

let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getDashboard = async () => {
  var res = {
    code: 200,
    message: "查询",
    tips: "查询成功",
    data: null,
  };
  try {
    res.data = {
      read: await groupDao.getGroupByRead(),
      order: await groupDao.getGroupByOrder(),
      successMoney: await groupDao.getGroupByOrderMoneySuccess(),
      nopayMoney: await groupDao.getGroupByOrderMoneyNopay(),
      user: await groupDao.getGroupByUser(),
      goods: await groupDao.getGroupByGoods(),
      like: await groupDao.getGroupByLike(),
    };
  } catch (error) {
    res.tips = error;
  }
  return res;
};

module.exports = {
  getDashboard,
}; //暴露
