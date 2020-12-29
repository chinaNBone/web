<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="beforeClose"
      width="600px"
      class="menber-dialog"
      title="添加学生"
      :close-on-click-modal="false"
    >
      <div class="menber-title">学员学时需达到总学时的2/3才可发放证书</div>
      <div class="menber-box">
        <!-- 左边待选择成员 -->
        <div class="left-menber menber-content">
          <div class="select-box">
            <el-input class="select-input" v-model="searchKey" @keyup.enter="search" placeholder></el-input>
            <el-button class="select-btn" type="primary" @click="search">查询</el-button>
          </div>
          <div class="menber-list" v-loading="loading" element-loading-background="#fff">
            <ul>
              <li v-for="user in pendingList" :key="user.id" class="menber-item">
                <span class="menber-list-name">
                  <i class="el-icon-user-solid"></i>
                  <span :title="getShowTitle(user)">
                    {{
                    getShowTitle(user)
                    }}
                  </span>
                </span>
                <span>
                  <i class="el-icon-circle-plus" @click="user.selected = true"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 中间间隔符 -->
        <div class="menber-line">
          <i class="el-icon-arrow-right"></i>
        </div>
        <!-- 左边待选择成员 -->
        <div class="right-menber menber-content">
          <div class="select-box f-f-clearfix">
            <span class="select-text">以选择{{ selectList.length || 0 }}项</span>
            <el-button class="select-clear" @click="removeAll">清空</el-button>
          </div>
          <div class="menber-list">
            <ul>
              <li v-for="user in selectList" :key="user.id" class="menber-item">
                <span class="menber-list-name">
                  <i class="el-icon-user-solid"></i>
                  <span :title="getShowTitle(user)">
                    {{
                    getShowTitle(user)
                    }}
                  </span>
                </span>
                <span>
                  <i class="el-icon-error" @click="user.selected = false"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="menber-fooler">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="previewShow"
      width="940px"
      :close-on-click-modal="false"
      class="dialog-image-preview dialog-cert-preview"
    >
      <!-- dom生成base64 png图片 -->
      <div class="imageWrapper" ref="imageWrapper">
        <div class="cert-box">
          <div class="cert-view f-fn f-clearfix" element-loading-background="#fff">
            <img
              class="background-base"
              :src="imgUrl + certImg"
              width="100%"
              height="100%"
              crossorigin="anonymous"
            />
            <div class="cert-preview">
              <div class="item-left">
                <div class="cert-title-sub">{{ cert.name }}</div>
                <div class="cert-title">结业证书</div>
                <div class="cert-content">广东省教育厅制</div>
                <div class="cert-content">
                  证书编号：
                  <span style="font-weight: bold;">{{ studentMsg.number || "***************" }}</span>
                </div>
              </div>
              <!-- 右边信息 -->
              <div class="item-right">
                <div class="item-text-img f-clearfix">
                  <div>
                    <img :src="imgUrl + studentMsg.avatar" alt width="100%" height="100%" />
                  </div>
                  <p>
                    <span style="font-weight: bold;">{{ studentMsg.realName || "***" }}</span>
                    老师 参加了由广东省教育厅 举办的
                    <span
                      style="font-weight: bold;"
                    >{{ projectDetail.title || "******" }}</span>
                    项目， 其中集中学习
                    <span
                      style="font-weight: bold;"
                    >{{ studentMsg.focusCredit || "0" }}</span>
                    学时，跟岗学习
                    <span
                      style="font-weight: bold;"
                    >{{ studentMsg.followCredit || "0" }}</span>
                    学时，其他学习
                    <span
                      style="font-weight: bold;"
                    >{{ studentMsg.otherCredit || "0" }}</span>
                    学时，总学习
                    <span
                      style="font-weight: bold;"
                    >{{ studentMsg.allCredit || "0" }}</span>
                    学时，经综合考核成绩合格，准予结业，特发此证。
                  </p>
                </div>
                <div>
                  <div class="item-org">
                    <p>培训单位（盖章）</p>
                    <p>验证单位（盖章）</p>
                  </div>
                  <div class="item-date">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 年
                    &nbsp;&nbsp;&nbsp;&nbsp; 月&nbsp;&nbsp;&nbsp;&nbsp;日
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
export default {
  name: "addOffer",
  props: ["show", "cert"],
  data() {
    return {
      certImg: "",
      certDetail: {},
      imgUrl: this.$setting.imageUrl,
      visible: this.show,
      loading: true,
      saveLoading: false,
      // 查询key
      searchKey: "",
      // 查询响应key
      searchVal: "",
      userList: [],
      // 用户列表，缓存1分钟
      cacheTime: 0,
      studentList: [],
      stuName: "",
      baseImg: "",
      projectDetail: {},
      studentMsg: {},
      previewShow: false,
      id: "",
    };
  },
  watch: {
    show(v) {
      this.visible = v;
      if (v) {
        this.removeAll();
        if (this.cacheExpired()) {
          this.init();
        }
      }
    },
    visible(v) {
      this.$emit("update:show", v);
    },
  },
  computed: {
    pendingList() {
      return this.userList.filter(
        (user) =>
          !user.selected &&
          (this.searchVal != ""
            ? user.realName.indexOf(this.searchVal) > -1
            : true)
      );
    },
    selectList() {
      return this.userList.filter((user) => user.selected);
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getProject();
    this.getCert();
    // this.certImg = this.certDetail.img;
  },
  methods: {
    sum(a, b, c) {
      let sum = Number(a) + Number(b) + Number(c);
      return sum;
    },
    // 利用dom生成base64图片
    async toImage() {
      this.$emit("closeStudent ");
      await html2canvas(this.$refs.imageWrapper, {
        backgroundColor: null,
        useCORS: true, // 允许图片跨域
        taintTest: true, // 在渲染前测试图片
      })
        .then((res) => {
          let dataURL = res.toDataURL("image/png");
          this.baseImg = dataURL.replace("data:image/png;base64,", "");
        })
        .catch((msg) => {});
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
    init() {
      this.getStudentList();
    },
    cacheExpired() {
      return this.cacheTime < new Date().getTime();
    },
    refreshCache() {
      this.cacheTime = new Date().getTime() + 10 * 1000;
    },
    // 获取待发放证书学员列表
    getStudentList() {
      let par = {
        certificateId: this.id,
        projectId: localStorage.getItem("projectId"),
        name: this.stuName,
      };
      this.$http
        .post("/api/edu/certificate/studentList", par)
        .then((res) => {
          res.data.forEach((data) => {
            data.selected = false;
          });
          this.userList = res.data;
          this.loading = false;
          this.refreshCache();
        })
        .catch((msg) => {
          // this.$message.error(msg);
          this.loading = false;
        });
    },
    getShowTitle(user) {
      return user.realName + (user.mobile ? ` (${user.mobile})` : "");
    },
    search() {
      this.searchVal = this.searchKey.trim();
    },
    addUser(user) {
      user.selected = true;
    },
    removeUser(user) {
      user.selected = false;
    },
    removeAll() {
      this.userList.forEach((user) => (user.selected = false));
    },
    beforeClose() {
      this.$emit("update:show", false);
    },
    getCert() {
      this.$http
        .post("api/edu/certificate/getInfo", {
          id: this.id,
        })
        .then((res) => {
          this.certDetail = res.data;
          this.certImg = res.data.img;
          let img = document.createElement("img");
          img.crossOrigin = "*";
          img.src = this.imgUrl + res.data.img;
          img.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            this.certImg = canvas.toDataURL();
          };
        })
        .catch(() => {});
    },
    // 证书发放
    save() {
      let userJson = [];
      this.selectList.forEach((user) => {
        let item = {
          userId: user.id,
          allCredit: user.allCredit,
          focusCredit: user.focusCredit,
          followCredit: user.followCredit,
          otherCredit: user.otherCredit,
        };
        userJson.push(item);
      });
      if (userJson == "") {
        this.$message.warning("请先选择需要发放证书的学生");
        this.saveLoading = false;
        return false;
      }
      this.saveLoading = true;
      this.$http
        .post("/api/edu/certificate/releaseOffer", {
          certificateId: this.id,
          userJson: JSON.stringify(userJson),
        })
        .then(async (json) => {
          this.$message.success(`发放完成，成功 ${this.selectList.length}个`);
          this.saveLoading = false;
          this.cacheTime = 0;
          let item = json.data;
          this.baseImg = "";
          this.studentMsg = {};
          let jsonList = [];
          this.previewShow = true;
          this.$nextTick(async () => {
            for (let i = 0; i < item.length; i++) {
              // this.studentMsg = item[i];
              await this.setMsg(item[i]);
              await this.toImage();
              jsonList.push({
                offerId: this.studentMsg.offerId,
                baseImg: this.baseImg,
              });
            }
            await this.setBaseImg(jsonList);
          });
          // this.$emit("save");
        })
        .catch((msg) => {
          // this.$message.error(msg);
          this.saveLoading = false;
        });
    },
    setMsg(val) {
      let certImg = this.cert.img;
      this.certImg = certImg;
      this.studentMsg = val;
    },
    // 生成发放证书图片
    setBaseImg(val) {
      this.$message.info(`证书加载中...`);
      return this.$http
        .post("oss/oss/saveImg", {
          imgJson: JSON.stringify(val),
        })
        .then((res) => {
          this.$message.success(`证书已完成`);
          this.setimgOffer(res.data);
        })
        .catch((msg) => {});
    },
    // 生成发放证书图片
    setimgOffer(val) {
      console.log(val);
      this.$message.info(`证书加载中...`);
      return this.$http
        .post("/api/edu/certificate/imgOffer", {
          offerJson: JSON.stringify(val),
        })
        .then((res) => {
          this.$message.success(`证书已完成`);
          this.previewShow = false;
          this.$emit("save");
        })
        .catch((msg) => {});
    },
  },
};
</script>
<style lang="scss">
.menber-dialog {
  .menber-title {
    color: #ff9c06;
    margin-bottom: 15px;
    font-size: 16px;
  }
  & .menber-box {
    width: 100%;
    height: 400px !important;
    margin-bottom: 20px;
    & .menber-content {
      border: solid 1px #ccc;
      width: 260px;
      height: 400px;
      display: inline-block;
      overflow-y: hidden;
      .select-box {
        padding: 10px;
        border-bottom: solid 1px #ccc;
        .select-input,
        .select-text {
          width: 150px;
          margin-right: 15px;
        }
        .select-text {
          display: inline-block;
        }
      }
      .menber-list {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 340px;
        overflow-y: auto;
        .menber-item {
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .el-icon-user-solid {
            padding: 0 5px;
          }
          .el-icon-error,
          .el-icon-circle-plus {
            cursor: pointer;
            padding: 0 5px;
          }
          .menber-list-name {
            overflow: hidden;
          }
        }
      }
    }
    .menber-line {
      margin: 0 13px;
      display: inline-block;
      vertical-align: top;
      .el-icon-arrow-right {
        line-height: 400px;
        font-weight: bold;
      }
    }
  }
  .menber-fooler {
    text-align: right;
  }
}
// .imageWrapper {
//   // display: none;
//   // width: 0px;
//   // height: 0px;
//   position: absolute;
//   top: 0;
//   width: 940px;
//   z-index: -10;
//   opacity: 0;
// }
</style>
