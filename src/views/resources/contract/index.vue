<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">合同列表</h2>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding: 20px 0">
          <!-- 检索行 -->
          <el-row class="search-row">
            <div class="f-fl">
              <el-button type="primary" size="medium" @click="uploader(1)"
                >上传合同</el-button
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
                @click="getUserList('search')"
                >搜索</el-button
              >
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column
              label="合同名称"
              prop="fileName"
              width="300"
            ></el-table-column>
            <el-table-column
              prop="projectName"
              label="所属项目"
            ></el-table-column>
            <el-table-column
              prop="createdDt"
              label="上传时间"
            ></el-table-column>
            <el-table-column
              prop="uploaderName"
              label="上传人"
              width="100"
            ></el-table-column>
            <el-table-column label="操作" align="left" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="toEdit(scope.row, 2)"
                  >编辑</el-button
                >
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
            :title="type == 1 ? '上传合同' : '编辑合同'"
            :visible.sync="passDialogVisible"
            :close-on-click-modal="false"
            @close="onCloseDialog"
            width="510px"
          >
            <div>
              <el-form ref="projectFrom" :rules="formRule" :model="formVal">
                <el-form-item
                  label="合同名称"
                  v-if="formVal.file != ''"
                  style="margin-left: 10px"
                  >{{ formVal.file }}</el-form-item
                >
                <el-form-item label="添加合同" prop="file" v-else>
                  <el-upload
                    class="upload-demo"
                    :action="saveUrl"
                    :on-success="handleSuccess"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                  >
                    <el-button
                      style="
                        background: #fff;
                        color: #00be6e;
                        border: 1px solid #00be6e;
                      "
                      icon="el-icon-upload2"
                      >添加合同</el-button
                    >
                  </el-upload>
                  <el-input v-show="false" v-model="formVal.file"></el-input>
                </el-form-item>
                <el-form-item label="关联项目" prop="change">
                  <el-select
                    placeholder="请选择关联项目"
                    v-model="formVal.change"
                  >
                    <el-option
                      v-for="item in fileList"
                      :key="item.projectId"
                      :label="item.projectName"
                      :value="item.projectId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer">
              <el-button @click="onCloseDialog">取 消</el-button>
              <el-button type="primary" @click="onSave">确定</el-button>
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
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      filters: {
        search: "",
      },
      //编辑时的id
      editId: "",
      fileList: [],
      projectId: "",
      fileName: "",
      size: "",
      filePath: "",
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      passDialogVisible: false,
      total: 0,
      tableData: [],
      tableQuery: {
        pageSize: 15,
        pageNo: 1,
      },
      type: "",
      formVal: {
        file: "",
        change: "",
      },
      formRule: {
        file: [
          {
            required: true,
            message: "请添加合同问卷",
            trigger: "blur",
          },
        ],
        change: [
          {
            required: true,
            message: "请选择关联项目",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    selectList() {
      return this.chooseTags.filter((item) => item.isSelect);
    },
  },
  mounted() {
    this.getUserList();
    this.getFileList();
  },
  methods: {
    uploader(val) {
      this.type = val;
      this.passDialogVisible = true;
    },
    handleSuccess(res, file) {
      this.formVal.file = res.data.filename;
      this.fileName = res.data.filename;
      this.size = res.data.size;
      this.filePath = res.data.path;
    },
    beforeUpload() {},
    handleCurrentChange(val) {
      this.tableQuery.pageNo = val;
      this.getUserList();
    },
    onCloseDialog() {
      this.passDialogVisible = false;
      this.formVal = { file: "", change: "" };
    },
    onSave() {
      this.$refs["projectFrom"].validate((valid) => {
        if (valid) {
          if (this.type == 1) {
            let param = {
              fileName: this.fileName,
              size: this.size,
              filePath: this.filePath,
              projectId: this.formVal.change,
            };
            this.$http
              .post("/api/web/contract/save", param)
              .then((json) => {
                this.$message.success("上传成功");
                this.passDialogVisible = false;
                this.getUserList();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.editContract();
          }
        }
      });
    },
    //用户角色状态值
    checkRoleFormat(val) {
      if (val.moocRole == "0") {
        return "学生";
      } else {
        return "老师";
      }
    },
    getUserList(val) {
      if (val == "search") {
        this.tableQuery.pageNo = 1;
      }
      let par = {
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
        keyWord: this.filters.search,
      };
      this.$http
        .get("/api/web/contract/list/page", { params: par })
        .then((res) => {
          this.total = res.data.total;
          this.tableData = res.data.records;
          this.tableQuery.pageNo = res.data.current;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //关联
    getFileList() {
      this.$http
        .get("/api/web/contract/options/project")
        .then((res) => {
          this.fileList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toEdit(item, val) {
      this.type = val;
      this.passDialogVisible = true;
      this.formVal.change = item.relId;
      this.formVal.file = item.fileName;
      this.editId = item.id;
    },
    editContract() {
      let par = { id: this.editId, relId: this.formVal.change };
      this.$http
        .post("/api/web/contract/update", par)
        .then(() => {
          this.$message.success("编辑成功");
          this.passDialogVisible = false;
          this.getUserList();
        })
        .catch((msg) => {});
    },
    download(id) {
      window.location.href =
        this.$setting.baseURL + `/oss/download/downloadById?fileId=${id}`;
    },
    deleteItem(id) {
      this.$confirm("您确定要删除该合同吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .delete(`/api/web/contract/logic/${id}`)
          .then(() => {
            this.$message.success("删除合同成功");
            this.getUserList();
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
