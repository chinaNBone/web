<template>
  <!--页面头部-->
  <el-col :span="24" class="g-hd g-sys-nav">
    <!-- <el-col :span="14" class="title">系统管理平台</el-col> -->
    <h2>省级中小学教师发展中心培训平台</h2>
    <el-menu
      v-if="type != 'login'"
      :default-active="pathFlag"
      class="el-menu-demo"
      mode="horizontal"
      text-color="#333"
      active-text-color="#00be6e"
      @select="pathSelect"
      router
    >
      <el-menu-item index="/" v-if="$role.isSuperAdmin()">首页</el-menu-item>
      <el-menu-item index="/project">培训项目</el-menu-item>
      <el-menu-item index="/question" v-if="$role.isSuperAdmin()"
        >问卷管理</el-menu-item
      >
      <el-menu-item index="/fieldList">资源管理</el-menu-item>
      <el-menu-item
        index="/system"
        v-if="
          $role.isSuperAdmin() || $store.state.global.role.indexOf('5') != -1
        "
        >系统管理</el-menu-item
      >
    </el-menu>

    <el-dropdown
      v-if="type != 'login'"
      class="userinfo m-menu"
      :hide-timeout="200"
    >
      <a href="javascript:;" class="m-menu-box el-dropdown-link">
        <img
          :src="
            account.avatar
              ? imgUrl + account.avatar
              : '/images/avatar_normal_200.jpg'
          "
          alt
          class="m-user-head"
        />
        <span class="m-menu-btn m-header-btn">
          {{ account ? account.userName : "" }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </a>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="openAccount()"
          >信息设置</el-dropdown-item
        >
        <el-dropdown-item @click.native="openPass()">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="loginOut()">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="账户设置"
      :visible.sync="dialogVisible1"
      width="500px"
      :before-close="closeAccount"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div class="con-account">
        <div>
          <el-form
            ref="account"
            :model="account"
            :rules="userInfo"
            label-width="120px"
            label-position="right"
          >
            <el-form-item label="头像:" prop="avatar">
              <div class="con-icon">
                <el-upload
                  class="avatar-uploader"
                  :action="saveUrl"
                  accept=".jpg, .jpeg, .png"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  style="text-align: left"
                >
                  <div v-if="account.avatar" class="image-con image-user">
                    <img :src="imgUrl + account.avatar" class="avatar" />
                    <div class="imang_hover">
                      <span>更换图片</span>
                    </div>
                  </div>
                  <div v-else class="image-icon image-user">
                    <img
                      src="/images/avatar_normal_200.jpg"
                      alt
                      class="m-user-head"
                    />
                    <div class="imang_hover">
                      <span>上传图片</span>
                    </div>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="用户名:">{{ account.userName }}</el-form-item>
            <el-form-item
              label="真实姓名:"
              prop="realName"
              style="width: 420px"
            >
              <el-input v-model.trim="account.realName"></el-input>
            </el-form-item>
            <el-form-item label="性别:" style="width: 420px" prop="gender">
              <el-radio v-model="account.gender" :label="1">男</el-radio>
              <el-radio v-model="account.gender" :label="2">女</el-radio>
            </el-form-item>
            <!-- <el-form-item label="手机号:" style="width:420px;" prop="mobile">
              <el-input v-model.trim="account.mobile"></el-input>
            </el-form-item>-->
            <el-form-item align="right" class="dialog-btns">
              <el-button @click="closeAccount">取消</el-button>
              <el-button type="primary" @click="setAccount">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="closePassword"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editPass"
        :model="editPass"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="原登录密码:" prop="password" style="width: 420px">
          <el-input
            v-model.trim="editPass.password"
            type="password"
            placeholder="请输入原登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新登录密码:" prop="newPass" style="width: 420px">
          <el-input
            type="password"
            v-model.trim="editPass.newPass"
            placeholder="请输入新密码"
            autocomplete="off"
            :maxlength="16"
            :minlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="checkPass" style="width: 420px">
          <el-input
            type="password"
            v-model.trim="editPass.checkPass"
            placeholder="请确认密码"
            autocomplete="off"
            :maxlength="16"
            :minlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closePassword">取消</el-button>
          <el-button type="primary" @click="setPassword">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Header",
  components: {},
  props: {
    type: {
      default() {
        return "home";
      },
    },
  },
  computed: {
    ...mapGetters(["getUserInfo"]),
  },
  data() {
    let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!pattern.test(value)) {
          callback(new Error("请输入6-16位且包含数字，大小写字母三种"));
        }
        if (this.editPass.checkPass !== "") {
          this.$refs.editPass.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editPass.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      dialogVisible1: false,
      dialogVisible2: false,
      pathFlag: "/",
      account: {},
      editPass: {
        password: "",
        newPass: "",
        checkPass: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        newPass: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: "请输入6-16位大小写字母加数字密码，不能用空格，区分大小写",
            trigger: "blur",
          },
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            required: true,
            message: "请确认新密码",
            trigger: "blur",
          },
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
      userInfo: {
        avatar: [
          {
            required: true,
            message: "请选择头像",
            trigger: "change",
          },
        ],
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
          },
        ],
        realName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])[0-9]{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getCurrentUser();
    // console.log("/", this.$route.meta);
    this.pathFlag = this.$utils.getMenu(this.$route, 0);
    if (this.pathFlag == "/resources") {
      this.pathFlag = "/fieldList";
    }
    // console.log("path", this.pathFlag, this.$route);
  },
  watch: {
    "$route.path"() {
      this.pathFlag = this.$utils.getMenu(this.$route, 0);
      if (this.pathFlag == "/resources") {
        this.pathFlag = "/fieldList";
      }
      // console.log("path", this.pathFlag, this.$route);
    },
  },
  methods: {
    pathSelect(key, keyPath) {
      // console.log(arguments);
      this.pathFlag = key;
    },
    handleAvatarSuccess(res, file) {
      this.account.avatar = res.data.path;
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
    //   账户设置
    openAccount() {
      this.dialogVisible1 = true;
    },
    closeAccount() {
      this.dialogVisible1 = false;
      this.getCurrentUser();
    },
    setAccount() {
      this.$refs["account"].validate((valid) => {
        if (valid) {
          let par = {
            gender: this.account.gender,
            realName: this.account.realName,
            mobile: this.account.mobile,
            avatar: this.account.avatar,
          };
          this.$http
            .post("/api/upms/user/changeInfo", par)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.closeAccount();
            })
            .catch((msg) => {});
        }
      });
    },
    // 编辑密码
    openPass(val) {
      this.dialogVisible2 = true;
    },
    closePassword() {
      this.dialogVisible2 = false;
      // this.editPass = {};
      this.$refs["editPass"].resetFields();
    },
    setPassword() {
      this.$refs["editPass"].validate((valid) => {
        if (valid) {
          let par = {
            oldPassword: this.editPass.password,
            newPassword: this.editPass.newPass,
          };
          this.$http
            .post("/api/upms/user/changePassword", par)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.closePassword();
            })
            .catch((msg) => {});
        }
      });
    },
    // 退出登录
    loginOut() {
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    getCurrentUser() {
      this.$http
        .post("/api/upms/user/getUserInfo")
        .then((data) => {
          let { msg, code, ret } = data;
          localStorage.setItem("userInfo", JSON.stringify(data.data));
          this.$store.dispatch("updateUserInfo", data.data);
          this.account = data.data;
        })
        .catch((msg) => {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        });
    },
  },
};
</script>

<style lang="scss">
.con-account {
  display: flex;
  align-items: flex-end;
  div {
    flex: 1;
  }
  .con-icon {
    max-width: 150px;
    height: 150px;
    width: 150px;
    overflow: hidden;
    border-radius: 50%;
    .el-upload {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style
>>
