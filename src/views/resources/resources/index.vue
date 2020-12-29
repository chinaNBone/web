<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">专家列表</h2>
      <div class="g-box-header-back f-pointer" @click="back">返回></div>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding: 20px 0">
          <!-- 检索行 -->
          <el-row class="search-row">
            <div class="expert-top">
              <div>
                <div class="expert-name">{{ users.realName }}</div>
                <div class="expert-details">
                  <span>手机号：{{ users.mobile }}</span>
                  <span style="margin: 0 20px"
                    >专业：{{ users.profession }}</span
                  >
                  <span>学历：{{ users.education }}</span>
                  <span style="margin-left: 20px">职称：{{ users.title }}</span>
                </div>
              </div>
              <div
                class="expert-click"
                style="cursor: pointer"
                @click="changeNext"
              >
                切换到下一个专家
              </div>
            </div>
          </el-row>
          <div class="search-time">
            <el-date-picker
              v-model="time"
              @change="listChange"
              type="monthrange"
              value-format="yyyy-MM"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <span>合计学时：{{ periodCount }}学时</span>
          </div>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column
              label="上课日期"
              prop="classDate"
            ></el-table-column>
            <el-table-column
              label="上课时间"
              prop="beginTime"
            ></el-table-column>
            <el-table-column label="培训内容" prop="title"></el-table-column>
            <el-table-column label="上课地点" prop="place"></el-table-column>
            <el-table-column
              label="所属项目"
              prop="projectName"
            ></el-table-column>
          </el-table>

          <div class="m-pages">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              layout="prev, pager, next,total"
              :current-page.sync="pageList.pageNo"
              :page-size="pageList.pageSize"
              :total="pageList.total"
            ></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-col>
  </section>
</template>

<script>
import moment from "moment";
export default {
  name: "Manage",
  components: {},
  data() {
    return {
      tableData: [],
      pageList: {
        pageNo: 1,
        pageSize: 10,
        total: 1,
      },
      users: {},
      allUser: [],
      nextId: "",
      nextUserId: "",
      newUserId: "",
      time: [],
      periodCount: "",
    };
  },

  created() {},
  mounted() {
    this.getUserInfo(this.$route.query.userId);
    this.getList(this.$route.query.userId);
    this.getAllUser();
  },
  methods: {
    changeNext() {
      let index = "";
      let id = this.newUserId == "" ? this.$route.query.userId : this.newUserId;
      for (var i = 0; i < this.allUser.length; i++) {
        if (
          id == this.allUser[i].userId &&
          id != this.allUser[this.allUser.length - 1].userId
        ) {
          index = i;
          this.getUserInfo(this.allUser[index + 1].userId);
          this.getList(this.allUser[index + 1].teacherId);
          this.newUserId = this.allUser[index + 1].userId;
        }
        if (id == this.allUser[this.allUser.length - 1].userId) {
          this.$message({
            message: "已是最后一位专家",
            type: "warning",
          });
          return;
        }
      }
    },
    handleCurrentChange(val) {
      this.pageList.pageNo = val;
      this.getList(
        this.newUserId == "" ? this.$route.query.userId : this.newUserId
      );
    },
    getAllUser() {
      this.$http
        .get("/api/web/trainingexperts/userteacherids")
        .then((res) => {
          this.allUser = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserInfo(val) {
      this.$http
        .get(`/api/web/trainingexperts/info/${val}`)
        .then((res) => {
          this.users = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getList(val) {
      if (this.time == null) this.time = [];
      let par = {
        userId: val,
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize,
        start: this.time[0] ? this.time[0] + "-01 00:00:00" : "",
        end: this.time[1]
          ? this.time[1] +
            "-" +
            new Date(
              this.time[1].split("-")[0],
              this.time[1].split("-")[1],
              0
            ).getDate() +
            " 23:59:59"
          : "",
      };
      this.$http
        .post(`/api/web/trainingexperts/timetable/page`, par)
        .then((res) => {
          this.pageList.pageNo = res.data.pageTableData.current;
          this.pageList.total = res.data.pageTableData.total;
          this.tableData = res.data.pageTableData.records;
          this.periodCount = res.data.periodCount;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    listChange() {
      this.getList(
        this.newUserId == "" ? this.$route.query.userId : this.newUserId
      );
    },
    back() {
      this.$router.push({
        path: "/resources",
      });
    },
  },
};
</script>

<style lang="scss">
.el-dialog__header {
  padding: 20px;
  padding-bottom: 10px;
  text-align: left;
}
.expert-name {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 18px;
}
.expert-click {
  color: #00be6e;
}
.expert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  height: 80px;
  background: #f4fcf8;
  border: 1px dashed #e6e6e6;
}
.expert-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-dialog--center .el-dialog__footer {
  text-align: right;
}
.editTags {
  margin-left: 15px;
  color: #409eff;
}
.dialog-footer {
  width: 200px;
  text-align: right;
}
.el-upload-list__item-name {
  margin: 20px 0;
}
* {
  margin: 0;
  padding: 0;
}
.box {
  width: 850px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.boxHeader__li {
  width: 100px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.boxHeader__li:nth-of-type(8n + 1) {
  border-left: 1px solid #ccc;
}
.borderB {
  border-bottom: 1px solid #ccc;
}
.borderA {
  background: #e4e2e2;
}
.img {
  width: 25px;
  height: 25px;
}
li {
  list-style: none;
}
.search-time {
  margin-bottom: 10px;
}
</style>
