const mongoose = require("mongoose"); //引入mongoose
const recordModel = mongoose.model("record");
// 获取文档列表

const getAdmRecordList = ({ _filter, _sort, _skip, _limit }) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;

    recordModel.aggregate(
      [
        { $match: _filter },
        { $sort: _sort },
        { $skip: _skip || 0 },
        { $limit: _limit || 20 },
        {
          $lookup: {
            from: "goods", //关联的表名
            localField: "goods_id", //本身的外键
            foreignField: "_id",
            as: "goods",
          },
        },
        { $unwind: "$goods" },
        {
          $lookup: {
            from: "dic", //关联的表名
            localField: "goods.tagsIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "goods.tags", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名
            localField: "goods.mainPicId", //本身的外键
            foreignField: "_id", //需要关联表的外键
            as: "goods.mainPic", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名
            localField: "goods.productPicIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "goods.productPicList", //起个名字，随便，和下面对应
          },
        },
      ],
      (err, res) => {
        if (!err) {
          data = res;
          computedNum += 1;
          resolveFn();
        } else {
          resolve({
            code: 400,
            message: "查询",
            tips: "查询失败",
            data: err,
          });
        }
      }
    );
    recordModel.find(_filter, null).exec((err, res) => {
      if (!err) {
        total = res.length;
        computedNum += 1;
        resolveFn();
      } else {
        resolve({
          code: 400,
          message: "查询",
          tips: "查询失败",
          data: err,
        });
      }
    });
    function resolveFn() {
      if (computedNum == 2) {
        resolve({
          code: 200,
          message: "查询",
          tips: "查询成功",
          data: data,
          total: total,
        });
      }
    }
  });
};

const getUserRecordList = ({ _filter, _sort, _skip, _limit }) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;

    recordModel.aggregate(
      [
        { $match: _filter },
        {
          $group: {
            _id: "$goods_id",
            goods_id: { $first: "$goods_id" },
            user_id: { $first: "$user_id" },
            remarks: { $last: "$remarks" },
            type: { $first: "$type" },
            createTime: { $last: "$createTime" },
            updateTime: { $last: "$updateTime" },
          },
        },
        { $sort: _sort },
        { $skip: _skip || 0 },
        { $limit: _limit || 20 },
        {
          $lookup: {
            from: "goods", //关联的表名
            localField: "goods_id", //本身的外键
            foreignField: "_id",
            as: "goods",
          },
        },
        { $unwind: "$goods" },
        {
          $lookup: {
            from: "dic", //关联的表名
            localField: "goods.tagsIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "goods.tags", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名
            localField: "goods.mainPicId", //本身的外键
            foreignField: "_id", //需要关联表的外键
            as: "goods.mainPic", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名 
            localField: "goods.productPicIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "goods.productPicList", //起个名字，随便，和下面对应
          },
        },
      ],
      (err, res) => {
        if (!err) {
          data = res;
          computedNum += 1;
          resolveFn();
        } else {
          resolve({
            code: 400,
            message: "查询",
            tips: "查询失败",
            data: err,
          });
        }
      }
    );
    recordModel
      .find(_filter, null)
      .distinct("goods_id")
      .exec((err, res) => {
        if (!err) {
          total = res.length;
          computedNum += 1;
          resolveFn();
        } else {
          resolve({
            code: 400,
            message: "查询",
            tips: "查询失败",
            data: err,
          });
        }
      });
    function resolveFn() {
      if (computedNum == 2) {
        resolve({
          code: 200,
          message: "查询",
          tips: "查询成功",
          data: data,
          total: total,
        });
      }
    }
  });
};
// 创建记录
const postRecord = async (data) => {
  return new Promise(function (resolve, reject) {
    recordModel.create([data], (err, res) => {
      if (!err) {
        resolve({
          code: 200,
          message: "添加",
          tips: "添加成功",
          data: res,
        });
      } else {
        resolve({
          code: 400,
          message: "添加",
          tips: "添加失败",
          data: err,
        });
      }
    });
  });
};

// 删除记录
const deleteRecord = async (id) => {
  return new Promise(function (resolve, reject) {
    recordModel.findByIdAndRemove(id, (err, res) => {
      if (!err) {
        if (res) {
          resolve({
            code: 200,
            message: "删除",
            tips: "删除成功",
            data: res,
          });
        } else {
          resolve({
            code: 404,
            message: "未找到",
            tips: "删除失败",
            data: res,
          });
        }
      } else {
        resolve({
          code: 400,
          message: "删除",
          tips: "删除失败",
          data: err,
        });
      }
    });
  });
};

// 删除记录
const deleteRecordByUser = async ({ user_id, goods_id }) => {
  return new Promise(function (resolve, reject) {
    recordModel.remove(
      {
        goods_id: goods_id,
        user_id: user_id,
      },
      (err, res) => {
        if (!err) {
          if (res) {
            resolve({
              code: 200,
              message: "删除",
              tips: "删除成功",
              data: res,
            });
          } else {
            resolve({
              code: 404,
              message: "未找到",
              tips: "删除失败",
              data: res,
            });
          }
        } else {
          resolve({
            code: 400,
            message: "删除",
            tips: "删除失败",
            data: err,
          });
        }
      }
    );
  });
};

// 统计数量
const getRecordGroup = async (_type, id) => {
  return new Promise(async function (resolve, reject) {
    recordModel.aggregate(
      [
        {
          $match: {
            user_id: id,
            type: _type,
          },
        },
        {
          $group: { _id: "$goods_id", goods_id: { $first: "$goods_id" } },
        },
        {
          $group: { _id: null, count: { $sum: 1 } },
        },
      ],
      (err, res) => {
        if (!err) {
          if (res[0]) {
            resolve(res[0].count);
          } else {
            resolve(0);
          }
        } else {
          resolve(null);
        }
      }
    );
  });
};

module.exports = {
  getUserRecordList,
  getAdmRecordList,
  postRecord,
  deleteRecord,
  deleteRecordByUser,
  getRecordGroup,
}; //暴露
