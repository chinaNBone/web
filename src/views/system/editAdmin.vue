<template>
  <div class="g-box user-edit">
    <div class="l-mod-tool">
      <h2>账号管理</h2>
      <el-button type="text" class="g-box-header-back" @click="back">返回 &gt;</el-button>
    </div>
    <el-col>
      <el-container>
        <el-main style="padding:0 ">
          <div class="title-line">
            <span>基本资料</span>
            <el-button type="text" v-if="!isShow" @click="toEdit" class="free">编辑</el-button>
          </div>
          <el-form v-if="!isShow" label-width="100px" size="small" class="userFrom">
            <el-form-item class="item-avatar" label="用户头像:">
              <div class="pic-show-thumbnail square" v-preview.sync="userForm.avatar">
                <img
                  :src="
                    userForm.avatar
                      ? imgUrl + userForm.avatar
                      : '/images/avatar_normal_200.jpg'
                  "
                  alt
                />
              </div>
            </el-form-item>
            <el-form-item label="用户名:">{{ userForm.userName }}</el-form-item>
            <el-form-item label="学历:">{{ userForm.education || "-" }}</el-form-item>
            <el-form-item label="手机号:">{{ userForm.mobile }}</el-form-item>
            <el-form-item label="专业:">{{ userForm.profession || "-" }}</el-form-item>
            <el-form-item label="姓名:">{{ userForm.realName || "-" }}</el-form-item>
            <el-form-item label="角色:">{{ userForm.roleName || "-" }}</el-form-item>
            <el-form-item label="性别:">{{ userForm.gender == 1 ? "男" : userForm.gender ==2?"女":'' }}</el-form-item>
            <el-form-item label="职称:">{{ userForm.title || "-" }}</el-form-item>
            <el-form-item label="单位:">{{ userForm.unit || "-" }}</el-form-item>
            <el-form-item label="职务:">{{ userForm.position || "-" }}</el-form-item>
            <el-form-item label="省、市、区:">{{ areaOpt || "-" }}</el-form-item>
            <el-form-item label="研究领域:">{{ userForm.major || "-" }}</el-form-item>
            <el-form-item label="详细地址:">{{ userForm.address || "-" }}</el-form-item>
          </el-form>
          <el-form
            v-if="isShow"
            ref="userForm"
            :rules="rules1"
            :model="userForm"
            label-width="100px"
            size="small"
            class="userFrom"
          >
            <el-form-item class="item-avatar" label="头像">
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
                  <img :src="imgUrl + userForm.avatar" class="avatar" />
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
            <el-form-item label="用户名:">{{ userForm.userName }}</el-form-item>
            <el-form-item label="学历:">
              <el-input v-model.trim="userForm.education" placeholder="请输入学历"></el-input>
            </el-form-item>
            <el-form-item label="手机号">{{ userForm.mobile }}</el-form-item>
            <el-form-item label="专业:">
              <el-input v-model.trim="userForm.profession" placeholder="请输入专业"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model.trim="userForm.realName" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="角色:">
              <div v-if="userForm.roleId == 1">超级管理员</div>
              <el-checkbox-group v-else v-model="roleListIds">
                <el-checkbox
                  v-for="(item, index) in roleList"
                  :key="index"
                  :label="item.code"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <!-- <el-radio-group v-else v-model="userForm.roleId">
                <el-radio label="4">学员</el-radio>
                <el-radio label="3">讲师</el-radio>
                <el-radio label="2">管理员</el-radio>
              </el-radio-group>-->
            </el-form-item>
            <el-form-item label="性别:" prop="gender ">
              <el-radio-group v-model="userForm.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="职称:">
              <el-input v-model.trim="userForm.title" placeholder="请输入职称"></el-input>
            </el-form-item>
            <el-form-item label="单位">
              <el-input v-model.trim="userForm.unit" placeholder="请输入单位"></el-input>
            </el-form-item>

            <el-form-item label="职务:">
              <el-input v-model.trim="userForm.position" placeholder="请输入职务"></el-input>
            </el-form-item>
            <el-form-item label="省、市、区:">
              <el-cascader
                v-model="areaIds"
                :options="areaOptions"
                :props="{
                  value: 'id',
                  label: 'name',
                  children: 'childrenList',
                }"
                clearable
                style="width:100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="研究领域:">
              <el-input v-model.trim="userForm.major" placeholder="请输入研究领域"></el-input>
            </el-form-item>
            <el-form-item label="详细地址:">
              <el-input v-model.trim="userForm.address" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item class="item-avatar" align="center">
              <el-button type="primary" @click="editUser(userForm)">保存</el-button>
              <el-button @click="handleCloseUser">取消</el-button>
            </el-form-item>
          </el-form>
          <div class="line"></div>
          <div class="title-line" style="margin:0">
            <span>相关经历</span>
            <el-button
              style="background:#fff;color:#00be6e;border:none"
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="addwork"
            >添加相关经历</el-button>
          </div>
          <el-form
            v-if="showWork"
            ref="filters"
            :rules="rules"
            :model="filters"
            label-width="85px"
            label-position="right"
            style="border:1px solid #ccc;background: #fafafa;padding:20px"
            class="userFrom"
          >
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

            <el-form-item label="工作单位:" prop="department">
              <el-input type="text" placeholder="请输入工作单位" v-model.trim="filters.department"></el-input>
            </el-form-item>

            <el-form-item prop="content" style="width:1000px;margin-left:-75px;">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="200"
                placeholder="请输入相关经历"
                show-word-limit
                v-model.trim="filters.content"
              ></el-input>
            </el-form-item>

            <el-form-item align="right" class="item-avatar">
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
          <div class="content-box" v-for="item in workList" :key="item.index">
            <div class="work-text">
              <div class="work-titile">
                <div class="work-time">{{ item.beginD }}~{{ item.endD }}</div>
                <div class="work-address">{{ item.department }}</div>
              </div>
              <div class="work-content">{{ item.content }}</div>
            </div>
            <div class="work-btn">
              <el-button type @click="delRowWork(item.id)">删除</el-button>
            </div>
          </div>

          <div class="line"></div>
          <div class="title-line">
            <span>奖励证明</span>
            <el-button
              style="background:#fff;color:#00be6e;border:none"
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="addreward"
            >奖励证明</el-button>
          </div>
          <el-upload
            :action="saveUrl"
            :on-success="handleFileSuccess"
            :before-upload="beforeFileUpload"
            :file-list="fileList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            multiple
            :before-remove="beforeRemove"
            class="reward-upload"
          >
            <!-- :on-remove="handleRemove" -->
            <i slot="default" class="el-icon-plus">添加奖励</i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-main>
      </el-container>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      areaOptions: [],
      areaIds: [],
      areaOpt: "",
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      showWork: false,
      isShow: false,
      id: "",
      roleList: [
        { code: "4", name: "学员" },
        { code: "3", name: "讲师" },
        { code: "2", name: "管理员" },
        { code: "11", name: "督导" },
      ],
      roleListIds: [],
      userForm: {
        userName: "",
        avatar: "",
        mobile: "",
        gender: 1,
        unit: "",
        address: "",
        title: "",
        position: "",
        major: "",
        roleId: "",
        roleName: "",
        realName: "",
        profession: "",
        education: "",
        provinceId: "",
        cityId: "",
        areaId: "",
      },
      rules1: {
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        realName: [
          {
            required: true,
            message: "请输入用户姓名",
            trigger: "blur",
          },
        ],
        // unit: [
        //   {
        //     required: true,
        //     message: "请输入单位",
        //     trigger: "blur",
        //   },
        // ],
        avatar: [{ required: true, message: "请选择头像", trigger: "change" }],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
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
        content: "",
        department: "",
        beginD: "",
        endD: "",
      },
      rules: {
        daterange: [
          { required: true, message: "请选择工作时间", trigger: "blur" },
        ],
        department: [
          { required: true, message: "请输入工作单位", trigger: "blur" },
        ],
        content: [
          {
            required: true,
            message: "请输入相关经历",
            trigger: "blur",
          },
        ],
      },
      workList: [],
      fileList: [],
      fildIdsFlag: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      valArr: [],
    };
  },
  watch: {
    $route(to, from) {
      this.id = to.query.id;
      this.getUserList();
    },
  },
  computed: {
    selectList() {
      return this.chooseTags.filter((item) => item.isSelect);
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getUserList();
  },
  methods: {
    handleAvatarSuccess(res, file) {
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
      // this.userForm = {};
      this.isShow = false;
    },
    editUser() {
      if (this.userForm.roleId != "1") {
        this.userForm.roleId = this.roleListIds.toString();
      }
      if (this.areaIds.length == 3) {
        this.userForm.provinceId = this.areaIds[0];
        this.userForm.cityId = this.areaIds[1];
        this.userForm.areaId = this.areaIds[2];
      } else {
        this.userForm.provinceId = "";
        this.userForm.cityId = "";
        this.userForm.areaId = "";
      }
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/upms/user/edit", this.userForm)
            .then((res) => {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.getUserList();
              this.isShow = false;
            })
            .catch((msg) => {});
        }
      });
    },
    saveTake() {
      this.filters.userId = this.id;
      if (
        this.filters.daterange !== null &&
        this.filters.daterange.length > 0
      ) {
        this.filters.beginD = this.filters.daterange[0];
        this.filters.endD = this.filters.daterange[1];
      }
      this.$refs["filters"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/web/userRef/editExperiences", this.filters)
            .then((res) => {
              this.$message({
                message: "编辑经历成功",
                type: "success",
              });
              this.getUserList();
              this.cancelTake(this.filters);
              this.showWork = false;
            })
            .catch((msg) => {});
        }
      });
    },
    cancelLecturer() {
      this.experience = {};
      this.showWork = false;
    },
    handleRemove(file, fileList) {
      let item = this.fildIdsFlag;
      for (let i = 0; i < item.length; i++) {
        if (file.name == item[i].fileName) {
          item.splice(i, 1);
        }
      }
    },
    handleFileSuccess(res, file) {
      let par = {
        reward: res.data.path,
        userId: this.id,
      };
      this.$http
        .post("/api/web/userRef/editReward", par)
        .then((json) => {
          this.$message({
            message: "添加奖励成功",
            type: "success",
          });
        })
        .catch((msg) => {});
    },
    handlePreview(file) {},
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
      if (
        type != "png" &&
        type != "ppt" &&
        type != "jpeg" &&
        type != "jpg" &&
        type != "doc" &&
        type != "docx" &&
        type != "pdf"
      ) {
        this.$message({
          message: "请选择上传格式为jpg/jpeg/png/pdf/ppt/doc",
          type: "warning",
        });
        return false;
      }
    },

    // handleExceed(files, fileList) {
    //   this.$message.warning(
    //     `本次选择了 ${
    //       files.length
    //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    //   );
    // },
    beforeRemove(file, fileList) {
      // this.$confirm(`是否删除该奖励证明`, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // }).then(() => {
      this.$http
        .post("/api/web/userRef/removeRewardById", {
          removeRewardById: file.fileId,
        })
        .then((json) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].fileId == file.fileId) {
              this.fileList.splice(i, 1);
            }
          }
        })
        .catch((err) => {});
      // });
    },
    delRowWork(val) {
      this.$confirm(`是否删除该相关经历`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http
          .post("/api/web/userRef/removeExperienceById", {
            experienceId: val,
          })
          .then((json) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            for (let i = 0; i < this.workList.length; i++) {
              if (this.workList[i].id == val) {
                this.workList.splice(i, 1);
              }
            }
          })
          .catch((err) => {});
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //打开添加奖励证明窗口
    addreward() {},
    //编辑奖励证明
    savePicture() {},
    //取消编辑奖励
    cancelPicture() {
      this.fildIdsFlag = [];
    },
    toEdit() {
      this.isShow = true;
    },
    back() {
      this.$parent.pathRoute("admin");
    },
    addwork() {
      this.showWork = true;
    },
    cancelTake() {
      this.showWork = false;
      this.filters = {
        userId: "",
        daterange: [],
        content: "",
        department: "",
        beginD: "",
        endD: "",
      };
    },
    getUserList() {
      if (!this.id) return false;
      let param = {
        id: this.id,
      };
      this.$http
        .post("/api/web/userRef/details", param)
        .then(async (json) => {
          this.$nextTick(async () => {
            await this.getAreaList();
            this.userForm = json.data;
            let area = [
              this.userForm.provinceId,
              this.userForm.cityId,
              this.userForm.areaId,
            ];
            // 省市区部分
            this.areaIds = area;
            if (this.userForm.areaId && this.areaOpt == "") {
              let arr = [];
              let allList = this.listArr(this.areaOptions, arr);
              this.areaOpt = this.returnName(
                allList,
                this.userForm.areaId,
                this.valArr
              )
                .reverse()
                .join("-");
            }
            // this.areaOpt =
            //   this.areaName(json.data.provinceId) ? this.areaName(json.data.provinceId) : '' +
            //   this.areaName(json.data.cityId) ? this.areaName(json.data.cityId) : '' +
            //   this.areaName(json.data.areaId) ? this.areaName(json.data.areaId): '';
            // 角色部分处理
            this.roleListIds = this.userForm.roleId.split(",");
            this.workList = json.data.experiences;
            let item = json.data.rewards;
            for (let i = 0; i < item.length; i++) {
              let filePar = {
                fileId: item[i].id,
                url: this.imgUrl + item[i].reward,
              };
              this.fileList.push(filePar);
            }
          });
        })
        .catch((err) => {});
    },
    returnName(arr, id, arr2) {
      arr.forEach((item) => {
        if (item.id == id) {
          arr2.push(item.name);
          if (item.parentId != 100000) {
            this.returnName(arr, item.parentId, arr2);
          }
        }
      });
      console.log(arr2);
      return arr2;
    },
    listArr(arr, arr2) {
      for (var v of arr) {
        arr2.push(v);
        if (Array.isArray(v.childrenList)) {
          this.listArr(v.childrenList, arr2);
        }
      }
      return arr2;
    },
    // 获取地区数据
    getAreaList() {
      let param = {
        level: 3,
      };
      return this.$http
        .post("/api/sys/area/areaTree", param)
        .then((res) => {
          this.areaOptions = this.removeChildren(res.data);
        })
        .catch((err) => {});
    },
    removeChildren(tree) {
      const newTree = tree.map((item) => {
        if (item.childrenList.length === 0) {
          delete item.childrenList;
          return item;
        } else {
          return {
            ...item,
            childrenList: this.removeChildren(item.childrenList),
          };
        }
      });
      return newTree;
    },
    areaName(val) {
      let item = this.$utils.tree.getTreeNodes(this.areaOptions);
      for (let i = 0; i < item.length; i++) {
        if (val == item[i].id) {
          return item[i].name;
        }
      }
    },
  },
};
</script>

