<template>
  <div>
    <div class="d-sum d-space-between">
      <div class="d-title">
        <div>
          <span class="d-title-type">
            {{
            ["", "报到问卷"][1]
            }}
          </span>
          2019年第四季度全省小学骨干教师研修报到问卷
        </div>
        <div>学员在2019.08.12于阶梯教室（十三报到），请携带好笔记本于中性笔。</div>
      </div>
      <div class="d-btn">
        <el-button type="primary" @click="reject()">审核驳回</el-button>
        <el-button type="warning" @click="pass()">审核通过</el-button>
      </div>
    </div>
    <h2 class="d-page">题目内容</h2>
    <ul class="d-con">
      <li>
        <div class="d-con-title d-border-d">
          <span class="d-title-type d-title-type-color">
            {{
            ["", "问答题", "单选题", "多选题"][1]
            }}
          </span>
          <span>1.您所在的单位名称是（请准确完整填写目前所在单位的名称）</span>
        </div>
      </li>
      <li>
        <div class="d-con-title d-border-d">
          <span class="d-title-type d-title-type-color">
            {{
            ["", "问答题", "单选题", "多选题"][1]
            }}
          </span>
          <span>2. 您的职务是？</span>
        </div>
      </li>
      <li>
        <div class="d-con-title d-border-d">
          <span class="d-title-type d-title-type-color">
            {{
            ["", "问答题", "单选题", "多选题"][1]
            }}
          </span>
          <span>3. 您在单位的工作年限是？</span>
        </div>
        <div class="d-con-select">
          <span>A.1年以下</span>
          <span>B.1-3年</span>
          <span>C.3-5年</span>
          <span>D.5年以上</span>
        </div>
      </li>
      <li>
        <div class="d-con-title d-border-d">
          <span class="d-title-type d-title-type-color">
            {{
            ["", "问答题", "单选题", "多选题"][1]
            }}
          </span>
          <span>4. 您是否对课程进行了预习</span>
        </div>
        <div class="d-con-select">
          <span>A.是</span>
          <span>B.否</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: "111",
      loading: false,
      listTable: [
        {
          resourname: "《2019年第四季度全省中小学骨干教师研修》开班典礼通讯稿",
          author: "李小华",
          time: "2019-11-02"
        },
        {
          resourname: "《2019年第四季度全省中小学骨干教师研修》开班典礼通讯稿",
          author: "李小华",
          time: "2019-11-02"
        },
        {
          resourname: "《2019年第四季度全省中小学骨干教师研修》开班典礼通讯稿",
          author: "李小华",
          time: "2019-11-02"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.d-space-between {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-bottom: 20px;

  .d-title {
    display: block;

    div {
      margin-bottom: 10px;
    }
  }
}

.d-page {
  padding: 10px 0;
  color: #bbbbbb;
}

.d-con {
  li {
    margin-bottom: 20px;
    border: 1px dashed #dddddd;
    border-radius: 5px;

    .d-con-title {
      background: #f2f2f2;
      padding: 20px;
    }

    .d-con-select {
      padding: 20px;

      span {
        display: inline-block;
        width: 150px;
      }
    }
  }
}

.d-btn-examine {
  margin-bottom: 20px;

  .d-check {
    line-height: 40px;
  }
}

.d-options {
  span {
    margin-right: 10px;
  }
}
</style>