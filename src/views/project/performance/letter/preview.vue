<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="beforeClose"
    width="723px"
    height="511px"
    class="dialog-image-preview"
  >
    <div class="cert-box">
      <div
        class="cert-view f-fn f-clearfix"
        v-loading="loading"
        element-loading-background="#fff"
      >
        <!--<img src="/public/admin/images/certificate.jpg" width="100%" id="cover">-->
        <img
          :src="imgUrl + cert.img"
          width="100%"
          height="100%"
          v-if="cert.img"
        />
        <div class="cert-preview">
          <div class="item-left">
            <div class="cert-title-sub">
              {{ cert.name || "" }}
            </div>
            <div class="cert-title">结业证书</div>
            <div class="cert-content">广东省教育厅制</div>
            <div class="cert-content">
              证书编号：************
            </div>
          </div>
          <!-- 右边信息 -->
          <div class="item-right">
            <div class="item-text-img f-clearfix">
              <div></div>
              <p>
                <span style="font-weight: bold;">
                  {{ projectDetail.name || "***" }}
                </span>
                老师 参加了由广东省教育厅 举办的
                <span style="font-weight: bold;">
                  {{ projectDetail.title || "******" }}
                </span>
                项目， 其中集中学习
                <span style="font-weight: bold;">
                  {{ projectDetail.focusCredit || "***" }}
                </span>
                学时，跟岗学习
                <span style="font-weight: bold;">
                  {{ projectDetail.followCredit || "***" }}
                </span>
                学时，其他学习
                <span style="font-weight: bold;">
                  {{ projectDetail.otherCredit || "***" }}
                </span>
                学时，总学习
                <span style="font-weight: bold;">
                  {{ projectDetail.allCredit || "***" }}
                </span>
                学时，经综合考核成绩合格，准予结业，特发此证。
              </p>
            </div>
            <div>
              <div class="item-org">
                <p>培训单位（盖章）</p>
                <p>验证单位（盖章）</p>
              </div>
              <div class="item-date">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp;&nbsp;&nbsp;
                月&nbsp;&nbsp;&nbsp;&nbsp;日
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["id", "show"],
  data() {
    return {
      imgUrl: this.$setting.imageUrl,
      cert: {},
      loading: true,
      visible: this.show,
      projectDetail: {},
    };
  },
  watch: {
    show(v) {
      this.visible = v;
      if (v) {
        this.cert = {};
        this.getCert();
      }
    },
    visible(v) {
      this.$emit("update:show", v);
    },
  },
  mounted() {
    this.getProject();
  },
  methods: {
    sum(a, b, c) {
      let sum = Number(a) + Number(b) + Number(c);
      return sum;
    },
    getCert() {
      this.loading = true;
      this.$http
        .post("/api/edu/certificate/getInfo", {
          id: this.id,
        })
        .then((res) => {
          this.cert = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getProject() {
      this.$http
        .post("/api/edu/project/getProjectInfo", {
          projectId: localStorage.getItem("projectId"),
        })
        .then((res) => {
          this.projectDetail = res.data;
        })
        .catch(() => {});
    },
    beforeClose() {
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss"></style>
