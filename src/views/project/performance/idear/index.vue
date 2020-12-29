<!-- 督导意见与建议 -->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>督导意见与建议</h2>
    </div>
    <div class="m-search"></div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="title" label="意见标题"></el-table-column>
      <el-table-column prop="realName" label="反馈人姓名"></el-table-column>
      <el-table-column prop="createdDt" label="反馈时间"></el-table-column>
      <el-table-column prop="option" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="details(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="delAdmin(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
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
    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="closePassword"
      :close-on-click-modal="false"
    >
      <el-form label-position="right">
        <el-form-item label style="text-align: center;">{{ detailspage.title }}</el-form-item>
        <el-form-item label>{{ detailspage.content }}</el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closePassword">关闭</el-button>
          <!-- <el-button type="primary" @click="setPassword">保存</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible2: false,
      detailspage: {},
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
    details(row) {
      this.dialogVisible2 = true;
      this.detailspage = Object.assign({}, row);
    },
    delAdmin(id) {
      this.$confirm("请确认是否执行删除操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            id: id
          };
          this.$http
            .delete(`/api/web/comment/logic/${id}`, { params: par })
            .then(() => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getList();
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          throw err;
        });
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    closePassword() {
      this.dialogVisible2 = false;
    },
    // 获取list
    getList() {
      this.loading = true;
      let par = {
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .get("/api/web/comment/list/page", { params: par })
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          for (let i = 0; i < this.listTable.length; i++) {
            for (let j in this.listTable[i]) {
              if (j === "createdDt") {
                this.listTable[i][j] = this.getTime(this.listTable[i][j]);
              }
            }
          }
          this.loading = false;
        })
        .catch(() => {});
    },
    getTime(data) {
      var d = new Date(data);
      var time = `${d.getFullYear()}-${
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      return time;
    }
  }
};
</script>
