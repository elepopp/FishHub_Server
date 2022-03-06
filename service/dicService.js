const dicDao = require("../dao/dicDao"); //引入
let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getDicList = async (query) => {
  var sort = {
    orderNum: 1,
    updateTime: -1,
  };
  var skip = query.pageNum * query.pageSize - query.pageSize;
  var limit = query.pageSize;
  delete query["sort"];
  delete query["pageNum"];
  delete query["pageSize"];

  const reg = new RegExp(query.keyword, "i"); //不区分大小写
  var filter = {
    $or: [
      //多条件，数组
      { key: { $regex: reg } },
      { value: { $regex: reg } },
    ],
  };
  if (query.type) {
    filter.$and = [{ type: query.type }];
  }
  let res = await dicDao.getDicList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((dic) => {
      dic.BeautifyCreateTime = util.getBeautifyTime(dic.createTime);
      dic.BeautifyUpdateTime = util.getBeautifyTime(dic.updateTime);
      dic.createTime = moment(dic.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      dic.updateTime = moment(dic.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const getFaq = async () => {
  var sort = {
    orderNum: 1,
    updateTime: -1,
  };
  var skip = 0;
  var limit = 1000000000;
  var filter = {
    $or: [
      // 多字段同时匹配
      { type: 201 },
      { type: 202 },
      { type: 203 },
      { type: 204 },
      { type: 205 },
    ],
  };

  let res = await dicDao.getDicList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });
  var faqIndex = [];
  var faq = [];
  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((dic) => {
      dic.BeautifyCreateTime = util.getBeautifyTime(dic.createTime);
      dic.BeautifyUpdateTime = util.getBeautifyTime(dic.updateTime);
      dic.createTime = moment(dic.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      dic.updateTime = moment(dic.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );

      if (faqIndex.indexOf(dic.type) >= 0) {
        faq[faqIndex.indexOf(dic.type)].push(dic);
      } else {
        faqIndex.push(dic.type);
        faq.push([dic]);
      }
    });
  }
  res.data = faq;
  return res;
};

const getHomeOptions = async () => {
  var sort = {
    orderNum: 1,
    updateTime: -1,
  };
  var skip = 0;
  var limit = 1000000000;
  var filter = {
    $or: [
      // 多字段同时匹配
      { type: 101 },
      { type: 102 },
      { type: 103 },
    ],
  };

  let res = await dicDao.getDicList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  return res;
};

const getArticleType = async () => {
  var sort = {
    orderNum: 1,
    updateTime: -1,
  };
  var skip = 0;
  var limit = 1000000000;
  var filter = {
    $or: [
      // 多字段同时匹配
      { type: 301 },
    ],
  };

  let res = await dicDao.getDicList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  return res;
};

const getArticleTag = async () => {
  var sort = {
    orderNum: 1,
    updateTime: -1,
  };
  var skip = 0;
  var limit = 1000000000;
  var filter = {
    $or: [
      // 多字段同时匹配
      { type: 888 },
    ],
  };

  let res = await dicDao.getDicList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  return res;
};
const postDic = async (data) => {
  let res = await dicDao.postDic(data);
  return res;
};

const getDic = async (id) => {
  let res = await dicDao.getDic(id);
  return res;
};

const putDic = async (id, data) => {
  let res = await dicDao.putDic(id, data);
  return res;
};

const deleteDic = async (id) => {
  let res = await dicDao.deleteDic(id);
  return res;
};
const testDelDic = async (key) => {
  let res = await dicDao.testDelDic(key);
  return res;
};

const checkEvent = async (ticket) => {
  let res = await dicDao.checkEvent(ticket);
  return res;
};

module.exports = {
  getDicList,
  getHomeOptions,
  getFaq,
  postDic,
  getDic,
  putDic,
  deleteDic,
  testDelDic,
  getArticleType,
  getArticleTag,
  checkEvent,
}; //暴露
