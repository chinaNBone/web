<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">培训项目</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }"
            >当前位置：首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>培训项目</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod l-edit">
      <div class="l-mod-tool">
        <h2 v-if="checkTitle">{{ checkTitle }}</h2>
        <h2 v-else>创建项目</h2>
        <div @click="toBlock()">返回 &gt;</div>
      </div>
      <div class="l-con">
        <div class="d-title">
          <h2>
            <el-tooltip
              class="item"
              effect="light"
              :content="title"
              placement="top-start"
              :open-delay="800"
            >
              <div
                style="
                  color: #000;
                  width: 69%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: left;
                "
              >
                <i class="el-icon-arrow-left" @click="toBlock()"></i>
                {{ title }}
                <button
                  type="text"
                  style="
                    font-size: 10px;
                    color: #aaa;
                    border: 1px solid #999;
                    border-radius: 4px;
                  "
                >
                  {{
                    [
                      "未发布",
                      "已发布",
                      "已撤回",
                      "审核中",
                      "已审核",
                      "审核未通过",
                      "专家审核中",
                      "已关闭",
                    ][status]
                  }}
                </button>
              </div>
            </el-tooltip>
          </h2>
          <div v-if="flag">
            <div v-if="status == 3">
              <el-button type="warning" @click="checkReturn(userId)"
                >审核驳回</el-button
              >
              <el-button type="primary" @click="checkPass(userId)"
                >审核通过</el-button
              >
            </div>
          </div>
          <div v-else>
            <el-button type="primary" @click="submitted">提交审核</el-button>
          </div>
          <el-dialog
            title="项目审核"
            :visible.sync="dialogVisible2"
            width="620px"
            class="menber-dialog"
            :before-close="closeDetail2"
            :close-on-click-modal="false"
          >
            截止日期：
            <el-date-picker
              style="width: 380px"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="value1"
              placeholder="选择日期"
              :picker-options="expireTimeOption"
            ></el-date-picker>
            <p class="menber-specialist">
              选择审核专家（
              <span class="pass-msg"
                >如果选择的专家都是上一次项目已通过审核的专家，项目会直接审核通过</span
              >）
            </p>
            <div class="menber-box">
              <!-- 左边待选择成员 -->
              <div class="left-menber menber-content">
                <div class="select-box select-people">
                  <el-input
                    class="select-input"
                    v-model.trim="roleName"
                    placeholder="输入专家姓名"
                  ></el-input>
                  <el-button
                    class="select-btn"
                    type="primary"
                    @click="getAdminList"
                    >查询</el-button
                  >
                </div>
                <div class="menber-list">
                  <ul>
                    <li
                      v-for="(item, index) in adminList"
                      :key="index"
                      class="menber-item"
                    >
                      <span>
                        <i class="el-icon-user-solid"></i>
                        <span>{{ item.realName }}</span>
                      </span>
                      <span>
                        <i
                          class="el-icon-circle-plus"
                          @click="addItemAdmin(item, index)"
                        ></i>
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
                  <span class="select-text"
                    >以选择{{ roleList.length || 0 }}项</span
                  >
                  <el-button class="select-clear" @click="removeAllAdmin"
                    >清空</el-button
                  >
                </div>
                <div class="menber-list">
                  <ul>
                    <li
                      v-for="(item, index) in roleList"
                      :key="index"
                      class="menber-item"
                    >
                      <span>
                        <i class="el-icon-user-solid"></i>
                        <span>{{ item.realName }}</span>
                      </span>
                      <span>
                        <i
                          class="el-icon-error"
                          @click="removeItemAdmin(item, index)"
                        ></i>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="menber-fooler">
              <el-button @click="dialogVisible2 = false">取 消</el-button>
              <el-button
                type="primary"
                :loading="loading2"
                @click="setSpecialist"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </div>
        <div style="margin-top: 20px">
          <el-tabs v-model="proName" type="card" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="detail"></el-tab-pane>
            <el-tab-pane
              label="专家团队"
              name="expert"
              :disabled="getId ? false : true"
            ></el-tab-pane>
            <el-tab-pane
              label="管理团队"
              name="manage"
              :disabled="getId ? false : true"
            ></el-tab-pane>
            <el-tab-pane
              label="课程设置"
              name="course"
              :disabled="getId ? false : true"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <detail
            :flag="flag"
            v-show="proName == 'detail'"
            @proName="proName"
            @getRouteLeave="getRouteLeave"
            ref="detail"
          ></detail>
          <expert
            :flag="flag"
            v-show="proName == 'expert'"
            ref="expert"
            @listTable="getExpert"
          ></expert>
          <manage
            :flag="flag"
            v-show="proName == 'manage'"
            ref="manage"
            @listTable="getManage"
          ></manage>
          <course
            :flag="flag"
            v-show="proName == 'course'"
            ref="course"
            @listTable="getCourse"
          ></course>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import detail from "./projectDetail";
