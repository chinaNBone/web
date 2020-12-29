<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员管理</h2>
      <div class="g-box-header-back btn-cursor" @click="back">返回></div>
    </el-header>
    <el-col>
      <el-container>
        <el-main style="padding:20px 0 ">
          <div class="title-line">
            <span>基本资料</span>
            <!-- <span v-if="!isShow" @click="toEdit" class="free btn-cursor">编辑</span> -->
          </div>
          <el-row>
            <el-form
              v-if="!isShow"
              label-width="100px"
              style="width: 800px;padding-left: 80px;"
              size="small"
            >
              <el-col :span="24">
                <el-form-item label="学员头像:">
                  <div class="pic-show-thumbnail square">
                    <img
                      width="80"
                      height="80"
                      :src="userForm.avatar ? imgUrl + userForm.avatar : '/images/avatar_normal_200.jpg'"
                      class="avatar"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学员姓名:">
                  {{
                  userForm.realName
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号:">
                  {{
                  userForm.mobile
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学员性别:">
                  {{
                  userForm.gender == 1 ? "男" : "女"
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职称:">{{ userForm.title }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位:">{{ userForm.unit }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职务:">
                  {{
                  userForm.position
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址:">
                  {{
                  userForm.address
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="研究领域:">
                  {{
                  userForm.major
                  }}
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <el-form
              v-if="isShow"
              ref="userForm"
              :rules="userFormRules"
              :model="userForm"
              label-width="100px"
              style="width: 800px;padding-left: 80px;"
              size="small"
            >
              <el-col :span="24">
                <el-form-item label="学员头像" prop="avatar">
                  <el-upload
                    class="avatar-uploader"
                    :action="saveUrl"
                    :show-file-list="false"
                    accept=".jpg, .jpeg, .png"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    style="text-align:left;"
                  >
                    <div v-if="userForm.avatar" class="image-con image-logo">
                      <img width="40" height="40" :src="imgUrl + userForm.avatar" class="avatar" />
                      <div class="imang_hover">
                        <span>更换图片</span>
                      </div>
                    </div>
                    <div v-else class="image-icon image-logo">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                      <div class="imang_hover">
                        <span>上传图片</span>
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学员姓名" prop="userName">
                  <el-input v-model.trim="userForm.userName" placeholder="请输入用户名" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model.trim="userForm.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="userForm.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职称" prop="title">
                  <el-input v-model.trim="userForm.title" placeholder="请输入职称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="unit">
                  <el-input v-model.trim="userForm.unit" placeholder="请输入单位"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职务" prop="position">
                  <el-input v-model.trim="userForm.position" placeholder="请输入职务"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地址" prop="address">
                  <el-input v-model.trim="userForm.address" placeholder="请输入地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="研究领域" prop="major">
                  <el-input v-model.trim="userForm.major" placeholder="请输入研究领域"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item align="left" class="dialog-btns">
                  <el-button type="primary" @click="editUser(userForm)">保存</el-button>
                  <el-button @click="handleCloseUser(userForm)">取消</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div class="line"></div>
          <div class="title-line" style="margin:0">
            <span style="margin-bottom: 10px;">相关经历</span>
          </div>
          <el-form
            v-if="showWork"
            ref="filters"
            :rules="rules"
            :model="filters"
            style="border:1px solid #ccc;background: rgb(235, 245, 241);padding:10px 5px"
            label-width="85px"
            label-position="right"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="工作日期:" prop="daterange">
                  <el-date-picker
                    v-model.trim="filters.daterange"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工作单位:" prop="department">
                  <el-input v-model.trim="filters.department" placeholder="请输入工作单位"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item prop="content" style="width:1000px;margin-left:-75px;">
              <el-input
                type="textarea"
                :rows="6"
                maxlength="200"
                placeholder="请输入相关经历"
                show-word-limit
                v-model.trim="filters.content"
              ></el-input>
            </el-form-item>

            <el-form-item align="right" class="dialog-btns" style="margin:0 5px 5px 0">
              <el-button
                type="primary"
                size="medium"
                style="width:80px"
                @click="saveTake(filters)"
              >保存</el-button>
              <el-button
                type="primary"
                size="medium"
                style="background:#fff;color:#00be6e;width:80px;"
                @click="cancelTake(filters)"
              >取消</el-button>
            </el-form-item>
          </el-form>
          <div v-for="item in userForm.experiences" :key="item.index">
            <div class="work-titile f-clearfix">
              <div class="work-time f-fl">{{ item.beginD }} ~ {{ item.endD }}</div>
              <div class="work-address f-fl">{{ item.department }}</div>
              <!-- <i class="el-icon-close f-fr" @click="delcurrent(item.id)" style="font-size: 18px;"></i> -->
            </div>
            <div class="work-content">{{ item.content }}</div>
          </div>

          <div class="line"></div>
          <div class="title-line">
            <span>奖励证明</span>
          </div>
          <el-upload
            :action="saveUrl"
            :on-preview="handlePictureCardPreview"
            :before-remove="beforeRemove"
            :on-success="handleFileSuccess"
            accept=".jpg, .jpeg, .png"
            :before-upload="beforeFileUpload"
            :file-list="fileList"
            list-type="picture-card"
            :on-remove="handleRemove"
            multiple
            class="pictureAdd"
          >
            <i
              slot="default"
              class="el-icon-plus"
              style="font-size:14px;margin:0 auto;margin-top:40%"
            >添加奖励</i>
            <div slot="file" slot-scope="{ file }">
              <img
                width="100%"
                height="100%"
                class="el-upload-list__item-thumbnail"
                :src="imgUrl + file.reward"
                alt
              />
            </div>
          </el-upload>
        </el-main>
      </el-container>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      showWork: false,
      isShow: false,
      id: "",
      userForm: {
        id: "",
        createdBy: "",
        createdDt: "",
        updatedBy: "",
        updatedDt: "",
        isDeleted: "",
        remark: "",
        status: "",
        userName: "",
        realName: "",
        password: "",
        avatar: "",
        gender: "",
        email: "",
        mobile: "",
        unit: "",
        provinceId: "",
        cityId: "",
        areaId: "",
        address: "",
        major: "",
        profession: "",
        education: "",
        position: "",
        title: "",
        experiences: [],
        rewards: [],
      },
      userFormRules: {
        avatar: [{ required: true, message: "请选择头像", trigger: "change" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        major: [{ required: true, message: "请输入职称", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
        title: [{ required: true, message: "请输入职务", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        position: [
          { required: true, message: "请输入研究领域", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
      experience: {
        id: "",
        date: "",
        induction: "",
      },
      filters: {
        userId: "",
        daterange: [],
        projectId: "",
        content: "",
        department: "",
        beginD: "",
        endD: "",
        reward: "",
      },
      rules: {
        daterange: [
          { required: true, message: "请选择工作时间", trigger: "blur" },
        ],
        department: [
          { required: true, message: "请输入单位", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入相关经历", trigger: "blur" },
        ],
      },
      fileList: [],
      dialogImageUrl: "",
    };
  },
  computed: {
    selectList() {
      return this.chooseTags.filter((item) => item.isSelect);
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getList();
    for (let item in this.$route.query) {
      this.userForm[item] = this.$route.query[item];
    }
    // console.log(this.userForm)
  },
  methods: {
    handleAvatarSuccess(res) {
      this.userForm.avatar = res.data.path;
    },
    beforeAvatarUpload(file) {
      let size = file.size / 1024 / 1024 < 1;
      if (file.type != "image/jpeg" && file.type != "image/png") {
        this.$message.error("请选择图片的格式为 jpg或png");
        return false;
      }
      if (!size) {
        this.$message.error("上传图片大小不得超过1MB");
        return false;
      }
    },
    handleCloseUser() {
      this.$refs["userForm"].resetFields();
      this.isShow = false;
    },
    editUser() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/web/userRef/edit", this.userForm)
            .then(() => {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.isShow = false;
            })
            .catch(() => {});
        }
      });
    },
    saveTake() {
      this.filters.userId = this.userForm.id;
      if (this.filters.daterange !== "" && this.filters.daterange.length > 0) {
        this.filters.beginD = this.filters.daterange[0];
        this.filters.endD = this.filters.daterange[1];
      }
      let workParams = {
        beginD: this.filters.beginD,
        content: this.filters.content,
        department: this.filters.department,
        endD: this.filters.endD,
        userId: this.filters.userId,
      };
      this.$refs["filters"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/web/userRef/editExperiences", workParams)
            .then(() => {
              this.$message({
                message: "编辑经历成功",
                type: "success",
              });
              this.userForm.experiences.push(workParams);
              this.$refs["filters"].resetFields();
              this.getList();
              this.showWork = false;
            })
            .catch(() => {});
        }
      });
    },
    cancelLecturer() {
      this.experience = {};
      this.showWork = false;
    },
    delcurrent(id) {
      let par = {
        experienceId: id,
      };
      this.$http.post("/api/web/userRef/removeExperienceById", par).then(() => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file) {
      let par = {
        removeRewardById: file.id,
      };
      this.$http.post("/api/web/userRef/removeRewardById", par).then(() => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
    },
    handleFileSuccess(res) {
      if (res.code === 0) {
        let data = res.data;
        let par = {
          reward: res.data.path,
          userId: this.userForm.id,
        };
        this.$http.post("/api/web/userRef/editReward", par).then(() => {
          this.userForm.rewards.push(data);
          this.getList();
        });
      }
    },
    handlePreview() {},
    beforeFileUpload(file) {
      let size = file.size / 1024 / 1024 <= 20;
      if (!size) {
        this.$message.error("上传文件大小不得超过20MB");
        return false;
      }
      // 截取文件名后缀
      let type1 = file.name.lastIndexOf(".");
      let type2 = file.name.length;
      let type = file.name.substring(type2, type1 + 1);
      if (type != "png" && type != "jpeg" && type != "jpg") {
        this.$message({
          message: "请选择上传格式为jpg/jpeg/png",
          type: "warning",
        });
        return false;
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    toEdit() {
      this.isShow = true;
    },
    back() {
      this.$router.push({ path: "/studentManage" });
    },
    addwork() {
      this.showWork = true;
    },
    cancelTake() {
      this.showWork = false;
      this.filters = {};
    },
    getList() {
      let param = {
        id: this.id,
      };
      this.$http
        .post("/api/web/userRef/details", param)
        .then((json) => {
          this.userForm = json.data;
          this.userForm.experiences = json.data.experiences;
          this.fileList = json.data.rewards;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.pic-show-thumbnail {
  img {
    border-radius: 50%;
  }
}
.pictureAdd {
  .el-upload {
    display: none;
  }
}
.btn-cursor {
  cursor: pointer;
}
.el-form-item__label,
.el-form-item__content {
  color: #333;
}
.el-dialog__header {
  padding: 20px;
  padding-bottom: 10px;
  text-align: left;
}
.el-upload el-upload--picture-card {
  margin: -240px 0 1000px 180px !important;
  opacity: 0;
}
.el-dialog--center .el-dialog__footer {
  text-align: right;
}
.dialog-foter {
  float: right;
}
</style>
<style lang="scss" scoped>
.user-head {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
.work-titile {
  width: 100%;
  padding: 20px 0 10px 0;
  & > div {
    margin-right: 20px;
  }
}
.work-time {
  font-size: 16px;
  font-weight: bold;
}
.editTags {
  margin-left: 15px;
  color: #409eff;
}
.dialog-footer {
  width: 200px;
  text-align: right;
}
.upload-demo {
  min-height: 100px;
}
.free {
  font-size: 14px;
  color: #00be6e;
}

.el-upload-list__item-name {
  margin: 20px 0;
}
.line {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 20px 0;
}
.title-line {
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  // align-items: center;
}
.experience {
  font-size: 20px;
  display: flex;
  align-items: center;
}
</style>
