var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    user_id: mongoose.Schema.ObjectId,
    status: {
      // 状态
      type: Number,
      default: 101,
    },
    title: {
      // 标题
      type: String,
      default: "",
    },
    orderNum: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "JavaScript",
    },
    cover: {
      type: String,
      default: "",
    },
    layout: {
      type: String,
      default: "markdown",
    },
    like: {
      type: Number,
      default: 0,
    },
    content: {
      // 内容
      type: String,
      default: "",
    },
    description: {
      // 文章描述
      type: String,
      default: "",
    },
    picList: {
      // 文章描述
      type: Array,
      default: [],
    },
    mainPicId: mongoose.Schema.ObjectId,
    tagsIds: {
      // 标签
      type: Array,
      default: [],
    },
    isTop: {
      // 是否置顶
      type: Boolean,
      default: false,
    },
    remarks: {
      // 类型
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

mongoose.model("article", articleSchema, "article"); //根据骨架创建模版
