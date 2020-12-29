<template>
  <div>
    <div class="d-btn-examine m-flex">
      <div class="d-check">
        <el-checkbox v-model="checked">全选</el-checkbox>
      </div>
      <div class="d-btn">
        <el-button class="el-button--warning">审核驳回</el-button>
        <el-button class="el-button--primary">审核通过</el-button>
      </div>
    </div>
    <div class="d-con">
      <div class="d-con-item">
        <div>
          <div class="d-con-title m-flex">
            <h2><el-checkbox v-model="checked"></el-checkbox><span @click="view(1, true)">2019年第四季度全省小学骨干教师研修报到</span></h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
        </div>
        <div class="d-item-footer">
          <span>收集时间：2019-10-25~2019-10-31</span>
        </div>
      </div>
      <div class="d-con-item">
        <div>
          <div class="d-con-title m-flex">
            <h2><el-checkbox v-model="checked"></el-checkbox>2019年第四季度全省小学骨干教师研修报到</h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
        </div>
        <div class="d-item-footer">
          <span>收集时间：2019-10-25~2019-10-31</span>
        </div>
      </div>
      <div class="d-con-item">
        <div>
          <div class="d-con-title m-flex">
            <h2><el-checkbox v-model="checked"></el-checkbox>2019年第四季度全省小学骨干教师研修报到</h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
        </div>
        <div class="d-item-footer">
          <span>收集时间：2019-10-25~2019-10-31</span>
        </div>
      </div>
      <div class="d-con-item">
        <div>
          <div class="d-con-title m-flex">
            <h2><el-checkbox v-model="checked"></el-checkbox>2019年第四季度全省小学骨干教师研修报到</h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
        </div>
        <div class="d-item-footer">
          <span>收集时间：2019-10-25~2019-10-31</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      checked: false
    };
  },
  methods: {
    view(val) {
      this.$router.push({ name: "reportTest" });
    },
  }
};
</script>

<style lang="scss" scoped>
.d-btn-examine {
  margin-bottom: 20px;

  .d-check {
    line-height: 40px;
  }
}

.d-con {

  .d-con-item {
    padding: 20px;
    margin-bottom: 20px;
    color: #333333;
    border: 1px solid rgba(228, 228, 228, 1);

    .d-con-title {
      margin-bottom: 20px;

      h2 {
        .el-checkbox {
          margin-right: 5px;
        }
      }

      .d-con-status {
        span {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>