<template>
  <div>
    <div class="topImg">
      <div class="name">
        <i
          class="el-icon-arrow-left"
          style="border:1px solid #ccc;padding:3px; color:#ccc;margin-right:7px;cursor:pointer"
          @click="goDetail"
        ></i>
        <img :src="imgUrl + detailFrom.avatar" alt />
        {{ detailFrom.name }}
      </div>
      <div class="next" @click="nextQuestion()">下一份</div>
    </div>
    <ul>
      <li class="list" v-for="(item, index) in list" :key="index">
        <div class="first">
          <span>{{ index + 1 }}</span>
          <div class="status">
            {{
            item.type == 1 ? "问答题" : item.type == 2 ? "单选题" : "多选题"
            }}
          </div>
          <p>{{ item.title }}</p>
        </div>
        <div v-if="item.type==1" class="type1">{{item.answer}}</div>
        <ol v-else-if="item.type==2" class="end f-clearfix">
          <li v-for="(son, index2) in item.opt" :key="index2">
            <span :style="item.answer == son.option ? style : ''">
              {{
              index2 + 1 + "." + son.option
              }}
            </span>
          </li>
        </ol>
        <ol v-else class="end f-clearfix">
          <li v-for="(son, index3) in item.opt" :key="index3">
            <span :style="son.isTrue=='1'? style : ''">
              {{
              index3 + 1 + "." + son.option
              }}
            </span>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  // props: {
  //   detailFrom: {},
  //   detailFlag: { type: Boolean },
  // },
  props: ["userId", "detailFrom", "questionId", "createby"],
  data() {
    return {
      imgUrl: this.$setting.imageUrl + "/",
      tableData: [],
      listTable: [],
      total: 0,
      list: [],
      id: "",
      style: "color:#00be6e"
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDetail();
    this.getList();
  },
  methods: {
    getList() {
      let par = {
        id: this.id,
        searchName: "",
        pageNo: 1,
        pageSize: 9999
      };
      this.$http
        .post(`/api/web/studentReport/manager/answer/page`, par)
        .then(res => {
          this.listTable = res.data.records;
          this.total = res.data.total;
        })
        .catch(msg => {});
    },
    getDetail() {
      let par = {
        questionId: this.detailFrom.questionId,
        createBy: this.detailFrom.createBy
      };
      return this.$http
        .post(`/api/web/studentReport/manager/answer`, par)
        .then(res => {
          this.list = res.data;
          this.list.forEach(item => {
            item.opt = JSON.parse(item.options);
            if (item.answer.indexOf("[") == 0) {
              item.answer2 = JSON.parse(item.answer);
            }
          });
          this.list.forEach(item => {
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
        .catch(msg => {});
    },
    goDetail() {
      this.$emit("update:detailFlag", false);
    },
    nextQuestion() {
      this.$nextTick(async () => {
        for (let i = 0; i < this.listTable.length; i++) {
          if (this.userId == this.listTable[i].id) {
            if (i + 1 == this.total) {
              this.$message({
                message: "已经是最后一份答题了",
                type: "warning"
              });
              return false;
            } else {
              this.this.userId = this.listTable[i + 1].id;
              await this.getDetail();
              return false;
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.list {
  width: 100%;
  border: 1px dashed #ccc;
  margin-top: 10px;
  .first {
    background: rgb(247, 247, 247);
    display: flex;
    height: 50px;
    align-items: center;
    padding-left: 30px;
    span {
      font-size: 18px;
    }
    .status {
      width: 42px;
      height: 20px;
      background: #fff;
      text-align: center;
      margin: 0 7px 0 12px;
      border: 1px solid rgb(188, 188, 188);
      font-size: 12px;
    }
    p {
      width: 400px;
    }
  }
  .end {
    padding: 20px 0 20px 50px;
    li {
      margin-right: 50px;
      float: left;
      line-height: 40px;
    }
  }
}
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
.type1 {
  padding: 20px 0 20px 50px;
}
</style>
