import { role } from "@/config/role";
export default [
  /**
   * 培训项目
   */
  {
    path: "/",
    component: () => import("@/views/homeIndex/index.vue"),
    name: "index",
    meta: {
      menu: "首页",
      menuPath: "/",
      requireRole: role.superAdmin,
    },

    hidden: true,
    children: [],
  },
];
