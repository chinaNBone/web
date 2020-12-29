<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">创建评价问卷</h2>
      <div class="g-box-header-back" @click="back" style="cursor:pointer">返回></div>
    </el-header>
    <div style="margin-top:30px">
      <el-form
        :model="addForm"
        status-icon
        :rules="rules"
        ref="addForm"
        label-width="100px"
        style="width:550px"
        class="demo-ruleForm"
      >
        <el-form-item label="问卷标题" prop="title">
          <el-input v-model.trim="addForm.title" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item v-if="questionFlag" label="关联问卷" prop="questionId">
          <span>{{ addForm.questionName }}</span>
        </el-form-item>
        <el-form-item v-else label="关联问卷:" :prop="questId==''?'questionId':''" style="width:500px;">
          <el-button
            @click="tunQuestion"
            v-if="questionList.length==0"
            style="background:#fff;color:#00be6e; border:1px solid #00be6e"
            icon="el-icon-plus"
          >选择关联问卷</el-button>
          <el-tag
            v-for="tag in questionList"
            :key="tag.id"
            closable
            :disable-transitions="false"
            @close="handleTag(tag)"
          >{{tag.title}}</el-tag>
        </el-form-item>
        <el-form-item label="收集时间" prop="date" width="100">
          <div class="q-line">
            <el-date-picker
              v-model="addForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:100%;"
              :disabled="dateFlag"
            ></el-date-picker>
            <el-checkbox v-model="dateFlag">不限</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label prop="showResult">
          <el-checkbox v-model="addForm.showResult" label="提交后展示问卷结果"></el-checkbox>
        </el-form-item>
        <!-- </el-form> -->
        <el-form-item align="left" class="dialog-btns">
          <el-button
            type="primary"
            size="medium"
            style="width: 120px;height:40px"
            @click="nextStep()"
          >下一步</el-button>
          <el-button
            type="primary"
            size="medium"
            style="background:#fff;color:#00be6e;width: 120px;height:40px"
            @click="back()"
          >取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="选择问卷"
        :visible.sync="dialogVisible1"
        width="850px"
        style="margin:50px 0 0 50px;"
        :before-close="handlestudentClose"
      >
        <el-row class="search-row">
          <div class="f-fl">
            <el-input v-model="filters.search" size="medium" placeholder="输入问卷关键词搜索"></el-input>
            <el-button
              type="primary"
              style="background:rgba(255, 153, 0, 1);border:none"
              size="medium"
              @click="getList"
            >搜索</el-button>
          </div>
        </el-row>
        <!-- table表格 -->
        <el-table :data="questionData" highlight-current-row>
          <el-table-column label="问卷名称" prop="title" width="200"></el-table-column>
          <el-table-column prop="realName" label="创建人"></el-table-column>
          <el-table-column prop="updatedDt" label="更新时间" width="200"></el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                type="primary"
                style="background:#fff;color:#00be6e; border:1px solid #00be6e"
                size="small"
                @click="toQuestion(scope.row)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filters: {
        search: ""
      },
      questionData: [],
      questId: "",
      questionFlag: false,
      dialogVisible1: false,
      dateFlag: false,
      addForm: {
        title: "",
        fileId: "",
        date: [],
        showResult: false,
        questionId: "",
        questionName: "",
        surveyId: ""
      },
      questionList: [],
      rules: {
        title: [
          { required: true, message: "请输入调研问卷标题", trigger: "blur" }
        ],
        questionId: [
          { required: true, message: "请选择关联调研问卷", trigger: "blur" }
        ],
        date: [
          { required: true, message: "请输入调研问卷收集时间", trigger: "blur" }
        ],
        showResult: [
          {
            required: true,
            message: "请选择是否展示调研问卷结果",
            trigger: "blur"
          }
        ]
      },
      fildIdsFlag: "",
      fileList: []
    };
  },
  methods: {
    //下一步
    nextStep() {
      this.$refs["addForm"].validate(valid => {
        console.log(this.addForm.date);
        if (valid && this.dateFlag == false) {
          this.$router.push({
            path: "/createEvalute",
            query: {
              id: this.questId,
              title: this.addForm.title,
              starDate: this.addForm.date[0],
              endDate: this.addForm.date[1]
            }
          });
        } else if (
          this.dateFlag == true &&
          this.questId != "" &&
          this.addForm.title != ""
        ) {
          this.$router.push({
            path: "/createEvalute",
            query: {
              id: this.questId,
              title: this.addForm.title,
              starDate: "",
              endDate: ""
            }
          });
        } else {
          this.$message.error("您的信息未填写完整");
        }
      });
    },
    back() {
      this.$router.push("/evaluate");
    },
    handleTag(tag) {
      this.questionList.splice(0, 1);
      this.questId = "";
    },
    handlestudentClose() {
      this.dialogVisible1 = false;
    },
    tunQuestion() {
      this.dialogVisible1 = true;
      this.getList();
    },
    //问卷列表
    getList() {
      let par = {
        search: this.filters.search
      };
      this.$http
        .get("/api/web/evaluation/list/questionnaire", { params: par })
        .then(res => {
          this.questionData = res.data;
        })
        .catch(msg => {});
    },
    //选择文件赋值id
    toQuestion(val) {
      this.questionList = [];
      this.questId = val.id;
      this.questionList.push(val);
      this.dialogVisible1 = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.q-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.questionnaire {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
