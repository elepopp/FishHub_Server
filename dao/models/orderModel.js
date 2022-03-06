var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = new Schema(
  {
    goods_id: mongoose.Schema.ObjectId,
    user_id: mongoose.Schema.ObjectId,
    transaction_id: String,
    prepay_id: String, //预支付交易会话标识
    trade_type: String,
    trade_state_desc: String,
    trade_state: String,
    total_fee: Number,
    remarks: String,
    out_trade_no: String,
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

mongoose.model("order", orderSchema, "order"); //根据骨架创建模版
