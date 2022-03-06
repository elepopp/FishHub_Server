const mongoose = require("mongoose"); //引入mongoose
const commentModel = mongoose.model("comment");

// 获取文档列表
const getCommentList = async ({
  _filter,
  _sort,
  _skip,
  _limit,
  article_id,
}) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;

    commentModel.aggregate(
      [
        { $match: _filter },
        { $sort: _sort },
        { $skip: _skip || 0 },
        { $limit: _limit || 20 },
        {
          $lookup: {
            from: "user", //关联的表名
            localField: "user_id", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "user", //起个名字，随便，和下面对应
          },
        },
      ],
      async (err, res) => {
        if (!err) {
          data = res;
          // 过滤用户密码
          data.forEach((e) => {
            e.user = e.user[0];
            delete e.user["password"];
          });
          let promiseResArr = [];
          data.map((e) => {
            promiseResArr.push(
              getCommentListByPid({ _id: e._id, _sort, _skip })
            );
          });
          let childrenList = await Promise.all(promiseResArr);
          data = data.map((e, i) => {
            e.children = childrenList[i].data;
            return e;
          });
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
    if (article_id) {
      commentModel
        .find(
          {
            $and: [
              //多条件，数组
              { article_id: article_id },
            ],
          },
          null
        )
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
    } else {
      total = _limit;
      computedNum += 1;
      resolveFn();
    }

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

// 获取文档列表
const getCommentListByPid = async ({ _id, _sort, _skip }) => {
  // data
  return new Promise(async function (resolve, reject) {
    commentModel.aggregate(
      [
        {
          $match: {
            $and: [
              {
                pid: _id,
              },
            ],
          },
        },
        { $sort: _sort },
        { $skip: _skip || 0 },
        { $limit: 20 },
        {
          $lookup: {
            from: "user", //关联的表名
            localField: "user_id", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "user", //起个名字，随便，和下面对应
          },
        },
      ],
      (err, res) => {
        if (!err) {
          // 过滤用户密码
          res.forEach((e) => {
            e.user = e.user[0];
            delete e.user["password"];
          });

          resolve({
            code: 200,
            message: "查询",
            tips: "查询成功",
            data: res,
            total: res.length,
          });
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
  });
};

// 获取文档
const getComment = async (id) => {
  return new Promise(function (resolve, reject) {
    commentModel.findById(id, (err, res) => {
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

// 创建文档
const postComment = async (data) => {
  return new Promise(function (resolve, reject) {
    commentModel.create([data], (err, res) => {
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

// 创建文档
const postComments = async (data) => {
  return new Promise(function (resolve, reject) {
    commentModel.create(data, (err, res) => {
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
const putComment = async (id, data) => {
  data.updateTime = Date.now();
  return new Promise(function (resolve, reject) {
    commentModel.findByIdAndUpdate(id, data, { new: true }, (err, res) => {
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
const deleteComment = async (id) => {
  return new Promise(function (resolve, reject) {
    commentModel.findByIdAndRemove(id, (err, res) => {
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

module.exports = {
  getCommentList,
  postComments,
  postComment,
  getComment,
  putComment,
  deleteComment,
};
