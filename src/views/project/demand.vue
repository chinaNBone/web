<template>
  <div>
    <div class="m-search">
      <div>
        <el-select v-model="status" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option label="未发布" :value="0"></el-option>
          <el-option label="已发布" :value="1"></el-option>
          <el-option label="已关闭" :value="2"></el-option>
        </el-select>
        <el-input
          v-model.trim="search"
          placeholder="输入项目关键词搜索"
        ></el-input>

        <el-button type class="btn-search" @click="getList('search')"
          >搜索</el-button
        >
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="openDialog('addFlag')"
          >创建调研问卷</el-button
        >
      </div>
    </div>
    <div class="m-mod" v-loading="loading">
      <ul class="d-list">
        <li v-for="(item, index) in listTable" :key="index">
          <div class="d-msg">
            <h2>{{ item.title }}</h2>
            <!-- <p class="d-msg-text">相关文件：{{ item.fileName }}</p> -->
            <p>
              <span>
                收集时间：
                <span
                  v-if="
                    item.collectDateBegin != null && item.collectDateEnd != null
                  "
                >
                  {{ item.collectDateBegin | moment("YYYY-MM-DD HH:mm") }} -
                  {{ item.collectDateEnd | moment("YYYY-MM-DD HH:mm") }}
                </span>
                <span v-else>不限</span>
              </span>
            </p>
          </div>
          <div class="d-start">
            <div class="d-start-msg">
              <span>创建人：{{ item.realName || "-" }}</span>
              <span :class="['', 'color-green', 'color-red'][item.status]">
                {{ ["未发布", "已发布", "已关闭"][item.status] }}
              </span>
              <span>填写人数：{{ item.applyNum }}</span>
            </div>
            <div class="d-start-btn">
              <span v-if="item.status == 0" @click="publishOrClose(item.id, 1)"
                >发布</span
              >
              <span v-if="item.status == 0" @click="edit(item.id)">编辑</span>
              <!-- TODO -->
              <!-- <span v-if="item.status == 1">二维码</span> -->
              <!-- <span v-if="item.status != 0" @click="toManager()">管理</span> -->
              <span
                v-if="item.status != 1"
                class="color-red"
                @click="delRow(item.id)"
                >删除</span
              >
              <span
                v-if="item.status != 0"
                class="color-green"
                @click="toDetail(item)"
                >管理</span
              >
              <template v-if="item.status == 1">
                <el-popover placement="left" trigger="click">
                  <canvas
                    class="clocking-qrcode"
                    v-qrcode.lazy="getAttendanceUrl(item)"
                  ></canvas>
                  <div slot="reference" class="color-green">二维码</div>
                </el-popover>
              </template>
              <span
                v-if="item.status == 1"
                class="color-green"
                v-clipboard:copy="getAttendanceUrl(item)"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
                >复制链接</span
              >
              <span
                v-if="item.status == 1"
                class="color-red"
                @click="publishOrClose(item.id, 2)"
                >关闭</span
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="m-pages">
      <el-pagination
        v-if="pageList && pageList.total > 0"
        background
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        :page-size="pageList.pageSize"
        layout=" prev, pager, next,total"
        :total="pageList.total"
      ></el-pagination>
    </div>
    <Empty v-if="!pageList || pageList.total == 0" msg="暂无相关调研"></Empty>
    <el-dialog
      :title="titleDialog"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeDialog"
    >
      <el-form
        :model="addForm"
        status-icon
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问卷标题" prop="title">
          <el-input
            v-model.trim="addForm.title"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item v-if="questionFlag" label="关联问卷" prop="questionId">
          <span>{{ addForm.questionName }}</span>
        </el-form-item>
        <el-form-item v-else label="关联问卷" prop="questionId">
          <el-select
            v-model="addForm.questionId"
            placeholder="请选择关联问卷"
            style="width: 100%"
          >
            <el-option
              v-for="item in questionList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收集时间" prop="date">
          <el-date-picker
            v-model="addForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            :disabled="dateFlag"
          ></el-date-picker>
          <el-checkbox v-model="dateFlag" @change="changeCheck()"
            >不限</el-checkbox
          >
        </el-form-item>
        <el-form-item label prop="showResult">
          <el-checkbox
            v-model="addForm.showResult"
            label="提交后展示问卷结果"
          ></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button
          type="primary"
          @click="titleDialog == '创建调研问卷' ? setrow(0) : editRow(0)"
          >保 存</el-button
        >
        <!-- <el-button
          type="primary"
          @click="titleDialog == '创建调研问卷' ? setrow(1) : editRow(1)"
          >发布问卷</el-button
        >-->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import Empty from "@/components/Empty";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      titleDialog: "",
      dialogVisible: false,
      dateFlag: false,
      addForm: {
        title: "",
        fileId: "",
        date: [],
        showResult: false,
        questionId: "",
        questionName: "",
        surveyId: "",
      },
      questionFlag: false,
      questionList: [],
      loading: false,
      status: "",
      search: "",
      pageList: {
        pageNo: 1,
        pageSize: 20,
        total: 1,
      },
      listTable: [],
      fileList: [],
      rules: {
        title: [
          { required: true, message: "请输入调研问卷标题", trigger: "blur" },
        ],
        questionId: [
          { required: true, message: "请选择关联调研问卷", trigger: "blur" },
        ],
        date: [
          {
            required: true,
            message: "请输入调研问卷收集时间",
            trigger: "blur",
          },
        ],
        showResult: [
          {
            required: true,
            message: "请选择是否展示调研问卷结果",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getQuestionList();
    this.getList();
  },
  methods: {
    toDetail(val) {
      this.$router.push({
        path: "demandManage",
        query: {
          surveyId: val.id,
        },
      });
    },
    handleCurrentChange(val) {
      this.pageList.pageNo = val;
      this.getList();
    },
    validataFile(file) {
      let size = file.size / 1024 / 1024 <= 20;
      if (!size) {
        this.$message.error("上传文件大小不得超过20MB");
        return false;
      }
      // 截取文件名后缀
      let type1 = file.name.lastIndexOf(".");
      let type2 = file.name.length;
      let type = file.name.substring(type2, type1 + 1);
      if (
        type != "xlsx" &&
        type != "xls" &&
        type != "pdf" &&
        type != "doc" &&
        type != "docx"
      ) {
        this.$message({
          message: "请选择上传格式为xls/pdf/doc",
          type: "warning",
        });
        return false;
      }
    },
    fileSuccess(res, file, fileList) {
      let data = res.data;
      let par = {
        fileName: data.filename,
        size: data.size,
        filePath: data.path,
      };
      this.$http
        .post("/oss/oss/saveFile", par)
        .then((json) => {
          this.addForm.fileId = json.data;
        })
        .catch((msg) => {});
    },
    handleChange(file, fileList) {
      // this.fileList = fileList.slice(-3);
    },
    handleRemove(file, fileList) {
      // let item = this.addForm.docIds;
      // // this.fileList = fileList.slice(-3);
      // for (let i = 0; i < item.length; i++) {
      //   if (file.name == item[i].fileName) {
      //     item.splice(i, 1);
      //   }
      // }
    },

    toManager() {
      this.$router.push({
        path: "/studentManage",
      });
    },
    // 发布与关闭
    publishOrClose(val, status) {
      let title =
        status == 1 ? "请确认是否执行发布操作?" : "请确认是否执行关闭操作?";
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            status: status,
            surveyId: val,
          };
          this.$http
            .post("/api/edu/projectQuestion/publishOrCloseProjectQuestion", par)
            .then((res) => {
              this.$message({
                message: val == 1 ? "发布" : "关闭" + "成功",
                type: "success",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    // 删除当前问卷
    delRow(val) {
      this.$confirm("请确认是否执行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            surveyId: val,
          };
          this.$http
            .post("/api/edu/projectQuestion/deleteProjectQuestion", par)
            .then((res) => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    edit(val) {
      this.$router.push({
        path: "/demandDetailRule",
        query: {
          demandId: val,
        },
      });
    },
    // 打开弹窗
    async openDialog(val) {
      this.dialogVisible = true;
      if (val == "addFlag") {
        this.titleDialog = "创建调研问卷";
      } else {
        this.titleDialog = "编辑调研问卷";
        await this.getDetail(val.id);
      }
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false;
      this.addForm = {
        title: "",
        fileId: "",
        date: [],
        showResult: false,
        questionId: "",
        questionName: "",
        surveyId: "",
      };
      this.questionFlag = false;
      this.fileList = [];
      this.dateFlag = false;
    },
    changeCheck() {
      if (this.dateFlag) {
        this.addForm.date = [0];
      } else {
        this.addForm.date = [];
      }
    },
    // 添加调研
    setrow(val) {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (this.dateFlag) {
            this.addForm.date = [];
          }
          let par = {
            questionId: this.addForm.questionId,
            showResult: this.addForm.showResult ? 0 : 1,
            collectDateBegin: this.addForm.date[0] || "",
            collectDateEnd: this.addForm.date[1] || "",
            // fileId: this.addForm.fileId,
            title: this.addForm.title,
            status: val,
          };
          this.$http
            .post("/api/edu/projectQuestion/addProjectQuestion", par)
            .then((res) => {
              this.$message({
                message: "创建成功",
                type: "success",
              });

              this.edit(res.data);
              this.closeDialog();
            })
            .catch((msg) => {});
        } else {
          return false;
        }
      });
    },
    // 添加调研
    editRow(val) {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (this.dateFlag) {
            this.addForm.date = [];
          }
          console.log(this.addForm.date);
          let par = {
            showResult: this.addForm.showResult ? 0 : 1,
            collectDateBegin: this.addForm.date[0] || "",
            collectDateEnd: this.addForm.date[1] || "",
            fileId: this.addForm.fileId,
            title: this.addForm.title,
            surveyId: this.addForm.surveyId,
            status: val,
          };
          this.$http
            .post("/api/edu/projectQuestion/editProjectQuestion", par)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.getList();
              this.closeDialog();
            })
            .catch((msg) => {});
        } else {
          return false;
        }
      });
    },
    getDetail(id) {
      return this.$http
        .post("/api/edu/projectQuestion/getOne", { surveyId: id })
        .then((val) => {
          this.questionFlag = true;
          this.addForm.title = val.data.title;
          this.addForm.fileId = val.data.fileId;
          if (
            val.data.collectDateBegin != null &&
            val.data.collectDateEnd != null
          ) {
            let arr = [
              moment(val.data.collectDateBegin).format("YYYY-MM-DD HH:mm:ss"),
              moment(val.data.collectDateEnd).format("YYYY-MM-DD HH:mm:ss"),
            ];
            this.addForm.date = arr;
          } else {
            this.dateFlag = true;
            this.addForm.date = [0];
          }
          this.addForm.showResult = val.data.showResult == 0 ? true : false;
          this.addForm.questionId = val.data.questionId;
          this.addForm.questionName = val.data.questionName;
          this.addForm.surveyId = val.data.id;
          this.fileList = [
            {
              name: val.data.fileName,
            },
          ];
        })
        .catch((msg) => {});
    },
    // 获取问卷列表
    getQuestionList() {
      let par = {
        type: 1,
        status: 1,
        key: "",
        pageNo: 1,
        pageSize: 500,
      };
      this.$http
        .post("/api/questionnaire/list", par)
        .then((res) => {
          this.questionList = res.data.records;
        })
        .catch((msg) => {});
    },
    // 获取list
    getList(val) {
      if (val == "search") {
        this.pageList.pageNo = 1;
      }
      this.loading = true;
      let par = {
        status: this.status,
        search: this.search,
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize,
      };
      this.$http
        .post("/api/edu/projectQuestion/getList", par)
        .then((res) => {
          this.pageList.pageNo = res.data.current;
          this.pageList.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch((msg) => {});
    },
    getAttendanceUrl(item) {
      return `${this.$setting.h5URL}/center/demand/${item.id}?questionId=${item.questionId}`;
    },
    onCopy(error) {
      this.$notify.success({
        message: "链接复制成功",
        customClass: "notify-only-message",
      });
    },
    onCopyError() {
      this.$notify.error({
        message: "链接复制失败",
        customClass: "notify-only-message",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.clocking-qrcode {
  width: 174px;
  height: 174px;
}
</style>