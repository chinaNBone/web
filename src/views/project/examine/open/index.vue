<template>
  <div>
    <div class="d-btn-examine">
      <el-button class="el-button--warning" @click="pass()">审核驳回</el-button>
      <el-button class="el-button--primary" @click="reject()">审核通过</el-button>
    </div>
    <div class="d-con" v-if="openData.length !== 0">
      <div class="d-con-item">
        <div>
          <h2>{{ openData[0].title }}</h2>
          <p>{{ openData[0].remark }}</p>
        </div>
        <div class="d-item-footer">
          <span><i class="el-icon-document"></i>{{ openData[0].fileWholeName }}</span>
          <span><i class="el-icon-time"></i>{{ openData[0].createdDt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.getList();
  },
  data() {
    return {
      openData: []
    };
  },
  methods: {
    getList() {
      let par = {
        projectId: localStorage.getItem('projectId'),
        status: '0'
      };
      this.$http
        .post('/api/resource/check/getNoticeApply', par)
        .then(res => {
          this.openData = res.data;
        })
        .catch(() => {})
    },
    pass() {
      let par = {
        status: 3
      };
      this.$http
        .post('/api/resource/check/checkForNotice', par)
        .then(res => {
          console.log(res);
        })
        .catch(() => {})
    },
    reject() {
      let par = {
        status: 4
      };
      this.$http
        .post('/api/resource/check/checkForNotice', par)
        .then(res => {
          console.log(res);
        })
        .catch(() => {})
    }
  }
};
</script>

<style lang="scss" scoped>
.d-btn-examine {
  margin-bottom: 20px;
}

.d-con {

  .d-con-item {
    border: 1px solid rgba(228, 228, 228, 1);
    color: #333333;

    div {
      padding: 20px;
      
      h2 {
        margin-bottom: 20px;
      }

      p {
        color: #666666;
      }
    }

    .d-item-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #f2f2f2;

      span {
        i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>