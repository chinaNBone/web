<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">用户帮助</h2>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding: 20px 0">
          <!-- 检索行 -->
          <el-row class="search-row">
            <div class="f-fl" v-if="$role.isSuperAdmin()">
              <el-button type="primary" size="medium" @click="add"
                >添加</el-button
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
                @click="getList('search')"
                >搜索</el-button
              >
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row v-loading="loading">
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column
              prop="createdDt"
              label="创建时间"
            ></el-table-column>
            <el-table-column label="操作" align="left">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="toEdit(scope.row)"
                  v-if="$role.isSuperAdmin()"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="toDetail(scope.row.id)"
                  >查看</el-button
                >
                <el-button
                  v-if="$role.isSuperAdmin()"
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
              layout="prev, pager, next"
              :current-page.sync="tableQuery.pageNo"
              :page-size="tableQuery.pageSize"
              :total="total"
            ></el-pagination>
          </div>
          <!-- 添加与编辑弹窗 -->
          <el-dialog
            title="用户帮助"
            :visible.sync="passDialogVisible"
            :close-on-click-modal="false"
            @close="onCloseDialog"
            width="800px"
          >
            <div>
              <el-form ref="projectFrom" :model="formVal">
                <el-form-item label="标题">
                  <el-input
                    v-model="formVal.title"
                    maxlength="100"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <quill-editor
                  ref="myQuillEditor"
                  v-model="formVal.content"
                  :options="editorOption"
                  style="height: 400px"
                ></quill-editor>
                <el-form-item align="right" class="dialog-btns">
                  <el-button @click="onCloseDialog">取 消</el-button>
                  <el-button
                    type="primary"
                    :disabled="formVal.title && formVal.content ? false : true"
                    @click="onSave"
                    >确定</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
        </el-main>
      </el-container>
    </el-col>
  </section>
</template>

<script>
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
Quill.register("modules/ImageExtend", ImageExtend);
export default {
  name: "Manage",
  components: { quillEditor },
  data() {
    return {
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: "file",
            action: this.$setting.baseURL + "/oss/upload/upload",
            response: (res) => {
              return this.$setting.imageUrl + res.data.path;
            },
          },
          toolbar: {
            container: container,
            handlers: {
              image: function () {
                QuillWatch.emit(this.quill.id);
              },
            },
          },
        },
      },
      loading: false,
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
      passDialogVisible: false,
      total: 0,
      tableData: [],
      tableQuery: {
        pageSize: 15,
        pageNo: 1,
      },
      formVal: {
        title: "",
        content: "",
      },
    };
  },
  computed: {
    selectList() {
      return this.chooseTags.filter((item) => item.isSelect);
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    toDetail(val) {
      this.$router.push({
        path: "/helpDetail",
        query: {
          id: val,
        },
      });
    },
    handleCurrentChange(val) {
      this.tableQuery.pageNo = val;
      this.getList();
    },
    onCloseDialog() {
      this.passDialogVisible = false;
    },
    onSave() {
      let par = {
        title: this.formVal.title,
        content: this.formVal.content,
        id: this.editId,
      };
      this.$http
        .post("/api/resource/help/save", par)
        .then((res) => {
          this.$message.success("保存成功");
          this.passDialogVisible = false;
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getList(val) {
      if (val == "search") {
        this.tableQuery.pageNo = 1;
      }
      this.loading = true;
      let par = {
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
        searchKey: this.filters.search,
      };
      this.$http
        .get("/api/resource/help/list", { params: par })
        .then((res) => {
          this.total = res.data.total;
          this.tableData = res.data.records;
          this.tableQuery.pageNo = res.data.current;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toEdit(item) {
      this.passDialogVisible = true;
      this.formVal.title = item.title;
      this.formVal.content = item.content;
      this.editId = item.id;
    },
    add() {
      this.formVal = { title: "", content: "" };
      this.passDialogVisible = true;
      this.editId = "";
    },
    deleteItem(id) {
      this.$confirm("您确定要删除该数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .delete(`/api/resource/help/delete//${id}`)
          .then(() => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch((msg) => {});
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.dialog-btns {
  margin-top: 80px;
}
.el-upload-list__item-name {
  margin: 20px 0;
}
.ql-container {
  height: 350px;
}
/deep/.ql-video {
  display: none !important;
}
</style>
