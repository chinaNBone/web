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
            <h2><el-checkbox v-model="checked"></el-checkbox>关于2019年第四季度全省小学骨干教师研修开班通知</h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
          <p>
            根据省教育厅《关于选派教师参加2019年第四季度全省小学骨干教师研修》文件要求，
            该项目由省教师继续教育指导中心负责统筹，由省师范学院负责具体实施工作，现定于
            11月1日组织各地市教育局推荐人选参加现场面试，最终确定50人参加培训。现将该通
            知下发给各位学员，请各位学员务必认真阅读相关事项并及时反馈。
          </p>
        </div>
        <div class="d-item-footer">
          <span><i class="el-icon-document"></i>关于2019年第四季度全省小学骨干教师研修开班通知.pdf</span>
          <span><i class="el-icon-time"></i>2019-10-25 16:37</span>
        </div>
      </div>
      <div class="d-con-item">
        <div>
          <div class="d-con-title m-flex">
            <h2><el-checkbox v-model="checked"></el-checkbox>关于2019年第四季度全省小学骨干教师研修开班通知</h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
          <p>
            根据省教育厅《关于选派教师参加2019年第四季度全省小学骨干教师研修》文件要求，
            该项目由省教师继续教育指导中心负责统筹，由省师范学院负责具体实施工作，现定于
            11月1日组织各地市教育局推荐人选参加现场面试，最终确定50人参加培训。现将该通
            知下发给各位学员，请各位学员务必认真阅读相关事项并及时反馈。
          </p>
        </div>
        <div class="d-item-footer">
          <span><i class="el-icon-document"></i>关于2019年第四季度全省小学骨干教师研修开班通知.pdf</span>
          <span><i class="el-icon-time"></i>2019-10-25 16:37</span>
        </div>
      </div>
      <div class="d-con-item">
        <div>
          <div class="d-con-title m-flex">
            <h2><el-checkbox v-model="checked"></el-checkbox>关于2019年第四季度全省小学骨干教师研修开班通知</h2>
            <div class="d-con-status"><span class="color-red">审核驳回</span><span class="color-green">审核通过</span></div>
          </div>
          <p>
            根据省教育厅《关于选派教师参加2019年第四季度全省小学骨干教师研修》文件要求，
            该项目由省教师继续教育指导中心负责统筹，由省师范学院负责具体实施工作，现定于
            11月1日组织各地市教育局推荐人选参加现场面试，最终确定50人参加培训。现将该通
            知下发给各位学员，请各位学员务必认真阅读相关事项并及时反馈。
          </p>
        </div>
        <div class="d-item-footer">
          <span><i class="el-icon-document"></i>关于2019年第四季度全省小学骨干教师研修开班通知.pdf</span>
          <span><i class="el-icon-time"></i>2019-10-25 16:37</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: "111"
    };
  },
  methods: {}
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
    margin-bottom: 20px;
    color: #333333;
    border: 1px solid rgba(228, 228, 228, 1);

    .d-con-title {
      margin-bottom: 20px;

      .d-con-status {
        span {
          margin-right: 10px;
        }
      }
    }

    &>div {
      padding: 20px;
      
      h2 {
        .el-checkbox {
          margin-right: 5px;
        }
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