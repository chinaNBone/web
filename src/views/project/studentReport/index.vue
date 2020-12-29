<template>
<!-- 学员报到 -->
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员报到</h2>
    </el-header>
    <div @click="stipoffer" class="course" v-if="tableList == ''">
      <div class="stip">+</div>
      <div>点击创建学员报到</div>
    </div>
    <div v-else v-for="item in tableList" :key="item.id" class="report-box">
      <div class="item-msg">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-content">
          <p
            v-if="item.collectDateBegin != null"
            style="color:#666666;font-size:14px"
          >收集时间：{{ item.collectDateBegin }}~{{ item.collectDateEnd }}</p>
          <p v-else>收集时间：不限</p>
          <p>已报到：{{ item.reportNum || "0" }} 人</p>
          <p>未报到：{{ item.unReportNum || "0" }} 人</p>
        </div>
      </div>
      <div class="item-status">
        <div v-if="item.status == 0">待发布</div>
        <div v-if="item.status == 1">已发布</div>
        <div v-if="item.status == 2">已关闭</div>
        <!-- <div v-if="item.status == 3">收集中</div> -->
        <div v-if="item.status == 4">审核失败</div>
      </div>
      <div class="item-btn">
        <div class="updateoffer" v-if="item.status == 1">
          <el-popover placement="bottom" trigger="click">
            <canvas class="clocking-qrcode" v-qrcode="qrcodeUrl"></canvas>
            <span slot="reference" class="updateoffer">二维码</span>
          </el-popover>
        </div>
        <div
          v-if="item.status == 2 || item.status == 1"
          class
          @click="
            toDetail(
              item.id,
              item.questionId,
              item.reportNum,
              item.unReportNum,
              item.collectDateBegin,
              item.collectDateEnd
            )
          "
        >管理</div>
        <div v-if="item.status == 0 || item.status == 4" class @click="edit(item)">修改</div>
        <div v-if="item.status == 0" class @click="changeStatus(item.id)">发布</div>
        <div v-if="item.status == 1" class @click="change(item.id)">撤回</div>
        <div v-if="item.status == 1" class="color-red" @click="close(item.id)">关闭</div>
        <div v-if="item.status == 0 || item.status == 4" class="color-red" @click="del(item.id)">删除</div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      passDialogVisible: false,
      isshow: false,
      form: {
        title: ""
      },
      tableList: [],
      projectId: localStorage.getItem("projectId")
    };
  },
  computed: {
    qrcodeUrl() {
      return `${this.$setting.h5URL}/center/report/${this.tableList[0].id}?projectId=${this.projectId}&questionId=${this.tableList[0].questionId}`;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http
        .get(`/api/web/studentReport/list/${this.projectId}`)
        .then(res => {
          this.tableList = res.data;
        })
        .catch(() => {});
    },
    onCloseDialog() {
      this.passDialogVisible = false;
    },
    stipoffer() {
      this.$router.push({
        path: "/reportCreat"
      });
    },
    // 管理
    toDetail(val, questionId, reportNum, unReportNum, begDate, endDate) {
      this.$router.push({
        path: "/reportDetailIndex",
        query: {
          id: val,
          questionId: questionId,
          reportNum: reportNum,
          unReportNum: unReportNum,
          begDate: begDate,
          endDate: endDate
        }
      });
    },
    // 修改
    edit(val) {
      this.$router.push({
        path: "reportQuestion",
        query: {
          id: val.questionId,
          targetId: val.id
        }
      });
    },
    // 关闭
    close(val) {
      this.$confirm("确定要关闭吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put(`/api/web/studentReport/close/${val}`)
            .then(() => {
              this.$message({
                message: "报到已关闭",
                type: "success"
              });
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 发布
    changeStatus(val) {
      this.$http
        .put(`/api/web/studentReport/publish/${val}`)
        .then(() => {
          this.$message({
            message: "报到已发布",
            type: "success"
          });
          this.getList();
        })
        .catch(() => {});
    },
    // 撤回
    change(val) {
      this.$confirm("确定要撤回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .put(`/api/web/studentReport/returnBack/${val}`)
            .then(() => {
              this.$message({
                message: "报到已撤回",
                type: "success"
              });
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 删除
    del(val) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`/api/web/studentReport/logic/${val}`)
            .then(() => {
              this.$message({
                message: "报到已删除",
                type: "success"
              });
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    onSave() {
      this.$router.push({ name: "questionnaire" });
    },
  }
};
</script>
<style lang="scss" scoped>
.course {
  width: 70%;
  height: 260px;
  margin-left: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin-top: 30px;
  text-align: center;
  cursor: pointer;
  .stip {
    color: #00be6e;
    font-size: 100px;
  }
}
.el-dialog__wrapper {
  top: 170px;
  left: 200px;
}

.report-box {
  border: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 30px 20px;
  .item-msg,
  .item-status,
  .item-btn {
    flex: 1;
  }
  .item-msg {
    min-width: 70%;
    max-width: 70%;
    .item-title {
      font-size: 20px;
      color: #333;
      font-weight: 600;
    }
    .item-content {
      display: flex;
      padding-top: 15px;
      p {
        font-size: 14px;
        color: #777;
        margin-right: 15px;
      }
    }
  }
  .item-status {
    color: #777;
  }
  .item-btn {
    min-width: 190px;
    display: flex;
    color: #00be6e;
    div {
      font-size: 14px;
      margin-right: 15px;
      cursor: pointer;
    }
    .color-red {
      color: #ff0000;
    }
  }
}
</style>
