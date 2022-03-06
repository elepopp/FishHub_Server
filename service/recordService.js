const recordDao = require("../dao/recordDao"); //引入
const articleService = require("./articleService"); //引入


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
  if (data.article_id) {
    data.article_id = require("mongodb").ObjectID(data.article_id);
    await articleService.putArticle({
      id: data.article_id,
      data: {
        $inc: { [data.type]: 1 },
      },
    });
  } else {
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

module.exports = {
  getUserRecordList,
  getAdmRecordList,
  postRecord,
  deleteRecord,
  deleteRecordByUser,
}; //暴露
