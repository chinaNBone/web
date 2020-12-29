<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员报到</h2>
      <div class="g-box-header-back" @click="back">返回 &gt;</div>
    </el-header>
    <div style="margin-top:30px">
      <el-form
        ref="reportFrom"
        :rules="rules"
        :model="reportFrom"
        label-width="120px"
        label-position="right"
        class="report-from"
      >
        <el-form-item label="问卷标题:" prop="title" style="width:500px;">
          <el-input v-model.trim="reportFrom.title" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item v-if="questionFlag" label="关联问卷" prop="questionId">
          <span>{{ reportFrom.questionName }}</span>
        </el-form-item>
        <el-form-item label="关联问卷:" prop="questionId" style="width:500px;" class="item-question">
          <el-button
            style="background:#fff;color:#00be6e; border:1px solid #00be6e"
            icon="el-icon-plus"
            @click="openQuestion()"
          >选择问卷</el-button>
          <div v-if="reportFrom.questionId != ''">
            <a :href="`/detailIndex?id=${reportFrom.questionId}`" target="_black">
              <i class="el-icon-document"></i>
              {{ reportFrom.questionName }}
            </a>
          </div>
        </el-form-item>
        <el-form-item label="收集时间:" prop="date" style="width:500px;">
          <el-date-picker
            v-model="reportFrom.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:100%;"
            :disabled="reportFrom.isShow"
          ></el-date-picker>
          <el-checkbox v-model="reportFrom.isShow" @change="changeCheck()">不限</el-checkbox>
        </el-form-item>
        <el-form-item style="width:500px;">
          <el-checkbox v-model="reportFrom.isChecked">提交后显示问卷结果</el-checkbox>
        </el-form-item>
        <el-form-item align="left" class="dialog-btns">
          <el-button
            type="primary"
            size="medium"
            style="background:rgba(255, 153, 0, 1);border:none;width: 120px;height:40px"
            @click="setReport()"
          >下一步</el-button>
          <el-button
            type="primary"
            size="medium"
            style="width: 120px;height:40px"
            @click="back()"
          >取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="选择问卷"
        :visible.sync="dialogVisible"
        width="850px"
        style="margin:50px 0 0 50px;"
        :before-close="handleClose"
      >
        <el-row class="search-row">
          <div class="f-fl">
            <el-input v-model="search" size="medium" placeholder="输入问卷关键词搜索"></el-input>
            <el-button type size="medium" @click="getQuestion()" class="btn-search">搜索</el-button>
          </div>
        </el-row>
        <!-- table表格 -->
        <el-table :data="tableData" highlight-current-row>
          <el-table-column label="问卷名称" prop="title" width="200"></el-table-column>
          <el-table-column prop="realName" label="创建人"></el-table-column>
          <el-table-column prop="updatedDt" label="更新时间" width="200"></el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="background:#fff;color:#00be6e; border:1px solid #00be6e;height: 20px;width: 40px;"
                size="medium"
                @click="setRow(scope.row)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl + "/",
      questionList: [],
      search: "",
      tableData: [],
      projectId: localStorage.getItem("projectId"),
      questionFlag: false,
      reportFrom: {
        isShow: false,
        title: "",
        id: "flag",
        questionId: "",
        date: "",
        isChecked: false,
        questionName: ""
      },
      dateFlag: false,
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 20, message: "可输入最大长度为20个字符", trigger: "blur" }
        ],
        date: [{ required: true, message: "请选择收集时间", trigger: "blur" }],
        questionId: [
          { required: true, message: "请选择选择关联问卷", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openQuestion() {
      this.dialogVisible = true;
      this.getQuestion();
    },
    // 获取报到问卷
    getQuestion() {
      let par = {
        type: 2,
        status: 1,
        search: this.search,
        pageNo: 1,
        pageSize: 9999
      };
      this.$http
        .post("/api/questionnaire/list", par)
        .then(res => {
          this.tableData = res.data.records;
        })
        .catch(() => {});
    },
    // 选取问卷
    setRow(val) {
      this.reportFrom.questionName = "";
      this.reportFrom.questionId = "";
      this.reportFrom.questionName = val.title;
      this.reportFrom.questionId = val.id;
      this.dialogVisible = false;
    },
    back() {
      this.$router.push({
        path: "/studentReport"
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    changeCheck() {
      this.$refs["reportFrom"].rules.date[0].required = !this.reportFrom.isShow;
      if (this.reportFrom.dateFlag) {
        this.reportFrom.date = [0];
      } else {
        this.reportFrom.date = [];
      }
    },
    // 新建报到
    setReport() {
      this.$refs["reportFrom"].validate(valid => {
        if (valid) {
          if (this.dateFlag) {
            this.reportFrom.date = [];
          }
          let par = {
            title: this.reportFrom.title,
            questionId: this.reportFrom.questionId,
            projectId: this.projectId,
            id: this.reportFrom.id,
            showResult: this.reportFrom.isChecked ? 0 : 1,
            collectDateBegin: this.reportFrom.date[0] || "",
            collectDateEnd: this.reportFrom.date[1] || ""
          };
          this.$http
            .post("/api/web/studentReport/save/report", par)
            .then(res => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$router.push({
                path: "reportQuestion",
                query: {
                  id: res.data.questionId,
                  targetId: res.data.id
                }
              });
            })
            .catch(() => {});
        }
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.course {
  width: 70%;
  height: 260px;
  margin-left: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin-top: 30px;
  .stip {
    color: #00be6e;
    font-size: 100px;
  }
}
.collectionTime {
  display: flex;
}
.offer-title {
  padding: 0 0 30px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stipOffer {
  color: #333333;
  font-size: 20px;
}
.downloadoffer {
  height: 40px;
}
.offer-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 22%;
}
.updateoffer {
  color: #00be6e;
}
.deleteoffer {
  color: red;
}
.container-left {
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.contain-center {
  //   padding: 20px;
  margin-top: 30px;
  border: 1px solid #e6e6e6;
  min-height: 200px;
  .offer-foter {
    width: 100%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e6e6e6;
  }
  .foter-content {
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.report-from {
  .item-question {
    color: #333;
    line-height: 30px;
    i {
      margin-right: 15px;
    }
  }
}
</style>
