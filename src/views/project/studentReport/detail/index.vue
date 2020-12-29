<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员报到</h2>
      <div class="g-box-header-back" @click="back">返回 &gt;</div>
    </el-header>
    <!--  -->
    <!-- report详情组件 -->
    <div class="student-detail">
      <div class="detail-top">
        <div class="file-name">
          <span style="font-size: 17px">
            <i
              class="el-icon-arrow-left"
              style="
                border: 1px solid #ccc;
                padding: 3px;
                color: #ccc;
                margin-right: 7px;
                cursor: pointer;
              "
              @click="back"
            ></i>
            {{ projectTitle }}
          </span>
        </div>
        <div class="d-margin" style="display: flex">
          <div>
            <span>
              收集时间：
              <span v-if="begDate">
                {{ begDate | moment("YYYY-MM-DD HH:mm") }}
                至
                {{ endDate | moment("YYYY-MM-DD HH:mm") }}
              </span>
              <span v-else>不限</span>
            </span>
          </div>
          <el-popover placement="bottom" trigger="click">
            <canvas class="clocking-qrcode" v-qrcode="qrcodeUrl"></canvas>
            <span slot="reference" class="color-orange f-pointer">二维码</span>
          </el-popover>
          <span class="color-gray">|</span>
          <span
            class="color-orange f-pointer"
            v-clipboard:copy="qrcodeUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
            >复制链接</span
          >
        </div>
      </div>
      <div>
        <el-button
          @click="getPdf(projectTitle)"
          :loading="pdfLoading"
          type="warning"
          style="height: 40px"
          v-if="tabFlag == 'second'"
          >导出PDF</el-button
        >
        <el-button
          type="primary"
          size="medium"
          style="background: #fff; color: #00be6e; width: 120px; height: 40px"
          @click="close(id)"
          >关闭问卷</el-button
        >
      </div>
    </div>
    <el-tabs v-model="tabFlag" type="card">
      <el-tab-pane label="报到详情" name="first"></el-tab-pane>
      <el-tab-pane label="汇总统计" name="second"></el-tab-pane>
      <el-tab-pane label="答卷详情" name="third"></el-tab-pane>
    </el-tabs>
    <detailIndex v-if="tabFlag == 'first'" :id="id"></detailIndex>
    <dataIndex v-if="tabFlag == 'second'" :id="id"></dataIndex>
    <questionIndex v-if="tabFlag == 'third'" :id="id"></questionIndex>
  </div>
</template>
<script>
import detailIndex from "./detailIndex";
import dataIndex from "./dataIndex";
import questionIndex from "./questionIndex";
export default {
  components: { detailIndex, dataIndex, questionIndex },
  data() {
    return {
      id: this.$route.query.id,
      questionId: this.$route.query.questionId,
      tabFlag: "first",
      formDetail: [],
      projectId: localStorage.getItem("projectId"),
      projectTitle: localStorage.getItem("projectTitle"),
      begDate: "",
      endDate: "",
    };
  },
  computed: {
    qrcodeUrl() {
      return `${this.$setting.h5URL}/center/report/${this.id}?projectId=${this.projectId}&questionId=${this.questionId}`;
    },
    pdfLoading() {
      return this.$store.state.global.pdfLoading;
    },
  },
  mounted() {
    this.begDate = this.$route.query.begDate;
    this.endDate = this.$route.query.endDate;
    this.getList();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/studentReport",
      });
    },
    getList() {
      this.$http
        .get(`/api/web/studentReport/list/${this.projectId}`)
        .then((res) => {
          this.formDetail = res.data;
        })
        .catch(() => {});
    },
    // 关闭
    close(val) {
      this.$confirm("确定要关闭吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .put(`/api/web/studentReport/close/${val}`)
            .then(() => {
              this.$message({
                message: "报到已关闭",
                type: "success",
              });
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    onCopy() {
      this.$notify.success({
        message: "链接复制成功",
        customClass: "notify-only-message",
      });
    },
    onCopyError() {
      this.$notify.error({
        message: "链接复制失败",
        customClass: "notify-only-message",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.student-detail {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
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
