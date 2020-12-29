import { role } from "@/config/role";
export default [
  /**
   * 培训项目
   */
  {
    path: "/question",
    component: () => import("@/views/question/question.vue"),
    name: "question",
    meta: {
      menu: "问卷管理",
      menuPath: "/question",
      requireRole: role.superAdmin,
    },

    hidden: true,
    children: [
      // {
      //   path: "/question",
      //   component: () => import("@/views/question/index.vue"),
      //   name: "question",
      //   meta: {
      //     menu: "问卷管理",
      //     menuPath: "/question",
      //
      //   },
      //   hidden: true
      // },
    ],
  },
  {
    path: "/questionDetail",
    component: () => import("@/views/question/details/index.vue"),
    name: "question",
    meta: {
      menu: "问卷管理",
      menuPath: "/question",
      requireRole: role.superAdmin,
    },
    hidden: true,
  },
  {
    path: "/detailRule",
    component: () => import("@/views/question/details/detailRule.vue"),
    name: "question",
    meta: {
      menu: "问卷管理",
      menuPath: "/question",
      requireRole: role.superAdmin,
    },
    hidden: true,
  },
  {
    path: "/detailIndex",
    component: () => import("@/views/question/details/detailIndex.vue"),
    name: "question",
    meta: {
      menu: "问卷管理",
      menuPath: "/question",
      requireRole: role.superAdmin,
    },
    hidden: true,
  },
];
