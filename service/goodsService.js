const goodsDao = require("../dao/goodsDao"); //引入
let moment = require("moment"); // 格式化时间插件
let util = require("../util/index.js"); // 工具

const getGoodsList = async (query) => {
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
      { type: query.type || 101 },
      { pages: { $lte: query.maxPages || 10000, $gte: query.minPages || 1 } }, //  页数
      { price: { $lte: query.maxPrice || 10000, $gte: query.minPrice || 0 } }, // 价格
    ],
    $or: [
      //多条件，数组
      { name: { $regex: reg } },
      { description: { $regex: reg } },
    ],
  };

  if (query.skills && query.skills.length > 0) {
    query.skills = query.skills.map((id) => {
      return require("mongodb").ObjectID(id);
    });
    filter.$and.push({ tagsIds: { $elemMatch: { $in: query.skills } } });
  }
  if (query.layout && query.layout.length > 0) {
    query.layout = query.layout.map((id) => {
      return require("mongodb").ObjectID(id);
    });
    filter.$and.push({ tagsIds: { $elemMatch: { $in: query.layout } } });
  }
  if (query.topics && query.topics.length > 0) {
    query.topics = query.topics.map((id) => {
      return require("mongodb").ObjectID(id);
    });
    filter.$and.push({ tagsIds: { $elemMatch: { $in: query.topics } } });
  }
  let res = await goodsDao.getGoodsList({
    _filter: filter,
    _sort: sort,
    _skip: skip,
    _limit: limit,
  });

  if (res.code == 200) {
    res.data = JSON.parse(JSON.stringify(res.data));

    res.data.forEach((goods) => {
      goods.mainPic = goods.mainPic[0];
      goods.BeautifyCreateTime = util.getBeautifyTime(goods.createTime);
      goods.BeautifyUpdateTime = util.getBeautifyTime(goods.updateTime);
      goods.createTime = moment(goods.createTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
      goods.updateTime = moment(goods.updateTime).format(
        "YYYY年MM月DD日 hh:mm:ss A"
      );
    });
  }
  return res;
};

const postGoods = async (data) => {
  if (data.tagsIds) {
    data.tagsIds = data.tagsIds.map((id) => {
      return require("mongodb").ObjectID(id);
    });
  }
  if (data.productPicList) {
    data.productPicIds = data.productPicList.map((pic) => {
      return require("mongodb").ObjectID(pic._id);
    });
  }
  if (data.mainPic)
    data.mainPicId = require("mongodb").ObjectID(data.mainPic._id);
  let res = await goodsDao.postGoods(data);
  return res;
};

const getGoods = async (id) => {
  let res = await goodsDao.getGoods(require("mongodb").ObjectID(id));
  res.data.mainPic = res.data.mainPic[0];
  return res;
};
const getGoodsByUser = async ({ id, user_id }) => {
  let res = await goodsDao.getGoodsByUser({
    id: require("mongodb").ObjectID(id),
    user_id: user_id,
  });
  res.data.mainPic = res.data.mainPic[0];
  return res;
};

const putGoods = async (id, data) => {
  if (data.tagsIds) {
    data.tagsIds = data.tagsIds.map((id) => {
      return require("mongodb").ObjectID(id);
    });
  }
  if (data.productPicList) {
    data.productPicIds = data.productPicList.map((pic) => {
      return require("mongodb").ObjectID(pic._id);
    });
  }
  if (data.mainPic)
    data.mainPicId = require("mongodb").ObjectID(data.mainPic._id);
  let res = await goodsDao.putGoods(id, data);
  return res;
};

const deleteGoods = async (id) => {
  let res = await goodsDao.deleteGoods(id);
  return res;
};

const getGoodsUrlByUser = async ({ user_id: user_id, goods_id: goods_id }) => {
  let res = await goodsDao.getGoodsUrlByUser({
    user_id: user_id,
    goods_id: require("mongodb").ObjectID(goods_id),
  });
  return res;
};

const getGoodsUrl = async ({ goods_id: goods_id }) => {
  let res = await goodsDao.getGoodsUrl({
    goods_id: require("mongodb").ObjectID(goods_id),
  });
  return res;
};

module.exports = {
  getGoodsList,
  postGoods,
  getGoods,
  putGoods,
  deleteGoods,
  getGoodsByUser,
  getGoodsUrl,
  getGoodsUrlByUser,
}; //暴露
