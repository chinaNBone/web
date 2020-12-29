<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">系统管理</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }"
            >当前位置：首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod l-flex">
      <div class="m-nav l-shadow" style="padding: 10px 0 0 20px">
        <h2>
          <i class="el-icon-user"></i>
          组织管理
        </h2>
        <ul class="item">
          <li
            :class="pathFlag == 'faculty' ? 'color-green' : ''"
            @click="pathRoute('faculty')"
            v-if="$role.isSuperAdmin()"
          >
            院系管理
          </li>
          <li
            :class="
              pathFlag == 'admin' || pathFlag == 'adminEdit'
                ? 'color-green'
                : ''
            "
            @click="pathRoute('admin')"
          >
            账号管理
          </li>

          <li
            :class="pathFlag == 'power' ? 'color-green' : ''"
            @click="pathRoute('power')"
            v-if="$role.isSuperAdmin()"
          >
            角色权限管理
          </li>
        </ul>
        <h2 v-if="$role.isSuperAdmin()">
          <i class="el-icon-setting"></i>
          系统设置
        </h2>
        <ul class="item">
          <li
            :class="pathFlag == 'system' ? 'color-green' : ''"
            @click="pathRoute('system')"
            v-if="$role.isSuperAdmin()"
          >
            平台信息设置
          </li>
          <li
            :class="pathFlag == 'sysLog' ? 'color-green' : ''"
            @click="pathRoute('sysLog')"
            v-if="$role.isSuperAdmin()"
          >
            日志管理
          </li>
        </ul>
      </div>
      <div class="m-nav-con l-shadow">
        <faculty v-if="pathFlag == 'faculty'"></faculty>
        <admin v-if="pathFlag == 'admin'"></admin>
        <power v-if="pathFlag == 'power'"></power>
        <protal v-if="pathFlag == 'system'"></protal>
        <syslog v-if="pathFlag == 'sysLog'"></syslog>
        <edit v-if="pathFlag == 'adminEdit'"></edit>
      </div>
    </div>
  </div>
</template>
<script>
import admin from "./administrator";
import power from "./power";
import protal from "./protal";
import syslog from "./sysLog";
import edit from "./editAdmin";
import faculty from "./faculty";
export default {
  components: {
    admin,
    power,
    protal,
    syslog,
    edit,
    faculty,
  },
  data() {
    return {
      pathFlag: "admin",
    };
  },
  mounted() {
    var goFlag =
      this.$store.state.global.role.indexOf("5") != -1 &&
      $role.isSuperAdmin() != true
        ? "admin"
        : "faculty";
    this.pathFlag = this.$route.query.t || goFlag;
  },
  methods: {
    pathRoute(flag) {
      this.pathFlag = flag;
      this.$router.push({
        query: {
          t: this.pathFlag,
        },
      });
    },
    pathChild(flag, val) {
      this.pathFlag = flag;
      this.$router.push({
        query: {
          t: this.pathFlag,
          id: val.id,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.m-nav {
  .item {
    padding-left: 20px;
  }
}
</style>
