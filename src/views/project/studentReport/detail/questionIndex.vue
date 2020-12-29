<template>
  <div>
    <!-- list列表 -->
    <div v-if="!detailFlag">
      <div class="m-search">
        <el-button type="primary" @click="exportUser()">导出问卷数据</el-button>
        <div>
          <el-input
            class="s-el-input"
            v-model="key"
            placeholder="输入学员姓名搜索"
          ></el-input>
          <el-button type class="btn-search" @click="getList('search')"
            >搜索</el-button
          >
        </div>
      </div>
      <!-- <div class="msg-content">
        共收集答卷2份，有效答卷2份
      </div>-->
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
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop label="所在地区">
          <template scope="scope"
            >{{ scope.row.province || "" }}{{ scope.row.city || "" }}</template
          >
        </el-table-column>
        <el-table-column prop label="提交时间">
          <template scope="scope">
            {{ scope.row.createdDt | moment("YYYY-MM-DD HH:ss") }}
          </template>
        </el-table-column>
        <el-table-column
          prop="answerTime"
          label="答卷时长(秒)"
        ></el-table-column>
        <el-table-column prop label="报到状态">
          <template scope="scope">
            <el-button
              type="text"
              class="color-green"
              @click="toDetail(scope.row)"
              >查看答卷</el-button
            >
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
    <!-- 单个详情 -->
    <answer
      v-else
      :listTable="listTable"
      :detailFrom="detailFrom"
      :detailFlag.sync="detailFlag"
      ref="child"
      :userId="userId"
    ></answer>
  </div>
</template>
<script>
import answer from "./answer";
export default {
  components: {
    answer,
  },
  data() {
    return {
      imgUrl: this.$setting.imageUrl + "/",
      listTable: [],
      loading: false,
      detailFrom: {},
      userId: "",
      questionId: "",
      createby: "",
      id: "",
      key: "",
      detailFlag: false,
      listPage: {
        pageNo: 1,
        pageSize: 15,
        total: 0,
      },
      reportNum: "",
      unReportNum: "",
    };
  },
  mounted() {
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
        searchName: this.key,
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize,
      };
      this.$http
        .post(`/api/web/studentReport/manager/answer/page`, par)
        .then((res) => {
          this.loading = false;
          this.listTable = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
        })
        .catch((msg) => {
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
        keyWord: this.key,
      };
      this.$http
        .post("/api/web/studentReport/manager/answer/export", par)
        .then((res) => {
          let exlList = res.data;
          let title = "学员列表";
          let sheet = "学员列表";
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "姓名",
              "手机号",
              "省份",
              "城市",
              "提交时间",
              "答卷时长(秒)",
            ];
            let filterVal = [
              "name",
              "mobile",
              "province",
              "city",
              "createdDt",
              "answerTime",
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch((msg) => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) =>
        filterVal.map((j) => {
          if (j == "gender") {
            return v[j] == 1 ? "男" : "女";
          }
          return v[j];
        })
      );
      return arr;
    },
    toDetail(val) {
      this.detailFlag = !this.detailFlag;
      this.detailFrom = val;
      this.userId = val.id;
      this.questionId = val.questionId;
      this.createby = val.createby;
    },
  },
};
</script>
<style lang="scss" scoped>
.msg-content {
  line-height: 40px;
  color: #777;
  font-size: 14px;
}
</style>
