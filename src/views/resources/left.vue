<template>
  <el-scrollbar class="m-left-nav project-left-menu">
    <el-menu
      :default-active="menuActive"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      :default-openeds="openeds"
      router
      @close="handleClose"
    >
      <el-submenu :index="item.url" :key="item.url" v-for="item in menuList">
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item-group :key="chirld.url" v-for="chirld in item.son">
          <el-menu-item
            :index="chirld.url"
            v-if="
              chirld.title == '项目统计'
                ? $role.isSuperAdmin()
                : chirld.title == '培训专家管理'
                ? $role.isSuperAdmin() ||
                  $store.state.global.role.indexOf('5') != -1
                : true
            "
            >{{ chirld.title }}</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
    </el-menu>

    <!-- </aside> -->
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "LeftAside",
  components: {},
  data() {
    return {
      openeds: ["/resources"],
      routess: "/manage",
      menuActive: "/resources",
      menuList: [
        {
          title: "资源管理",
          url: "/resources",
          icon: "el-icon-folder-opened",
          son: [
            {
              title: "培训场地管理",
              url: "/fieldList",
              icon: "",
            },
            {
              title: "培训专家管理",
              url: "/resources",
              icon: "",
            },

            {
              title: "培训文件管理",
              url: "/document",
              icon: "",
            },
            {
              title: "培训合同管理",
              url: "/contract",
              icon: "",
            },
            {
              title: "问卷试题库",
              url: "/questionStore",
              icon: "",
            },
            {
              title: "项目统计",
              url: "/projectStatistics",
              icon: "",
            },
            {
              title: "用户帮助",
              url: "/userHelp",
              icon: "",
            },
          ],
        },
      ],
    };
  },
  computed: {
    activeRouter() {
      const curRouter = this.$route.path;
      return this.$route.meta.menuPath;
    },
    ...mapGetters(["getUserInfo"]),
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getMenuList() {
      if (this.getUserInfo.roleId == "") {
        this.currentMenuList = [];
      } else if (
        this.getUserInfo.roleId != "" &&
        this.getUserInfo.roleId.split(",").indexOf("1") == -1
      ) {
        this.$http
          .post("/manager/admin/getRolePermission")
          .then((data) => {
            // console.log(data)
            this.currentMenuList = data.data;
            this.removeChildren(this.currentMenuList);
            this.menuNameArr = JSON.stringify(this.currentMenuList);
            if (this.menuNameArr.indexOf(this.$route.meta.meun) == -1) {
              this.$router.push(this.currentMenuList[0].url);
            }
            // console.log(this.currentMenuList);
          })
          .catch(() => {});
      } else {
        this.currentMenuList = this.menuList;
        this.menuNameArr = JSON.stringify(this.currentMenuList);
        if (this.$route.path === "/") {
          this.$router.push(this.currentMenuList[0].url);
        }
      }
      // http请求
    },
  },
  created() {},
  mounted() {
    // console.log(this.$route.path);
    // console.log(this.$router);
    // todo 获取菜单列表
    // this.getMenuList();
    this.menuActive = this.$utils.getMenu(this.$route, 1);
  },
};
</script>
<style lang="scss">
.el-icon-arrow-down::before {
  content: "" !important;
}

.m-left-nav {
  box-shadow: 0 0 5px #ccc;
}
.m-nav {
  padding: 0;
}
.el-menu {
  .nav-icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 6px;
    // background: url(../../../src/assets/icon/icon.png) no-repeat;
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
