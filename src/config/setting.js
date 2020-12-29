import Utils from "@/utils/utils";

// 公共配置
const common = {
  MAX_REFRESH_TIMES: 2,
  title_suffix: "省级中小学教师发展中心培训平台",
};

// production
const production = {
  baseURL: "https://jspxapi.gdei.edu.cn",
  imageUrl: "https://jspxfile.gdei.edu.cn",
  h5URL: "https://jspx.gdei.edu.cn",
};
// test
const test = {
  baseURL: "http://api.gers.dev.net1637.com:8521",
  imageUrl: "http://api.gers.dev.net1637.com:8521/proxy",
  h5URL: "http://wap.gers.dev.net1637.com:8521",
};
// test
const testd = {
  baseURL: "http://api.max.ges.dev.net1637.com:8521",
  imageUrl: "http://api.max.ges.dev.net1637.com:8521/proxy",
  h5URL: "http://wapdev.gers.dev.net1637.com:8521",
};
// dev
const dev = {
  // baseURL: "http://localhost:8080",
  // baseURL: "http://api.ges.dev.net1637.com",
  // imageUrl: "http://localhost:8080/proxy",
  // baseURL: "http://api.gers.dev.net1637.com:8521",
  // imageUrl: "http://api.gers.dev.net1637.com:8521/proxy",
  baseURL: "http://192.168.1.159:8080",
  imageUrl: "http://192.168.1.161:8080/proxy",
  // h5URL: "http://192.168.1.110:5405",
  h5URL: "http://wapdev.gers.dev.net1637.com:8521",
};

let mode;
switch (process.env.VUE_APP_MODE) {
  case "production":
    mode = production;
    break;
  case "test":
    mode = test;
    break;
  case "testd":
    mode = testd;
    break;
  default:
    mode = dev;
    break;
}
export const setting = Utils.Utils.extend(true, {}, common, mode);

//对实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, "$setting", {
      value: setting,
    });
  },
  setting,
};