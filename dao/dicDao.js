const mongoose = require("mongoose"); //引入mongoose
const dicModel = mongoose.model("dic");

// 获取文档列表
const getDicList = async ({ _filter, _sort, _skip, _limit }) => {
  // data
  return new Promise(async function (resolve, reject) {
    var data = false;
    var total = false;
    var computedNum = 0;
    dicModel
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
    dicModel
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
const getDic = async (id) => {
  return new Promise(function (resolve, reject) {
    dicModel.findById(id, (err, res) => {
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
const postDic = async (data) => {
  return new Promise(function (resolve, reject) {
    dicModel.create([data], (err, res) => {
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
const putDic = async (id, data) => {
  data.updateTime = Date.now();
  return new Promise(function (resolve, reject) {
    dicModel.findByIdAndUpdate(id, data, { new: true }, (err, res) => {
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
const deleteDic = async (id) => {
  return new Promise(function (resolve, reject) {
    dicModel.findByIdAndRemove(id, (err, res) => {
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

// 检查字典
const checkDic = async (value) => {
  return new Promise(function (resolve, reject) {
    dicModel
      .find(
        {
          value: value,
          type: 888,
        },
        null
      )
      .exec(async (err, res) => {
        if (!err) {
          if (res.length > 0) {
            resolve(res[0]);
          } else {
            let res2 = await postDic({
              type: 888,
              key: value,
              value: value,
            });
            resolve(res2.data[0]);
          }
        } else {
          resolve("error");
        }
      });
  });
};

// 删除记录
const testDelDic = async (key) => {
  return new Promise(function (resolve, reject) {
    dicModel.remove(
      {
        key: key,
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

// 检查字典
const checkEvent = async (value) => {
  return new Promise(function (resolve, reject) {
    dicModel
      .find(
        {
          value: value,
        },
        null
      )
      .exec(async (error, res) => {
        if (!error) {
          resolve({
            code: 200,
            data: res,
          });
        } else {
          resolve({
            code: 500,
            data: error,
          });
        }
      });
  });
};

module.exports = {
  getDicList,
  postDic,
  getDic,
  putDic,
  deleteDic,
  checkDic,
  testDelDic,
  checkEvent,
}; //暴露
