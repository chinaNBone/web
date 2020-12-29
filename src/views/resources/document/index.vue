<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">文件列表</h2>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding: 20px 0">
          <!-- 检索行 -->
          <el-row class="search-row">
            <div class="f-fl">
              <el-button type="primary" size="medium" @click="uploader"
                >上传文件</el-button
              >
            </div>
            <div class="f-fr">
              <el-input
                v-model="filters.search"
                size="medium"
                placeholder="输入关键字号搜索"
              ></el-input>
              <el-button
                type="primary"
                style="background: rgba(255, 153, 0, 1); border: none"
                size="medium"
                @click="getTrainingList('search')"
                >搜索</el-button
              >
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column
              label="文件名称"
              prop="fileName"
              width="400"
            ></el-table-column>
            <el-table-column prop="fileSize" label="文件大小" width="100">
              <template slot-scope="scope">{{
                scope.row.fileSize | sizeFormat
              }}</template>
            </el-table-column>
            <el-table-column
              prop="updatedDt"
              label="上传时间"
            ></el-table-column>
            <el-table-column label="操作" align="left" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="download(scope.row.id)"
                  >下载</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="deleteItem(scope.row.id)"
                  style="background: #fff; color: #ff0000; border: none"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="m-pages">
            <el-pagination
              v-show="total > 0"
              background
              @current-change="handleCurrentChange"
              layout="prev, pager, next,total"
              :current-page.sync="tableQuery.pageNo"
              :page-size="tableQuery.pageSize"
              :total="total"
            ></el-pagination>
          </div>
          <!-- 添加与编辑弹窗 -->
          <el-dialog
            title="上传文件"
            :visible.sync="passDialogVisible"
            :close-on-click-modal="false"
            @close="onCloseDialog"
            width="480px"
          >
            <div class="l-user-btn">
              <div>
                <el-input
                  v-model="fileName"
                  style="width: 350px"
                  placeholder="请选择文件"
                ></el-input>
                <div style="color: #ccc">支持pdf文档，最大不超过10M</div>
              </div>

              <el-upload
                class="upload-demo"
                :action="saveUrl"
                :on-success="handleSuccess"
                :show-file-list="false"
                accept=".pdf"
                :auto-upload="true"
              >
                <el-button
                  style="background: rgba(255, 153, 0, 1); border: none"
                  type="primary"
                  >浏览</el-button
                >
              </el-upload>
            </div>
            <div slot="footer">
              <el-button @click="onCloseDialog">取 消</el-button>
              <el-button
                type="primary"
                @click="onSave"
                :disabled="fileName == '' ? true : false"
                >开始上传</el-button
              >
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </el-col>
  </section>
</template>

<script>
export default {
  name: "Manage",
  components: {},
  data() {
    return {
      filters: {
        search: "",
      },
      fileName: "",
      size: "",
      filePath: "",
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      passDialogVisible: false,
      dialogVisible: false,
      total: 0,
      tableData: [],
      tableQuery: {
        pageSize: 10,
        pageNo: 1,
      },
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
    };
  },

  mounted() {
    this.getTrainingList();
  },
  methods: {
    uploader() {
      this.passDialogVisible = true;
    },
    handleSuccess(res, file) {
      console.log(res);
      this.fileName = res.data.filename;
      this.size = res.data.size;
      this.filePath = res.data.path;
    },
    handleCurrentChange(val) {
      this.tableQuery.pageNo = val;
      this.getTrainingList();
    },
    onCloseDialog() {
      this.passDialogVisible = false;
      this.fileName = "";
    },
    onSave() {
      let param = {
        fileName: this.fileName,
        size: this.size,
        filePath: this.filePath,
      };
      this.$http
        .post("/api/web/training/save", param)
        .then((json) => {
          this.$message.success("上传成功");
          this.passDialogVisible = false;
          this.getTrainingList();
          this.fileName = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //超级管理员获取所有列表
    getTrainingList(val) {
      if (val == "search") {
        this.tableQuery.pageNo = 1;
      }
      let param = {
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
        type: 2,
        fileName: this.filters.search,
      };
      //超管获取所有列表，普通管理获取自己列表
      if (this.userId == 1) {
        this.$http
          .get("/api/web/training/list/page", { params: param })
          .then((res) => {
            this.total = res.data.total;
            this.tableData = res.data.records;
            this.tableQuery.pageNo = res.data.current;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$http
          .get("/api/web/training/list/managerPage", { params: param })
          .then((res) => {
            this.total = res.data.total;
            this.tableData = res.data.records;
            this.tableQuery.pageNo = res.data.current;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    download(id) {
      window.location.href =
        this.$setting.baseURL + `/oss/download/downloadById?fileId=${id}`;
    },

    deleteItem(id) {
      this.$confirm("您确定要删除该文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .delete(`/api/web/training/logic/${id}`)
          .then(() => {
            this.$message.success("删除文件成功");
            this.getTrainingList();
          })
          .catch((msg) => {});
      });
    },
  },
};
</script>

<style lang="scss">
.l-user-btn {
  display: flex;
  justify-content: space-between;
}
.el-dialog__header {
  padding: 20px;
  padding-bottom: 10px;
  text-align: left;
}
.el-dialog--center .el-dialog__footer {
  text-align: right;
}
.editTags {
  margin-left: 15px;
  color: #409eff;
}
.dialog-footer {
  width: 200px;
  text-align: right;
}
.el-upload-list__item-name {
  margin: 20px 0;
}
</style>
