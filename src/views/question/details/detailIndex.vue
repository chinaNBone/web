<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">查看问卷</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">当前位置：首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/question' }">问卷管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看问卷</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod l-edit">
      <div class="l-mod-tool">
        <h2>查看问卷</h2>
        <div @click="toBlock()">返回 &gt;</div>
      </div>
      <div class="l-con">
        <div class="d-title">
          <h2>
            <span class="d-title-type">
              {{
              [
              "",
              "需求调研",
              "报名问卷",
              "考勤问卷",
              "教师授课问卷",
              "学员学习问卷",
              "项目综合评价问卷"
              ][info.type]
              }}
            </span>
            <span v-show="!isEsit">{{ info.title }}</span>
          </h2>
        </div>
        <div class="d-info d-detail">
          <div class="d-des">
            <span>{{ info.description }}</span>
          </div>
          <h2>问卷题目</h2>
          <ul class="d-con">
            <li v-for="(item, index) in question" :key="index" class="d-li-flex">
              <div>
                <span class="d-title-type d-title-type-color">
                  {{
                  ["", "问答题", "单选题", "多选题"][item.type]
                  }}
                </span>
                <span>{{ index + 1 }}、{{ item.title }}</span>
              </div>
              <div
                v-for="(res, i) in item.options"
                :key="i"
                v-if="res.option != ''"
                class="item-option"
              >
                <span v-if="res.option != ''">选项：{{ res.option }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      activeName: "first",
      tagsName: "1",
      formInline: {},
      id: "",
      isEsit: false,
      info: {},
      editFlagId: "",
      question: [],
      questionSet: {
        title: "",
        type: 2,
        sortId: 1,
        required: false,
        options: [
          {
            option: ""
          }
        ]
      }
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDetail();
    this.getInfo();
  },
  methods: {
    // 返回上级「
    toBlock() {
      this.$router.push({
        path: "/question"
      });
    },
    getDetail() {
      let par = {
        questionId: this.id
      };
      this.$http
        .post("/api/questionnaire/getDetails", par)
        .then(res => {
          this.question = res.data;
          for (let i = 0; i < this.question.length; i++) {
            this.question[i].options = JSON.parse(this.question[i].options);
          }
          this.questionSet.sortId = this.question.length + 1;
        })
        .catch(msg => {});
    },
    getInfo() {
      let par = {
        questionId: this.id
      };
      this.$http
        .post("/api/questionnaire/getInfo", par)
        .then(res => {
          this.info = res.data;
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss">
.d-detail {
  .d-con {
    li.d-li-flex {
      display: block !important;
      .item-option {
        padding-left: 90px;
        font-size: 14px;
        color: #777;
        line-height: 30px;
      }
    }
  }
}
</style>
