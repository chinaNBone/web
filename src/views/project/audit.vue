<!--项目审核-->
<template>
  <div>
    <div class="m-search">
      <el-select
        v-model="list.status"
        placeholder="项目状态"
        class="s-el-input"
      >
        <el-option label="审核中" :value="3"></el-option>
        <el-option label="审核通过" :value="4"></el-option>
        <el-option label="审核未通过" :value="5"></el-option>
        <el-option label="专家审核中" :value="6"></el-option>
      </el-select>
      <div>
        <el-input
          v-model="list.search"
          placeholder="输入项目关键词搜索"
          class="search-input"
        ></el-input>
        <el-date-picker
          v-model="list.dates"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button type class="btn-search" @click="getList">搜索</el-button>
      </div>
    </div>
    <div class="m-mod" v-loading="loading">
      <ul class="d-list">
        <li v-for="(item, index) in listTable" :key="index">
          <div class="d-msg">
            <h2 id="h2">
              <div>{{ item.title }}</div>
              <span>
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
                  ][item.status]
                }}
              </span>
            </h2>
            <!-- 预留描述 -->
            <!-- <p class="d-msg-text"></p> -->
            <p>
              <span>院系负责人：{{ item.departmentPerson }}</span>
              <span>项目执行人：{{ item.executivePerson }}</span>
            </p>
          </div>
          <div class="d-start">
            <div class="d-start-msg">
              <i class="el-icon-time"></i>
              <span>{{ item.createdDt }}</span>
            </div>
            <div class="d-start-btn">
              <span
                class="color-green"
                @click="checkDetail(item.id, item.title, item.status)"
                >查看</span
              >
              <span
                class="color-red"
                v-if="item.status == 3"
                @click="checkReturn(item.id)"
                >审核驳回</span
              >
              <span
                id="span"
                v-if="item.status == 3"
                @click="checkPass(item.id)"
                >审核通过</span
              >
              <span
                id="span"
                v-if="item.status != 3"
                @click="showDetail(item.id)"
                >专家审核意见</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- <div class="m-pages">
      <el-pagination
        background
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        :page-size="pageList.pageSize"
        layout=" prev, pager, next,total"
        :total="pageList.total"
      ></el-pagination>
    </div>-->
    <Empty v-if="listTable.length == 0" msg="暂无相关项目"></Empty>
    <el-dialog
      title="项目审核"
      :visible.sync="dialogVisible2"
      width="630px"
      class="menber-dialog"
      :before-close="closeDetail2"
      :close-on-click-modal="false"
    >
      截止日期：
      <el-date-picker
        style="width: 380px"
        value-format="yyyy-MM-dd HH:mm:ss"
        v-model="value1"
        :picker-options="expireTimeOption"
        placeholder="选择日期"
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
            <el-button class="select-btn" type="primary" @click="getAdminList"
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
            <span class="select-text">以选择{{ roleList.length || 0 }}项</span>
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
        <el-button type="primary" :loading="loading2" @click="setSpecialist"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="专家审核意见"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="closeDetail"
      :close-on-click-modal="false"
    >
      <p v-if="getDetailList.length == 0">无审核</p>
      <el-collapse
        v-else
        v-model="activeName"
        v-for="(item, index) in getDetailList"
        :key="index"
      >
        <el-collapse-item
          :title="'第' + item.checkTime + '次审核'"
          :name="index + 1"
        >
          <el-collapse class="collapse" v-model="activeName2" accordion>
            <el-collapse-item
              v-for="(item2, index2) in item.list"
              :key="index2"
            >
              <template slot="title">
                <div>{{ item2.realName }}</div>
                <div
                  class="l-passNo"
                  :style="item2.isPass == 0 ? style : style2"
                >
                  {{
                    item2.isCheck == 1
                      ? "未审核"
                      : item2.isPass == 0
                      ? "审核通过"
                      : "审核不通过"
                  }}
                </div>
              </template>
              <ul class="l-score">
                <li>基本信息：{{ item2.contentScore }}分</li>
                <li>专家团队：{{ item2.teamScore }}分</li>
                <li>管理团队：{{ item2.managerScore }}分</li>
                <li>课程设置：{{ item2.courseScore }}分</li>
              </ul>
              <p class="l-msg">审核意见：{{ item2.comment }}</p>
              <div v-if="item2.signature" style="margin-top: 15px">
                专家签名：
                <img
                  :src="item2.signature ? imgUrl + item2.signature : ''"
                  width="240"
                  alt
                />
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
      <div class="l-close">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Empty from "@/components/Empty";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      imgUrl: this.$setting.imageUrl,
      init: false,
      loading: false,
      loading2: false,
      listTable: [],
      list: {
        status: "",
        search: "",
        dates: "",
      },
      pageList: {
        pageNo: 1,
        pageSize: 20,
        total: 1,
      },
      dialogVisible: false,
      dialogVisible2: false,
      style: "color:#00BE6E",
      style2: "color:#D9001B",
      value1: "",
      projectId: "",
      //-------------------
      //审核专家ids
      userIds: "",
      //专家审核列表详情
      getDetailList: [],
      // 成员维护部分
      roleId: "",
      roleName: "",
      roleList: [],
      adminList: [],
      //手风琴默认展开一栏
      activeName: "1",
      activeName2: "1",
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 86400000;
        },
      },
    };
  },
  mounted() {
    this.getList();
    this.getAdminList();
  },
  methods: {
    checkDetail(val, title, status) {
      this.$router.push({
        path: "/projectAdd",
        query: {
          id: val,
          title: title,
          status: status,
          flag: true,
          checkTitle: "查看项目",
          pathFlag: "third",
        },
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
              this.$message.success("操作成功");
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    //审核详情
    showDetail(val) {
      this.projectId = val;
      this.getDetails();
    },
    //审核通过
    checkPass(val) {
      this.dialogVisible2 = true;
      this.projectId = val;
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
                this.getList();
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
    //审核详情
    getDetails() {
      let par = {
        projectId: this.projectId,
      };
      this.$http
        .post("/api/edu/checkProject/professorComment", par)
        .then((res) => {
          this.getDetailList = res.data;
          this.dialogVisible = true;
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

    //--------------------------
    closeDetail() {
      this.dialogVisible = false;
    },
    closeDetail2() {
      this.dialogVisible2 = false;
    },
    // 获取list
    getList() {
      this.loading = true;
      let par = {
        endD: this.list.dates[1],
        keyword: this.list.search,
        startD: this.list.dates[0],
        status: this.list.status,
      };
      this.$http
        .post("/api/edu/checkProject/projectCheckList", par)
        .then((res) => {
          this.pageList.pageNo = res.data.current;
          this.pageList.total = res.data.total;
          this.listTable = res.data;
          this.loading = false;
        })
        .catch((msg) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.search-input {
  width: 165px;
}
/deep/.el-range-editor {
  width: 260px;
}
/deep/.el-dialog__body {
  padding: 30px 30px;
  .el-collapse {
    border-bottom: none;
  }
  .el-collapse-item {
    position: relative;
    .l-passNo {
      position: absolute;
      right: 30px;
      top: 0px;
    }
  }
  .collapse {
    padding: 0 20px;
  }
}
/deep/.el-collapse-item__content {
  font-size: 14px;
  padding-bottom: 0;
}
.l-score {
  overflow: hidden;
  margin-bottom: 30px;
  li {
    line-height: 34px;
    width: 50%;
    &:nth-of-type(odd) {
      float: left;
    }
    &:nth-of-type(even) {
      float: right;
    }
  }
}
.l-msg {
  line-height: 14px;
}
.l-close {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
#h2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span {
    font-size: 12px;
    color: #aaa;
  }
}
#span {
  margin-left: 22px;
}
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
