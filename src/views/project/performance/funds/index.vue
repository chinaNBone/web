<!-- 经费管理 -->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>经费管理</h2>
    </div>

    <div class="m-search">
      <div class="f-clearfix btn-width">
        <el-upload
          :action="saveUrl"
          :data="{projectId: projectId}"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-upload="beforeFileUpload"
          :show-file-list="false"
          style="margin-right:10px;"
          multiple
        >
          <el-button type="primary">导入经费使用数据</el-button>
        </el-upload>
        <el-button type="warning" @click="exoprtData()">导出经费使用数据</el-button>
        <el-button type="warning" @click="downTemplate()">模板下载</el-button>
      </div>
      <div>
        <el-input v-model="list.search" placeholder="输入项目名称" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="title" label="项目名称"></el-table-column>
      <el-table-column prop="budget" label="预算经费(万)"></el-table-column>
      <el-table-column prop="expenditure" label="实际使用经费(万)"></el-table-column>
      <el-table-column prop="percent" label="使用进度"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="createdDt" label="录入时间"></el-table-column>
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
    <el-dialog
      title="导入经费信息"
      :visible.sync="dialogVisible1"
      width="500px"
      :before-close="closecourseForm"
      :close-on-click-modal="false"
    >
      <el-alert title="以下信息未导入成功" type="warning"></el-alert>
      <el-table
        :data="listTable2.slice((upLoadPage.currentPage-1)*upLoadPage.pageSize,upLoadPage.currentPage*upLoadPage.pageSize)"
      >
        <el-table-column prop="title"></el-table-column>
        <el-table-column prop="budget"></el-table-column>
        <el-table-column prop="expenditure"></el-table-column>
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
          <el-button type="primary" @click="dialogVisible1=false">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/api/web/expenditure/import",
      downloadUrl:
        this.$setting.baseURL + "/api/web/template/download/expenditure",
      adminTitle: "",
      list: {
        search: "",
        status: ""
      },
      loading: false,
      roleList: [],
      listTable: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      fileList: [],
      projectId: "",
      //前端分页
      upLoadPage: {
        currentPage: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 5
      },
      listTable2: [],
      dialogVisible1: false
    };
  },
  mounted() {
    this.getList();
    this.projectId = localStorage.getItem("projectId");
  },
  methods: {
    downTemplate() {
      window.open(this.downloadUrl);
    },
    handlePreview() {},
    handleRemove(file) {
      let item = [];
      // this.fileList = fileList.slice(-3);
      for (let i = 0; i < item.length; i++) {
        if (file.name == item[i].fileName) {
          item.splice(i, 1);
        }
      }
    },
    //导入失败名单前端分页
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    //导入
    handleSuccess(res) {
      if (res.code == 0) {
        this.dialogVisible1 = true;
        this.listTable2 = res.data;
        this.$message({
          message: res.message,
          type: "success"
        });
        if (res.data.length === 0) {
          this.dialogVisible1 = false;
        }
        console.log(this.projectId);
        this.getList();
      }
    },
    closecourseForm() {
      this.dialogVisible1 = false;
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
          type: "warning"
        });
        return false;
      }
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    exoprtData() {
      let par = {
        expenditureName: this.list.status,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .get("/api/web/expenditure/list/all", { params: par })
        .then(res => {
          let exlList = res.data;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
            // 导出使用进度转化100%
            exlList[i].percent = exlList[i].percent * 100 + "%";
          }
          let title = "经费管理列表";
          let sheet = "经费管理列表";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "项目名称",
              "预算经费(万)",
              "实际使用经费(万)",
              "使用进度",
              "备注"
            ];
            let filterVal = [
              "title",
              "budget",
              "expenditure",
              "percent",
              "remark"
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch();
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v => filterVal.map(j => v[j]));
      return arr;
    },
    // 获取list
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        expenditureName: this.list.search,
        projectId: localStorage.getItem("projectId"),
        // status: this.list.status,
        search: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .get("/api/web/expenditure/list/page", { params: par })
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          for (let i = 0; i < this.listTable.length; i++) {
            for (let j in this.listTable[i]) {
              if (j === "createdDt") {
                this.listTable[i][j] = moment(this.listTable[i][j]).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }
              if (j === "percent") {
                console.log(this.listTable[i][j]);
                this.listTable[i][j] = this.listTable[i][j] * 100 + "%";
              }
            }
          }
          this.loading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-width {
  & > div {
    display: inline-block;
  }
  .el-button {
    display: inline-block;
  }
}
</style>
