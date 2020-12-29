<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">课表详情</h2>
      <div class="g-box-header-back f-pointer" @click="back">返回></div>
    </el-header>
    <div class="detail-course-title">
      <div class="item-title">
        <i class="el-icon-arrow-left f-pointer" @click="back"></i>
        名家讲座：{{ detailFrom.title }}
        <span>
          {{
          ["已失效", "使用中", "旧课表", "新课表"][detailFrom.status]
          }}
        </span>
      </div>
      <div class="item-btn" v-if="detailFrom.status != 0&&detailFrom.timetablePublish!=0">
        <el-popover placement="bottom" trigger="click">
          <canvas class="clocking-qrcode" v-qrcode="attendanceUrl"></canvas>
          <span slot="reference">签到二维码</span>
        </el-popover>|
        <!-- <span>签到二维码</span> | -->
        <span
          v-clipboard:copy="attendanceUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onCopyError"
        >复制链接</span>
      </div>
    </div>
    <el-form
      :model="detailFrom"
      label-width="80px"
      label-position="right"
      class="detail-course-from"
    >
      <el-form-item label="上课日期">{{ detailFrom.date }}</el-form-item>
      <el-form-item label="上课时间">{{ detailFrom.beginTime }} ~ {{ detailFrom.endTime }}</el-form-item>
      <el-form-item label="授课教师" prop>
        {{
        detailFrom.teacherName
        }}
      </el-form-item>
      <el-form-item label="上课地点">{{ detailFrom.roomName }}</el-form-item>
      <el-form-item label="备注">{{ detailFrom.remark }}</el-form-item>
      <el-form-item label="考勤问卷">
        <a :href="`/detailIndex?id=${detailFrom.teacherCheckId}`" target="_black">
          <i class="el-icon-document"></i>
          {{ detailFrom.teacherCheckQuestion }}
        </a>
        <a :href="`/detailIndex?id=${detailFrom.userCheckId}`" target="_black">
          <i class="el-icon-document"></i>
          {{ detailFrom.userCheckQuestion }}
        </a>
      </el-form-item>
      <el-form-item label="评价问卷">
        <a :href="`/detailIndex?id=${detailFrom.teacherQuestionId}`" target="_black">
          <i class="el-icon-document"></i>
          {{ detailFrom.teacherQuestion }}
        </a>
        <a :href="`/detailIndex?id=${detailFrom.userQuestionId}`" target="_black">
          <i class="el-icon-document"></i>
          {{ detailFrom.userQuestion }}
        </a>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detailFrom: {},
      id: "",
      tabFlag: "all"
    };
  },
  computed: {
    // 签到二维码（考勤）
    attendanceUrl() {
      return `${this.$setting.h5URL}/center/clocking/${this.detailFrom.id}`;
    }
  },
  mounted() {
    console.log(this.$route);
    this.id = this.$route.query.id;
    this.getdetail();
  },
  methods: {
    back() {
      this.$router.push("/course");
    },
    handleClick() {},
    getdetail() {
      this.$http
        .post("/api/edu/timetable/getInfo", { id: this.id })
        .then(res => {
          this.detailFrom = res.data;
          this.detailFrom.date = res.data.beginTime.slice(0, 10);
          this.detailFrom.beginTime = res.data.beginTime.slice(-8);
          this.detailFrom.endTime = res.data.endTime.slice(-8);
        })
        .catch(msg => {});
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
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-course-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  .item-title {
    font-weight: 600;
    font-size: 18px;

    i {
      color: #777;
      font-weight: normal;
      border: solid 1px #777;
      padding: 2px;
      font-size: 14px;
    }
    span {
      padding: 2px 8px;
      font-size: 14px;
      border: solid 1px #777;
      color: #777;
      border-radius: 3px;
      margin-left: 20px;
    }
  }
  .item-btn {
    color: #777;
    span {
      cursor: pointer;
      margin: 0 8px;
      font-size: 14px;
      color: #ff9900;
    }
  }
}
.detail-course-from {
  a {
    margin-right: 20px;
  }
}
.clocking-qrcode {
  width: 174px;
  height: 174px;
}
</style>
