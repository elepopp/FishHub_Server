var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    nickname: {
      type: String,
      default: "新用户" + new Date().getTime(),
    },
    wx_openid: {
      type: String,
      default: "",
    },
    github_id: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    blog: {
      type: String,
      default: "",
    },
    gender: {
      type: Number,
      default: 0,
    },
    phone: {
      type: Number,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    school: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "general",
    },
    location: {
      type: String,
      default: "",
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

mongoose.model("user", userSchema, "user"); //根据骨架创建模版
