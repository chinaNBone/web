<template>
  <div>
    <div class="m-search">
      <el-button type="primary" @click="exportUser()">导出报到数据</el-button>
      <div>
        <el-select class="s-el-input" v-model="status" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option label="已报到" :value="true"></el-option>
          <el-option label="未报到" :value="false"></el-option>
        </el-select>
        <el-input class="s-el-input" v-model="key" placeholder="输入学员姓名搜索"></el-input>
        <el-button type class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <div class="msg-content">
      共 {{ sum() }} 位学员，已报到 {{ reportNum }} 人，未报到
      {{ unReportNum }} 人
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="title" label="照片">
        <template scope="scope">
          <div class="image-logo-box">
            <img
              :src="
                scope.row.avatar
                  ? imgUrl + scope.row.avatar
                  : '/images/avatar_normal_200.jpg'
              "
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column prop label="性别">
        <template scope="scope">{{ scope.row.gender == 1 ? "男" : "女" }}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="place" label="所在地区"></el-table-column>
      <el-table-column prop="unit" label="所在学校"></el-table-column>
      <el-table-column prop="createdDt" label="报到时间"></el-table-column>
      <el-table-column prop label="报到状态">
        <template scope="scope">
          <span
            :class="
              scope.row.reportStatus == '已报到' ? 'color-green' : 'color-red'
            "
          >{{ scope.row.reportStatus }}</span>
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
      listTable: [],
      loading: false,
      status: "",
      id: "",
      key: "",
      listPage: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      reportNum: "",
      unReportNum: ""
    };
  },
  mounted() {
    console.log(this.id);
    this.reportNum = this.$route.query.reportNum;
    this.unReportNum = this.$route.query.unReportNum;
    this.id = this.$route.query.id;
    this.getList();
  },
  methods: {
    sum() {
      return parseInt(this.reportNum) + parseInt(this.unReportNum);
    },
    getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        id: this.id,
        isReport: this.status,
        keyWord: this.key,
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize
      };
      this.$http
        .post(`/api/web/studentReport/manager/details/page`, par)
        .then(res => {
          this.loading = false;
          this.listTable = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
        })
        .catch(msg => {
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    // 导出
    exportUser() {
      let par = {
        id: this.id,
        isReport: this.status,
        keyWord: this.key
      };
      this.$http
        .post("/api/web/studentReport/manager/details/export", par)
        .then(res => {
          let exlList = res.data;
          let title = "学员列表";
          let sheet = "学员列表";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "姓名",
              "性别",
              "手机号",
              "所在地区",
              "所在学校",
              "报到状态"
            ];
            let filterVal = [
              "realName",
              "gender",
              "mobile",
              "place",
              "unit",
              "reportStatus"
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch(msg => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v =>
        filterVal.map(j => {
          if (j == "gender") {
            return v[j] == 1 ? "男" : "女";
          }
          return v[j];
        })
      );
      return arr;
    }
  }
};
</script>
<style lang="scss" scoped>
.msg-content {
  line-height: 40px;
  color: #777;
  font-size: 14px;
}
</style>
