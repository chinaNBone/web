<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">创建评价问卷</h2>
      <div class="g-box-header-back" @click="back" style="cursor:pointer">返回></div>
    </el-header>
    <div class="student-detail">
      <div class="detail-top">
        <div class="evalute">评价问卷</div>
        <span v-show="!isEsit" style="font-size:16px">
          {{ title }}
          <i class="el-icon-edit-outline" @click="isEsit = !isEsit"></i>
        </span>
        <el-input v-show="isEsit" v-model.trim="title" placeholder style="font-size:16px">
          <i slot="suffix" class="el-input__icon el-icon-edit-outline" @click="isEsit = !isEsit"></i>
        </el-input>
        <!-- <i style="margin:0 0 0 10px;font-size:18px " class="el-icon-edit-outline"></i> -->
      </div>
    </div>
    <div class="t-line">请如实填写您对本培训的评价。</div>
    <div class="title">题目设置</div>
    <div class="div" v-for="(item,index) in list_a" :key="index">
      <div class="question">
        <span class="free">{{['','问答题','单选题','多选题'][item.type]}}</span>
        <span>{{index+1}}.</span>
        {{item.title}}
      </div>
      <div class="answer">
        <ul v-if="item.type!=1">
          <li
            v-for="(item2,index2) in item.options2"
            :key="index2"
          >{{['A','B','C','D','E','F','G','H'][(index2)]}}.{{item2.option}}</li>
        </ul>
        <div class="line"></div>
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" size="medium" style="width:80px" @click="save">保存</el-button>
      <el-button
        type="primary"
        size="medium"
        style="width:100px"
        @click="release"
        :disabled="requestId==''?true:false"
      >发布问卷</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //保存成功后返回id
      requestId: "",
      list: [],
      all_list: [],
      list_a: [],
      isEsit: false,
      title: this.$route.query.title
    };
  },
  methods: {
    //发布问卷
    release() {
      this.$http
        .put(`/api/web/evaluation/publish/${this.requestId}`)
        .then(res => {
          this.$message.success("发布成功");
          this.$router.push({ name: "evaluate" });
        })
        .catch(msg => {});
    },
    //保存问卷
    save() {
      let par = {
        questionId: this.$route.query.id,
        collectDateBegin: this.$route.query.starDate,
        collectDateEnd: this.$route.query.endDate,
        title: this.title,
        type: 2,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .post("/api/web/evaluation/save", par)
        .then(res => {
          this.$message.success("保存成功");
          this.requestId = res.data;
        })
        .catch(msg => {});
    },
    back() {
      this.$router.push({
        name: "creatFile"
      });
    },
    //获取问卷详情题目列表
    getList() {
      this.$http
        .get(`/api/web/evaluation/detail/${this.$route.query.id}`)
        .then(res => {
          this.list_a = res.data;
          for (var i of this.list_a) {
            i.options2 = JSON.parse(i.options);
          }
        })
        .catch(msg => {});
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style scoped>
.detail-top {
  display: flex;
  align-items: center;
}
.student-detail {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.evalute {
  width: 88px;
  padding: 3px 5px;
  margin: 0 10px 0 0;
  color: #00be6e;
  border: 1px solid #00be6e;
  text-align: center;
}
.t-line {
  border: 1px dashed #e6e6e6;
  background: #f4fcf8;
  height: 40px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  padding: 0 5px;
}
.title {
  font-size: 18px;
  margin: 10px 0 20px 0;
  color: #ccc;
}
li {
  list-style: none;
}
.line {
  width: 100%;
  height: 1px;
  background: #ccc;
  margin: 10px 0;
}
.footer {
  display: flex;
  justify-content: space-between;
  margin-left: 800px;
}
.div {
  margin: 6px 0px;
}
.question {
  width: 100%;
  text-align: left;
  margin: 10px 0;
}
.type {
  width: 200px;
  text-align: left;
}
.answer li {
  width: 100%;
  height: 20px;
  margin: 10px 15px;
}
.answer span {
  float: left;
}
.answer input {
  float: right;
}
.free {
  border: 1px solid #ccc;
  padding: 2px 10px;
  font-size: 12px;
  color: #ccc;
  margin: 0 8px;
}
</style>