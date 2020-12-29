<!-- 项目总结 -->
<template>
  <div>
    <div class="l-mod-tool">
      <h2>项目总结</h2>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-loading="loading">
      <el-tab-pane v-model="activeName" label="项目简报" name="first">
        <div class="course" v-if="listTableE.length < 1">
          <el-upload
            :action="saveUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeFileUpload"
            :on-success="handleSuccess"
            :show-file-list="false"
            multiple
          >
            <div class="stip">+</div>
            <div class="clickoffer">点击上传项目简报</div>
          </el-upload>
        </div>
        <div class="f-fl" v-if="listTableE.length >= 1" style="width: 100%;">
          <el-upload
            :action="saveUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeFileUpload"
            :on-success="handleSuccess"
            :show-file-list="false"
            multiple
          >
            <el-button type="primary" size="medium">导入项目简报</el-button>
          </el-upload>
          <ul class="List">
            <li v-for="(item, index) of listTableE" :key="index">
              <div class="m-flex">
                <div class="d-title">
                  <i class="el-icon-document"></i>
                  <span>{{item.fileName}}.{{item.fileSuffix}}</span>
                </div>
                <div class="d-options">
                  <el-button type="text" style="color: green" @click="download(item)">下载</el-button>
                  <el-button type="text" style="color: red" @click="reject(item)">删除</el-button>
                </div>
              </div>
              <p>上传时间 : {{ item.createdDt | moment("YYYY-MM-DD") }}~{{ item.updatedDt | moment("YYYY-MM-DD") }}</p>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自评报告" name="second">
        <div class="course" v-if="listTableS.length < 1">
          <el-upload
            :action="saveUrl"
            :data="fileData"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeFileUpload"
            multiple
            :file-list="fileList"
            :show-file-list="false"
          >
            <div class="stip">+</div>
            <div class="clickoffer">点击上传自评报告</div>
          </el-upload>
        </div>
        <div class="f-fl" v-if="listTableS.length >= 1" style="width: 100%;">
          <el-upload
            :action="saveUrl"
            :data="fileData"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="beforeFileUpload"
            multiple
            :file-list="fileList"
            :show-file-list="false"
          >
            <el-button type="primary" size="medium" @click="importReport">导入自评报告</el-button>
          </el-upload>
          <ul class="List">
            <li v-for="(item, index) of listTableS" :key="index">
              <div class="m-flex">
                <div class="d-title">
                  <i class="el-icon-document"></i>
                  <span>{{item.fileName}}.{{item.fileSuffix}}</span>
                </div>
                <div class="d-options">
                  <el-button type="text" style="color: green" @click="download(item)">下载</el-button>
                  <el-button type="text" style="color: red" @click="reject(item)">删除</el-button>
                </div>
              </div>
              <p>上传时间 : {{ item.createdDt | moment("YYYY-MM-DD") }}~{{ item.updatedDt | moment("YYYY-MM-DD") }}</p>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data() {
    return {
      loading: false,
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      fileData: {},
      brief: [],
      activeName: "first",
      first: false,
      second: true,
      third: false,
      fourth: true,
      adminTitle: "",
      list: {
        search: "",
        status: ""
      },
      roleList: [],
      fileList: [],
      listTableE: [],
      listTableS: [],
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1
      },
      groupType: "BRIEFING",
      fileId: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSuccess(res, file) {
      if (res.code === 0) {
        let type1 = file.name.lastIndexOf(".");
        let type2 = file.name.length;
        let type = file.name.substring(type2, type1 + 1);
        if (type != "pdf") {
          this.$message({
            message: "请选择上传格式为pdf",
            type: "warning"
          });
          return false;
        }
        let data = res.data;
        let par = {
          fileName: data.filename,
          filePath: data.path,
          group: this.groupType,
          projectId: localStorage.getItem("projectId"),
          size: data.size
        };
        this.$http
          .post(`/api/web/projectsumup/save`, qs.stringify(par), {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
          .then(res => {
            this.$message({
              message: "上传成功",
              type: "success"
            });
            this.fileId = res.data;
            this.getList();
          });
      } else {
        console.log("error: " + res.msg);
      }
    },
    handlePreview(file) {
      console.log(file);
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
    reject(obj) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let par = {
          fileId: obj.id
        };
        this.$http
          .post("/oss/oss/delete", par)
          .then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
          })
          .catch(() => {});
      });
    },
    download(obj) {
      window.location.href =
        this.$setting.baseURL + `/oss/download/downloadById?fileId=${obj.id}`;
    },
    beforeFileUpload() {},
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    // 获取list
    async getList() {
      this.loading = true;
      let projectId = localStorage.getItem("projectId");
      let par = {
        group: this.groupType,
        projectId: localStorage.getItem("projectId"),
        // status: this.list.status,
        // search: this.list.search,
        pageSize: this.listPage.pageSize,
        currentPage: this.listPage.pageNo
      };
      this.$http
        .get(`/api/web/projectsumup/list/${projectId}`, { params: par })
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            for (let j in res.data[i]) {
              if (j === "createdDt" || j === "updatedDt") {
                res.data[i][j] = this.getTime(res.data[i][j]);
              }
            }
          }
          this.listTableE = res.data.filter(v => v.fileGroup === "BRIEFING");
          this.listTableS = res.data.filter(
            v => v.fileGroup === "SELFEVALUATION"
          );
          this.loading = false;
        })
        .catch();
    },
    importBrief() {},
    importReport() {},
    handleClick(tab) {
      this.loading = true;
      if (tab.name === "first") {
        this.groupType = "BRIEFING";
      } else if (tab.name === "second") {
        this.groupType = "SELFEVALUATION";
      }
      this.getList(tab.name);
    },
    getTime(data) {
      var d = new Date(data);
      var time = `${d.getFullYear()}-${
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }-${d.getDate()}`;
      return time;
    }
  }
};
</script>
<style lang="scss">
.f-fl {
  .List {
    li {
      border: 1px solid #ccc;
      padding: 15px;
      margin-top: 20px;

      .m-flex {
        .d-title {
          font-size: 20px;
          i {
            padding-right: 6px;
          }
        }
      }

      p {
        padding-top: 10px;
      }
    }
  }
}
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
  margin-bottom: 200px;
  cursor: pointer;

  & > div {
    width: 100%;
    height: 100%;
    .el-upload {
      width: 100%;
      height: 100%;
      display: block;
      max-width: inherit;
    }
  }
  .stip {
    color: #00be6e;
    font-size: 100px;
    margin-top: 40px;
  }
}
</style>
