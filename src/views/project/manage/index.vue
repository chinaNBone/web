<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员管理</h2>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main">
          <!-- 检索行 -->
          <el-row class="search-row f-clearfix">
            <div class="f-fl manage-width">
              <el-upload
                class="avatar-uploader1"
                :action="fileUrl"
                :show-file-list="false"
                :data="{ projectId: projectId }"
                :before-upload="beforeFileUpload"
                :on-success="handleSuccess"
              >
                <el-button type="primary">导入账号</el-button>
              </el-upload>
              <el-button type="primary" @click="downloadExl"
                >导出名单</el-button
              >
              <el-button type="primary" @click="downTable">模板下载</el-button>
            </div>
            <div class="f-fr">
              <el-input
                v-model="filters.search"
                placeholder="输入学员姓名/手机号搜索"
              ></el-input>
              <el-button
                type="primary"
                class="search-button"
                @click="getList('search')"
                >搜索</el-button
              >
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column label="学员姓名" prop="avatar" width="180">
              <template slot-scope="scope">
                <div class="s-img f-clearfix">
                  <img
                    :src="
                      scope.row.avatar
                        ? imgUrl + scope.row.avatar
                        : '/images/avatar_normal_200.jpg'
                    "
                    alt
                    width="40"
                    height="40"
                    class="f-fl"
                    style="margin-right: 10px"
                  />
                  <div class="f-fl">{{ scope.row.realName }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
              width="120"
            ></el-table-column>
            <el-table-column prop="gender" label="性别" width="80">
              <template slot-scope="scope">
                <div>{{ scope.row.gender == 1 ? "男" : "女" }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
              width="120"
            ></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column label="操作" align="left" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toEdit(scope.row)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  style="color: red"
                  size="small"
                  @click="deleteItem(scope.row.id)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="m-pages">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              layout="prev, pager, next,total"
              :current-page.sync="tableQuery.pageNo"
              :page-size="tableQuery.pageSize"
              :total="tableQuery.total"
            ></el-pagination>
          </div>
          <el-dialog
            title="导入名单"
            :visible.sync="dialogVisible1"
            width="700px"
            :before-close="closecourseForm"
            :close-on-click-modal="false"
          >
            <el-alert title="以下学员未导入成功" type="warning"></el-alert>
            <el-table
              :data="
                listTable2.slice(
                  (upLoadPage.currentPage - 1) * upLoadPage.pageSize,
                  upLoadPage.currentPage * upLoadPage.pageSize
                )
              "
            >
              <el-table-column label="姓名" prop="realName"></el-table-column>
              <el-table-column label="手机号" prop="mobile"></el-table-column>
              <el-table-column label="原因" prop="errorMsg"></el-table-column>
            </el-table>
            <el-pagination
              align="center"
              @size-change="handleSizeChange"
              @current-change="handleCuChange"
              :current-page="upLoadPage.currentPage"
              :page-size="upLoadPage.pageSize"
              :total="listTable2.length"
              layout="total, prev, pager, next"
            ></el-pagination>
            <el-form label-width="120px" label-position="right">
              <el-form-item align="right" class="dialog-btns">
                <el-button type="primary" @click="dialogVisible1 = false"
                  >确定</el-button
                >
              </el-form-item>
            </el-form>
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
      imgUrl: this.$setting.imageUrl + "/",
      fileUrl: this.$setting.baseURL + "/api/web/userRef/addExcel",
      projectId: localStorage.getItem("projectId"),
      filters: {
        search: "",
      },
      dialogVisible1: false,
      chooseTags: [],
      tableData: [],
      tableQuery: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
      },
      listTable2: [],
      //前端分页
      upLoadPage: {
        currentPage: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 5,
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
    handleCurrentChange(val) {
      this.tableQuery.pageNo = val;
      this.getList();
    },
    //导入失败名单前端分页
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    beforeFileUpload(file) {
      let size = file.size / 1024 / 1024 <= 10;
      if (!size) {
        this.$message.error("上传文件大小不得超过10MB");
        return false;
      }
      // 截取文件名后缀
      let type1 = file.name.lastIndexOf(".");
      let type2 = file.name.length;
      let type = file.name.substring(type2, type1 + 1);
      if (type != "xlsx" && type != "xls") {
        this.$message({
          message: "请选择上传格式为xls/xlsx",
          type: "warning",
        });
        return false;
      }
    },
    //导入
    handleSuccess(res) {
      if (res.code == 0) {
        if (res.data.failList.length === 0) {
          this.dialogVisible1 = false;
        } else {
          this.dialogVisible1 = true;
          this.listTable2 = res.data.failList;
          this.$message({
            message: res.message,
            type: "success",
          });
        }
        this.getList();
      }
    },
    closecourseForm() {
      this.dialogVisible1 = false;
    },
    //导出名单
    downloadExl() {
      let param = {
        projectId: this.projectId,
      };
      this.$http
        .post("/api/web/userRef/exportStudentList", param)
        .then((res) => {
          let exlList = res.data;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
          }
          console.log("res", res);
          let title = "学员列表";
          let sheet = "学员列表";
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["学员姓名", "手机号", "单位", "地址"];
            let filterVal = ["realName", "mobile", "unit", "address"]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch(() => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) => filterVal.map((j) => v[j]));
      return arr;
    },
    getList(val) {
      if (val == "search") {
        this.tableQuery.pageNo = 1;
      }
      let param = {
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
        keyWords: this.filters.search,
        projectId: this.projectId,
      };
      this.$http
        .post("/api/web/userRef/pageStudentList", param)
        .then((res) => {
          this.tableQuery.total = res.data.total;
          this.tableQuery.pageSize = res.data.size;
          this.tableQuery.pageNo = res.data.current;
          this.tableData = res.data.records;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toEdit(obj) {
      this.$router.push({
        path: "/studentNews",
        query: obj,
      });
    },
    downTable() {
      window.location.href =
        this.$setting.baseURL + `/api/web/template/download/student`;
    },
    deleteItem(item) {
      this.$confirm("您确定要删除该学员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let url = "/api/edu/userRef/delete";
        this.$http
          .post(url, { id: item, projectId: this.projectId })
          .then(() => {
            this.$message.success("删除学员成功");
            this.getList();
          })
          .catch((msg) => {
            console.log("tag", msg);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-button,
.search-button:hover,
.search-button:focus {
  background: rgba(255, 153, 0, 1);
  border: none;
}
.g-main {
  padding: 20px 0;
}
.manage-width {
  min-width: 350px;
  & > div {
    max-width: 110px;
  }
  & > .el-button {
    max-width: 110px;
    background: rgba(255, 153, 0, 1);
    border: none;
    float: left;
  }
}
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
  align-items: center;
  img {
    flex: 1;
    max-width: 40px;
    min-width: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }
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
.avatar-uploader1 {
  text-align: left;
  float: left;
  margin-right: 15px;
}
</style>
