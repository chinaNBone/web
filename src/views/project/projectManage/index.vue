<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员手册</h2>
    </el-header>
    <div class="f-fl" style="margin-top:20px">
      <el-button type="primary" size="medium" @click="exportUser(2)">导入学员手册</el-button>
    </div>
    <div class="contain-center">
      <div style="height:150px;padding: 20px 20px 0 20px;">
        <div class="offer-title">
          <div class="stipOffer">关于2019年第四季度全省小学骨干教师研修开班通知</div>
          <div class="offer-right">
            <div class="updateoffer" @click="editOffer">下载</div>
            <div class="deleteoffer" @click="deleteOffer">删除</div>
          </div>
        </div>
        <div
          class="downloadoffer"
          style="cursor: pointer;"
          v-for="item in fiflest"
          :key="item.id"
          @click="download(item.id)"
        >
          <p style="color:#666666;font-size:14px">{{item.name}}</p>
        </div>
      </div>

      <div class="offer-foter">
        <div class="foter-content">
          <div>
            <i class="el-icon-time"></i>
            <!-- {{receiveStartDt | moment("YYYY-MM-DD")}} -->
          </div>
          <div>
            <i class="el-icon-view"></i> 86人
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      fiflest: ""
    };
  },
  methods: {
    openOffer() {},
    editOffer() {},
    deleteOffer() {},
    stipoffer() {
      this.showOffer = true;
    },
    exportUser(type) {
      this.uploadUrl = `${this.$setting.baseURL}/api/oss/upload/uploadXls?type=${type}`;
      this.dialogUserVisible = true;
      this.type = type;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-upload__tip {
  margin-left: 10px;
}
.offer-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stipOffer {
  color: #333333;
  font-size: 20px;
}
.downloadoffer {
  height: 40px;
}
.offer-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 10%;
}
.updateoffer {
  color: #00be6e;
}
.deleteoffer {
  color: red;
}
.contain-center {
  //   padding: 20px;
  margin-top: 80px;
  border: 1px solid #e6e6e6;
  min-height: 200px;
  .offer-foter {
    width: 100%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e6e6e6;
  }
  .foter-content {
    width: 20%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>