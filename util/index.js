// 处理查询参数
const filterQuery = function (data) {
  for (var key in data) {
    if (data[key] === "" || !data[key] || data[key].length == 0) {
      delete data[key];
    }
  }
  return data;
};

// 处理聚合后的数组ID排序
const setNewListByIds = function (list, ids) {
  let newList = [];
  if (ids) {
    ids.forEach((id) => {
      list.forEach((list) => {
        if (
          JSON.parse(JSON.stringify(id)) == JSON.parse(JSON.stringify(list._id))
        ) {
          newList.push(list);
        }
      });
    });
  }

  return newList;
};

/**
 * 人性化时间处理 传入国际时间格式
 */
function getBeautifyTime(date) {
  var timestamp = new Date(date).getTime();
  var mistiming = Math.round(new Date() / 1000) - timestamp / 1000;
  if (mistiming <= 0) {
    return "刚刚";
  }
  var postfix = mistiming > 0 ? "前" : "后";

  mistiming = Math.abs(mistiming);
  var arrr = ["年", "个月", "星期", "天", "小时", "分钟", "秒"];
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
  for (var i = 0; i < 7; i++) {
    var inm = Math.floor(mistiming / arrn[i]);
    if (inm != 0) {
      return inm + " " + arrr[i] + postfix;
    }
  }
}
//获取当天零点时间
function getFirstDay() {
  return new Date(new Date().setHours(0, 0, 0, 0));
}
//获取本周周一零点时间
function getThisWeekFirstDay() {
  let today = new Date();
  let day = today.getDay() || 7;
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1 - day
  );
}
//获取本月一号零点时间
function getThisMonthFirstDay() {
  let today = new Date();
  today.setDate(1);
  today.setHours(0, 0, 0, 0);
  return today;
}
//获取本年一号零点时间
function getThisYearFirstDay() {
  let today = new Date();
  today.setDate(1);
  today.setMonth(0);
  today.setHours(0, 0, 0, 0);
  return today;
}

// 导出模块
module.exports = {
  filterQuery,
  setNewListByIds,
  getBeautifyTime,
  getThisYearFirstDay,
  getThisMonthFirstDay,
  getThisWeekFirstDay,
  getFirstDay,
};
