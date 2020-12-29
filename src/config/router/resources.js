import {
  role
} from "@/config/role";
export default [{
  path: "/resources",
  component: () => import("@/views/resources/index.vue"),
  name: "resources",
  meta: {
    menu: "资源管理",
    menuPath: "/resources",
  },
  children: [{
    path: "/",
    component: () => import("@/views/resources/resources/resourceIndex.vue"),
    name: "resources",
    meta: {
      menu: "培训专家管理",
      menuPath: "/resources/resources",
    },
    hidden: true,
  },
  {
    path: "/resourcesDetail",
    component: () => import("@/views/resources/resources/index.vue"),
    name: "resourcesDetail",
    meta: {
      menu: "培训专家管理",
      menuPath: "/resources/resourcesDetail",
    },
    hidden: true,
  },
  {
    path: "/fieldList",
    component: () => import("@/views/resources/field/fieldList.vue"),
    name: "fieldList",
    meta: {
      menu: "培训场地管理",
      menuPath: "/resources/fieldList",
    },
    hidden: true,
  },
  {
    path: "/fieldDetail",
    component: () => import("@/views/resources/field/index.vue"),
    name: "fieldDetail",
    meta: {
      menu: "培训场地详情",
      menuPath: "/resources/fieldDetail",
    },
    hidden: true,
  },
  {
    path: "/document",
    component: () => import("@/views/resources/document/index.vue"),
    name: "document",
    meta: {
      menu: "培训文件管理",
      menuPath: "/resources/document",
    },
    hidden: true,
  },
  {
    path: "/contract",
    component: () => import("@/views/resources/contract/index.vue"),
    name: "contract",
    meta: {
      menu: "培训合同",
      menuPath: "/resources/contract",
    },
    hidden: true,
  },
  {
    path: "/questionStore",
    component: () => import("@/views/resources/questionStore/index.vue"),
    name: "questionStore",
    meta: {
      menu: "问题试卷库",
      menuPath: "/resources/questionStore",
      visit: true
    },
    hidden: true
  },
  {
    path: "/projectStatistics",
    component: () => import("@/views/resources/projectStatistics/index.vue"),
    name: "projectStatistics",
    meta: {
      menu: "项目统计",
      menuPath: "/resources/projectStatistics",
    },
    hidden: true,
  },
  {
    path: "/userHelp",
    component: () => import("@/views/resources/help/index.vue"),
    name: "userHelp",
    meta: {
      menu: "用户帮助",
      menuPath: "/resources/userHelp",
    },
    hidden: true,
  },
  {
    path: "/helpDetail",
    component: () => import("@/views/resources/help/detail.vue"),
    name: "helpDetail",
    meta: {
      menu: "用户帮助",
      menuPath: "/resources/helpDetail",
    },
    hidden: true,
  },
  ],
  hidden: true,
},];