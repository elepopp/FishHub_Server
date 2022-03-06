const articleDao = require("../dao/articleDao"); //引入
const dicDao = require("../dao/dicDao"); //引入
var Promise = require("bluebird");

let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getArticleList = async (query) => {
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
    $and: [
      // 多字段同时匹配
      { status: query.status || 101 },
    ],
    $or: [
      //多条件，数组
      { title: { $regex: reg } },
      { description: { $regex: reg } },
    ],
  };
  if (query.type && query.type.length > 0) {
    filter.$and.push({ type: query.type });
  }
  if (query.user_id && query.user_id.length > 0) {
    filter.$and.push({ user_id: require("mongodb").ObjectID(query.user_id) });
  }
  if (query.tagsIds && query.tagsIds.length > 0) {
    query.tagsIds = query.tagsIds.map((id) => {
      return require("mongodb").ObjectID(id);
    });
    filter.$and.push({ tagsIds: { $elemMatch: { $in: query.tagsIds } } });
  }

  let res = await articleDao.getArticleList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));

    res.data.forEach((article) => {
      article.mainPic = article.mainPic[0];
      article.BeautifyCreateTime = util.getBeautifyTime(article.createTime);
      article.BeautifyUpdateTime = util.getBeautifyTime(article.updateTime);
      article.tags = article.tags.map((tag) => {
        return tag.value;
      });

      article.createTime = moment(article.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      article.updateTime = moment(article.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const postArticle = async ({ data }) => {
  if (data && data.tags) {
    var tags = data.tags;
    var _tags = await Promise.map(tags, function (tag) {
      // Promise.map awaits for returned promises as well.
      return dicDao.checkDic(tag);
    });
    data.tagsIds = _tags.map((tag) => {
      return tag._id;
    });
  }
  if (data.mainPic)
    data.mainPicId = require("mongodb").ObjectID(data.mainPic._id);
  let res = await articleDao.postArticle(data);
  return res;
};

const getArticle = async (id) => {
  let res = await articleDao.getArticle(require("mongodb").ObjectID(id));
  res.data.mainPic = res.data.mainPic[0];
  res.data.BeautifyCreateTime = util.getBeautifyTime(res.data.createTime);
  res.data.BeautifyUpdateTime = util.getBeautifyTime(res.data.updateTime);

  res.data.createTime = moment(res.data.createTime).format(
    "YYYY年MM月DD日 hh:mm:ss A"
  );
  res.data.updateTime = moment(res.data.updateTime).format(
    "YYYY年MM月DD日 hh:mm:ss A"
  );
  return res;
};
const getArticleByUser = async ({ id, user_id }) => {
  let res = await articleDao.getArticleByUser({
    id: require("mongodb").ObjectID(id),
    user_id: user_id,
  });

  res.data.BeautifyCreateTime = util.getBeautifyTime(res.data.createTime);
  res.data.BeautifyUpdateTime = util.getBeautifyTime(res.data.updateTime);

  res.data.createTime = moment(res.data.createTime).format(
    "YYYY年MM月DD日 hh:mm:ss A"
  );
  res.data.updateTime = moment(res.data.updateTime).format(
    "YYYY年MM月DD日 hh:mm:ss A"
  );

  res.data.mainPic = res.data.mainPic[0];
  return res;
};

const putArticle = async ({ id, data }) => {
  if (data && data.tags) {
    var tags = data.tags;
    var _tags = await Promise.map(tags, function (tag) {
      // Promise.map awaits for returned promises as well.
      return dicDao.checkDic(tag);
    });
    data.tagsIds = _tags.map((tag) => {
      return tag._id;
    });
  }

  if (data && data.mainPic) {
    data.mainPicId = require("mongodb").ObjectID(data.mainPic._id);
  }

  let res = await articleDao.putArticle(id, data);
  return res;
};

const deleteArticle = async (id) => {
  let res = await articleDao.deleteArticle(id);
  return res;
};

module.exports = {
  getArticleList,
  postArticle,
  getArticle,
  putArticle,
  deleteArticle,
  getArticleByUser,
}; //暴露
