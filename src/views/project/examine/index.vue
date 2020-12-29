<template>
  <div class="g-nav">
    <div class="l-mod">
      <el-tabs v-model="pathFlag" @tab-click="pathRoute">
        <!-- <el-tab-pane label="开班通知" name="open"></el-tab-pane>
        <el-tab-pane label="学员管理" name="manage"></el-tab-pane>
        <el-tab-pane label="学员报到" name="report"></el-tab-pane>
        <el-tab-pane label="学习课表" name="learn"></el-tab-pane>-->
        <el-tab-pane label="资源审核" name="resource"></el-tab-pane>
      </el-tabs>
      <div class="l-con">
        <open v-if="pathFlag == 'open'" ref="child"></open>
        <manage v-if="pathFlag == 'manage'" ref="child"></manage>
        <report v-if="pathFlag == 'report'" ref="child"></report>
        <learn v-if="pathFlag == 'learn'" ref="child"></learn>
        <resource v-if="pathFlag == 'resource'" ref="child"></resource>
      </div>
    </div>
  </div>
</template>
<script>
import open from "./open/index";
import manage from "./manage/index";
import report from "./report/index";
import learn from "./learn/index";
import resource from "./resource/index";
export default {
  components: {
    open,
    manage,
    report,
    learn,
    resource
  },
  data() {
    return {
      pathFlag: "resource"
    };
  },
  mounted() {
    this.pathFlag = this.$route.query.t || "resource";
  },
  methods: {
    pathRoute(tab, event) {
      this.pathFlag = tab.name;
      this.$router.push({
        query: {
          t: this.pathFlag
        }
      });
    }
  }
};
</script>
