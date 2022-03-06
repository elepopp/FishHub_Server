var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var dicSchema = new Schema(
  {
    key: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    opt: {
      type: Object,
      default: {},
    },
    orderNum: {
      type: Number,
      default: 1,
    },
    type: {
      type: Number,
      default: 101,
    },
    status: {
      type: Number,
      default: 101,
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

mongoose.model("dic", dicSchema, "dic"); //根据骨架创建模版
