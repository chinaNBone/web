<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学习课表</h2>
    </el-header>
    <el-main class="g-main" style="padding:20px 0;">
      <!-- report详情组件 -->
      <course
        :detail-data="report"
        :status="status"
        :showOld="showOld"
        :loading="loading"
        @func="getMsg"
        @refresh="refresh"
        v-loading="loading"
      >
        <template v-slot:head>
          <el-row class="search-row">
            <el-alert
              title="创建和修改课程后，请提交平台管理员审核，审核完成后课程才能生效"
              type="warning"
              :closable="false"
              show-icon
              class="course-tips"
            ></el-alert>
            <div class="f-fl" v-if="!showOld">
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-plus"
                @click="addCourse()"
                v-if="showAdd"
              >添加课程</el-button>
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-upload"
                @click="importCourse()"
                v-if="showAdd"
              >导入课程</el-button>
              <el-button type="primary" size="medium" @click="downloadExl">导出课表</el-button>
              <el-button type="primary" size="medium" @click="downTable">模板下载</el-button>
              <el-button
                type="primary"
                size="medium"
                class="course-publish-button"
                :loading="publishLoading"
                @click="publish"
                v-if="showPublish"
              >发布课表</el-button>
              <el-button
                type="primary"
                size="medium"
                class="course-publish-button"
                :loading="publishLoading"
                @click="apply"
                v-if="showApply"
              >提交审核</el-button>
              <el-button
                type="primary"
                size="medium"
                class="course-publish-button"
                :loading="publishLoading"
                @click="applyRevoke"
                v-if="showApplyRevoke"
              >撤回申请</el-button>
            </div>
            <div class="f-fr">
              <!-- <el-select
                v-model="teacherId"
                size="medium"
                @change="sendTeacher"
                placeholder="选择上课教师">
                <el-option
                  v-for="item in teachers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="roomId" size="medium" placeholder="选择上课教室" @change="sendRoom">
                <el-option
                  v-for="item in rooms"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-button
                circle
                :type="oldType"
                @click="showOldHandler"
                v-if="status==2||status==3"
              >旧</el-button>
            </div>
          </el-row>
        </template>
      </course>
      <ImportCourse :show="importShow" @close="importShow = false" @complete="importComplete"></ImportCourse>
    </el-main>
  </div>
