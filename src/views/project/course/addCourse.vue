<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">添加课程</h2>
      <div class="g-box-header-back f-pointer" @click="back">返回></div>
    </el-header>
    <div style="margin-top: 30px">
      <el-form
        ref="timetable"
        :rules="rules"
        :model="timetable"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="培训内容:" prop="title" style="width: 500px">
          <el-input v-model.trim="timetable.title" maxlength="50"></el-input>
          <span class="u-tags-limit" style="top: 55%; right: 48px">{{
            timetable.title.length + "/50"
          }}</span>
        </el-form-item>
        <el-form-item label="上课日期:" prop="day" style="width: 500px">
          <el-date-picker
            style="width: 380px"
            v-model="timetable.day"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上课时间:" prop="time" style="width: 500px">
          <el-time-picker
            is-range
            style="width: 380px"
            v-model="timetable.time"
            format="HH:mm"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="学时类型:" prop="periodType" style="width: 500px">
          <el-select
            v-model="timetable.periodType"
            filterable
            style="width: 380px"
            placeholder="请输入教师名称搜索"
            :reserve-keyword="false"
          >
            <el-option
              v-for="item in periodTypeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学时:" prop="period" style="width: 500px">
          <el-input
            v-model.number="timetable.period"
            maxlength="2"
            placeholder="请输入学时"
          ></el-input>
        </el-form-item>
        <el-form-item label="上课教师:" prop="teacherId" style="width: 500px">
          <el-select
            v-model="timetable.teacherId"
            filterable
            remote
            style="width: 380px"
            placeholder="请输入教师名称搜索"
            :reserve-keyword="false"
            :remote-method="getTeacherList"
            :loading="loading"
            @focus="teacherClick"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.realName + '_' + item.mobile"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课教室:" prop="roomId" style="width: 500px">
          <el-select
            v-model="timetable.roomId"
            filterable
            remote
            style="width: 380px"
            placeholder="请输入教室名称搜索"
            :reserve-keyword="false"
            :remote-method="getRoomList"
            :loading="loading"
            @focus="roomClick"
          >
            <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注:" prop="remark" style="width: 500px">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="200"
            placeholder="请输入内容"
            show-word-limit
            v-model="timetable.remark"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="考勤问卷:"
          prop="teacherQuestionId"
          style="width: 500px"
        >
          <div class="q-line">
            <div class="questionnaire">
              <el-button
                @click="selectQuestion(1)"
                v-if="selectStudent.length === 0"
                style="
                  background: #fff;
                  color: #00be6e;
                  border: 1px solid #00be6e;
                "
                icon="el-icon-plus"
                >学员考勤问卷</el-button
              >
              <el-tag
                :key="tag.id"
                v-for="tag in selectStudent"
                closable
                :disable-transitions="true"
                @close="handleTag(tag)"
                >{{ tag.title }}</el-tag
              >
            </div>
            <div class="questionnaire">
              <el-button
                @click="selectQuestion(0)"
                v-if="selectTeacher.length === 0"
                style="
                  background: #fff;
                  color: #00be6e;
                  border: 1px solid #00be6e;
                "
                icon="el-icon-plus"
                >教师考勤问卷</el-button
              >
              <el-tag
                :key="tag.id"
                v-for="tag in selectTeacher"
                closable
                :disable-transitions="true"
                @close="handleTag(tag)"
                >{{ tag.title }}</el-tag
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="评价问卷:"
          prop="teacherQuestionId"
          style="width: 500px"
        >
          <div class="q-line">
            <div class="questionnaire">
              <el-button
                @click="selectQuestion(3)"
                v-if="selectStudent2.length === 0"
                style="
                  background: #fff;
                  color: #00be6e;
                  border: 1px solid #00be6e;
                "
                icon="el-icon-plus"
                >学员学习问卷</el-button
              >
              <el-tag
                :key="tag.id"
                v-for="tag in selectStudent2"
                closable
                :disable-transitions="true"
                @close="handleTag(tag)"
                >{{ tag.title }}</el-tag
              >
            </div>
            <div class="questionnaire">
              <el-button
                @click="selectQuestion(2)"
                v-if="selectTeacher2.length === 0"
                style="
                  background: #fff;
                  color: #00be6e;
                  border: 1px solid #00be6e;
                "
                icon="el-icon-plus"
                >教师授课问卷</el-button
              >
              <el-tag
                :key="tag.id"
                v-for="tag in selectTeacher2"
                closable
                :disable-transitions="true"
                @close="handleTag(tag)"
                >{{ tag.title }}</el-tag
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item
          align="left"
          class="dialog-btns"
          style="margin-bottom: 10px"
        >
          <el-button
            type="primary"
            size="medium"
            style="width: 120px; height: 40px"
            @click="save"
            :loading="saveLoading"
            >保存</el-button
          >
          <el-button
            type="primary"
            size="medium"
            style="background: #fff; color: #00be6e; width: 120px; height: 40px"
            @click="back"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
      <el-dialog
        :title="questionUsed.title"
        :visible.sync="dialogVisible"
        width="850px"
        style="margin: 50px 0 0 50px"
        :closeOnClickModal="false"
        :before-close="handleClose"
      >
        <el-row class="search-row">
          <div class="f-fl">
            <el-input
              v-model="questionUsed.search"
              size="medium"
              placeholder="输入问卷关键词搜索"
            ></el-input>
            <el-button
              type="primary"
              style="background: rgba(255, 153, 0, 1); border: none"
              size="medium"
              @click="getQestionsList"
              >搜索</el-button
            >
          </div>
        </el-row>
        <!-- table表格 -->
        <el-table :data="questionUsed.data" highlight-current-row>
          <el-table-column
            prop="title"
            label="问卷名称"
            width="200"
          ></el-table-column>
          <el-table-column prop="realName" label="创建人"></el-table-column>
          <el-table-column
            prop="updatedDt"
            label="更新时间"
            width="200"
          ></el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="questionsSelect(scope.row)"
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    id: String,
  },
  data() {
    return {
      dialogVisible: false,
      saveLoading: false,
      questionsType: 0,
      questions: [
        { title: "选择教师考勤问卷", data: [], search: "", type: 3 },
        { title: "选择学员考勤问卷", data: [], search: "", type: 3 },
        { title: "选择教师授课问卷", data: [], search: "", type: 4 },
        { title: "选择学员学习问卷", data: [], search: "", type: 5 },
      ],
      loading: false,
      roomList: [],
      roomInit: false,
      teacherList: [],
      teacherInit: false,
      periodTypeList: [],
      timetable: {
        id: this.id,
        title: "",
        beginTime: "",
        endTime: "",
        teacherId: "",
        projectId: localStorage.getItem("projectId"),
        remark: "",
        roomId: "",
        day: "",
        time: "",
        period: "",
        periodType: "",
        userCheckId: "",
        teacherCheckId: "",
        teacherQuestionId: "",
        userQuestionId: "",
      },
      rules: {
        title: [
          { required: true, message: "请输入培训内容", trigger: "blur" },
          // { max: 20, message: "可输入最大长度为20个字符", trigger: "blur" }
        ],
        // remark: [
        //   { required: true, message: "备注", trigger: "blur" },
        //   { max: 150, message: "可输入最大长度为150个字符", trigger: "blur" }
        // ],
        day: [{ required: true, message: "请选择上课日期", trigger: "change" }],
        time: [
          { required: true, message: "请选择上课时间", trigger: "change" },
        ],
        teacherId: [
          { required: true, message: "请选择上课教师", trigger: "change" },
        ],
        roomId: [
          { required: true, message: "请选择上课教室", trigger: "change" },
        ],
        periodType: [
          { required: true, message: "请选择学时类型", trigger: "change" },
        ],
        period: [
          { required: true, message: "请输入学时", trigger: "change" },
          {
            type: "number",
            min: 0,
            max: 99,
            message: "学时在0-99之间",
            trigger: "change",
          },
        ],
        teacherQuestionId: [
          { required: true, message: "请选择教师考勤问卷", trigger: "change" },
        ],
        userQuestionId: [
          { required: true, message: "请选择学员考勤问卷", trigger: "change" },
        ],
        teacherCheckId: [
          { required: true, message: "请选择教师评价问卷", trigger: "change" },
        ],
        userCheckId: [
          { required: true, message: "请选择学员评价问卷", trigger: "change" },
        ],
      },
      textarea: "",
    };
  },
  computed: {
    questionUsed() {
      return this.questions[this.questionsType];
    },
    selectTeacher() {
      this.timetable.teacherCheckId = null;
      return this.questions[0].data.filter((item) => {
        if (item.isSelect) {
          console.log(this.questions);
          this.timetable.teacherCheckId = item.id;
        }
        return item.isSelect;
      });
    },
    selectStudent() {
      this.timetable.userCheckId = null;
      return this.questions[1].data.filter((item) => {
        if (item.isSelect) {
          this.timetable.userCheckId = item.id;
        }
        return item.isSelect;
      });
    },
    selectTeacher2() {
      this.timetable.teacherQuestionId = null;
      return this.questions[2].data.filter((item) => {
        if (item.isSelect) {
          this.timetable.teacherQuestionId = item.id;
        }
        return item.isSelect;
      });
    },
    selectStudent2() {
      this.timetable.userQuestionId = null;
      return this.questions[3].data.filter((item) => {
        if (item.isSelect) {
          this.timetable.userQuestionId = item.id;
        }
        return item.isSelect;
      });
    },
  },
  created() {
    this.getOptionList();
    if (this.id) {
      this.getTimetable();
    }
  },
  methods: {
    back() {
      this.$router.push("/course");
    },
    selectQuestion(type) {
      this.questionsType = type;
      this.dialogVisible = true;
      this.getQestionsList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getTimetable() {
      this.$http
        .post("/api/edu/timetable/getInfo", {
          id: this.id,
        })
        .then((res) => {
          // 获取room
          this.getRoomList(res.data.roomName);
          // 获取teacher
          this.getTeacherList(res.data.teacherName);
          // 设置问卷
          if (res.data.teacherCheckId) {
            this.questions[0].data.push({
              id: res.data.teacherCheckId,
              title: res.data.teacherCheckQuestion,
              isSelect: true,
            });
          }
          if (res.data.userCheckId) {
            this.questions[1].data.push({
              id: res.data.userCheckId,
              title: res.data.userCheckQuestion,
              isSelect: true,
            });
          }
          if (res.data.teacherQuestionId) {
            this.questions[2].data.push({
              id: res.data.teacherQuestionId,
              title: res.data.teacherQuestion,
              isSelect: true,
            });
          }
          if (res.data.userQuestionId) {
            this.questions[3].data.push({
              id: res.data.userQuestionId,
              title: res.data.userQuestion,
              isSelect: true,
            });
          }
          // 设置时间
          res.data.day = moment(res.data.beginTime).format("YYYY-MM-DD");
          res.data.time = [
            moment(res.data.beginTime).format("HH:mm"),
            moment(res.data.endTime).format("HH:mm"),
          ];
          this.timetable = res.data;
        });
    },
    getQestionsList() {
      // this.dialogVisible = true;
      let question = this.questions[this.questionsType];
      this.$http
        .post("/api/questionnaire/list", {
          type: question.type,
          status: 1,
          search: question.search,
          pageNo: 1,
          pageSize: 500,
        })
        .then((res) => {
          res.data.records.forEach((el) => {
            el.isSelect = false;
          });
          question.data = res.data.records;
        })
        .catch((msg) => {});
    },
    getOptionList() {
      // this.dialogVisible = true;
      this.$http
        .post("/api/edu/project/getOptionList", {
          typeName: "courseType",
        })
        .then((res) => {
          this.periodTypeList = res.data;
        })
        .catch((msg) => {});
    },
    handleTag(tag) {
      tag.isSelect = false;
    },
    questionsSelect(item) {
      item.isSelect = true;
      this.dialogVisible = false;
    },
    roomClick() {
      if (!this.roomInit || this.roomList.length < 1) {
        this.getRoomList();
        this.roomInit = true;
      }
    },
    getRoomList(search) {
      this.$http
        .post("/api/resource/room/list", {
          pageNo: 1,
          pageSize: 8,
          status: 0,
          search: search,
        })
        .then((res) => {
          this.roomList = res.data.records;
          // console.log(res);
        })
        .catch((msg) => {});
    },
    teacherClick() {
      if (!this.teacherInit || this.teacherList.length < 1) {
        this.getTeacherList();
        this.teacherInit = true;
      }
    },
    getTeacherList(search) {
      this.$http
        .post("/api/upms/user/searchRoleUserPage", {
          pageNo: 1,
          pageSize: 7,
          roleId: 3,
          search: search,
        })
        .then((res) => {
          this.teacherList = res.data.records;
        })
        .catch((msg) => {});
    },
    save() {
      this.saveLoading = true;
      this.timetable.beginTime =
        this.timetable.day + " " + this.timetable.time[0];
      this.timetable.endTime =
        this.timetable.day + " " + this.timetable.time[1];
      this.$refs["timetable"].validate((valid) => {
        if (valid && this.checkQuestion()) {
          this.$http
            .post("/api/edu/timetable/addOrEdit", this.timetable)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.saveLoading = false;
              this.back();
            })
            .catch((msg) => {
              this.saveLoading = false;
            });
        } else {
          this.saveLoading = false;
        }
      });
    },
    checkQuestion() {
      if (!this.timetable.userQuestionId) {
        this.$message.error("请选择学员考勤问卷");
        return false;
      }
      if (!this.timetable.teacherQuestionId) {
        this.$message.error("请选择教师考勤问卷");
        return false;
      }
      if (!this.timetable.userCheckId) {
        this.$message.error("请选择学员学习问卷");
        return false;
      }
      if (!this.timetable.teacherCheckId) {
        this.$message.error("请选择教师授课问卷");
        return false;
      }
      return true;
    },
  },
  mounted() {},
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
