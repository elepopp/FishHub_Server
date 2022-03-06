const mediaDao = require("../dao/mediaDao"); //引入
let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getMediaList = async (query) => {
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
  let res = await mediaDao.getMediaList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));
    res.data.forEach((media) => {
      media.BeautifyCreateTime = util.getBeautifyTime(media.createTime);
      media.BeautifyUpdateTime = util.getBeautifyTime(media.updateTime);
      media.createTime = moment(media.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      media.updateTime = moment(media.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const postMedia = async (data) => {
  let res = await mediaDao.postMedia(data);
  return res;
};

const getMedia = async (id) => {
  let res = await mediaDao.getMedia(id);
  return res;
};

const putMedia = async (id, data) => {
  let res = await mediaDao.putMedia(id, data);
  return res;
};

const deleteMedia = async (id) => {
  let res = await mediaDao.deleteMedia(id);
  return res;
};
module.exports = {
  getMediaList,
  postMedia,
  getMedia,
  putMedia,
  deleteMedia,
}; //暴露
