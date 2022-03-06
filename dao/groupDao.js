const mongoose = require("mongoose"); //引入mongoose
const goodsModel = mongoose.model("goods");
const recordModel = mongoose.model("record");
const orderModel = mongoose.model("order");
const userModel = mongoose.model("user");
let util = require("../util/index.js"); // 工具

// 获取作品统计数据
const getGroupByGoods = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    goodsModel
      .find({ createTime: { $gt: util.getFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          day = res;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 周
    goodsModel
      .find({ createTime: { $gt: util.getThisWeekFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          week = res;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 月
    goodsModel
      .find({ createTime: { $gt: util.getThisMonthFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          month = res;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 总
    goodsModel
      .find({}, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          total = res;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      });
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day,
          week: week,
          month: month,
          total: total,
        });
      }
    }
  });
};

// 获取作品统计数据
const getGroupByUser = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    userModel
      .find({ createTime: { $gt: util.getFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          day = res;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 周
    userModel
      .find({ createTime: { $gt: util.getThisWeekFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          week = res;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 月
    userModel
      .find({ createTime: { $gt: util.getThisMonthFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          month = res;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 总
    userModel
      .find({}, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          total = res;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      });
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day,
          week: week,
          month: month,
          total: total,
        });
      }
    }
  });
};

// 获取收藏记录统计数据
const getGroupByLike = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    recordModel
      .find({ createTime: { $gt: util.getFirstDay() }, type: "like" }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          day = res;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 周
    recordModel
      .find(
        { createTime: { $gt: util.getThisWeekFirstDay() }, type: "like" },
        null
      )
      .count()
      .exec((err, res) => {
        if (!err) {
          week = res;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 月
    recordModel
      .find(
        { createTime: { $gt: util.getThisMonthFirstDay() }, type: "like" },
        null
      )
      .count()
      .exec((err, res) => {
        if (!err) {
          month = res;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 总
    recordModel
      .find({ type: "like" }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          total = res;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      });
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day,
          week: week,
          month: month,
          total: total,
        });
      }
    }
  });
};

// 获取记录统计数据
const getGroupByRead = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    recordModel
      .find({ createTime: { $gt: util.getFirstDay() }, type: "read" }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          day = res;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 周
    recordModel
      .find(
        { createTime: { $gt: util.getThisWeekFirstDay() }, type: "read" },
        null
      )
      .count()
      .exec((err, res) => {
        if (!err) {
          week = res;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 月
    recordModel
      .find(
        { createTime: { $gt: util.getThisMonthFirstDay() }, type: "read" },
        null
      )
      .count()
      .exec((err, res) => {
        if (!err) {
          month = res;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 总
    recordModel
      .find({ type: "read" }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          total = res;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      });
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day,
          week: week,
          month: month,
          total: total,
        });
      }
    }
  });
};

// 获取订单统计数据
const getGroupByOrder = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    orderModel
      .find({ createTime: { $gt: util.getFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          day = res;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 周
    orderModel
      .find({ createTime: { $gt: util.getThisWeekFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          week = res;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 月
    orderModel
      .find({ createTime: { $gt: util.getThisMonthFirstDay() } }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          month = res;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      });
    // 总
    orderModel
      .find({}, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          total = res;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      });
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day,
          week: week,
          month: month,
          total: total,
        });
      }
    }
  });
};

// 获取订单统计数据 已支付成功
const getGroupByOrderMoneySuccess = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    orderModel.aggregate(
      [
        {
          $match: {
            createTime: { $gt: util.getFirstDay() },
            trade_state: "SUCCESS",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          day = res.length > 0 ? res[0].sum : 0;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    // 周
    orderModel.aggregate(
      [
        {
          $match: {
            createTime: { $gt: util.getThisWeekFirstDay() },
            trade_state: "SUCCESS",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          week = res.length > 0 ? res[0].sum : 0;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    // 月
    orderModel.aggregate(
      [
        {
          $match: {
            createTime: { $gt: util.getThisMonthFirstDay() },
            trade_state: "SUCCESS",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          month = res.length > 0 ? res[0].sum : 0;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    // 总
    orderModel.aggregate(
      [
        {
          $match: {
            trade_state: "SUCCESS",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          total = res.length > 0 ? res[0].sum : 0;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day.toFixed(2),
          week: week.toFixed(2),
          month: month.toFixed(2),
          total: total.toFixed(2),
        });
      }
    }
  });
};

// 获取订单统计数据 未支付
const getGroupByOrderMoneyNopay = async () => {
  // data
  return new Promise(async function (resolve, reject) {
    var day = 0;
    var week = 0;
    var month = 0;
    var total = 0;
    var computedNum = 0;
    // 日
    orderModel.aggregate(
      [
        {
          $match: {
            createTime: { $gt: util.getFirstDay() },
            trade_state: "NOTPAY",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          day = res.length > 0 ? res[0].sum : 0;
        } else {
          day = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    // 周
    orderModel.aggregate(
      [
        {
          $match: {
            createTime: { $gt: util.getThisWeekFirstDay() },
            trade_state: "NOTPAY",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          week = res.length > 0 ? res[0].sum : 0;
        } else {
          week = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    // 月
    orderModel.aggregate(
      [
        {
          $match: {
            createTime: { $gt: util.getThisMonthFirstDay() },
            trade_state: "NOTPAY",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          month = res.length > 0 ? res[0].sum : 0;
        } else {
          month = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    // 总
    orderModel.aggregate(
      [
        {
          $match: {
            trade_state: "NOTPAY",
          },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: "$total_fee" },
          },
        },
      ],
      (err, res) => {
        if (!err) {
          total = res.length > 0 ? res[0].sum : 0;
        } else {
          total = null;
        }
        computedNum += 1;
        resolveFn();
      }
    );
    function resolveFn() {
      if (computedNum == 4) {
        resolve({
          day: day.toFixed(2),
          week: week.toFixed(2),
          month: month.toFixed(2),
          total: total.toFixed(2),
        });
      }
    }
  });
};

module.exports = {
  getGroupByGoods,
  getGroupByLike,
  getGroupByOrder,
  getGroupByUser,
  getGroupByRead,
  getGroupByOrderMoneySuccess,
  getGroupByOrderMoneyNopay,
}; //暴露
