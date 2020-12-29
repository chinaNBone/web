import { role } from "@/config/role";
export default [
  /**
   * 系统管理
   */
  {
    path: "/system",
    component: () => import("@/views/system/system.vue"),
    name: "system",
    meta: {
      menu: "系统管理",
      menuPath: "/system",
    },

    hidden: true,
    children: [
      // {
      //   path: "projectAdd",
      //   component: () => import("@/views/project/projectList/index.vue"),
      //   name: "projectAdd ",
      //   meta: {
      //     menu: "培训项目",
      //     menuPath: "/project",
      //   },
      //   hidden: true
      // }
    ],
  },
];
