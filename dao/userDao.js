const mongoose = require("mongoose"); //引入mongoose
const userModel = mongoose.model("user");
const articleModel = mongoose.model("article");
const commentModel = mongoose.model("comment");

// 获取文档列表
const getUserList = async ({ _filter, _sort, _skip, _limit }) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;

    userModel
      .find(_filter, null, {
        sort: _sort,
        skip: _skip || 0,
        limit: _limit || 20,
      })
      .exec((err, res) => {
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
      });

    userModel
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
const getUser = async (id) => {
  await sumCommentByUser(id);
  return new Promise(function (resolve, reject) {
    userModel.aggregate(
      [
        {
          $match: {
            _id: id,
          },
        },
      ],
      async (err, res) => {
        if (!err) {
          if (!res) {
            resolve({
              code: 404,
              message: "查询",
              tips: "暂无数据",
              data: null,
            });
          } else {
            let article = await getLikeByUser(id);
            let data = res[0];
            data.like_num = article.like_num;
            data.comment_num = await sumCommentByUser(id);
            data.article_num = article.article_num;
            delete data["password"];
            resolve({
              code: 200,
              message: "查询",
              tips: "查询成功",
              data: res[0],
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
      }
    );
  });
};

const getLikeByUser = (id) => {
  return new Promise(function (resolve, reject) {
    articleModel
      .aggregate([
        {
          $match: {
            user_id: id,
          },
        },
        {
          $group: {
            _id: "$_id",
            like: { $sum: "$like" },
          },
        },
        {
          $group: {
            _id: null,
            article_num: { $sum: 1 },
            like_num: { $sum: "$like" },
          },
        },
      ])
      .exec((err, res) => {
        if (!err) {
          resolve({
            code: 200,
            like_num: (res[0] && res[0].like_num) || 0,
            article_num: (res[0] && res[0].article_num) || 0,
          });
        } else {
          resolve({
            code: 400,
          });
        }
      });
  });
};

const sumCommentByUser = async (id) => {
  articleIds = (await getArticleByUser(id)).data.map((e) => e._id);
  let comment_num = await getCommentByArticle(articleIds);
  return comment_num.total;
};

const getArticleByUser = (id) => {
  return new Promise(function (resolve, reject) {
    articleModel
      .aggregate([
        {
          $match: {
            user_id: id,
          },
        },
      ])
      .exec((err, res) => {
        if (!err) {
          resolve({
            code: 200,
            data: res,
          });
        } else {
          resolve({
            code: 400,
          });
        }
      });
  });
};

const getCommentByArticle = (articleIds) => {
  return new Promise(function (resolve, reject) {
    commentModel
      .find({ article_id: articleIds }, null)
      .count()
      .exec((err, res) => {
        if (!err) {
          resolve({
            code: 200,
            total: res,
          });
        } else {
          resolve({
            code: 400,
          });
        }
      });
  });
};

// 创建文档
const postUser = async (data) => {
  return new Promise(function (resolve, reject) {
    userModel.create([data], (err, res) => {
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

// 创建多个用户
const postUsers = async (data) => {
  return new Promise(function (resolve, reject) {
    userModel.create(data, (err, res) => {
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
const putUser = async (id, data) => {
  data.updateTime = Date.now();
  return new Promise(function (resolve, reject) {
    userModel.findByIdAndUpdate(id, data, { new: true }, (err, res) => {
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
const deleteUser = async (id) => {
  return new Promise(function (resolve, reject) {
    userModel.findByIdAndRemove(id, (err, res) => {
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

const checkUser = async ({ _filter }) => {
  return new Promise(function (resolve) {
    userModel.find(_filter, null).exec((err, res) => {
      if (!err) {
        resolve({
          code: 200,
          data: res,
        });
      } else {
        resolve({
          code: 400,
          error: err,
        });
      }
    });
  });
};

module.exports = {
  getUserList,
  postUser,
  getUser,
  putUser,
  deleteUser,
  checkUser,
  postUsers,
}; //暴露
