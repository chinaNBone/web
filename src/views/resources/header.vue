<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">资源管理</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">当前位置：首页</el-breadcrumb-item>
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Top",
  components: {},
  props: {
    type: {
      default() {
        return "home";
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    stopTrain() {}
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
<style scoped>
.g-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 130px;
  z-index: 2;
  background: #404858;
  margin-bottom: 20px;
  /* position: relative;
  -webkit-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08); */
}
</style>