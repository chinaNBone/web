<!-- 管理员管理 -->
<template>
  <div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading" border>
      <el-table-column prop="stage" label="阶段" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="module" label="模块" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="title" label="专题名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="period" label="学时" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="内容要点" show-overflow-tooltip></el-table-column>
      <el-table-column prop="realName" label="授课专家" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unit" label="工作单位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="position" label="职称" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adminTitle: "",
      list: [],
      loading: false,
      listTable: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      let par = {
        // TODO
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .post("/api/edu/project/getCourseList", par)
        .then(res => {
          this.listTable = res.data;
          this.loading = false;
          this.$emit('course', this.listTable);
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table .el-button {
  margin-right: 0;
}
</style>
