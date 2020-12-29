<!--外出学习管理-->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>外出学习管理</h2>
    </div>
    <div class="m-search">
      <div>
        <el-upload
          class="upload-demo"
          :action="saveUrl"
          :data="upData"
          :headers="headers"
          :on-success="handleSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button type="primary" size="medium">导入登记表</el-button>
        </el-upload>

        <el-button type="warning" size="medium" @click="downloadExl">导出登记表</el-button>
        <el-button type="warning" size="medium" @click="downTable">模板下载</el-button>
      </div>
      <div>
        <el-input v-model="list.search" placeholder="输入用户姓名搜索" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">{{ scope.row.gender==1?'男':'女' }}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="unit" label="所属单位"></el-table-column>
      <el-table-column prop="remark" label="学习项目"></el-table-column>
      <el-table-column prop="period" label="培训时长（天）"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color:red" size="small" @click="rowDel(scope.row.id)">删除</el-button>
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
    <el-dialog
      title="导入登记表"
      :visible.sync="dialogVisible1"
      width="500px"
      :before-close="closecourseForm"
      :close-on-click-modal="false"
    >
      <el-alert title="以下信息未导入成功" type="warning"></el-alert>
      <el-table
        :data="listTable2.slice((upLoadPage.currentPage-1)*upLoadPage.pageSize,upLoadPage.currentPage*upLoadPage.pageSize)"
        v-loading="loading"
      >
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="remark" label="学习项目"></el-table-column>
        <el-table-column prop="period" label="培训时长(天)"></el-table-column>
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
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/import/excel",
      headers: { Authorization: this.$store.state.global.access_token },
      upData: { projectId: localStorage.getItem("projectId") },
      dialogVisible1: false,
      list: {
        search: ""
      },
      loading: false,
      roleList: [],
      listTable: [],
      listTable2: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      //前端分页
      upLoadPage: {
        currentPage: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 5
      }
    };
  },
  methods: {
    //导入失败名单前端分页
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    //删除列表
    rowDel(id) {
      this.$http
        .delete(`/logic/${id}`)
        .then(res => {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getList();
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    //导入
    handleSuccess(res) {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.dialogVisible1 = true;
          this.listTable2 = res.data;
        }
        this.getList();
        this.$message({
          message: res.message,
          type: "success"
        });
      }
    },
    beforeUpload() {},
    // 获取list
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        name: this.list.search,
        projectId: localStorage.getItem("projectId"),
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .get("/list/page", { params: par })
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(() => {});
    },
    closecourseForm() {
      this.dialogVisible1 = false;
    },
    //导出名单
    downloadExl() {
      let par = {
        name: this.list.search,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .get("/list/page", { params: par })
        .then(res => {
          let exlList = res.data.records;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
          }
          let title = "外出学习列表";
          let sheet = "外出学习列表";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["姓名", "手机号", "学习项目", "培训时间（天）"];
            let filterVal = ["name", "mobile", "studyProjectName", "period"]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch(() => {});
    },
    downTable() {
      window.location.href =
        this.$setting.baseURL + `/api/web/template/download/outside`;
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v => filterVal.map(j => v[j]));
      return arr;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style lang="scss">
</style>