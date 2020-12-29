<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">考勤管理</h2>
    </el-header>
    <el-main class="g-main" style="padding:20px 0;">
      <!-- report详情组件 -->
      <!-- <work :detail-data="report" @func="getMsg"></work> -->
      <el-tabs v-model="tabFlag" type="card">
        <el-tab-pane label="总览" name="first"></el-tab-pane>
        <el-tab-pane label="学员考勤" name="second"></el-tab-pane>
        <el-tab-pane label="教师考勤" name="third"></el-tab-pane>
      </el-tabs>
      <keep-alive>
        <all
          v-if="tabFlag == 'first'"
          ref="child1"
          :courseList.sync="courseList"
          :selectCourse="selectCourse"
          @select="select"
        ></all>
        <student
          v-if="tabFlag == 'second'"
          ref="child"
          :courseList.sync="courseList"
          :selectCourse="selectCourse"
          @select="select"
        ></student>
        <teacher v-if="tabFlag == 'third'" :courseList.sync="courseList"></teacher>
      </keep-alive>
    </el-main>
  </div>
</template>
<script>
import all from "./allIndex";
import student from "./studentIndex";
import teacher from "./teacherIndex";
export default {
  components: { all, student, teacher },
  data() {
    return {
      tabFlag: "first",
      projectId: localStorage.getItem("projectId"),
      courseList: [],
      selectCourse: null
    };
  },
  methods: {
    getCourse() {
      let par = {
        projectId: this.projectId
      };
      this.$http
        .post(`/api/web/check/timetable/list`, par)
        .then(res => {
          this.courseList = res.data;
          this.selectCourse = this.courseList[0];
        })
        .catch(msg => {});
    },
    select(item) {
      this.selectCourse = item;
    }
  },
  mounted() {
    this.getCourse();
  }
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
