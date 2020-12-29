<!--资源管理-->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>资源列表</h2>
    </div>
    <div class="m-search">
      <div>
        <!-- <el-upload
          class="upload-demo"
          :action="saveUrl"
          :data="upData"
          :headers="headers"
          :on-success="handleSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
          accept=".pdf"
        >
          <el-button type="primary" size="medium">上传资源</el-button>
        </el-upload>-->
        <el-button type="primary" size="medium" @click="uploader">上传资源</el-button>
        <!-- <el-button type="warning" size="medium">下载资源</el-button> -->
        <span class="msg">
          <i class="el-icon-info"></i>仅支持pdf格式，文件最大为10M
        </span>
      </div>
      <div>
        <el-input v-model="list.search" placeholder="输入关键字搜索" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="fileName" label="资源名称"></el-table-column>
      <el-table-column prop="uploadUser" label="创建人"></el-table-column>
      <el-table-column prop="createdDt" label="创建时间"></el-table-column>
      <!-- <el-table-column prop="scanNum" label="浏览量" width="100px"></el-table-column> -->
      <el-table-column label="上传状态" width="120px">
        <template
          slot-scope="scope"
        >{{scope.row.status==0?'审核中':(scope.row.status==1?'审核通过':'审核失败')}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="pull(scope.row.resourceId)"
            v-if="scope.row.status!=2"
          >发布</el-button>
          <el-button
            type="text"
            size="small"
            @click="rowDown(scope.row)"
            v-if="scope.row.status!=2"
          >下载</el-button>
          <el-button
            type="text"
            size="small"
            style="color:red"
            @click="rowDel(scope.row.resourceId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-pages">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total"
        :current-page.sync="listPage.pageNo"
        :page-size="listPage.pageSize"
        :total="listPage.total"
      ></el-pagination>
    </div>
    <el-dialog
      title="上传文件"
      :visible.sync="passDialogVisible"
      :close-on-click-modal="false"
      @close="onCloseDialog"
      width="480px"
    >
      <div class="l-user-btn">
        <div>
          <el-input v-model="fileName" style="width:350px" placeholder="请选择文件"></el-input>
          <div style="color:#ccc">仅支持pdf文档，最大不超过10M</div>
        </div>

        <el-upload
          class="upload-demo"
          :action="saveUrl"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          accept=".pdf"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-button style="background:rgba(255, 153, 0, 1);border:none" type="primary">浏览</el-button>
        </el-upload>
      </div>
      <div slot="footer">
        <el-button @click="onCloseDialog">取 消</el-button>
        <el-button type="primary" @click="onSave" :disabled="fileName==''?true:false">开始上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      fileUrl: this.$setting.imageUrl,
      upData: { projectId: localStorage.getItem("projectId"), fileId: "" },
      headers: { Authorization: this.$store.state.global.access_token },
      list: {
        status: ""
      },
      loading: false,
      roleList: [],
      listTable: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      //上传资源
      passDialogVisible: false,
      fileName: "",
      size: "",
      filePath: ""
    };
  },
  methods: {
    pull(item) {
      this.$confirm("是否发布?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            resourceId: item
          };
          this.$http
            .post("/api/edu/resource/publishFile", par)
            .then(res => {
              this.$message.success("发布成功");
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    uploader() {
      this.passDialogVisible = true;
    },
    onCloseDialog() {
      this.passDialogVisible = false;
      this.fileName = "";
    },
    //上传资源
    uploadResource(val) {
      let par = {
        fileId: val,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .post("/api/edu/resource/uploadResource", par)
        .then(res => {
          this.$message.success("上传成功");
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //导入
    handleSuccess(res, file) {
      this.fileName = res.data.filename;
      this.size = res.data.size;
      this.filePath = res.data.path;
    },
    onSave() {
      let par = {
        fileName: this.fileName,
        size: this.size,
        filePath: this.filePath
      };
      this.$http
        .post("/oss/oss/saveFile", par)
        .then(res => {
          this.uploadResource(res.data);
          // this.addCheckRecord(res.data);
          this.passDialogVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取id新增审核记录
    addCheckRecord(val) {
      let par = {
        projectId: localStorage.getItem("projectId"),
        relId: val,
        type: 5
      };
      this.$http
        .post("/api/resource/check/addResourceCheck", par)
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    },
    beforeUpload(file) {
      // const isPdf = file.type == ".pdf";
      const isSize = file.size / 1024 / 1024 < 10;
      // if (!isPdf) {
      //   this.$message({
      //     message: "上传文件只能是pdf格式!",
      //     type: "warning"
      //   });
      // }
      if (!isSize) {
        this.$message({
          message: "上传文件最大10M!",
          type: "warning"
        });
      }
      return isSize;
    },
    //下载
    rowDown(val) {
      window.location.href =
        this.$setting.baseURL +
        `/oss/download/downloadById?fileId=${val.fileId}`;
      let par = {
        resourceId: val.resourceId
      };
      this.$http
        .post("/api/edu/resource/addScanNum", par)
        .then(res => {
          this.getList();
        })
        .catch(msg => {});
    },
    rowDel(val) {
      this.$confirm("您确定要删除该资源吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            resourceId: val
          };
          this.$http
            .post("/api/edu/resource/removeResourceById", par)
            .then(res => {
              this.$message.success("删除成功");
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    // 获取list
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        projectId: localStorage.getItem("projectId"),
        keyword: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .post("/api/edu/resource/resourceList", par)
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(msg => {});
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.msg {
  font-size: 12px;
  color: #999999;
  display: inline-flex;
  align-items: center;
  i {
    font-size: 16px;
    margin: 0 6px 0 10px;
  }
}
.m-search .s-el-input {
  width: 212px;
}
.upload-demo {
  margin-right: 15px;
}
</style>