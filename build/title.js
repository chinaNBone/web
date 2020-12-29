// 配置title
const baseTitle = "OSS"
const spector = "-"
const title = {
  index: "首页"
}

module.exports = {
  get: function (str, force = false) {
    let def = force ? baseTitle : null;
    if (this.haveTitle(str)) {
      let t = title[str];
      return `${t}${spector}${baseTitle}`;
    }
    return def;
  },
  haveTitle: function (str) {
    return title[str] != null;
  }
}