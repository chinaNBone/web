<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员报到</h2>
      <div class="g-box-header-back" @click="back">返回></div>
    </el-header>
    <el-main class="g-main">
      <div class="student-detail">
        <div class="student-detail-header">
          <div class="student-name" style="font-size:16px">
            <i
              class="el-icon-arrow-left"
              style="border:1px solid #ccc;padding:3px; color:#ccc;margin-right:7px;"
            ></i>
            <span>2019年第四季度全省小学骨干教师研修报到</span>
          </div>
          <div class="student-detail-bottom">
            <span class="student-info"
              >收集时间：{{ orgDetail.createdDt }}至{{
                orgDetail.createdDt
              }}</span
            >
            <span class="student-info-right">二维码</span>
            <span class="student-info-right">复制链接</span>
          </div>
        </div>
        <el-button
          type="primary"
          size="medium"
          style="background:#fff;color:#00be6e;width: 120px;height:40px"
          @click="editLecturer(questionnaire)"
          >关闭问卷</el-button
        >
      </div>

      <!-- report详情组件 -->
      <report-detail :detail-data="report"></report-detail>
    </el-main>
  </div>
</template>
<script>
import reportDetail from "./reportDetail.vue";
export default {
  components: {
    reportDetail,
  },
  data() {
    return {
      orgDetail: {},
      report: [
        {
          name: "小黑",
          gender: 1,
          status: 1,
          school: "郑州大学",
          address: "郑州",
          mobile: "15038217320",
          avatr: "",
        },
        {
          name: "刘玉",
          gender: 1,
          status: 1,
          school: "郑州大学",
          address: "郑州",
          mobile: "15038217320",
          avatr: "",
        },
        {
          name: "蒋正洲",
          gender: 1,
          status: 1,
          school: "郑州大学",
          address: "郑州",
          mobile: "15038217320",
          avatr: "",
        },
        {
          name: "小白",
          gender: 2,
          status: 0,
          school: "郑州大学",
          address: "郑州",
          mobile: "15038217320",
          avatr: "",
        },
      ],
    };
  },
  methods: {
    getReportDetail() {
      this.loadingEx = true;
      this.$http
        .post("/manager/organization/getInfo", {
          orgId: this.$route.params.id,
        })
        .then((data) => {
          // console.log(data);
        })
        .catch((msg) => {});
    },
  },
  mounted() {
    // this.getReportDetail();
  },
};
</script>
<style scoped>
.student-detail {
  display: flex;
  justify-content: space-between;
}
.student-name,
.student-detail-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #333333;
}

.course-detail .course-detail-header .course-name .verify-info {
  margin-left: 10px;
  font-size: 14px;
  font-weight: 400;
}
.title-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.title-info {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.verify-info {
  margin-left: 20px;
  line-height: 24px;
}
.g-doc .g-bd .g-box .g-box-header .active {
  border-bottom: #4da5f7 2px solid;
}
</style>
