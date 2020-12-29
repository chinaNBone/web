<template>
  <!-- 学员手册 -->
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员手册</h2>
    </el-header>
    <div style="margin-top: 20px" v-if="isList && !showOffer">
      <el-button type="primary" size="medium" @click="exportUser"
        >添加学员手册</el-button
      >
    </div>
    <div @click="stipoffer" class="manualCourse" v-if="!isList && !showOffer">
      <div class="stip">+</div>
      <div class="clickoffer">点击创建学员手册</div>
    </div>
    <div v-if="showOffer && !isList" style="margin-top: 30px">
      <el-form
        ref="manauForm"
        :rules="rules"
        :model="manauForm"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="标题:" prop="title" style="width: 500px">
          <el-input v-model.trim="manauForm.title" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="附件:" prop="fileId" style="width: 500px">
          <div style="text-align: left; display: flex">
            <el-input
              type="text"
              v-model="manauForm.fileId"
              style="display: none"
            ></el-input>
            <el-upload
              :action="saveUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleFileSuccess"
              :on-change="handleChange"
              :before-upload="beforeFileUpload"
              :file-list="fileList"
              class="upload-name el-upload-list"
            >
              <div style="display: flex">
                <el-button
                  style="
                    background: #fff;
                    color: #00be6e;
                    border: 1px solid #00be6e;
                  "
                  icon="el-icon-upload2"
                  >上传手册文件</el-button
                >
                <div
                  class="image-detail"
                  style="line-height: 43px; margin-left: 10px"
                >
                  支持pdf文件，大小不超过10M
                </div>
              </div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="200"
            placeholder="请输入内容"
            show-word-limit
            v-model="manauForm.remark"
          ></el-input>
        </el-form-item>
        <el-form-item align="left" class="dialog-btns">
          <el-button
            type="primary"
            size="medium"
            style="
              background: rgba(255, 153, 0, 1);
              border: none;
              width: 120px;
              height: 40px;
            "
            @click="onSave()"
            >保存</el-button
          >
          <el-button
            type="primary"
            size="medium"
            style="width: 120px; height: 40px"
            @click="ReleaseLecturer()"
            >发布</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <ul v-if="isList && !showOffer">
      <li v-for="item in manaulList" :key="item.id" class="contain-center">
        <div style="min-height: 150px; padding: 20px 20px 0 20px">
          <div class="offer-title">
            <div class="stipOffer">{{ item.title }}</div>
            <div class="offer-right">
              <div v-if="item.status == 0">待发布</div>
              <div v-if="item.status == 2">已发布</div>
              <div class="container-left f-clearfix">
                <div
                  class="updateoffer cursor-pointer f-fr"
                  v-if="item.status == 0"
                  @click="Release(item.id)"
                >
                  发布
                </div>
                <div
                  class="updateoffer cursor-pointer f-fr"
                  v-if="item.status == 0"
                  @click="editOffer(item.id)"
                >
                  修改
                </div>
                <div
                  class="updateoffer cursor-pointer f-fr"
                  @click="download(item)"
                >
                  下载
                </div>
                <div
                  class="deleteoffer cursor-pointer f-fr"
                  @click="deleteOffer(item.id)"
                >
                  删除
                </div>
              </div>
            </div>
          </div>
          <div class="offer-content">{{ item.remark }}</div>
          <div class="downloadoffer" style="cursor: pointer">
            <p style="color: #666666; font-size: 14px">
              <i class="el-icon-document"></i>
              {{ item.fileWholeName }}
            </p>
          </div>
        </div>

        <div class="offer-foter">
          <div class="foter-content">
            <div>
              <i class="el-icon-time"></i>
              &nbsp;{{ item.createdDt }}
            </div>
            <div>
              <i class="el-icon-view"></i>
              &nbsp;{{ item.scanNum }}人
            </div>
            <!-- <div>
              <i class="el-icon-chat-dot-square"></i>
              &nbsp;{{ item.replyNum }}人
            </div>-->
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl + "/",
      fiflest: "",
      isshow: false,
      isList: false,
      manaulList: [],
      fildIdsFlag: [],
      fileList: [],
      showOffer: false,
      manauForm: {
        fileId: "",
        projectId: localStorage.getItem("projectId"),
        status: "0",
        title: "",
        remark: "",
      },
      reset: {
        fileId: "",
        projectId: localStorage.getItem("projectId"),
        status: "0",
        title: "",
        remark: "",
      },
      testForm: {},
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 20, message: "可输入最大长度为20个字符", trigger: "blur" },
        ],
        fileId: [
          { required: true, message: "请上传手册文件", trigger: "change" },
        ],
      },
      fileDisabled: false,
    };
  },
  methods: {
    download(obj) {
      window.location.href =
        this.$setting.baseURL +
        `/oss/download/downloadById?fileId=${obj.fileId}`;
    },
    openOffer() {},
    checkStatus() {
      if (this.manaulList.length != 0) {
        this.isList = true;
      } else {
        this.isList = false;
      }
    },
    getList() {
      let par = {
        projectId: localStorage.getItem("projectId"),
      };
      this.$http
        .post("/api/web/userManual/list", par)
        .then((res) => {
          this.manaulList = res.data;
          this.checkStatus();
          let item = res.data.files;
          for (let i = 0; i < item.length; i++) {
            let filePar = {
              fileName: item[i].name,
              fileId: item[i].id,
            };
            let fileItem = {
              name: item[i].name,
              url: item[i].url,
            };
            this.fildIdsFlag.push(filePar);
            this.fileList.push(fileItem);
          }
        })
        .catch(() => {});
    },
    editOffer(val) {
      this.manauForm = {
        ...this.manaulList.filter((item) => val == item.id)[0],
      };
      console.log(this.manauForm);
      var obj = {};
      this.$set(obj, "name", this.manauForm.fileWholeName);
      this.fileList.push(obj);
      this.fileList.length = 1;
      this.showOffer = true;
      this.isList = false;
    },
    stipoffer() {
      this.showOffer = true;
      this.checkStatus();
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
      if (res.code == 0) {
        let data = res.data;
        let par = {
          fileName: data.filename,
          size: data.size,
          filePath: data.path,
        };
        this.$http.post("/oss/oss/saveFile", par).then((json) => {
          if (json.code == 0) {
            this.manauForm.fileId = json.data;
            this.fileDisabled = true;
            let filePar = {
              fileName: res.data.filename,
              fileId: json.data,
            };
            this.fildIdsFlag.push(filePar);
          }
        });
      }
    },
    handlePreview() {},
    beforeFileUpload(file) {
      let size = file.size / 1024 / 1024 <= 10;
      if (!size) {
        this.$message.error("上传文件大小不得超过10MB,请重新上传");
        this.fileList.length = 0;
        return false;
      }
      // 截取文件名后缀
      let type1 = file.name.lastIndexOf(".");
      let type2 = file.name.length;
      let type = file.name.substring(type2, type1 + 1);
      if (type2 > 100) {
        this.$message({
          message: "文件名称不得超过100字,请重新上传",
          type: "warning",
        });
        this.fileList.length = 0;
        return false;
      }
      if (type != "pdf") {
        this.$message({
          message: "请选择上传格式为pdf",
          type: "warning",
        });
        this.fileList.length = 0;
        return false;
      }
    },
    //删除学员手册
    deleteOffer(id) {
      this.$confirm("您确定要删除该手册吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let par = {
          id: id,
        };
        this.$http
          .post("/api/edu/userManual/delete", par)
          .then(() => {
            this.$message({
              message: "删除学员手册成功",
              type: "success",
            });
            this.getList();
            this.manauForm = {
              fileId: "",
              projectId: localStorage.getItem("projectId"),
              status: "0",
              title: "",
              remark: "",
            };
            this.$refs["manauForm"].resetFields();
          })
          .catch(() => {});
      });
    },
    //创建学员手册
    onSave() {
      this.$refs["manauForm"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/web/userManual/addOrUpdate", this.manauForm)
            .then(() => {
              this.$message({
                message: "创建成功",
                type: "success",
              });
              this.getList();
              this.$refs["manauForm"].resetFields();
              this.showOffer = false;
            })
            .catch(() => {});
        }
      });
    },
    ReleaseLecturer(id) {
      this.manaulList.forEach((item) => {
        if (item.id === id) {
          this.manauForm.id = item.id;
          this.manauForm.title = item.title;
          this.manauForm.fileId = item.fileId;
          this.manauForm.status = item.status;
          this.manauForm.fileWholeName = item.fileWholeName;
          this.manauForm.remark = item.remark;
        }
      });
      this.$refs["manauForm"].validate((valid) => {
        if (valid) {
          this.manauForm.status = "2";
          this.$http
            .post("/api/web/userManual/addOrUpdate", this.manauForm)
            .then(() => {
              this.$message({
                message: "发布成功",
                type: "success",
              });
              this.getList();
              this.$refs["manauForm"].resetFields();
              this.showOffer = false;
            })
            .catch(() => {});
        }
      });
    },
    Release(id) {
      this.manaulList.forEach((item) => {
        if (item.id === id) {
          this.manauForm.id = item.id;
          this.manauForm.title = item.title;
          this.manauForm.fileId = item.fileId;
          this.manauForm.status = item.status;
          this.manauForm.fileWholeName = item.fileWholeName;
          this.manauForm.remark = item.remark;
        }
      });
      this.manauForm.status = "2";
      this.$http
        .post("/api/web/userManual/addOrUpdate", this.manauForm)
        .then(() => {
          this.$message({
            message: "发布成功",
            type: "success",
          });
          this.getList();
          this.$refs["manauForm"].resetFields();
          this.showOffer = false;
        })
        .catch(() => {});
    },
    exportUser() {
      this.manauForm = { ...this.reset };
      this.fileList = [];
      this.showOffer = true;
      this.isList = false;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.manualCourse {
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
.el-upload__tip {
  margin-left: 10px;
}
.offer-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.offer-content {
  margin-top: 20px;
}
.stipOffer {
  color: #333333;
  font-size: 20px;
}
.downloadoffer {
  margin-top: 20px;
  height: 40px;
  i {
    font-size: 18px;
    margin-right: 10px;
  }
}
.offer-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 26%;
}
.container-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.updateoffer {
  color: #00be6e;
  margin-right: 10px;
}
.deleteoffer {
  color: red;
}
.contain-center {
  margin-top: 20px;
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
    justify-content: flex-start;
    align-items: center;

    & > div {
      margin-right: 30px;
    }
  }
}
.el-upload-list {
  max-width: 500px;
  .a {
    margin-right: 20px !important;
  }
}
</style>
