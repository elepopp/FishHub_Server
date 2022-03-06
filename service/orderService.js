const orderDao = require("../dao/orderDao"); //引入

let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getOrderList = async (query) => {
  var sort = {
    updateTime: -1,
  };
  var skip = query.pageNum * query.pageSize - query.pageSize;
  var limit = query.pageSize;
  delete query["sort"];
  delete query["pageNum"];
  delete query["pageSize"];
  var filter = {};
  if (query.user_id) {
    filter = {
      $and: [{ user_id: query.user_id }],
    };
    if (query.type == "buyed") {
      filter.$and.push({ trade_state: "SUCCESS" });
    }
  }
  if (query.trade_state) {
    filter.$and = [{ trade_state: query.trade_state }];
  }
  let res = await orderDao.getOrderList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((order) => {
      order.goods.mainPic = order.goods.mainPic[0];
      order.BeautifyCreateTime = util.getBeautifyTime(order.createTime);
      order.BeautifyUpdateTime = util.getBeautifyTime(order.updateTime);
      order.createTime = moment(order.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      order.updateTime = moment(order.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res; 
};

const postOrder = async (data) => {
  let res = await orderDao.postOrder(data);
  return res;
};

const getOrder = async (id) => {
  let res = await orderDao.getOrder(id);
  return res;
};

const getOrderByOutTradeNo = async (id) => {
  let res = await orderDao.getOrderByOutTradeNo(id);
  return res;
};

const putOrder = async (id, data) => {
  let res = await orderDao.putOrder(id, data);
  return res;
};

const deleteOrder = async (id) => {
  let res = await orderDao.deleteOrder(id);
  return res;
};

module.exports = {
  getOrderList,
  postOrder,
  getOrder,
  putOrder,
  deleteOrder,
  getOrderByOutTradeNo,
}; //暴露
