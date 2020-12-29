<template>
  <div>
    <div class="d-btn-examine m-flex">
      <!-- <div class="d-check">
        <el-checkbox v-model="checked">全选</el-checkbox>
      </div>-->
      <div class="d-btn">
        <el-button class="el-button--warning" @click="noPassAll">审核驳回</el-button>
        <el-button class="el-button--primary" @click="passAll">审核通过</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fileName" label="资源名称" width="300px"></el-table-column>
      <el-table-column prop="creator" label="上传人"></el-table-column>
      <el-table-column prop="createdDt" label="上传时间"></el-table-column>
      <el-table-column prop="option" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="rowDown(scope.row)"
            v-if="scope.row.status!=2"
          >下载</el-button>
          <el-button
            type="text"
            size="small"
            @click="pass(scope.row)"
            v-if="scope.row.status!=2"
          >审核通过</el-button>
          <el-button type="text" size="small" style="color:red" @click="noPass(scope.row)">审核驳回</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: this.$setting.imageUrl + "/",
      checked: "111",
      loading: false,
      listTable: [],
      selectList: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      }
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.selectList = [];
      for (var i of val) {
        this.selectList.push({ logId: i.logId, id: i.id });
      }
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    passAll() {
      this.$confirm("是否批量通过审核文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var checkJson = JSON.stringify(this.selectList);
          let par = {
            checkJson: checkJson,
            status: 1
          };
          this.$http
            .post("/api/resource/check/checkForFile", par)
            .then(res => {
              this.$message.success("审核成功");
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    noPassAll() {
      this.$confirm("是否批量驳回审核文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var checkJson = JSON.stringify(this.selectList);
          let par = {
            checkJson: checkJson,
            status: 2
          };
          this.$http
            .post("/api/resource/check/checkForFile", par)
            .then(res => {
              this.$message.success("审核成功");
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    rowDown(val) {
      window.location.href =
        this.$setting.baseURL +
        `/oss/download/downloadById?fileId=${val.fileId}`;
    },
    pass(val) {
      this.$confirm("是否通过审核文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var checkJson = JSON.stringify([{ logId: val.logId, id: val.id }]);
          let par = {
            checkJson: checkJson,
            status: 1
          };
          this.$http
            .post("/api/resource/check/checkForFile", par)
            .then(res => {
              this.$message.success("审核成功");
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    noPass() {
      this.$confirm("是否驳回审核文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var checkJson = JSON.stringify([{ logId: val.logId, id: val.id }]);
          let par = {
            checkJson: checkJson,
            status: 2
          };
          this.$http
            .post("/api/resource/check/checkForFile", par)
            .then(res => {
              this.$message.success("审核成功");
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    getList() {
      this.loading = true;
      let par = {
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
        projectId: localStorage.getItem("projectId"),
        status: 0
      };
      this.$http
        .post("/api/resource/check/resourceList", par)
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(msg => {});
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.d-btn-examine {
  margin-bottom: 20px;

  .d-check {
    line-height: 40px;
  }
}

.d-options {
  span {
    margin-right: 10px;
  }
}
</style>