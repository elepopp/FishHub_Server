var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    user_id: mongoose.Schema.ObjectId,
    pid: mongoose.Schema.ObjectId,
    article_id: mongoose.Schema.ObjectId,
    level: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "article",
    },
    like: {
      // 类型
      type: Number,
      default: 0,
    },
    is_del: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: "",
    },
    status: {
      type: Number,
      default: 101,
    },
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

mongoose.model("comment", commentSchema, "comment"); //根据骨架创建模版
