<template>
  <div>
    <div v-if="courseList.length == 0" class="no-data">
      <img src="../../../assets/no_data.png" />
      暂无数据
    </div>
    <div v-else>
      <div class="expert-top">
        <div class="item-msg">
          <div class="expert-name">
            <span class="expert-title" style=" font-weight: 600;font-size: 18px;">
              {{
              selectCourse.title
              }}
            </span>
            <span class="conclusion">
              {{
              ["即将开始", "进行中", "已结束"][
              changeStatus(
              selectCourse.day,
              selectCourse.beginTime,
              selectCourse.endTime
              )
              ]
              }}
            </span>
          </div>
          <div class="expert-details">
            <span>{{ selectCourse.day }}</span>
            <span>({{ selectCourse.week }})</span>
            <span>{{ selectCourse.beginTime }} ~ {{ selectCourse.endTime }}</span>
            <span>{{ selectCourse.roomName }}</span>
            <span>{{ selectCourse.teacherName }}</span>
          </div>
        </div>
        <el-dropdown class="item-change" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            切换到其它课节
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="max-height:400px;overflow-y:auto;">
            <el-dropdown-item
              v-for="(item, index) in courseList"
              :key="index"
              :command="item"
            >{{ item.title }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="m-search" style="margin-top:20px;">
        <div>
          <el-button type="primary" @click="exportUser()">导出考勤数据</el-button>
          <el-popover placement="bottom" trigger="click">
            <canvas class="clocking-qrcode" v-qrcode="qrcodeUrl"></canvas>
            <span slot="reference" class="color-orange f-pointer">二维码</span>
          </el-popover>
          <span class="color-gray">|</span>
          <span
            class="color-orange f-pointer"
            v-clipboard:copy="qrcodeUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
          >复制链接</span>
        </div>
        <div>
          <el-select class="s-el-input" v-model="status" placeholder="签到状态">
            <el-option label="全部" value></el-option>
            <el-option label="未签到" :value="0"></el-option>
            <el-option label="请假" :value="1"></el-option>
            <el-option label="已签到" :value="2"></el-option>
            <el-option label="补签" :value="3"></el-option>
          </el-select>
          <el-input class="s-el-input" v-model="key" placeholder="输入用户姓名搜索"></el-input>
          <el-button type class="btn-search" @click="getList('search')">搜索</el-button>
        </div>
      </div>
      <!-- table表格 -->
      <el-table :data="listTable" border v-loading="loading">
        <el-table-column prop="checkName" label="姓名"></el-table-column>
        <el-table-column prop label="签到状态">
          <template slot-scope="scope">{{ ["未签到", "请假", "已签到", "已补签"][scope.row.status] }}</template>
        </el-table-column>
        <el-table-column label="签到时间">
          <template slot-scope="scope">{{scope.row.status==0?'':scope.row.checkDt }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <el-button
                v-if="scope.row.status == 2||scope.row.status == 3"
                type="primary"
                style="background:#fff;color:#00be6e; border:none"
                size="small"
                @click="setStatus(0, scope.row)"
              >取消签到</el-button>
              <!-- <el-button
              v-if="
                scope.row.status == 0 &&
                  changeStatus(
                    scope.row.day,
                    scope.row.beginTime,
                    scope.row.endTime
                  ) == 2
              "
              type="primary"
              style="background:#fff;color:#00be6e; border:none"
              size="small"
              @click="setStatus(2, scope.row.id)"
              >补签</el-button>-->
              <el-button
                v-if="scope.row.status == 0"
                type="primary"
                style="background:#fff;color:#00be6e; border:none"
                size="small"
                @click="setStatus(3, scope.row)"
              >补签</el-button>
              <!-- <el-button
              v-if="scope.row.status == 3"
              type="primary"
              style="background:#fff;color:#00be6e; border:none"
              size="small"
              @click="setStatus(0, scope.row.id)"
              >补签</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-pages">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next,total"
          :current-page.sync="listPage.pageNo"
          :page-size="listPage.pageSize"
          :total="listPage.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["courseList", "selectCourse"],
  data() {
    return {
      projectId: localStorage.getItem("projectId"),
      listTable: [],
      courseFlag: "",
      key: "",
      status: "",
      timeTableId: "",
      loading: false,
      indexFlag: 0,
      listPage: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      isCheck: true
    };
  },
  computed: {
    // 签到二维码（考勤）
    qrcodeUrl() {
      return `${this.$setting.h5URL}/center/clocking/${this.selectCourse.id}`;
    }
  },
  watch: {
    selectCourse() {
      this.getList();
    }
  },
  mounted() {
    // this.selectCourse = this.courseList[0];
    this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    handleCommand(command) {
      this.$emit("select", command);
      // this.$nextTick(() => {
      //   this.selectCourse = command;
      //   this.getList();
      // });
    },
    onCopy() {
      this.$notify.success({
        message: "链接复制成功",
        customClass: "notify-only-message"
      });
    },
    onCopyError() {
      this.$notify.error({
        message: "链接复制失败",
        customClass: "notify-only-message"
      });
    },
    change(val) {
      let par = {
        id: val,
        status: 3
      };
      this.$http
        .post(`/api/web/check/change/status`, par)
        .then(res => {
          this.$message({
            message: "取消签到成功",
            type: "success"
          });
          this.getList();
        })
        .catch(msg => {});
    },
    getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        projectId: this.projectId,
        status: this.status,
        keyWord: this.key,
        timeTableId: this.selectCourse.id,
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize
      };
      this.$http
        .post(`/api/web/check/usercheck/page/list`, par)
        .then(res => {
          this.loading = false;
          this.listTable = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
        })
        .catch(msg => {
          this.loading = false;
        });
    },
    // 更变签到状态
    setStatus(val, item) {
      let par = {
        projectId: this.projectId,
        courseId: this.selectCourse.id,
        userId: item.userId,
        status: val,
        id: item.id
      };
      if (this.isCheck == true) {
        this.isCheck = false;
        this.$http
          .post(`/api/web/check/change/status`, par)
          .then(res => {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList();
            this.isCheck = true;
          })
          .catch(msg => {});
      }
    },
    exportUser() {
      let par = {
        projectId: this.projectId,
        status: this.status,
        keyWord: this.key,
        timeTableId: this.selectCourse.id
      };
      this.$http
        .post("/api/web/check/usercheck/export/list", par)
        .then(res => {
          let exlList = res.data;
          let title = "学生列表签到";
          let sheet = "学生列表签到";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["学生姓名", "签到状态", "签到时间"];
            let filterVal = ["checkName", "status", "checkDt"]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch(msg => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v =>
        filterVal.map(j => {
          if (j == "status") {
            // return v[j] == 1 ? "男" : "女";
            return ["未签到", "请假", "已签到", "已补签"][v[j]];
          }
          return v[j];
        })
      );
      return arr;
    },
    // 通过课程时间展示状态
    changeStatus(day, beginTime, endTime) {
      let dateFlag = new Date().getTime();
      let dateStatus = 0;
      let str1 = (day + " " + beginTime).toString();
      str1 = str1.replace(/-/g, "/");
      let oDate1 = new Date(str1).getTime();
      let str2 = (day + " " + endTime).toString();
      str2 = str2.replace(/-/g, "/");
      let oDate2 = new Date(str2).getTime();
      if (dateFlag < oDate1) {
        dateStatus = 0;
      } else if (oDate1 < dateFlag && dateFlag < oDate2) {
        dateStatus = 1;
      } else if (oDate2 < dateFlag) {
        dateStatus = 2;
      }
      return dateStatus;
    }
  }
};
</script>
<style lang="scss" scoped>
.expert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background: #fafafa;
  border: 1px dashed #e6e6e6;
  .item-msg {
    .export-title {
      max-width: 630px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .expert-name {
      margin-bottom: 10px;
      display: flex;
      .conclusion {
        border: 1px solid #777;
        color: #777;
        padding: 3px 5px;
        font-size: 12px;
        margin-left: 20px;
      }
    }
    .expert-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #b3b1b1;
      span {
        margin-right: 15px;
      }
    }
  }
  .item-change {
    .el-dropdown-link {
      cursor: pointer;
      color: #00be6e;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}
.f-pointer {
  cursor: pointer;
  margin: 0 15px;
}
.no-data {
  width: 350px;
  height: 250px;
  margin: 60px auto;
  color: #777;
  font-size: 18px;
  text-align: center;
  img {
    height: 100%;
  }
}
</style>
