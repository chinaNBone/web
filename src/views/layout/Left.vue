<template>
  <aside class="g-sdc" style="overflow-x:auto;">
    <el-menu
      :default-active="activeRouter"
      class="el-menu-vertical-demo"
      @select="handleSelect"
      router
    >
      <template v-for="item in menuList">
        <el-submenu v-if="item.children.length > 0" :key="item.path" :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            {{ item.name }}
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
            style="padding-left: 55px;"
          >{{ child.name }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="item.path" :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </aside>
</template>

<script>
export default {
  name: "LeftAside",
  components: {},
  data() {
    return {
      menuList: [
        {
          name: "学员管理",
          path: "/studentManage",
          icon: "nav-icon nav-icon-sort",
          children: []
        },
        {
          name: "分类管理",
          path: "/classify",
          icon: "nav-icon nav-icon-classify",
          children: []
        },
        {
          name: "课程标签管理",
          path: "/courseTag",
          icon: "nav-icon nav-icon-course-tag",
          children: []
        },
        {
          name: "课程管理",
          path: "/course",
          icon: "nav-icon nav-icon-course",
          children: []
        },
        {
          name: "学校管理",
          path: "/school",
          icon: "nav-icon nav-icon-school",
          children: []
        },
        {
          name: "教师管理",
          path: "/teacher",
          icon: "nav-icon nav-icon-teacher",
          children: []
        },
        {
          name: "学生管理",
          path: "/student",
          icon: "nav-icon nav-icon-student",
          children: []
        },
        {
          name: "新闻管理",
          path: "/news",
          icon: "nav-icon nav-icon-news",
          children: []
        },
        {
          name: "活动管理",
          path: "/activities",
          icon: "nav-icon nav-icon-activities",
          children: []
        },
        {
          name: "banner管理",
          path: "/banner",
          icon: "nav-icon nav-icon-banner",
          children: []
        },
        {
          name: "数据统计",
          path: "/dataStats",
          icon: "nav-icon nav-icon-dataStats",
          children: []
        },
        {
          name: "系统管理",
          path: "/system",
          icon: "nav-icon nav-icon-system",
          children: []
        }
      ]
    };
  },
  computed: {
    activeRouter() {
      //   const curRouter = this.$route.path;
      //   return "/" + curRouter.split("/")[1];
      return "/" + this.$route.meta.name;
    }
  },
  methods: {
    handleSelect() {},
    getMenuList() {
      // http请求
      if (this.$route.path === "/") {
        this.$router.push(this.menuList[0].path);
      }
    }
  },
  created() {},
  mounted() {
    // console.log(this.$route.path);
    // console.log(this.$router);
    // todo 获取菜单列表
    // this.getMenuList();
  }
};
</script>
<style lang="scss">
.el-menu {
  .nav-icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 6px;
    background: url(../../../src/assets/icon/icon.png) no-repeat;
    vertical-align: middle;
    &.nav-icon-sort {
      background-position: -3px -7px;
    }

    &.nav-icon-classify {
      background-position: -48px -7px;
    }
    &.nav-icon-course {
      background-position: -90px -7px;
    }
    &.nav-icon-school {
      background-position: -135px -7px;
    }
    &.nav-icon-teacher {
      background-position: -177px -3px;
    }
    &.nav-icon-student {
      background-position: -223px -8px;
    }
    &.nav-icon-news {
      background-position: -267px -6px;
    }
    &.nav-icon-activities {
      background-position: -308px -6px;
    }
    &.nav-icon-banner {
      background-position: -353px -7px;
    }
    &.nav-icon-dataStats {
      background-position: -398px -7px;
    }
    &.nav-icon-system {
      background-position: -441px -7px;
    }
    &.nav-icon-course-tag {
      background-position: -484px -7px;
    }
  }
  .el-menu-item.is-active {
    .nav-icon {
      &.nav-icon-sort {
        background-position: -3px -41px;
      }
      &.nav-icon-classify {
        background-position: -48px -41px;
      }
      &.nav-icon-course {
        background-position: -90px -41px;
      }
      &.nav-icon-school {
        background-position: -135px -41px;
      }
      &.nav-icon-teacher {
        background-position: -177px -37px;
      }
      &.nav-icon-student {
        background-position: -223px -40px;
      }
      &.nav-icon-news {
        background-position: -267px -39px;
      }
      &.nav-icon-activities {
        background-position: -308px -40px;
      }
      &.nav-icon-banner {
        background-position: -353px -40px;
      }
      &.nav-icon-dataStats {
        background-position: -398px -38px;
      }
      &.nav-icon-system {
        background-position: -441px -39px;
      }
      &.nav-icon-course-tag {
        background-position: -484px -39px;
      }
    }
  }
}
</style>

