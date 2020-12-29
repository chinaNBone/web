<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">编辑问卷</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">当前位置：首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/question' }">问卷管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑问卷</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod l-edit">
      <div class="l-mod-tool">
        <h2>编辑问卷</h2>
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
            <span v-show="!isEsit">
              {{ info.title }}
              <i class="el-icon-edit-outline" @click="isEsit = !isEsit"></i>
            </span>
            <el-input v-show="isEsit" v-model.trim="info.title" placeholder>
              <i
                slot="suffix"
                class="el-input__icon el-icon-edit-outline"
                @click="isEsit = !isEsit"
              ></i>
            </el-input>
          </h2>
        </div>
        <div class="d-info">
          <div class="d-des">
            <el-input type="textarea" :rows="4" v-model.trim="info.description" placeholder="请输入说明"></el-input>
          </div>
          <h2>题目设置</h2>
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
              <div class="d-con-btn">
                <i class="el-icon-edit-outline" @click="editRow(item,index)"></i>
                <i class="el-icon-delete" @click="delRow(item,index)"></i>
              </div>
            </li>
          </ul>

          <div class="d-mod">
            <div class="d-mod-q">
              <h2>
                <span>
                  1、题干内容：
                  <span class="d-title-type d-title-type-color">
                    {{
                    ["", "问答题", "单选题", "多选题"][questionSet.type]
                    }}
                  </span>
                </span>
                <el-checkbox v-model="questionSet.required">必答题</el-checkbox>
              </h2>
              <el-input v-model="questionSet.title" placeholder="请输入题目名称">
                <template slot="prepend">题目：</template>
              </el-input>
            </div>
            <!-- 单选题 -->
            <div class="d-mod-a" v-if="questionSet.type != 1">
              <h2>
                <span>2、选项</span>
              </h2>
              <div class="d-mod-a-opt" v-for="(item, index) in questionSet.options" :key="index">
                <el-input v-model.trim="item.option" placeholder="请输入题目选项">
                  <template slot="prepend">选项{{ index + 1 }}：</template>
                  <i
                    v-if="questionSet.options.length > 1"
                    slot="suffix"
                    class="el-input__icon el-icon-delete close-opt"
                    @click="delOption(index)"
                  ></i>
                </el-input>
              </div>
              <el-button type="primary" icon="el-icon-plus" @click="addOption()">添加选项</el-button>
            </div>
            <el-divider></el-divider>
            <el-button type="primary" @click="setQuestion()">保存题目</el-button>
            <el-button @click="closeQuestion()">取 消</el-button>
          </div>

          <div class="d-set">
            <div>
              <el-button class="btn-add1" icon="el-icon-plus" @click="questionSet.type = 2">单选题</el-button>
              <el-button class="btn-add1" icon="el-icon-plus" @click="questionSet.type = 3">多选题</el-button>
              <el-button class="btn-add1" icon="el-icon-plus" @click="questionSet.type = 1">问答题</el-button>
            </div>
            <div>
              <el-button type="primary" @click="edit('flag')">保 存</el-button>
              <el-button type="primary" @click="publish('publish')">保存并发布问卷</el-button>
            </div>
          </div>
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
      editIndex: null,
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
    handleClick(tab, event) {},
    // 返回上级「
    toBlock() {
      this.$router.push({
        path: "/question"
      });
    },
    // 添加选项
    addOption() {
      let item = this.questionSet.options;
      for (let i = 0; i < item.length; i++) {
        if (item[i].option == "") {
          this.$message({
            message: "请先输入答案，再进行选项添加",
            type: "warning"
          });
          return false;
        }
      }
      this.questionSet.options.push({ option: "" });
    },
    // 删除选项
    delOption(val) {
      let item = this.questionSet.options;
      for (let i = 0; i < item.length; i++) {
        if (val == i) {
          item.splice(i, 1);
        }
      }
    },
    // 添加题目
    setQuestion() {
      let arr = this.questionSet;
      // 验证题干必填
      if (arr.title == "") {
        this.$message({
          message: "请输入题目",
          type: "warning"
        });
        return false;
      }
      // 移除空选项后，验证单选与多选题选项至少添加两个
      for (let j = 0; j < arr.options.length; j++) {
        if (arr.options[j].option == "") {
          arr.options.splice(j, 1);
        }
      }
      if (arr.type != 1 && arr.options.length < 2) {
        this.$message({
          message: "单选或多选题请添加至少两个选项",
          type: "warning"
        });
        return false;
      }
      if (this.editFlagId != "") {
        let item = this.question;
        for (let i = 0; i < item.length; i++) {
          if (item[i].id == this.editFlagId) {
            item[i] = arr;
          }
        }
      } else if (this.editFlagId == "" && this.editIndex != null) {
        this.question[this.editIndex] = arr;
      } else {
        this.question.push(arr);
      }
      this.closeQuestion();
      this.$message({
        message: "题目添加成功",
        type: "success"
      });
      this.editIndex = null;
    },
    // 清空题目
    closeQuestion() {
      this.editFlagId = "";
      this.questionSet = {
        title: "",
        type: 2,
        sortId: this.question.length + 1,
        required: false,
        options: [
          {
            option: ""
          }
        ]
      };
    },
    // 删除单个题目
    delRow(val, index) {
      let item = this.question;
      if (val.id) {
        for (let i = 0; i < item.length; i++) {
          if (item[i].id == val.id) {
            item.splice(i, 1);
          }
        }
      } else {
        item.splice(index, 1);
      }
    },
    // 编辑单个题目
    editRow(val, index) {
      this.editIndex = index;
      this.editFlagId = val.id ? val.id : "";
      this.questionSet.title = val.title;
      this.questionSet.type = val.type;
      this.questionSet.sortId = val.sortId;
      this.questionSet.required = val.required;
      this.questionSet.options = val.options;
    },
    // 保存编辑
    edit(flag) {
      for (var i of this.question) {
        if (i.required) {
          i.isRequired = 0;
        } else {
          i.isRequired = 1;
        }
      }
      let par = {
        id: this.id,
        title: this.info.title,
        description: this.info.description,
        question: JSON.stringify(this.question)
      };
      return this.$http
        .post("/api/questionnaire/edit", par)
        .then(res => {
          if (flag != "publish") {
            this.$message({
              message: "保存成功",
              type: "success"
            });

            this.$router.push({
              path: "/question"
            });
          }
        })
        .catch(msg => {});
    },
    // 发布问卷
    async publish(flag) {
      await this.edit(flag);
      let par = {
        questionId: this.id
      };
      this.$http
        .post("/api/questionnaire/publish", par)
        .then(res => {
          this.$message({
            message: "发布成功",
            type: "success"
          });
          this.$router.push({
            path: "/question"
          });
        })
        .catch(msg => {});
    },
    getDetail() {
      let par = {
        questionId: this.id
      };
      this.$http
        .post("/api/questionnaire/getDetails", par)
        .then(res => {
          this.question = res.data;
          for (var i of this.question) {
            if (i.isRequired == 0) {
              i.required = true;
            } else {
              i.required = false;
            }
          }
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
<style lang="scss" scoped>
.close-opt {
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: #00be6e;
  }
}
</style>
