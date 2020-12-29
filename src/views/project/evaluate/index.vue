<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">评价管理</h2>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding:20px 0 ">
          <!-- 检索行 -->
          <el-row class="search-row">
            <div class="f-fl">
              <el-button type="primary" icon="el-icon-plus" size="medium" @click="createFile">创建评价问卷</el-button>
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column label="问卷名称" prop="title" width="200"></el-table-column>
            <el-table-column label="问卷类型" width="120">
              <template
                slot-scope="scope"
              >{{['','调研','报名','考勤','教师授课','学生评价','综合评价问卷'][scope.row.questionType]}}</template>
            </el-table-column>
            <el-table-column label="所属课程" prop="courseName" width="160"></el-table-column>
            <el-table-column label="收集时间" width="200">
              <template
                slot-scope="scope"
              >{{scope.row.collectDateBegin| moment("YYYY-MM-DD")}}~{{scope.row.collectDateEnd| moment("YYYY-MM-DD")}}</template>
            </el-table-column>
            <el-table-column label="状态">
              <template
                slot-scope="scope"
              >{{scope.row.status==0?'待发布':(scope.row.status==1?'已发布':'已关闭')}}</template>
            </el-table-column>
            <el-table-column label="填报人数" prop="reportNum"></el-table-column>
            <el-table-column label="操作" align="left" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toEdit(scope.row)">管理</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="release(scope.row.id)"
                  v-if="scope.row.status!=1&&scope.row.status!=2&&scope.row.questionType === 6"
                >发布</el-button>
                <el-button
                  type="text"
                  style="color:red"
                  size="small"
                  @click="colseitem(scope.row.id)"
                  v-if="scope.row.status!=2&&scope.row.questionType === 6"
                >关闭</el-button>
                <el-button
                  type="text"
                  style="color:red"
                  size="small"
                  @click="deleteItem(scope.row.id)"
                  v-if="scope.row.questionType === 6"
                >删除</el-button>
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
      projectId: localStorage.getItem("projectId"),
      dialogTitle: "",
      radio: "",
      total: 0,
      tableData: [],
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
    //关闭
    colseitem(id) {
      this.$confirm("您确定要关闭该评价吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .put(`api/web/evaluation/close/${id}`)
          .then(() => {
            this.$message.success("操作成功");
            this.getList();
          })
          .catch(msg => {});
      });
    },
    //创建问卷
    createFile() {
      this.$router.push("/creatFile");
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    getList() {
      let par = {
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .get(`/api/web/evaluation/pageList/${this.projectId}`, { params: par })
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.tableData = res.data.records;
        })
        .catch(msg => {});
    },
    //管理
    toEdit(row) {
      this.$router.push({
        path: "/detailTab",
        query: { id: row.id, status: row.status }
      });
    },
    //发布
    release(id) {
      this.$confirm("是否发布该评价?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .put(`api/web/evaluation/publish/${id}`)
          .then(() => {
            this.$message.success("发布成功");
            this.getList();
          })
          .catch(msg => {});
      });
    },
    //删除
    deleteItem(id) {
      this.$confirm("您确定要删除该评价吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .delete(`api/web/evaluation/delete/${id}`)
          .then(() => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch(msg => {});
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
