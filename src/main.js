import Vue from "vue";
import App from "./App.vue";
import router from "./config/router";
import setting from "@/config/setting";
import role from "@/config/role";
import store from "./vuex/store";
import axios from "@/common/axios.js";
import utils from "@/utils/utils";
import VueClipboard2 from "vue-clipboard2";
import VueGlobalConfig from "@/common/vueGlobalConfig";
import "font-awesome/css/font-awesome.min.css";
import "@/assets/css/common.scss";
import "@/assets/css/views.scss";
import "@/assets/css/common_style.scss";
import echarts from "echarts";
import VueQuillEditor from 'vue-quill-editor'
import downPdf from '@/utils/downPdf'
Vue.use(downPdf)
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.prototype.$echarts = echarts;
// elementUI 引入
import ElementUI from "element-ui";

Vue.use(ElementUI);
Vue.use(setting);
Vue.use(role);
Vue.use(VueGlobalConfig, {
  mixin: {
    getter: true,
    mutations: true,
    actions: true,
  },
});
Vue.use(utils);
Vue.use(VueClipboard2);

// Vue.use(quillEditor);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

// 页面权限控制
router.beforeEach((to, from, next) => {
  let token = store.getters.getAccessToken;
  // console.log(from, to);

  if (!token && to.path != "/login" && !to.meta.visit) {
    next({
      path: "/login",
    });
  } else {
    // 已登录，判断是否超级管理员
    store.dispatch("getUserRoles").then(data => {
      if (!to.meta.requireRole) {
        next();
      } else if (role.role.has(to.meta.requireRole)) {
        next();
      } else {
        next({ path: role.role.getHome() });
      }
    });
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
