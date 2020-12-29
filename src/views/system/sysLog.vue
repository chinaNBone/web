<!-- 管理员管理 -->
<template>
  <div>
    <div class="l-mod-tool">
      <h2>日志管理</h2>
    </div>

    <div class="m-search">
      <div>
        <el-date-picker
          v-model="list.logTime"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        >></el-date-picker>
        <el-input v-model="list.user" placeholder="输入操作人姓名" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="title" label="动作"></el-table-column>
      <el-table-column prop="model" label="模块"></el-table-column>
      <el-table-column prop="realName" label="操作人"></el-table-column>
      <el-table-column prop="createdDt" label="操作时间"></el-table-column>
    </el-table>
    <div class="m-pages">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total"
        :current-page.sync="listPage.pageNo"
        :page-size="listPage.pageSize"
        :total="listPage.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adminTitle: "",
      list: {
        logTime: [],
        user: ""
      },
      loading: false,
      roleList: [],
      listTable: [],
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    // 获取list
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let startTime = "";
      let endTime = "";
      if (this.list.logTime) {
        startTime = this.list.logTime[0];
        endTime = this.list.logTime[1];
      }
      let par = {
        startTime: startTime,
        endTime: endTime,
        user: this.list.user,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .post("/api/sys/logs/getList", par)
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss"></style>
