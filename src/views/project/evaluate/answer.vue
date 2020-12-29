<template>
  <div>
    <div class="topImg">
      <div class="name">
        <i
          class="el-icon-arrow-left"
          style="border:1px solid #ccc;padding:3px; color:#ccc;margin-right:7px;cursor:pointer"
          @click="goDetail"
        ></i>
        <img :src="imgUrl+editVal.avatar" alt />
        {{editVal.name}}
      </div>
      <div class="next" @click="next">下一份</div>
    </div>
    <ul>
      <li class="list" v-for="(item,index) in list" :key="index">
        <div class="first">
          <span>{{index+1}}</span>
          <div class="status">{{item.type==1?'问答题':(item.type==2?'单选题':'多选题')}}</div>
          <p>{{item.title}}</p>
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
    <!-- <div class="m-pages">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total"
        :current-page.sync="listPage.pageNo"
        :page-size="listPage.pageSize"
        :total="listPage.total"
      ></el-pagination>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "Manage",
  components: {},
  props: { editVal: {}, answerNum: { type: Boolean }, tableList: {} },
  data() {
    return {
      tableData: [],
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1
      },
      imgUrl: this.$setting.imageUrl,
      list: [],
      style: "color:#00be6e"
    };
  },
  mounted() {
    this.getList(this.editVal.questionId, this.editVal.createBy);
  },
  methods: {
    // handleCurrentChange(val) {
    //   this.listPage.pageNo = val;
    //   this.getList();
    // },
    next() {
      for (var i = 0; i < this.tableList.length; i++) {
        if (
          this.tableList[this.tableList.length - 1].createBy ==
          this.editVal.createBy
        ) {
          this.$message({
            message: "已经是最后一份答题了",
            type: "warning"
          });
          return;
        } else if (this.tableList[i].createBy == this.editVal.createBy) {
          this.editVal = this.tableList[i + 1];
          this.getList(this.editVal.questionId, this.editVal.createBy);
          return;
        }
      }
    },
    getList(questionId, createBy) {
      this.$http
        .get(`/api/web/evaluation/answer/detail/${questionId}/${createBy}`)
        .then(res => {
          this.list = res.data;
          this.list.forEach(item => {
            item.opt = JSON.parse(item.options);
            if (item.answer != null && item.answer.indexOf("[") == 0) {
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
      this.$emit("update:answerNum", true);
    }
  }
};
</script>

<style lang="scss">
.list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  width: 940px;
  border: 1px dashed #ccc;
  background: rgb(247, 247, 247);
  margin-top: 10px;
  .first {
    margin-left: 13px;
    display: flex;
    align-items: center;
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
    display: flex;
    li {
      margin-right: 32px;
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
  padding: 20px 30px 20px 50px;
  color: #00be6e;
}
</style>