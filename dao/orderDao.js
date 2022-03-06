const mongoose = require("mongoose"); //引入mongoose
const orderModel = mongoose.model("order");

// 获取文档列表
const getOrderList = ({ _filter, _sort, _skip, _limit }) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;
    orderModel.aggregate(
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

    orderModel
      .find(_filter, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          total = res;
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

// 获取文档
const getOrder = async (id) => {
  return new Promise(function (resolve, reject) {
    orderModel.findById(id, (err, res) => {
      if (!err) {
        if (!res) {
          resolve({
            code: 404,
            message: "查询",
            tips: "暂无数据",
            data: null,
          });
        } else {
          resolve({
            code: 200,
            message: "查询",
            tips: "查询成功",
            data: res,
          });
        }
      } else {
        resolve({
          code: 400,
          message: "查询",
          tips: "查询失败",
          data: err,
        });
      }
    });
  });
};

// 获取文档
const getOrderByOutTradeNo = async (out_trade_no) => {
  return new Promise(function (resolve, reject) {
    orderModel.find({ out_trade_no: out_trade_no }, (err, res) => {
      if (!err) {
        if (!res) {
          resolve([]);
        } else {
          resolve(res);
        }
      } else {
        resolve([]);
      }
    });
  });
};

// 创建文档
const postOrder = async (data) => {
  return new Promise(function (resolve, reject) {
    orderModel.create([data], (err, res) => {
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

// 更新文档
const putOrder = async (id, data) => {
  data.updateTime = Date.now();
  return new Promise(function (resolve, reject) {
    orderModel.findByIdAndUpdate(id, data, { new: true }, (err, res) => {
      if (!err) {
        if (!res) {
          resolve({
            code: 404,
            message: "更新",
            tips: "未找到",
            data: null,
          });
        } else {
          resolve({
            code: 200,
            message: "更新",
            tips: "更新成功",
            data: res,
          });
        }
      } else {
        resolve({
          code: 400,
          message: "更新",
          tips: "更新失败",
          data: err,
        });
      }
    });
  });
};

// 删除文档
const deleteOrder = async (id) => {
  return new Promise(function (resolve, reject) {
    orderModel.findByIdAndRemove(id, (err, res) => {
      if (!err) {
        resolve({
          code: 200,
          message: "删除",
          tips: "删除成功",
          data: res,
        });
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
// 统计数量
const getOrderGroup = async (id) => {
  return new Promise(async function (resolve, reject) {
    orderModel.aggregate(
      [
        {
          $match: {
            user_id: id,
            trade_state: "SUCCESS",
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
  getOrderList,
  getOrderByOutTradeNo,
  postOrder,
  getOrder,
  putOrder,
  deleteOrder,
  getOrderGroup,
}; //暴露
