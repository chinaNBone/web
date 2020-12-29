<template>
  <el-dialog title="导入课程" :visible.sync="visible" width="500px" :close-on-click-modal="false">
    <div class="import-div">
      <el-upload
        class="avatar-uploader1"
        :action="importUrl"
        :show-file-list="false"
        :headers="importHeader"
        :data="{ projectId: projectId }"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
      >
        <el-button type="primary" :loading="loading">选择导入文件</el-button>
      </el-upload>
      <!-- <el-button type="primary" @click="download" class="import-button">下载导入模板</el-button> -->
    </div>
    <div
      class="import-loading"
      v-if="loading || !list.failedExist"
      v-loading="loading"
      element-loading-background="#fff"
      element-loading-text="导入解析中，请稍后..."
    >{{message}}</div>
    <el-table :data="list.failList" max-height="300" v-if="list.failedExist && !loading">
      <el-table-column label="错误行号" prop="rowNum" width="120"></el-table-column>
      <el-table-column label="错误信息" prop="errorMsg" show-overflow-tooltip header-align="center"></el-table-column>
    </el-table>
    <el-form label-width="120px" label-position="right">
      <el-form-item align="right" class="dialog-btns">
        <el-button type="primary" @click="visible=false">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "importCourse",
  props: ["show"],
  data() {
    return {
      list: {},
      isInit: false,
      loading: false,
      visible: false,
      message: "",
      importUrl: this.$setting.baseURL + "/api/edu/timetable/import",
      downloadUrl: this.$setting.baseURL + "/api/web/template/download/timetable",
      projectId: localStorage.getItem("projectId")
    };
  },
  computed: {
    importHeader() {
      return {
        Authorization: this.vx_accessToken
      };
    }
  },
  watch: {
    show(v) {
      this.visible = v;
    },
    visible(v) {
      if (v) {
        this.init();
      } else {
        this.$emit("close");
      }
    }
  },
  methods: {
    init() {
      this.list = {};
      this.loading = false;
      this.message = `点击左上角 "选择导入文件"按钮 导入课程`;
    },
    beforeUpload(file) {
      let size = file.size / 1024 / 1024 <= 10;
      if (!size) {
        this.$message.error("上传文件大小不得超过10MB");
        return false;
      }
      // 截取文件名后缀
      let type1 = file.name.lastIndexOf(".");
      let type2 = file.name.length;
      let type = file.name.substring(type2, type1 + 1);
      if (type != "xlsx" && type != "xls") {
        this.$message.warning("请选择上传格式为xls/xlsx");
        return false;
      }
      this.loading = true;
    },
    //导入
    handleSuccess(res) {
      this.loading = false;
      if (res.code == 0) {
        this.list = res.data;
        this.message = `导入成功${res.data.list.length}个课程,  失败${res.data.failList.length}个课程`;
        this.$notify.success({
          title: "导入结果",
          message: this.message
        });
        this.$emit("complete", res.data);
      }
    },
    download() {
      window.open(this.downloadUrl);
    }
  }
};
</script>
<style lang="scss" scoped>
.import-div {
  display: flex;
  margin-bottom: 10px;
  .import-button {
    margin-left: 10px;
  }
}
.import-loading {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.import-alert {
  margin-bottom: 10px;
}
</style>