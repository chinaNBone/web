import store from "../vuex/store";
export const role = {
  superAdmin: { code: "1", name: "超级管理员", home: "/" },
  manager: { code: "2", name: "项目管理员", home: "/project" },
  teacher: { code: "3", name: "专家讲师" },
  student: { code: "4", name: "学生" },
  headTeacher: { code: "9", name: "项目执行人" },
  supervise: { code: "11", name: "督导" },

  /**
   * exp: this.$role.has(...)
   */
  has(code) {
    if (typeof code === "object") {
      code = code.code;
    }
    let r = store.getters.getRole;
    return r && r.indexOf(code) > -1;
  },
  /**
   * exp: this.$role.isSuperAdmin()
   */
  isSuperAdmin() {
    let r = store.getters.getRole;
    return r && r.indexOf(this.superAdmin.code) > -1;
  },
  getHome() {
    return this.isSuperAdmin() ? this.superAdmin.home : this.manager.home;
  },
};
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$role", {
      value: role,
    });
  },
  role,
};
