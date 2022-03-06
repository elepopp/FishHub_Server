const orderDao = require("../dao/orderDao"); //引入
const goodsService = require("./goodsService"); //引入

let moment = require("moment"); // 格式化时间插件
let util = require("util"); // 格式化时间插件
const tenpay = require("tenpay");
const {
  appid: appid,
  mchid,
  partnerKey,
  pfx,
  notify_url,
  spbill_create_ip,
} = require("../config/index");

// 方式一
const api = new tenpay({
  appid: appid,
  mchid,
  partnerKey,
  pfx,
  notify_url,
  spbill_create_ip,
});
const getQrCode = async (user_id, query) => {
  if (query.body && query.total_fee && query.goods_id) {
    var out_trade_no =
      "tngeek" + new Date().getTime() + Date.now().toString(36);

    let result = await api.unifiedOrder({
      out_trade_no: out_trade_no, // 订单号
      body: query.body, // 描述
      total_fee: query.total_fee * 100, // 金额
      trade_type: "NATIVE",
      product_id: query.goods_id,
    });

    // 生成订单
    let order = await api.orderQuery({
      out_trade_no: out_trade_no,
    });

    var order_data = {
      user_id: user_id,
      goods_id: require("mongodb").ObjectID(query.goods_id),
      prepay_id: order.prepay_id, //预支付交易会话标识
      out_trade_no: out_trade_no, // 内部订单号
      transaction_id: "", // 交易订单
      trade_type: "NATIVE", // 支付类型
      trade_state_desc: order.trade_state_desc, // 支付状态描述
      trade_state: order.trade_state, // 支付状态
      goods_name: query.body, // 商品描述
      total_fee: order.total_fee / 100, // 商品金额
      createTime: new Date(), // 创建时间
      updateTime: new Date(), // 更新时间
    };
    const createOrderRes = await orderDao.postOrder(order_data);

    if (createOrderRes.code == 200) {
      order_data._id = createOrderRes.data[0]._id;
      res = {
        code: 200,
        tips: "获取支付信息成功",
        message: "获取支付信息成功",
        data: {
          code_url: result.code_url,
          out_trade_no: out_trade_no,
          order_info: order_data,
        },
      };
    } else {
      res = {
        code: 400,
        tips: "生成订单失败！",
        message: "生成订单失败！",
        data: "",
      };
    }
  } else {
    res = {
      code: 400,
      tips: "参数错误，请检查参数！",
      message: "参数错误，请检查参数！",
      data: "",
    };
  }
  return res;
};

const isPaySuccess = async (out_trade_no) => {
  const order = await orderDao.getOrderByOutTradeNo(out_trade_no);
  if (order.length > 0) {
    await orderDao.putOrder(order[0]._id, {
      trade_state: "SUCCESS",
      trade_state_desc: "支付成功",
    });
    await goodsService.putGoods(order[0].goods_id, {
      $inc: { buyed: 1 },
    });
  }
};

module.exports = { getQrCode, isPaySuccess }; //暴露