<style lang="scss">
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
.user-head {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
.work-titile {
  width: 40%;
  padding: 20px 0 10px 0;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  .work-time {
    font-size: 16px;
    font-weight: bold;
    margin-right: 80px;
  }
}
.editTags {
  margin-left: 15px;
  color: #409eff;
}
.dialog-footer {
  width: 200px;
  text-align: right;
}
.free {
  font-size: 14px;
  color: #00be6e;
}
.el-upload-list__item-name {
  margin: 20px 0;
}
.user-edit {
  .upload-demo {
    min-height: 100px;
  }
  .line {
    width: 100%;
    height: 1px;
    background: #ccc;
    margin: 20px 0;
  }
}
.title-line {
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;
  padding: 0 20px 0 10px;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  span {
    font-weight: bold;
  }
  // align-items: center;
}
.experience {
  font-size: 20px;
  display: flex;
  align-items: center;
}
.userFrom {
  .el-form-item {
    display: inline-block;
    width: 50%;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
  .item-avatar {
    width: 100%;
    display: block;
  }
}
.content-box {
  padding: 0 20px 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .work-text {
    flex: 1;
  }
  .work-btn {
    text-align: right;
    flex: 1;
    max-width: 100px;
    min-width: 100px;
  }
}
.reward-upload {
  display: block;
  .el-upload {
    // display: inline-block;
    height: 40px;
    border: solid 1px #00be6e;
    align-items: center;
    line-height: 40px;
    text-align: center;
    i {
      flex: 1;
      color: #00be6e;
      font-size: 14px;
    }
  }
}
.g-box-header-back:hover {
  color: #00be6e !important;
}
</style>
