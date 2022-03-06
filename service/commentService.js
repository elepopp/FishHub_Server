const commentDao = require("../dao/commentDao"); //引入
let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getCommentList = async (query) => {
  var sort = {
    updateTime: -1,
  };
  var skip = query.pageNum * query.pageSize - query.pageSize;
  var limit = query.pageSize;
  delete query["sort"];
  delete query["pageNum"];
  delete query["pageSize"];

  const reg = new RegExp(query.keyword, "i"); //不区分大小写
  var filter = {};

  if (query.article_id) {
    filter.$and = [
      //多条件，数组
      { article_id: require("mongodb").ObjectID(query.article_id) },
      { level: 1 },
    ];
  }

  let res = await commentDao.getCommentList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
    article_id: query.article_id || "",
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((comment) => {
      comment.BeautifyCreateTime = util.getBeautifyTime(comment.createTime);
      comment.BeautifyUpdateTime = util.getBeautifyTime(comment.updateTime);
      comment.children.forEach((commentChild) => {
        commentChild.BeautifyCreateTime = util.getBeautifyTime(
          commentChild.createTime
        );
        commentChild.BeautifyUpdateTime = util.getBeautifyTime(
          commentChild.updateTime
        );
        commentChild.createTime = moment(commentChild.createTime).format(
          "YYYY年MM月DD日 hh:mm:ss A"
        );
        commentChild.updateTime = moment(commentChild.updateTime).format(
          "YYYY年MM月DD日 hh:mm:ss A"
        );
      });
      comment.createTime = moment(comment.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      comment.updateTime = moment(comment.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const postComment = async (data) => {
  if (!data.article_id) {
    delete data["article_id"];
    data.type = "other";
  } else {
    data.type = "article";
  }
  if (!data.pid) {
    delete data["pid"];
    data.level = 1;
  } else {
    data.level = 2;
  }
  let res = await commentDao.postComment(data);
  return res;
};

const postComments = async (data) => {
  let res = await commentDao.postComments(data);
  return res;
};
module.exports = {
  getCommentList,
  postComment,
  postComments,
}; //暴露
