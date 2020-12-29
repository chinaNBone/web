<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title" @click="change">评价管理</h2>
    </el-header>
    <el-main class="g-main" style="padding: 20px 0">
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
                @click="goList"
              ></i>
              {{ formDetail.title }}
            </span>
          </div>
          <div class="d-margin" style="display: flex">
            <div>
              <span>
                收集时间：
                <span>
                  {{ formDetail.collectDateBegin | moment("YYYY-MM-DD HH:mm") }}
                  至
                  {{ formDetail.collectDateEnd | moment("YYYY-MM-DD HH:mm") }}
                </span>
                <!-- <span v-else>不限</span> -->
              </span>
            </div>
            <el-popover placement="bottom" trigger="click" v-if="status != 0">
              <canvas class="clocking-qrcode" v-qrcode="qrcodeUrl"></canvas>
              <span slot="reference" class="color-orange f-pointer"
                >二维码</span
              >
            </el-popover>
            <span class="color-gray" v-if="status != 0">|</span>
            <span
              v-if="status != 0"
              class="color-orange f-pointer"
              v-clipboard:copy="qrcodeUrl"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
              >复制链接</span
            >
          </div>
        </div>
        <el-button
          type="primary"
          size="medium"
          style="background: #fff; color: #00be6e; width: 120px; height: 40px"
          @click="colse()"
          >关闭卷</el-button
        >
      </div>
      <detail-tap :detailId="detailId" :title="formDetail.title"></detail-tap>
    </el-main>
  </div>
</template>
<script>
import DetailTap from "./detailTap.vue";
export default {
  components: {
    DetailTap,
  },
  data() {
    return {
      formDetail: {
        title: "",
        collectDateBegin: "",
        collectDateEnd: "",
      },
      detailId: this.$route.query.id,
      status: this.$route.query.status,
      projectId: localStorage.getItem("projectId"),
    };
  },
  computed: {
    qrcodeUrl() {
      return `${this.$setting.h5URL}/center/evaluate/${this.formDetail.questionId}?p=${this.projectId}`;
    },
  },
  methods: {
    change() {},
    getDetail() {
      this.$http
        .get(`/api/web/evaluation/${this.detailId}`)
        .then((res) => {
          this.formDetail = res.data;
        })
        .catch((msg) => {});
    },
    colse() {
      this.$confirm("您确定要关闭该评价吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .put(`api/web/evaluation/close/${this.detailId}`)
          .then(() => {
            this.$message.success("操作成功");
            this.getList();
          })
          .catch((msg) => {});
      });
    },
    goList() {
      this.$router.push({ name: "evaluate" });
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
  mounted() {
    this.getDetail();
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
.student-detail {
  display: flex;
  justify-content: space-between;
}
</style>