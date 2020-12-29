<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">培训项目</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }"
            >当前位置：首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>培训项目</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod">
      <el-tabs v-model="pathFlag" @tab-click="pathRoute">
        <el-tab-pane label="项目列表" name="first"></el-tab-pane>
        <el-tab-pane
          label="需求调研"
          name="second"
          v-if="
            $role.isSuperAdmin() || $store.state.global.role.indexOf('2') != -1
          "
        ></el-tab-pane>
        <el-tab-pane
          label="项目审核"
          name="third"
          v-if="$role.isSuperAdmin()"
        ></el-tab-pane>
      </el-tabs>
      <div class="l-con">
        <list v-if="pathFlag == 'first'" ref="child"></list>
        <demand v-if="pathFlag == 'second'" ref="child"></demand>
        <audit v-if="pathFlag == 'third'" ref="child"></audit>
      </div>
    </div>
  </div>
</template>
<script>
import list from "./projectList";
import demand from "./demand";
import audit from "./audit";
export default {
  components: {
    list,
    demand,
    audit,
  },
  data() {
    return {
      pathFlag: "first",
    };
  },
  mounted() {
    this.pathFlag = this.$route.query.t || "first";
    if (!this.$role.isSuperAdmin() && this.pathFlag == "third") {
      this.pathFlag = "first";
    }
  },
  methods: {
    pathRoute(tab, event) {
      this.pathFlag = tab.name;
      this.$router.push({
        query: {
          t: this.pathFlag,
        },
      });
    },
  },
};
</script>
