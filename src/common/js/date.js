export function formatDate(date, fmt) {
  // 格式化时间"rateTime": 1469271264000, yyyy-mm-dd hh:mm
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + ''));
  }
}
// import使用方括号引用
// 如果是export default 不用加方括号
// 8-16/17评价列表里有讲解，比较复杂，未研究
