/**
 * meta字段含义：
 * meta: {
 *    menu: '课程分类管理'            // 路由所属菜单
 *    menuPath: '/coursecate'        // 路由所属菜单路径
 *    visit: true                    // 无需登陆即可访问的页面
 *    requireRole: role.superAdmin   // 访问需要的角色权限
 * }
 */
const index = {
  path: "/",
  component: () => import("@/views/Home.vue"),
  name: "index",
  hidden: true,
};
const base = [
  index,
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
    name: "login",
    meta: {
      visit: true,
    },
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/404.vue"),
    meta: {
      visit: true,
    },
    name: "error",
    hidden: true,
  },
  // {
  //   path: "/index",
  //   component: () => import("@/views/homeIndex/index.vue"),
  //   meta: {
  //     visit: true
  //   },
  //   name: "首页",
  //   hidden: true
  // },
  {
    path: "*",
    name: "other",
    hidden: true,
    meta: {
      visit: true,
    },
    component: () => import("@/views/404.vue"),
  },
];

function use(router, parentIndex) {
  let parent;
  // 寻找父级路由，默认index，不建议使用其他路由
  if (!parentIndex) {
    parent = index;
  } else {
    parent = base.find(el => el.name == parentIndex);
  }
  if (!parent.children) {
    parent.children = [];
  }
  parent.children = parent.children.concat(router);
}

function useAll(routers) {
  routers.forEach(router => {
    use(router.router || router, router.parent);
  });
}

export default { use, useAll, router: base };
