/*
* 数据存储
* */
export function saveToLocal(id, key, value) { // 储存uel的id
  let seller = window.localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage._seller_ = JSON.stringify(seller);
}

export function loadFromLocal(id, key, def) { // 读取储存过的id
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id]; // 转化为对象
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}
