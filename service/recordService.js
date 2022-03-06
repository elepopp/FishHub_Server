const recordDao = require("../dao/recordDao"); //引入
const goodsService = require("./goodsService"); //引入
const articleService = require("./articleService"); //引入

const orderDao = require("../dao/orderDao"); //引入

let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getAdmRecordList = async (query) => {
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
    if (query.type) {
      filter.$and.push({ type: query.type });
    }
  }

  let res = await recordDao.getAdmRecordList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((record) => {
      record.goods.mainPic = record.goods.mainPic[0];
      record.BeautifyCreateTime = util.getBeautifyTime(record.createTime);
      record.BeautifyUpdateTime = util.getBeautifyTime(record.updateTime);
      record.createTime = moment(record.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      record.updateTime = moment(record.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const getUserRecordList = async (query) => {
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
    if (query.type) {
      filter.$and.push({ type: query.type });
    }
  }

  let res = await recordDao.getUserRecordList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((record) => {
      record.goods.mainPic = record.goods.mainPic[0];
      record.createTime = moment(record.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      record.updateTime = moment(record.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const postRecord = async (data) => {
  if (data.goods_id) {
    data.goods_id = require("mongodb").ObjectID(data.goods_id);
    await goodsService.putGoods(data.goods_id, {
      $inc: { [data.type]: 1 },
    });
  } else {
    delete data["goods_id"];
  }
  if (data.article_id) {
    data.article_id = require("mongodb").ObjectID(data.article_id);
    await articleService.putArticle({
      id: data.article_id,
      data: {
        $inc: { [data.type]: 1 },
      },
    });
  }else{
    delete data["article_id"];
  }
  let res = await recordDao.postRecord(data);
  return res;
};

const deleteRecord = async (id) => {
  let res = await recordDao.deleteRecord(id);
  return res;
};

const deleteRecordByUser = async ({ user_id, goods_id }) => {
  let res = await recordDao.deleteRecordByUser({
    user_id: user_id,
    goods_id: require("mongodb").ObjectID(goods_id),
  });
  return res;
};

const getRecordGroup = async (id) => {
  let like = await recordDao.getRecordGroup("like", id);
  let read = await recordDao.getRecordGroup("read", id);
  let buyed = await orderDao.getOrderGroup(id);
  if (like == null || read == null || buyed == null) {
    return {
      code: 400,
      message: "失败",
      tips: "发生未知错误 20211015001",
      data: {
        like: like,
        read: read,
        buyed: buyed,
      },
    };
  } else {
    return {
      code: 200,
      message: "成功",
      tips: "查询成功",
      data: {
        like: like,
        read: read,
        buyed: buyed,
      },
    };
  }
};

module.exports = {
  getUserRecordList,
  getAdmRecordList,
  postRecord,
  deleteRecord,
  deleteRecordByUser,
  getRecordGroup,
}; //暴露
