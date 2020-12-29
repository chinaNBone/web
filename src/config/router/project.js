import { role } from "@/config/role";
export default [
  {
    path: "/project",
    component: () => import("@/views/project/project.vue"),
    name: "project",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },

    hidden: true,
  },
  {
    path: "projectAdd",
    component: () => import("@/views/project/projectList/index.vue"),
    name: "project ",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },
    hidden: true,
  },
  {
    path: "/demandManage",
    component: () => import("@/views/project/demand/index.vue"),
    name: "project",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },
    hidden: true,
  },
  {
    path: "/demandDetailRule",
    component: () => import("@/views/project/demand/detailRule.vue"),
    name: "project",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },
    hidden: true,
  },
  {
    path: "/demandDetailIndex",
    component: () => import("@/views/project/demand/detailIndex.vue"),
    name: "project",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },
    hidden: true,
  },
  {
    path: "/details",
    component: () => import("@/views/project/demand/index.vue"),
    name: "project",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },
    hidden: true,
  },
  {
    path: "/studentManage",
    component: () => import("@/views/project/studentManage/index.vue"),
    name: "project",
    meta: {
      menu: "培训项目",
      menuPath: "/project",
    },
    children: [
      {
        path: "/",
        component: () => import("@/views/project/manage/index.vue"),
        name: "project",
        meta: {
          menu: "学员管理",
          menuPath: "/project/studentManage",
        },
        hidden: true,
      },
      {
        path: "/questionnaire",
        component: () => import("@/views/project/questionnaire/index.vue"),
        name: "questionnaire",
        meta: {
          menu: "创建问卷",
          menuPath: "/project/questionnaire",
        },
        hidden: true,
      },
      {
        path: "/studentNews",
        component: () => import("@/views/project/manage/studentNews.vue"),
        name: "studentNews",
        meta: {
          menu: "学员信息",
          menuPath: "/project/studentNews",
        },
        hidden: true,
      },
      {
        path: "/offerCourse",
        component: () => import("@/views/project/offerCourse/index.vue"),
        name: "offerCourse",
        meta: {
          menu: "开班通知",
          menuPath: "/project/offerCourse",
        },
        hidden: true,
      },
      {
        path: "/projectMsg",
        component: () => import("@/views/project/projectList/projectMsg.vue"),
        name: "projectMsg",
        meta: {
          menu: "基本信息",
          menuPath: "/project/projectMsg",
        },
        hidden: true,
      },
      {
        path: "/manual",
        component: () => import("@/views/project/manual/index.vue"),
        name: "manual",
        meta: {
          menu: "学员手册",
          menuPath: "/project/manual",
        },
        hidden: true,
      },

      {
        path: "/studentReport",
        component: () => import("@/views/project/studentReport/index.vue"),
        name: "studentReport",
        meta: {
          menu: "学员报到",
          menuPath: "/project/studentReport",
        },
        hidden: true,
      },
      {
        path: "/reportDetailIndex",
        component: () => import("@/views/project/studentReport/detail/index.vue"),
        name: "studentReport",
        meta: {
          menu: "学员报到",
          menuPath: "/project/studentReport",
        },
        hidden: true,
      },

      {
        path: "/reportCreat",
        component: () => import("@/views/project/studentReport/reportCreat.vue"),
        name: "reportCreat",
        meta: {
          menu: "创建学员报到",
          menuPath: "/project/reportCreat",
        },
        hidden: true,
      },
      {
        path: "/reportQuestion",
        component: () => import("@/views/project/studentReport/reportQuestion.vue"),
        name: "reportCreat",
        meta: {
          menu: "创建学员报到",
          menuPath: "/project/reportCreat",
        },
        hidden: true,
      },
      {
        path: "/reportList",
        component: () => import("@/views/project/reportList/index.vue"),
        name: "reportList",
        meta: {
          menu: "学员报到详情",
          menuPath: "/project/reportList",
        },
        hidden: true,
      },
      {
        path: "/news",
        component: () => import("@/views/project/news/index.vue"),
        name: "news",
        meta: {
          menu: "信息管理",
          menuPath: "/project/news",
        },
        hidden: true,
      },
      {
        path: "/checkWork",
        component: () => import("@/views/project/checkWork/index.vue"),
        name: "checkWork",
        meta: {
          menu: "考勤管理",
          menuPath: "/project/checkWork",
        },
        hidden: true,
      },

      {
        path: "/leave",
        component: () => import("@/views/project/leave/index.vue"),
        name: "leave",
        meta: {
          menu: "请假管理",
          menuPath: "/project/leave",
        },
        hidden: true,
      },

      {
        path: "/evaluate",
        component: () => import("@/views/project/evaluate/index.vue"),
        name: "evaluate",
        meta: {
          menu: "评价管理",
          menuPath: "/project/evaluate",
        },
        hidden: true,
      },
      {
        path: "/createEvalute",
        component: () => import("@/views/project/evaluate/createEvalute.vue"),
        name: "createEvalute",
        meta: {
          menu: "创建评价问卷",
          menuPath: "/project/createEvalute",
        },
        hidden: true,
      },
      {
        path: "/creatFile",
        component: () => import("@/views/project/evaluate/creatFile.vue"),
        name: "creatFile",
        meta: {
          menu: "创建评价问卷",
          menuPath: "/project/creatFile",
        },
        hidden: true,
      },
      {
        path: "/detailTab",
        component: () => import("@/views/project/evaluate/detail.vue"),
        name: "detailTab",
        meta: {
          menu: "评价问卷详情",
          menuPath: "/project/detailTab",
        },
        hidden: true,
      },
      {
        path: "/course",
        component: () => import("@/views/project/course/index.vue"),
        name: "course",
        meta: {
          menu: "学员课表",
          menuPath: "/project/course",
        },
        hidden: true,
      },
      {
        path: "/detailCourse",
        component: () => import("@/views/project/course/detail.vue"),
        name: "course",
        meta: {
          menu: "学员课表",
          menuPath: "/project/course",
        },
        hidden: true,
      },
      {
        path: "/addCourse",
        component: () => import("@/views/project/course/addCourse.vue"),
        name: "addCourse",
        props: route => ({
          id: route.query.id,
        }),
        meta: {
          menu: "添加课程",
          menuPath: "/project/addCourse",
        },
        hidden: true,
      },
      // 请假管理
      {
        path: "/leave",
        component: () => import("@/views/project/leave/index.vue"),
        name: "leave",
        meta: {
          menu: "请假管理",
          menuPath: "/project/leave",
        },
        hidden: true,
      },
      // 住宿管理
      {
        path: "/stay",
        component: () => import("@/views/project/stay/index.vue"),
        name: "stay",
        meta: {
          menu: "住宿管理",
          menuPath: "/project/stay",
        },
        hidden: true,
      },
      // 外出学习管理
      {
        path: "/outStudy",
        component: () => import("@/views/project/outStudy/index.vue"),
        name: "outStudy",
        meta: {
          menu: "外出学习管理",
          menuPath: "/project/outStudy",
        },
        hidden: true,
      },
      // 资源管理
      {
        path: "/resource",
        component: () => import("@/views/project/resource/index.vue"),
        name: "resource",
        meta: {
          menu: "资源管理",
          menuPath: "/project/resource",
        },
        hidden: true,
      }, // 审核管理
      {
        path: "/examine",
        component: () => import("@/views/project/examine/index.vue"),
        name: "examine",
        meta: {
          menu: "审核管理",
          menuPath: "/project/examine",
        },
        hidden: true,
      },
      //
      {
        path: "/examine/reportTest",
        component: () => import("@/views/project/examine/report/reportTest.vue"),
        name: "reportTest",
        meta: {
          menu: "报到问卷",
          menuPath: "/project/reportTest",
        },
        hidden: true,
      },
      /* 绩效评价路由*/
      // 督导意见与建议
      {
        path: "/idear",
        component: () => import("@/views/project/performance/idear/index.vue"),
        name: "idear",
        meta: {
          menu: "督导意见与建议",
          menuPath: "/project/idear",
        },
        hidden: true,
      },
      // 学时管理
      {
        path: "/point",
        component: () => import("@/views/project/performance/point/index.vue"),
        name: "point",
        meta: {
          menu: "学时管理",
          menuPath: "/project/point",
        },
        hidden: true,
      },
      // 项目总结
      {
        path: "/summary",
        component: () => import("@/views/project/performance/summary/index.vue"),
        name: "summary",
        meta: {
          menu: "项目总结",
          menuPath: "/project/summary",
        },
        hidden: true,
      },
      // 经费管理
      {
        path: "/funds",
        component: () => import("@/views/project/performance/funds/index.vue"),
        name: "funds",
        meta: {
          menu: "经费管理",
          menuPath: "/project/funds",
        },
        hidden: true,
      },
      // 结业证书
      {
        path: "/letter",
        component: () => import("@/views/project/performance/letter/index.vue"),
        name: "letter",
        meta: {
          menu: "结业证书",
          menuPath: "/project/letter",
        },
        hidden: true,
      },
      {
        path: "/letter/add",
        component: () => import("@/views/project/performance/letter/add.vue"),
        name: "letter",
        meta: {
          menu: "结业证书",
          menuPath: "/project/letter",
        },
        hidden: true,
      },
      {
        path: "/letter/offerList",
        component: () => import("@/views/project/performance/letter/offerList.vue"),
        name: "offerList",
        meta: {
          menu: "发放管理",
          menuPath: "/project/offerList",
        },
        hidden: true,
      },
    ],
    hidden: true,
  },
];
