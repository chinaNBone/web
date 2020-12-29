<template>
  <!-- 开班通知 -->
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">开班通知</h2>
    </el-header>
    <div
      @click="stipoffer"
      class="offerCourse"
      v-if="this.courseFrom.fileWholeName === null && !showOffer && !isshow"
    >
      <div class="stip">+</div>
      <div class="clickoffer">点击创建开班通知</div>
    </div>
    <div v-if="showOffer && !isshow" style="margin-top:30px">
      <el-form
        ref="courseFrom"
        :rules="rules"
        :model="courseFrom"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="标题:" prop="title" style="width:500px;">
          <el-input v-model.trim="courseFrom.title" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="附件:" prop="fileId" style="width:500px;">
          <div style="text-align:left;display: flex;">
            <el-upload
              class="avatar-uploader upload-name"
              :action="saveUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleFileSuccess"
              :on-change="handleChange"
              :before-upload="beforeFileUpload"
              :file-list="fileList"
              :show-file-list="true"
              style="300px"
            >
              <el-button
                style="background:#fff;color:#00be6e; border:1px solid #00be6e"
                icon="el-icon-upload2"
              >上传通知文件</el-button>
              <div
                class="image-detail"
                style="line-height: 43px;margin-left: 10px;"
              >支持pdf文件，大小不超过10M</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="courseFrom.remark"></el-input>
        </el-form-item>

        <el-form-item align="left" class="dialog-btns">
          <el-button
            type="primary"
            size="medium"
            style="background:rgba(255, 153, 0, 1);border:none;width: 120px;height:40px"
            @click="editLecturer(courseFrom)"
          >保存</el-button>
          <el-button
            type="primary"
            size="medium"
            style="width: 120px;height:40px"
            @click="getPeopleList('top')"
          >发布</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contain-center" v-if="this.courseFrom.title && (isshow || !showOffer)">
      <div style="min-height:150px;padding: 20px 20px 0 20px;">
        <div class="offer-title">
          <div class="stipOffer">{{ courseFrom.title }}</div>
          <div class="offer-right">
            <div v-if="courseFrom.status == 0" style="color: #999;">待发布</div>
            <div v-if="courseFrom.status == 3" style="color: #999;">已发布</div>
            <div class="container-left">
              <div
                class="updateoffer cursor-pointer"
                v-if="courseFrom.status == 0"
                @click="getPeopleList('bottom')"
              >发布</div>
              <div
                class="updateoffer cursor-pointer"
                v-if="courseFrom.status == 0"
                @click="editOffer()"
              >修改</div>
              <div
                class="updateoffer cursor-pointer"
                v-if="courseFrom.status == 3"
                @click="checkOffer()"
              >查看</div>
              <div class="deleteoffer cursor-pointer" @click="deleteOffer(courseFrom.id)">删除</div>
            </div>
          </div>
        </div>
        <div class="offer-content">{{ courseFrom.remark }}</div>
        <div class="downloadoffer" style="cursor: pointer;">
          <p style="color:#666666;font-size:14px">
            <i class="el-icon-document" style="font-size: 18px;margin-right: 10px;"></i>
            {{ courseFrom.fileWholeName }}
          </p>
        </div>
      </div>

      <div class="offer-foter">
        <div class="foter-content">
          <div>
            <i class="el-icon-time"></i>
            &nbsp;{{ courseFrom.createdDt | moment("YYYY-MM-DD HH:mm") }}
          </div>
          <div>
            <i class="el-icon-view"></i>
            &nbsp;{{ courseFrom.scanNum }}人
          </div>
          <div>
            <i class="el-icon-chat-dot-square"></i>
            &nbsp;{{ courseFrom.replyNum }}人
          </div>
        </div>
      </div>
      <el-dialog
        title="开班通知预览记录"
        :visible.sync="dialogVisible"
        width="650px"
        :before-close="handleClose"
        class="preview"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已查看" name="first">
            <el-table :data="tableData1" style="width: 100%">
              <el-table-column prop="realName" label="学员姓名"></el-table-column>
              <el-table-column prop="gender" label="性别"></el-table-column>
              <el-table-column prop="areaName" label="所在地区(省-市-区)" width="200"></el-table-column>
              <el-table-column prop="mobile" label="手机号"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="未查看" name="second">
            <el-table :data="tableData2" style="width: 100%" max-height="400px">
              <el-table-column prop="realName" label="学员姓名"></el-table-column>
              <el-table-column prop="gender" label="性别"></el-table-column>
              <el-table-column prop="areaName" label="所在地区(省-市-区)" width="200"></el-table-column>
              <el-table-column prop="mobile" label="手机号"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      title="未绑定微信用户（无法接收通知）"
      :visible.sync="dialogVisible1"
      width="650px"
      :before-close="handleClose1"
      class="preview"
    >
      <el-table
        :data="people.slice((upLoadPage.currentPage-1)*upLoadPage.pageSize,upLoadPage.currentPage*upLoadPage.pageSize)"
        style="width: 100%"
      >
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
      </el-table>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCuChange"
        :current-page="upLoadPage.currentPage"
        :page-size="upLoadPage.pageSize"
        :total="people.length"
        layout="total, prev, pager, next"
      ></el-pagination>
      <span slot="footer" class="dialog-footer" v-if="isRel">
        <el-button type="primary" @click="relStatus=='top'?ReleaseLecturer():Release()">发 布</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  data() {
    return {
      tableData1: [],
      tableData2: [],
      upLoadPage: {
        currentPage: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 5
      },
      people: [],
      isRel: true,
      dialogVisible1: false,
      activeName: "first",
      dialogVisible: false,
      fiflest: "",
      isshow: false,
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl + "/",
      showOffer: false,
      courseFrom: {
        id: "",
        fileId: "",
        title: "",
        status: "0",
        scanNum: "",
        replyNum: "",
        fileWholeName: "",
        remark: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 20, message: "可输入最大长度为20个字符", trigger: "blur" }
        ],
        fileId: [
          { required: true, message: "请上传通知文件", trigger: "change" }
        ]
      },
      fildIdsFlag: "",
      fileList: [],
      relStatus: null
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //开班通知列表
    getList() {
      let par = {
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .post("/api/web/startNotice/list", par)
        .then(res => {
          this.courseFrom = { ...res.data };
        })
        .catch(() => {});
    },
    //修改开班通知
    editOffer() {
      var obj = {};
      this.$set(obj, "name", this.courseFrom.fileWholeName);
      this.fileList.push(obj);
      this.fileList.length = 1;
      this.isshow = false;
      this.showOffer = true;
    },
    //发布开班通知
    ReleaseLecturer() {
      this.$refs["courseFrom"].validate(valid => {
        if (valid) {
          this.courseFrom.status = 3;
          this.courseFrom.projectId = localStorage.getItem("projectId");
          this.$http
            .post("/api/web/startNotice/addOrUpdate", this.courseFrom)
            .then(() => {
              this.$message({
                message: "发布成功",
                type: "success"
              });
              this.dialogVisible1 = false;
              this.getList();
              this.showOffer = false;
              this.isshow = true;
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    getPeopleList(val) {
      this.relStatus = val;
      this.isRel = true;
      let par = {
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .get("/api/web/startNotice/unWxOpenIdList", { params: par })
        .then(res => {
          this.people = res.data;
          this.dialogVisible1 = true;
        })
        .catch(() => {});
    },
    Release() {
      this.courseFrom.status = 3;
      this.courseFrom.projectId = localStorage.getItem("projectId");
      this.$http
        .post("/api/web/startNotice/addOrUpdate", this.courseFrom)
        .then(() => {
          this.$message({
            message: "发布成功",
            type: "success"
          });
          this.getList();
          this.dialogVisible1 = false;
          this.showOffer = false;
          this.isshow = true;
          this.isRel = false;
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    // 新增编辑开班通知
    editLecturer() {
      this.$refs["courseFrom"].validate(valid => {
        if (valid) {
          this.courseFrom.status = 0;
          this.courseFrom.projectId = localStorage.getItem("projectId");
          this.courseFrom.createdDt = new Date().toLocaleString();
          this.$http
            .post("/api/web/startNotice/addOrUpdate", this.courseFrom)
            .then(() => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.getList();
              this.showOffer = false;
              this.isshow = true;
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    deleteOffer(id) {
      this.$confirm("您确定要删除该通知吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let par = {
          id: id
        };
        this.$http
          .post("/api/edu/startNotice/delete", par)
          .then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
            this.showOffer = false;
            this.isshow = false;
          })
          .catch(() => {});
      });
    },
    checkOffer() {
      this.dialogVisible = true;
      this.readLog();
    },
    stipoffer() {
      this.showOffer = true;
      this.isshow = false;
    },
    handleRemove(file) {
      let item = [];
      // this.fileList = fileList.slice(-3);
      for (let i = 0; i < item.length; i++) {
        if (file.name == item[i].fileName) {
          item.splice(i, 1);
        }
      }
    },
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        // 只保留最后上传的新文件
        this.fileList = [fileList[fileList.length - 1]];
      }
    },
    handleFileSuccess(res, file, fileList) {
      this.fileList = fileList;
      if (res.code === 0) {
        let data = res.data;
        let par = {
          fileName: data.filename,
          size: data.size,
          filePath: data.path,
          type: 5
        };
        this.$http.post("/oss/oss/saveFile", par).then(res => {
          this.courseFrom.fileId = res.data;
        });
      }
    },
    handlePreview() {},
    beforeFileUpload(file) {
      let size = file.size / 1024 / 1024 <= 10;
      if (!size) {
        this.$message.error("上传文件大小不得超过10MB，请重新上传");
        this.fileList.length = 0;
        return false;
      }
      // 截取文件名后缀
      let type1 = file.name.lastIndexOf(".");
      let type2 = file.name.length;
      let type = file.name.substring(type2, type1 + 1);
      if (type != "pdf") {
        this.$message({
          message: "请选择上传格式为pdf，请重新上传",
          type: "warning"
        });
        this.fileList.length = 0;
        return false;
      }
    },
    handleClick(tab) {
      this.activeName = tab.name;
      if (this.activeName == "first") {
        this.readLog();
      } else {
        this.unReadLog();
      }
    },
    readLog() {
      let par = {
        noticeId: this.courseFrom.id,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .get("/api/web/startNotice/readLog", { params: par })
        .then(res => {
          for (let v of res.data) {
            v["gender"] = v["gender"] == 1 ? "男" : "女";
            v["areaName"] =
              (v["provinceName"] ? v["provinceName"] : "") +
              (v["cityName"] ? "-" + v["cityName"] : "") +
              (v["areaName"] ? "-" + v["areaName"] : "");
          }
          this.tableData1 = res.data;
        });
    },
    unReadLog() {
      let par = {
        noticeId: this.courseFrom.id,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .get("/api/web/startNotice/unReadLog", { params: par })
        .then(res => {
          for (let v of res.data) {
            v["gender"] = v["gender"] == 1 ? "男" : "女";
            v["areaName"] =
              (v["provinceName"] ? v["provinceName"] : "") +
              (v["cityName"] ? "-" + v["cityName"] : "") +
              (v["areaName"] ? "-" + v["areaName"] : "");
          }
          this.tableData2 = res.data;
        });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleClose1() {
      this.dialogVisible1 = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.offerCourse {
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
  text-align: center;
  .stip {
    color: #00be6e;
    font-size: 100px;
  }
}
.offer-title {
  padding: 0 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stipOffer {
  color: #333333;
  font-size: 20px;
}
.offer-content {
  margin-bottom: 10px;
}
.downloadoffer {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
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
.upload-name {
  max-width: 500px;
}
</style>