</template>
<script>
import Course from "./course.vue";
import ImportCourse from "./importCourse.vue";
import moment from "moment";
export default {
  components: {
    Course,
    ImportCourse,
  },
  data() {
    return {
      status: null,
      orgDetail: {},
      msgdata: {},
      activeTab: "all",
      courseForm: {
        teacherId: "",
        projectId: localStorage.getItem("projectId"),
        roomId: "",
        publish: 1,
      },
      tableQuery: {
        pageSize: 100,
        pageNo: 1,
      },
      report: [],
      periodTypeMap: null,
      loading: true,
      // top menu
      publishLoading: false,
      showOld: false,
      importShow: false,
    };
  },
  computed: {
    showAdd() {
      return this.status != 3 && !this.$role.isSuperAdmin();
    },
    showPublish() {
      return this.status == 3 && this.$role.isSuperAdmin();
    },
    showApply() {
      return (this.status == 0 || this.status == 2) && !this.$role.isSuperAdmin();
    },
    showApplyRevoke() {
      return this.status == 3 && !this.$role.isSuperAdmin();
    },
    oldType() {
      return this.showOld ? "success" : null;
    },
    showType() {
      return this.showOld ? 1 : 2;
    },
  },
  async created() {
    await this.getProjectStatus();
    this.getCourseList();
  },
  methods: {
    getMsg(data) {
      // console.log(data);
      this.activeTab = data.activeTab;
      this.courseForm.teacherId = data.teacherId;
      this.courseForm.roomId = data.roomId;
      this.refresh();
    },
    async refresh() {
      this.loading = true;
      await this.getProjectStatus();
      if (this.activeTab === "all") {
        this.getCourseList();
      } else if (this.activeTab === "teacher") {
        this.getTeacherList();
      } else {
        this.getPublishList();
      }
    },
    getProjectStatus() {
      return this.$http
        .post("/api/edu/timetable/getStatus", {
          projectId: this.courseForm.projectId,
        })
        .then((json) => {
          this.status = json.data;
        })
        .catch((msg) => {});
    },
    getOptionMap() {
      // this.dialogVisible = true;
      this.$http
        .post("/api/edu/project/getOptionList", {
          typeName: "courseType",
        })
        .then((res) => {
          this.periodTypeMap = {};
          res.data.forEach((el) => {
            this.periodTypeMap[el.id] = el.title;
          });
        })
        .catch((msg) => {});
    },
    getCourseList() {
      let par = {
        teacherId: this.courseForm.teacherId,
        roomId: this.courseForm.roomId,
        projectId: this.courseForm.projectId,
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
        publish: this.status == 0 ? 2 : this.showType,
      };
      this.$http
        .post("/api/edu/timetable/list", par)
        .then((data) => {
          // console.log(data);
          this.report = this.span(data.data.records, "all");
        })
        .catch((msg) => {})
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    getTeacherList() {
      let par = {
        teacherId: this.courseForm.teacherId,
        roomId: this.courseForm.roomId,
        projectId: this.courseForm.projectId,
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
        publish: this.status == 0 ? 2 : this.showType,
      };
      this.$http
        .post("/api/edu/timetable/getTeacherList", par)
        .then((data) => {
          // console.log(data);
          this.report = this.span(data.data.records, "teacher");
        })
        .catch((msg) => {})
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    getPublishList() {
      let par = {
        teacherId: this.courseForm.teacherId,
        roomId: this.courseForm.roomId,
        projectId: this.courseForm.projectId,
        pageSize: this.tableQuery.pageSize,
        pageNo: this.tableQuery.pageNo,
      };
      this.$http
        .post("/api/edu/timetable/getPublishList", par)
        .then((data) => {
          // console.log(data);
          this.report = this.span(data.data.records, "all");
        })
        .catch((msg) => {})
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        });
    },
    // 课节状态format
    courseStatus(item, now) {
      if (item.changeStatus == -1) {
        item.courseStatus = -1;
        item.courseStatusTitle = "待编辑";
      } else if (item.beginTime > now) {
        item.courseStatus = 0;
        item.courseStatusTitle = "未开始";
      } else if (item.endTime < now) {
        item.courseStatus = 2;
        item.courseStatusTitle = "已结束";
      } else {
        item.courseStatus = 1;
        item.courseStatusTitle = "进行中";
      }
    },
    // 合并方法
    span(list, type) {
      // 设置课节状态
      let now = moment().format("YYYY-MM-DD HH:mm:ss");
      list.forEach((item) => {
        this.courseStatus(item, now);
      });
      switch (type) {
        case "all":
          return this.spanAll(list);
        case "teacher":
          return this.spanTeacher(list);
        default:
          return this.spanAll(list);
      }
    },
    spanAll(list) {
      return this.spanHandler(list, (item) => moment(item.beginTime).format("YYYY-MM-DD"));
    },
    spanTeacher(list) {
      return this.spanHandler(list, (item) => item.teacherName);
    },
    spanHandler(list, cacheHandler) {
      let spanCache = {
        item: null,
        cache: null,
      };
      list.forEach((item) => {
        let cache = cacheHandler(item);
        if (!spanCache.cache || spanCache.cache != cache) {
          item.num = 1;
          spanCache = {
            item: item,
            cache: cache,
          };
        } else {
          spanCache.item.num++;
        }
      });
      return list;
    },
    // top menu
    showOldHandler() {
      this.showOld = !this.showOld;
      this.refresh();
    },
    // 添加课节
    addCourse(id) {
      this.$router.push(`/addCourse${id ? "?id=" + id : ""}`);
    },
    importCourse() {
      this.importShow = true;
    },
    importComplete(data) {
      this.refresh();
    },
    // 发布课表
    publish() {
      this.$confirm("确认发布当前课表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.publishLoading = true;
          this.$http
            .post("/api/edu/timetable/publish", {
              projectId: localStorage.getItem("projectId"),
            })
            .then((res) => {
              this.$message({
                message: "发布成功",
                type: "success",
              });
              this.refresh();
            })
            .catch((msg) => {})
            .finally(() => {
              this.publishLoading = false;
            });
        })
        .catch(() => {});
    },
    // 提交审核
    apply() {
      this.$confirm("确认提交当前课表审核申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.publishLoading = true;
          this.$http
            .post("/api/edu/timetable/apply", {
              projectId: localStorage.getItem("projectId"),
            })
            .then((res) => {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.refresh();
            })
            .catch((msg) => {})
            .finally(() => {
              this.publishLoading = false;
            });
        })
        .catch(() => {});
    },
    // 撤回审核
    applyRevoke() {
      this.$confirm("确认撤回当前课表审核申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.publishLoading = true;
          this.$http
            .post("/api/edu/timetable/applyRevoke", {
              projectId: localStorage.getItem("projectId"),
            })
            .then((res) => {
              this.$message({
                message: "撤回成功",
                type: "success",
              });
              this.refresh();
            })
            .catch((msg) => {})
            .finally(() => {
              this.publishLoading = false;
            });
        })
        .catch(() => {});
    },
    // 导出
    async downloadExl() {
      // 如果不存在选项map，则初始化
      if (!this.periodTypeMap) {
        await this.getOptionMap();
      }
      this.$http
        .post(`/api/edu/timetable/export`, {
          projectId: localStorage.getItem("projectId"),
        })
        .then((res) => {
          let exlList = res.data;
          let title = "课表数据";
          let sheet = "课表数据";
          console.log(this.periodTypeMap);

          exlList.forEach((item) => {
            item.beginTimeValue = moment(item.beginTime).format("YYYY-MM-DD HH:mm");
            item.endTimeValue = moment(item.endTime).format("YYYY-MM-DD HH:mm");
            item.periodTitle = this.periodTypeMap[item.periodType];
          });
          require.ensure([], () => {
            const { export_json_to_excel } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "培训内容",
              "开始时间",
              "结束时间",
              "场地名称",
              "教师名称",
              "学时",
              "学时类型",
            ];
            let filterVal = [
              "title",
              "beginTimeValue",
              "endTimeValue",
              "roomName",
              "teacherName",
              "period",
              "periodTitle",
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
      var arr = jsonData.map((v) => filterVal.map((j) => v[j]));
      return arr;
    },
    downTable() {
      window.location.href = this.$setting.baseURL + `/api/web/template/download/timetable`;
    },
  },
};
</script>
<style lang="scss" scoped>
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

.course-publish-button {
  background: rgb(255, 153, 0);
  border-color: rgb(255, 153, 0);
}
.course-tips {
  margin-bottom: 10px;
}
</style>