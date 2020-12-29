import Vue from "vue";
import Router from "vue-router";

let time = new Date().getTime();

import base from "./router/base";

Vue.use(Router);

// 添加子路由
import project from "./router/project";
import resources from "./router/resources";
import question from "./router/question";
import system from "./router/system";
import homeIndex from "./router/homeIndex";

base.useAll([
  // () => import("./router/test"),
  // () => import("./router/teacher"),
  project,
  resources,
  question,
  system,
  homeIndex

]);

console.debug(`路由加载完成，用时：${new Date().getTime() - time} ms`);
console.debug(JSON.stringify(base));
console.debug(base);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: base.router
});
