<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">信息管理</h2>
      <!-- <div class="g-box-header-back" @click="back">返回></div> -->
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding:20px 0 ">
          <!-- 检索行 -->
          <el-row class="search-row">
            <div class="f-fl">
              <el-button type="primary" size="medium" @click="exportUser">创建信息提醒</el-button>
              <!-- <el-button
                type="primary"
                size="medium"
                style="background:rgba(255, 153, 0, 1);border:none"
                >删除</el-button
              >-->
            </div>
            <div class="f-fr">
              <el-input v-model="filters.search" size="medium" placeholder="输入关键词搜索"></el-input>
              <el-button
                type="primary"
                style="background:rgba(255, 153, 0, 1);border:none"
                size="medium"
                @click="getList('search')"
              >搜索</el-button>
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column label="信息标题" prop="title" width="200"></el-table-column>
            <el-table-column prop="createName" label="创建人"></el-table-column>
            <el-table-column prop="createdDt" label="创建时间" width="160"></el-table-column>
            <el-table-column prop="scanNum" label="浏览量"></el-table-column>
            <el-table-column prop="status" label="发布状态"></el-table-column>
            <el-table-column label="操作" align="left" width="180">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status=='草稿'"
                  type="text"
                  size="small"
                  @click="toRelease(scope.row.id)"
                >发布</el-button>
                <el-button
                  v-if="scope.row.status=='已发布'"
                  type="text"
                  size="small"
                  @click="deleteItem(scope.row.id)"
                >删除</el-button>
                <el-button type="text" size="small" @click="toDetail(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-show="total > 0"
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="tableQuery.pageNo"
            :page-size="tableQuery.pageSize"
            layout="prev, pager, next,total"
            :total="total"
          ></el-pagination>
          <el-dialog
            title="创建信息提醒"
            :visible.sync="dialogUserVisible"
            :close-on-click-modal="false"
            @close="onCloseDialog"
            style="margin-top: 15vh;"
            width="480px"
          >
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="信息标题">
                <el-input v-model="form.name" placeholder="请输入信息标题"></el-input>
                <span class="u-tags-limit" style="top:55%;right:48px">
                  {{
                  form.name.length + "/30"
                  }}
                </span>
              </el-form-item>
              <el-form-item label="信息内容">
                <el-input type="textarea" :rows="5" placeholder="请输入信息内容" v-model="form.content"></el-input>
              </el-form-item>
              <el-form-item label="是否发布">
                <el-radio-group v-model="form.resource">
                  <el-radio label="保存草稿">保存草稿</el-radio>
                  <el-radio label="立即发布">立即发布</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button @click="dialogUserVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">创建</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog
            title="查看详情"
            :visible.sync="checkDetail"
            :close-on-click-modal="false"
            @close="onCloseDialog"
            style="margin-top: 15vh;"
            width="480px"
          >
            <el-form ref="userform" :model="userform" label-width="80px">
              <el-form-item label="信息标题">{{ userform.title }}</el-form-item>
              <el-form-item label="信息内容">{{ userform.content }}</el-form-item>
            </el-form>
          </el-dialog>
        </el-main>
      </el-container>
    </el-col>
  </section>
</template>

<script>
export default {
  name: "News",
  components: {},
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl + "/",
      filters: {
        search: ""
      },
      checkDetail: false,
      dialogUserVisible: false,
      chooseTags: [],
      form: {
        name: "",
        resource: "保存草稿",
        content: ""
      },
      total: 0,
      tableData: [],
      tableQuery: {
        pageSize: 10,
        pageNo: 1
      },
      userform: {
        title: "",
        content: ""
      }
    };
  },
  computed: {
    selectList() {
      return this.chooseTags.filter(item => item.isSelect);
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    toRelease(id) {
      this.$http
        .put(`/api/web/message/publish/${id}`)
        .then(() => {
          this.$message.success("发布成功");
          this.getList();
        })
        .catch(msg => {
          console.log("tag", msg);
        });
    },
    onSubmit() {
      let par = {
        content: this.form.content,
        relId: localStorage.getItem("projectId"),
        title: this.form.name
      };
      if (this.form.resource == "保存草稿") {
        par.status = "0";
      } else {
        par.status = "1";
      }
      this.$http.post("/api/web/message/add", par).then(() => {
        this.getList();
        this.dialogUserVisible = false;
      });
    },
    getUrl(url) {
      if (!url) {
        return url;
      }
      if (url.startsWith("http")) {
        return url;
      } else {
        return this.imgUrl + url;
      }
    },
    onCloseDialog() {
      this.dialogUserVisible = false;
    },
    handleSizeChange(val) {
      this.tableQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.tableQuery.pageNo = val;
      this.getList();
    },
    exportUser() {
      this.form = {
        name: "",
        resource: "保存草稿",
        content: ""
      };
      this.dialogUserVisible = true;
    },
    getList(val) {
      if (val == "search") {
        this.tableQuery.pageNo = 1;
      }
      let par = {
        keyWord: this.filters.search,
        pageNo: this.tableQuery.pageNo,
        pageSize: this.tableQuery.pageSize
      };
      this.$http
        .get(
          `/api/web/message/page/list/${localStorage.getItem("projectId")}`,
          { params: par }
        )
        .then(json => {
          this.total = json.data.total;
          this.tableData = json.data.records;
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i]["status"] =
              this.tableData[i]["status"] == 0 ? "草稿" : "已发布";
          }
          if (json.data.curPageSize == 0 && this.tableQuery.pageNo > 1) {
            this.tableQuery.pageNo -= 1;
            this.getList();
            return;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toDetail(id) {
      this.checkDetail = true;
      this.$http.get(`/api/web/message/details/${id}`).then(res => {
        Object.assign(this.userform, res.data);
      });
    },
    deleteItem(id) {
      this.$confirm("您确定要删除该信息提醒吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .delete(`/api/web/message/logic/${id}`)
          .then(() => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch(() => {});
      });
    }
  }
};
</script>

<style lang="scss">
.l-user-btn {
  display: flex;
  justify-content: space-between;
}
.faileList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.s-img {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.input-line {
  background: #fff;
  z-index: 999;
  position: absolute;
  left: 18px;
  width: 100px;
  height: 40px;
  opacity: 0;
}
</style>
