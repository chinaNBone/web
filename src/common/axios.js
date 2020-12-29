import axios from "axios";
import { setting } from "@/config/setting";
import store from "@/vuex/store";
import qs from "qs";
import { Message } from "element-ui";
import router from "@/config/router.js";

const Toast = msg => {
  Message({
    message: msg,
    type: "error",
    duration: 2000
  });
};
// console.log(setting.baseURL);
// 创建axios实列
const Axios = axios.create({
  baseURL: setting.baseURL,
  timeout: 10000, //请求超时时间,
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});

// request 拦截器
Axios.interceptors.request.use(
  config => {
    const token = store.getters.getAccessToken;
    if (token) {
      config.headers["Authorization"] = token;
    }
    // 在发送请求之前做某件事
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "delete"
    ) {
      // 序列化
      if (
        config.headers["Content-Type"] ===
        "application/x-www-form-urlencoded;charset=utf-8"
      ) {
        config.data = qs.stringify(config.data);
      }
    }
    return config;
  },
  err => {
    Message.error({
      showClose: false,
      message: err || "发起请求出错"
    });
    Promise.reject(err);
  }
);

// response 拦截器
Axios.interceptors.response.use(
  response => {
    let { code = 0, message, data, reqeustId } = response.data;

    // const res = response.data
    let pathName = router.history.current.path;
    if (code !== 0) {
      if (pathName === "/login" || pathName === "/")
        return Promise.reject(message);
      switch (code) {
        // 未授权
        case 50001:
          Toast(message);
          store.dispatchstore.dispatch("logout").then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
            router.push({
              path: "/login"
            });
          });
          break;
        // 未认证
        case 51001:
          Toast("未认证或没有权限");
          router.push({
            path: "/login"
          });
          break;
        // token过期
        case 52000:
          Toast(message);
          router.push({
            path: "/login"
          });
          break;
        default:
          Toast(message);
          break;
      }
      return Promise.reject(message);
    } else {
      return response.data;
    }
  },
  error => {
    Message({
      message: "网络异常！请重试",
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default Axios;
