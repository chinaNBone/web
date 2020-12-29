<!-- 学时管理 -->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>学时管理</h2>
    </div>

    <div class="m-search">
      <div>
        <!-- <el-button type="primary">导入学时学分</el-button> -->
        <!-- <el-button type="warning" @click="exportPonit()">导出学时</el-button> -->
      </div>
      <div>
        <el-input v-model="list.search" placeholder="输入学员姓名/手机号" class="s-el-input" clearable></el-input>
        <el-button type="warning" class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="realName" label="学员姓名"></el-table-column>
      <el-table-column prop="gender" label="性别" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.gender == 1 ? "男" : "女" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="focusCredit" label="集中培训学时"></el-table-column>
      <el-table-column prop="followCredit" label="跟岗培训学时"></el-table-column>
      <el-table-column prop="otherCredit" label="其他学习学时"></el-table-column>
      <el-table-column prop="allCredit" label="总学时"></el-table-column>
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
      list: {
        search: "",
        status: ""
      },
      loading: false,
      listTable: [],
      listPage: {
        pageSize: 10,
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
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        keyword: this.list.search,
        projectId: localStorage.getItem("projectId"),
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .post("/api/edu/project/credit/creditPageList", par)
        .then(res => {
          this.listTable = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          // this.listPage.pageSize = res.data.pageSize;
          this.loading = false;
        })
        .catch();
    }
  }
};
</script>
<style lang="scss">
.m-search .s-el-input {
  width: 200px;
}
</style>
