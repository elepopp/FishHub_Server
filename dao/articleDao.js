const mongoose = require("mongoose"); //引入mongoose
const articleModel = mongoose.model("article");
const commentModel = mongoose.model("comment");


// 获取文档列表
const getArticleList = async ({ _filter, _sort, _skip, _limit }) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;
    articleModel.aggregate(
      [
        { $match: _filter },
        { $sort: _sort },
        { $skip: _skip || 0 },
        { $limit: _limit || 20 },
        {
          $lookup: {
            from: "dic", //关联的表名
            localField: "tagsIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "tags", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "user", //关联的表名
            localField: "user_id", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "user", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名
            localField: "mainPicId", //本身的外键
            foreignField: "_id", //需要关联表的外键
            as: "mainPic", //起个名字，随便，和下面对应
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
            promiseResArr.push(getCommentNum({ article_id: e._id }));
          });
          let childrenList = await Promise.all(promiseResArr);

          data = data.map((e, i) => {
            e.comment_num = childrenList[i].total;
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
    articleModel
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

const getCommentNum = ({ article_id }) => {
  return new Promise(async function (resolve, reject) {
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
          resolve({
            code: 200,
            total: res,
          });
        } else {
          resolve({
            code: 500,
          });
        }
      });
  });
};

// 获取文档
const getArticle = async (id) => {
  return new Promise(async function (resolve, reject) {
    var resData = false;
    await articleModel.aggregate(
      [
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: "dic", //关联的表名
            localField: "tagsIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "tags", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "user", //关联的表名
            localField: "user_id", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "user", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名
            localField: "mainPicId", //本身的外键
            foreignField: "_id", //需要关联表的外键
            as: "mainPic", //起个名字，随便，和下面对应
          },
        },
      ],
      (err, res) => {
        if (!err) {
          if (res && res.length == 0) {
            resData = {
              code: 404,
              message: "查询",
              tips: "暂无数据",
              data: null,
            };
          } else {
            // 过滤用户密码
            let articleData = res[0];
            articleData.user = articleData.user[0];
            delete articleData.user["password"];

            resData = {
              code: 200,
              message: "查询",
              tips: "查询成功",
              data: articleData,
            };
          }
        } else {
          resData = {
            code: 400,
            message: "查询",
            tips: "查询失败",
            data: null,
          };
        }
        resolve(resData);
      }
    );
  });
};

// 获取文档
const getArticleByUser = async ({ id, user_id }) => {
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;
    await articleModel.aggregate(
      [
        {
          $match: {
            user_id: user_id,
          },
        },
        { $sort: _sort },
        { $skip: _skip || 0 },
        { $limit: _limit || 20 },
        {
          $lookup: {
            from: "dic", //关联的表名
            localField: "tagsIds", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "tags", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "user", //关联的表名
            localField: "user_id", //本身的外键
            foreignField: "_id".valueOf(), //需要关联表的外键
            as: "user", //起个名字，随便，和下面对应
          },
        },
        {
          $lookup: {
            from: "media", //关联的表名
            localField: "mainPicId", //本身的外键
            foreignField: "_id", //需要关联表的外键
            as: "mainPic", //起个名字，随便，和下面对应
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
            promiseResArr.push(getCommentNum({ article_id: e._id }));
          });
          let childrenList = await Promise.all(promiseResArr);

          data = data.map((e, i) => {
            e.comment_num = childrenList[i].total;
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
    articleModel
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

// 创建文档
const postArticle = async (data) => {
  return new Promise(function (resolve, reject) {
    articleModel.create([data], (err, res) => {
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
const putArticle = async (id, data) => {
  data.updateTime = Date.now();
  return new Promise(function (resolve, reject) {
    articleModel.findByIdAndUpdate(
      id,
      data,

      { new: true },
      (err, res) => {
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
      }
    );
  });
};

// 删除文档
const deleteArticle = async (id) => {
  return new Promise(function (resolve, reject) {
    articleModel.findByIdAndRemove(id, (err, res) => {
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
  getArticleList,
  postArticle,
  getArticle,
  getArticleByUser,
  putArticle,
  deleteArticle,
}; //暴露
