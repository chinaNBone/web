<template>
  <div class="g-lg-doc">
    <Header type="login"></Header>

    <el-col :span="24" class="g-bd login-wrapper">
      <div class="m-login-box f-center">
        <div class="m-login-banner">
          <img src="@/assets/login/left_aside.png" alt />
        </div>
        <div class="m-login-inner">
          <h2>用户登录</h2>

          <el-form
            :model="loginForm"
            :rules="rulesForm"
            ref="refForm"
            @keydown.native="onKeydown"
          >
            <el-form-item prop="account">
              <el-input
                type="text"
                autocomplete="off"
                prefix-icon="fa fa-user"
                v-model="loginForm.account"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>

            <el-form-item prop="checkPass">
              <el-input
                type="password"
                autocomplete="off"
                prefix-icon="fa fa-lock"
                v-model="loginForm.checkPass"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>

            <el-form-item prop="checkCode">
              <el-input
                type="text"
                autocomplete="off"
                v-model="loginForm.checkCode"
                style="width: 145px;"
                placeholder="请输入验证码"
              ></el-input>
              <img
                class="codeimg"
                width="130"
                height="40"
                alt
                title="换一张"
                :src="codeSrc"
                @click="getCode"
              />
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="rememberMe">下次自动登录</el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button
                :loading="logining"
                :disabled="loginBtnDisabled"
                @click="onSubmitLogin"
                @keyup.enter.native="onKeydown"
                type="primary"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Header from "./layout/Top.vue";
// import Footer from "./layout/Footer.vue";

export default {
  name: "home",
  components: {
    Header
    // Footer
  },
  data: () => {
    return {
      loginBtnDisabled: true,
      codeSrc: "",

      logining: false,
      logged: true,
      loginForm: {
        account: "",
        checkPass: "",
        checkCode: "",
        token: ""
      },
      rememberMe: true,
      rulesForm: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ],
        checkCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    onKeydown(e) {
      if (e.keyCode == 13) {
        this.onSubmitLogin();
      }
    },

    onSubmitLogin(ev) {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          this.logining = true;
          let loginParams = {
            username: this.loginForm.account,
            password: this.loginForm.checkPass,
            imageCode: this.loginForm.checkCode,
            imageToken: this.loginForm.token
          };
          this.$http
            .post("/api/upms/login", loginParams)
            .then(data => {
              this.logining = false;
              let { msg, code } = data;
              this.$store.dispatch("updateAccessToken", {
                access_token: data.data.token,
                rememberMe: this.rememberMe
              });
              this.getCurrentUser();
            })
            .catch(error => {
              this.getCode();
              this.$message({
                message: error,
                type: "warning"
              });
              this.logining = false;
            });
        } else {
          return false;
        }
      });
    },

    getCode() {
      this.$http
        .post("/api/static/getCaptcha")
        .then(res => {
          this.loginForm.token = res.data.token;
          this.codeSrc = res.data.image;
        })
        .catch(msg => {});
    },
    getCurrentUser() {
      if (!this.$store.getters.getAccessToken) {
        this.logged = false;
        return;
      }
      this.$http
        .post("/api/upms/user/getUserInfo")
        .then(data => {
          console.log(data);
          let { msg, code, ret } = data;
          this.$store.dispatch("updateUserInfo", data.data);
          this.$router.push("/");
          this.logged = true;
        })
        .catch(msg => {
          this.logged = false;
        });
    }
  },
  created() {
    this.getCode();
    // this.getCurrentUser();
  },
  watch: {
    loginForm: {
      handler(loginForm) {
        for (let key in loginForm) {
          if (loginForm[key].trim()) {
            this.loginBtnDisabled = false;
          } else {
            this.loginBtnDisabled = true;
            break;
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.login-wrapper {
  background: url(../../src/assets/login/banner.png) center top no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  //   filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='assets/login/banner.png', sizingMethod='scale');
  background-color: #f8f8f8;
  min-height: calc(100vh - 60px);
}

.m-login-box {
  top: 45%;
  width: 820px;
  display: block;
  background: #fff;
  border-radius: 12px;
  -webkit-box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.m-login-banner {
  display: block;
  float: left;
  height: 470px;
}
.m-login-inner {
  padding: 40px 60px 30px;
  display: block;
  width: 420px;
  float: left;
}

.m-login-inner h2 {
  display: block;
  text-align: left;
  font-size: 32px;
  margin-bottom: 35px;
}

.m-login-inner .el-input .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
}
.m-login-inner .codeimg {
  display: inline-block;
  height: 40px;
  margin-left: 6px;
  vertical-align: top;
  font-size: 0;
  cursor: pointer;
}

.m-login-inner .el-button {
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
}

.m-login-inner .el-input__icon {
  font-size: 16px;
}
.m-login-inner .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
</style>