import expert from "./expert";
import manage from "./manage";
import course from "./course";
export default {
  components: {
    detail,
    expert,
    manage,
    course,
  },
  data() {
    return {
      value1: "",
      roleName: "",
      dialogVisible2: false,
      adminList: [],
      roleList: [],
      proName: "detail",
      title: "",
      flag: false,
      status: 0,
      checkTitle: "",
      expertList: [],
      manageList: [],
      courseList: [],
      //项目状态判断只读
      projectStatus: localStorage.getItem("projectStatus"),
      routeLeave: false,
      submitTrue: false,
      loading2: false,
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 86400000;
        },
      },
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    this.checkTitle = this.$route.query.checkTitle;
    this.flag = this.$route.query.flag;
    this.status = this.$route.query.status;
    this.userId = this.$route.query.id;
    this.getAdminList();
  },
  beforeRouteLeave(to, form, next) {
    if (this.submitTrue == false) {
      if (this.routeLeave || this.$route.query.status != undefined) {
        next();
      } else {
        this.$confirm(`项目未更改保存，是否离开?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            next();
          })
          .catch(() => {});
      }
    } else {
      next();
    }
  },
  computed: {
    getId() {
      if (this.$route.query.isClone) {
        return undefined;
      } else {
        return this.$route.query.id;
      }
    },
  },
  methods: {
    getStatus() {
      let par = {
        projectId: this.userId,
      };
      this.$http.post("/api/edu/project/getProjectInfo", par).then((res) => {
        this.status = res.data.status;
      });
    },
    //审核驳回
    checkReturn(val) {
      this.$confirm("确定要驳回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            projectId: val,
            isPass: 1,
            comment: "",
          };
          this.$http
            .post("/api/edu/checkProject/checkProject", par)
            .then((res) => {
              this.getStatus();
              this.$message.success("操作成功");
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    //审核通过
    checkPass(val) {
      this.dialogVisible2 = true;
      this.projectId = val;
    },
    closeDetail2() {
      this.dialogVisible2 = false;
    },
    //专家审核确定
    setSpecialist() {
      this.loading2 = true;
      this.userIds = "";
      for (var i of this.roleList) {
        this.userIds = i.id + "," + this.userIds;
      }
      if (this.userIds == "") {
        this.$message({
          message: "审核专家不可为空",
          type: "warning",
        });
        return;
      } else {
        let par = {
          projectId: this.projectId,
          isPass: 0,
          comment: "",
        };
        this.$http
          .post("/api/edu/checkProject/checkProject", par)
          .then((res) => {
            let pars = {
              projectId: this.projectId,
              userIds: this.userIds,
              endDt: this.value1,
            };
            this.$http
              .post("/api/edu/checkProject/distribution", pars)
              .then((res) => {
                this.loading2 = false;
                this.$message.success("操作成功");
                this.getStatus();
                this.dialogVisible2 = false;
              })
              .catch((msg) => {});
          })
          .catch((msg) => {});
      }
    },
    // 操作审核专家
    getAdminList() {
      let par = {
        name: this.roleName,
        roleId: 3,
      };
      this.$http
        .post("/api/upms/user/searchRoleUserList", par)
        .then((res) => {
          this.adminList = res.data;
        })
        .catch((msg) => {});
    },
    addItemAdmin(item, index) {
      const a = this.roleList.find((val) => {
        return val.id == item.id;
      });
      if (a == undefined) {
        this.roleList.push(item);
        this.adminList.splice(index, 1);
      } else {
        this.$message({
          message: "审核专家已存在",
          type: "warning",
        });
      }
    },
    removeItemAdmin(val, index) {
      if (this.adminList.length > 0) {
        for (let i = 0; i < this.adminList.length; i++) {
          if (this.adminList[i].id == val.id) {
            this.roleList.splice(index, 1);
            return false;
          }
        }
      }
      this.adminList.push(val);
      this.roleList.splice(index, 1);
    },
    removeAllAdmin() {
      if (this.roleList.length > 0) {
        for (let i = 0; i < this.roleList.length; i++) {
          for (let j = 0; j < this.adminList.length; j++) {
            if (this.adminList[j].id == this.roleList[i].id) {
              this.roleList.splice(i, 1);
              // break;
              if (this.roleList.length == 0) {
                return;
              }
            }
          }
          this.adminList.push(this.roleList[i]);
        }
        this.roleList = [];
      }
    },
    handleClick(tab, event) {},
    toBlock() {
      this.$router.push({
        path: "/project",
        query: {
          t: this.$route.query.pathFlag,
        },
      });
    },
    submitted() {
      this.submitTrue = true;

      if (this.expertList.length <= 0) {
        this.$message({
          message: "专家团队不可为空",
          type: "warning",
        });
        return;
      }
      if (this.manageList.length <= 0) {
        this.$message({
          message: "管理团队不可为空",
          type: "warning",
        });
        return;
      }
      if (this.courseList.length <= 0) {
        this.$message({
          message: "课程设置不可为空",
          type: "warning",
        });
        return;
      }
      let par = {
        projectId: this.$route.query.id,
      };
      this.$http
        .post("/api/edu/project/publishProject", par)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.$router.push({ path: "project" });
          }
        })
        .catch((msg) => {
          this.$message.error(res.message);
        });
    },
    getExpert(val) {
      this.expertList = val;
    },
    getManage(val) {
      this.manageList = val;
    },
    getCourse(val) {
      this.courseList = JSON.parse(JSON.stringify(val));
    },
    getRouteLeave(val) {
      this.routeLeave = val;
    },
  },
};
</script>

<style lang="scss" scoped>
//   成员维护部分样式
.menber-dialog {
  .menber-specialist {
    margin: 22px 0;
    padding-top: 22px;
    border-top: 1px solid #ccc;
  }
  & .menber-box {
    width: 100%;
    height: 400px !important;
    margin-bottom: 20px;
    & .menber-content {
      border: solid 1px #ccc;
      width: 260px;
      height: 400px;
      overflow-y: auto;
      display: inline-block;
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
.select-people {
  display: flex;
}
.pass-msg {
  color: rgb(255, 156, 6);
}
</style>
