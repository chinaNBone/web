<template>
  <div>
    <div class="l-mod-tool">
      <h2>结业证书</h2>
      <div @click="toBlock()">返回 &gt;</div>
    </div>
    <div class="cert-box">
      <div class="cert-view f-fn f-clearfix">
        <!--<img src="/public/admin/images/certificate.jpg" width="100%" id="cover">-->
        <img :src="imgUrl + form.img" width="100%" height="100%" v-if="form.img != ''" />
        <div class="cert-preview">
          <div class="item-left">
            <div class="cert-title-sub">{{ form.name || "证书标题" }}</div>
            <div class="cert-title">结业证书</div>
            <div class="cert-content">广东省教育厅制</div>
            <div class="cert-content">证书编号：************</div>
          </div>
          <!-- 右边信息 -->
          <div class="item-right">
            <div class="item-text-img f-clearfix">
              <div></div>
              <p>
                ***老师 参加了由广东省教育厅 举办的 *** 项目， 其中集中学习
                ***学时 、跟岗学习***学时、其他学习***学时、总学习***学时
                ，经综合考核成绩合格，准予结业，特发此证。
              </p>
            </div>
            <div>
              <div class="item-org">
                <p>培训单位(盖章)</p>
                <p>验证单位(盖章)</p>
              </div>
              <div class="item-date">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 年 &nbsp;&nbsp;&nbsp;&nbsp;
                月&nbsp;&nbsp;&nbsp;&nbsp;日
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cert-form">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="90px"
          label-position="right"
          style="width:100%;"
        >
          <el-form-item label="证书标题:" prop="name">
            <el-input v-model.trim="form.name" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="背景图片:" prop="img">
            <el-upload
              class="avatar-uploader"
              :action="saveUrl"
              :show-file-list="false"
              accept=".jpg, .jpeg, .png, .bmp"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              style="text-align:left; width:50%"
            >
              <el-button style="width: 100%">上传图片</el-button>
            </el-upload>
            <div class="image-detail">
              <p>大小为1123 * 794px，支持jpg、jpeg、png、bmp等格式图片</p>
            </div>
          </el-form-item>
          <!-- <el-form-item label="证书编码:" prop="courseName">
            <el-input v-model.trim="form.courseName" maxlength="30"></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="学时:" prop="courseTime">
            <el-input v-model.number="form.courseTime" maxlength="4"></el-input>
          </el-form-item>-->
          <el-form-item label="培训时间:" prop="studyTime" class="item-form-date data-line">
            <el-date-picker
              v-model="form.studyTime"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <!-- <el-date-picker
              v-model="form.studyTime"
              value-format="yyyy-MM-dd"
              type="daterange"
            ></el-date-picker>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addCert(form)">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <el-row>
    <el-col :span="14"></el-col>
    <el-col :span="10"></el-col>
    </el-row>-->
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      maxSortId: 0,
      sortIdList: [],
      form: {
        id: "",
        name: "",
        img: "",
        courseTime: "",
        studyTime: [],
        startTime: "",
        endTime: "",
        projectId: localStorage.getItem("projectId"),
      },
      rules: {
        name: [
          { required: true, message: "请填写证书标题", trigger: "blur" },
          { max: 30, message: "可输入最大长度为30个字符", trigger: "blur" },
        ],
        img: [{ required: true, message: "请上传背景图片", trigger: "change" }],
        // linkUrl: [{ required: true, message: "请输入链接", trigger: "blur" }],
        // courseName: [
        //   { required: true, message: "请填写学习课程", trigger: "blur" },
        //   { max: 30, message: "可输入最大长度为30个字符", trigger: "blur" }
        // ],
        courseTime: [
          { required: true, message: "请填写学习课时", trigger: "blur" },
          { type: "number", message: "学习课时必须是数字", trigger: "blur" },
        ],
        studyTime: [
          { required: true, message: "请选择学习时间", trigger: "blur" },
        ],
      },
      certId: "",
    };
  },
  mounted() {
    if (this.$route.query) {
      this.certId = this.$route.query.id;
      this.getCert(this.certId);
    }
  },
  methods: {
    toBlock() {
      this.$router.push({
        path: "/letter",
      });
    },
    handleAvatarSuccess(res) {
      this.form.img = res.data.path;
    },
    beforeAvatarUpload(file) {
      let size = file.size / 1024 / 1024 < 10;
      if (
        file.type != "image/jpeg" &&
        file.type != "image/png" &&
        file.type != "image/bmp"
      ) {
        this.$message.error("请选择图片的格式为 jpg、jpeg、png或bmp");
        return false;
      }
      if (!size) {
        this.$message.error("上传图片大小不得超过10MB");
        return false;
      }
    },
    addCert() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let par = {
            id: this.form.id,
            courseTime: this.form.courseTime,
            img: this.form.img,
            name: this.form.name,
            projectId: this.form.projectId,
            startTime: this.form.studyTime[0],
            endTime: this.form.studyTime[1],
          };
          this.$http
            .post("/api/edu/certificate/createOrEditCertificate", par)
            .then(() => {
              if (this.certId == undefined) {
                this.$message.success("创建成功");
              } else {
                this.$message.success("修改成功");
              }
              this.$router.push("/letter");
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    getCert(id) {
      if (id == undefined) {
        return false;
      }
      this.$http
        .post("/api/edu/certificate/getInfo", {
          id: id,
        })
        .then((res) => {
          this.form = res.data;
          this.$set(this.form, "studyTime", [
            moment(res.data.startTime).format("YYYY-MM-DD HH:mm:ss"),
            moment(res.data.endTime).format("YYYY-MM-DD HH:mm:ss"),
          ]);
        })
        .catch(() => {});
    },
    cancel() {
      this.$router.push("/letter");
    },
  },
};
</script>
<style lang="scss">
.cert-view {
  height: 530px !important;
}
.data-line {
  .el-form-item__content {
    margin-left: 10px !important;
  }
}
</style>
