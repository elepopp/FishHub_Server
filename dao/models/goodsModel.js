var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var goodsSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    tagsIds: Array, // 标签列表
    status: {
      type: Number,
      default: 101,
    },
    orderNum: {
      type: Number,
      default: 100,
    },

    productPicIds: {
      type: Array,
      default: [],
    },
    mainPicId: mongoose.Schema.ObjectId,
    pages: {
      type: Number,
      default: 5,
    }, // 页数
    price: {
      type: Number,
      default: 30,
    }, // 价格
    difficulty: Number, // 难度
    type: {
      // 类型
      type: Number,
      default: 101,
    },
    like: {
      // 类型
      type: Number,
      default: 0,
    },
    buyed: {
      // 类型
      type: Number,
      default: 0,
    },
    read: {
      // 类型
      type: Number,
      default: 0,
    },
    filePath: {
      type: String,
      default: "",
    },
    createTime: {
      // 类型
      type: Date,
      default: Date.now,
    },
    updateTime: {
      // 类型
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

mongoose.model("goods", goodsSchema, "goods"); //根据骨架创建模版
