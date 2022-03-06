var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var mediaSchema = new Schema(
  {
    user_id: mongoose.Schema.ObjectId,
    status: {
      type: Number,
      default: 101,
    },
    title: {
      // 标题
      type: String,
      default: "",
    },
    description: {
      // 文章描述
      type: String,
      default: "",
    },
    url: {
      // 内容
      type: String,
      default: "",
    },
    type: {
      // 类型
      type: Number,
      default: 101,
    },
    width: {
      // 宽度
      type: Number,
      default: 400,
    },
    height: {
      // 高度
      type: Number,
      default: 300,
    },
    size: {
      type: Number,
      default: 1024,
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

mongoose.model("media", mediaSchema, "media"); //根据骨架创建模版
