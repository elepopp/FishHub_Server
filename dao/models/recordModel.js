var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var recordSchema = new Schema(
  {
    goods_id: mongoose.Schema.ObjectId,
    article_id: mongoose.Schema.ObjectId,
    user_id: mongoose.Schema.ObjectId,
    type: {
      // 类型
      type: String,
      default: "favor",
    },
    remarks: {
      // 类型
      type: String,
      default: "暂无",
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

mongoose.model("record", recordSchema, "record"); //根据骨架创建模版
