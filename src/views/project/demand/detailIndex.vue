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
          <div class="topImg">
            <div class="name">
              <i
                class="el-icon-arrow-left"
                style="border:1px solid #ccc;padding:3px; color:#ccc;margin-right:7px;cursor:pointer"
                @click="toBlock"
              ></i>
              <img :src="imgUrl + avatar" alt />
              {{ realName }}
            </div>
            <div class="next" @click="nextQuestion()">下一份</div>
          </div>
          <ul class="d-con">
            <li v-for="(item, index) in anwerDate" :key="index" class="d-li-flex">
              <div>
                <span class="d-title-type d-title-type-color">
                  {{
                  ["", "问答题", "单选题", "多选题"][item.type]
                  }}
                </span>
                <span>{{ index + 1 }}、{{ item.detail }}</span>
              </div>
              <div v-if="item.type == '1'" style="padding-top: 15px;">{{ item.answer }}</div>
              <ul>
                <li
                  v-show="item.type == '2'"
                  v-for="(res, index1) in item.opt"
                  :key="index1"
                  class="item-option"
                >
                  <span
                    :style="{'color': res.option === item.answer ? '#00be6e': ''}"
                  >{{ index1+1 }}.{{ res.option }}</span>
                </li>
              </ul>
              <ul>
                <li
                  v-show="item.type == '3'"
                  v-for="(res, index2) in item.opt"
                  :key="index2"
                  class="item-option"
                >
                  <span
                    :style="{'color': res.isTrue == '1' ? '#00be6e': ''}"
                  >{{ index2+1 }}.{{ res.option }}</span>
                </li>
              </ul>
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
      imgUrl: this.$setting.imageUrl + "/",
      list: [],
      anwerDate: [],
      questionId: "",
      userId: "",
      avatar: "",
      realName: "",
      demandId: "",
      quesFlag: false,
      isEsit: false,
      info: {},
      editFlagId: "",
      question: [],
      pageList: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      listTable: []
    };
  },
  mounted() {
    this.questionId = this.$route.query.questionId;
    this.userId = this.$route.query.userId;
    this.avatar = this.$route.query.avatar;
    this.realName = this.$route.query.realName;
    this.getDemandDetail();
    this.getAnswerList();
    this.getInfo();
  },
  methods: {
    // 返回上级「
    toBlock() {
      this.$router.push({
        path: "/demandManage",
        query: {
          surveyId: this.$route.query.surveyId,
          tagDetail: "2"
        }
      });
    },
    getDemandDetail() {
      this.$http
        .post("/api/edu/projectQuestion/answerInfo", {
          questionId: this.questionId,
          userId: this.userId
        })
        .then(res => {
          this.anwerDate = res.data;
          this.anwerDate.forEach(item => {
            item.opt = JSON.parse(item.options);
            if (item.answer.indexOf("[") == 0) {
              item.answer2 = JSON.parse(item.answer);
            }
          });
          this.anwerDate.forEach(item => {
            if (item.answer2) {
              item.opt.forEach(item2 => {
                item.answer2.forEach(item3 => {
                  if (item2.option == item3.option) {
                    item2.isTrue = "1";
                  }
                });
              });
            }
          });
        })
        .catch(() => {});
    },
    getAnswerList() {
      let par = {
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize,
        questionId: this.questionId,
        realName: this.search
      };
      this.$http
        .post("/api/edu/projectQuestion/answerPersonalList", par)
        .then(res => {
          this.listTable = res.data;
        });
    },
    nextQuestion() {
      this.$nextTick(async () => {
        for (let i = 0; i < this.listTable.length; i++) {
          if (this.userId == this.listTable[i].userId) {
            if (i + 1 == this.listTable.length) {
              this.$message({
                message: "已经是最后一份答题了",
                type: "warning"
              });
              return false;
            } else {
              this.userId = this.listTable[i + 1].userId;
              this.userInfo = this.listTable.filter(
                item => this.userId == item.userId
              )[0];
              this.avatar = this.userInfo.avatar;
              this.realName = this.userInfo.realName;
              await this.getDemandDetail();
              return false;
            }
          }
        }
      });
    },
    getInfo() {
      let par = {
        questionId: this.questionId
      };
      this.$http
        .post("/api/questionnaire/getInfo", par)
        .then(res => {
          this.info = res.data;
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.topImg {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  .name {
    display: flex;
    align-items: center;
    img {
      margin-right: 20px;
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  }
  .next {
    width: 73px;
    height: 50px;
    color: #00be6e;
    background: rgb(242, 242, 242);
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }
}
.d-detail {
  margin-top: 15px;
  .d-con {
    li.d-li-flex {
      display: block !important;
      .item-option {
        padding: 0 30px 0 0;
        font-size: 14px;
        color: #777;
        line-height: 30px;
        display: inline;
        border: none;
      }
    }
  }
}
</style>
