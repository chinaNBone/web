<!-- 专家管理 -->
<template>
  <div>
    <div v-if="!flag" class="m-search">
      <div>
        <el-upload
          class="upload-demo"
          :action="saveUrl"
          :data="upData"
          :headers="headers"
          :on-success="handleSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button type="primary">导入专家</el-button>
        </el-upload>
        <el-button type="primary" @click="addUser">添加专家</el-button>
        <el-button type="warning" @click="downTable">模板下载</el-button>
      </div>
      <div>
        <el-input v-model="list.search" placeholder="输入姓名搜索" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList()">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="image-logo-box">
            <img
              :src="(scope.row.avatar==null||scope.row.avatar=='')?defineImg:imgUrl+scope.row.avatar"
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">{{ scope.row.gender==1?'男':'女' }}</template>
      </el-table-column>
      <!-- <el-table-column prop="profession" label="专业"></el-table-column>
      <el-table-column prop="education" label="学历"></el-table-column>-->
      <el-table-column prop="title" label="职称"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column label="操作" align="center" width="100" v-if="!flag">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="rowDel(scope.row.userId)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px 0;">
      <!-- <el-button type="primary" @click="addExpert()">保 存</el-button> -->
    </div>
    <el-dialog
      title="导入专家团队"
      :visible.sync="dialogVisible1"
      width="700px"
      :before-close="closecourseForm"
      :close-on-click-modal="false"
    >
      <el-alert title="以下信息未导入成功" type="warning"></el-alert>
      <el-table
        :data="listTable2.slice((upLoadPage.currentPage-1)*upLoadPage.pageSize,upLoadPage.currentPage*upLoadPage.pageSize)"
        v-loading="loading"
      >
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="position" label="职务"></el-table-column>
        <el-table-column prop="errorMsg" label="原因"></el-table-column>
      </el-table>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCuChange"
        :current-page="upLoadPage.currentPage"
        :page-size="upLoadPage.pageSize"
        :total="listTable2.length"
        layout="total, prev, pager, next"
      ></el-pagination>
      <el-form label-width="120px" label-position="right">
        <el-form-item align="right" class="dialog-btns">
          <el-button type="primary" @click="closecourseForm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加专家 -->
    <el-dialog
      v-if="dialogVisible"
      title="添加专家"
      :visible.sync="dialogVisible"
      width="660px"
      style="margin:50px 0 0 50px;"
      :closeOnClickModal="false"
      :before-close="handleClose"
    >
      <el-row class="search-row">
        <div class="f-fl">
          <el-input v-model="searchUser" size="medium" placeholder="输入专家搜索"></el-input>
          <el-button
            type="primary"
            style="background:rgba(255, 153, 0, 1);border:none"
            size="medium"
            @click="getUserList('search')"
          >搜索</el-button>
        </div>
      </el-row>
      <!-- table表格 -->
      <el-table
        :data="tableData"
        highlight-current-row
        :row-key="getRowKey"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <div class="image-logo-box">
              <img
                :src="(scope.row.avatar==null||scope.row.avatar=='')?defineImg:imgUrl+scope.row.avatar"
                alt
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">{{ scope.row.gender==1?'男':'女' }}</template>
        </el-table-column>
        <el-table-column prop="title" label="职称"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveList">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/api/edu/project/importUserTeam",
      imgUrl: this.$setting.imageUrl,
      defineImg: require("../../../../public/images/avatar_normal_200.jpg"),
      headers: { Authorization: this.$store.state.global.access_token },
      upData: {
        type: 1,
        projectId: this.$route.query.id
      },
      //项目状态判断只读
      projectStatus: localStorage.getItem("projectStatus"),
      adminTitle: "",
      list: {
        search: "",
        status: ""
      },
      //添加专家
      dialogVisible: false,
      tableData: [],
      searchUser: "",
      userIds: "",
      // -------
      dialogVisible1: false,
      listTable2: [],
      // ----------------
      loading: false,
      roleList: [],
      listTable: [],
      listPage: {
        pageSize: 6,
        total: 0,
        pageNo: 1
      },
      //前端分页
      upLoadPage: {
        currentPage: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 5
      },
      editMsg: {
        id: "",
        userName: "",
        realName: "",
        mobile: "",
        gender: 1,
        avatar: "",
        roleId: ""
      },
      editMsgRules: {
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change"
          }
        ],
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        realName: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: "blur"
          }
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
        avatar: [{ required: true, message: "请选择头像", trigger: "change" }],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    dialogVisible(newV, oldV) {
      if (newV == false) {
        this.userIds = "";
      }
    }
  },
  mounted() {
    this.getUserList();
    if (this.$route.query.isClone != 1) {
      this.getList();
    }
  },
  methods: {
    //添加专家
    addUser() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.tableData.forEach(item => {
          this.listTable.forEach(item2 => {
            if (item.id == item2.userId) {
              this.$refs.multipleTable.toggleRowSelection(item, true);
            }
          });
        });
      });
    },
    getUserList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.$http
        .post("/api/upms/user/searchRoleUserPage", {
          pageNo: this.listPage.pageNo,
          pageSize: this.listPage.pageSize,
          search: this.searchUser,
          roleId: 3
        })
        .then(res => {
          this.listPage.total = res.data.total;
          this.tableData = res.data.records;
        });
    },
    handleSelectionChange(val) {
      this.userIds = "";
      for (var i of val) {
        this.userIds = this.userIds + i.id + ",";
      }
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getUserList();
    },
    saveList() {
      if (this.userIds == "") {
        this.$message({
          message: "请选择专家",
          type: "warning"
        });
      } else {
        this.$http
          .post("/api/edu/project/batchAddTeam", {
            projectId: this.$route.query.id,
            type: 1,
            userIds: this.userIds
          })
          .then(res => {
            this.getList();
            this.dialogVisible = false;
          });
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getRowKey(row) {
      return row.id;
    },
    //导入失败名单前端分页
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    //导入
    handleSuccess(res, file) {
      if (res.code == 0) {
        this.getList();
        if (res.data.length > 0) {
          this.listTable2 = res.data;
          this.dialogVisible1 = true;
        }
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
      }
    },
    beforeUpload(file) {
      if (this.$route.query.id == undefined) {
        this.$message({
          message: "需保存项目才可导入",
          type: "warning"
        });
        return false;
      }
    },
    //----------
    handleAvatarSuccess(res, file) {
      this.editMsg.avatar = res.data.path;
    },
    beforeAvatarUpload(file) {
      let size = file.size / 1024 / 1024 < 1;
      if (file.type != "image/jpeg" && file.type != "image/png") {
        this.$message.error("请选择图片的格式为 jpg或png");
        return false;
      }
      if (!size) {
        this.$message.error("上传图片大小不得超过1MB");
        return false;
      }
    },
    rowDel(val) {
      this.$confirm("您确定要移除该专家吗?", "提示", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = { type: 1, projectId: this.$route.query.id, userId: val };
          this.$http
            .post("/api/edu/project/removeUserTeamByUserId", par)
            .then(res => {
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    downTable() {
      window.location.href =
        this.$setting.baseURL + `/api/web/template/download/manager`;
    },
    getList() {
      this.loading = true;
      let par = {
        projectId: this.$route.query.id,
        type: 1,
        keyword: this.list.search
      };
      this.$http
        .post("/api/edu/project/getUserTeam", par)
        .then(res => {
          this.loading = false;
          this.listTable = res.data;
          this.$emit("listTable", this.listTable);
        })
        .catch(msg => {});
    },
    closecourseForm() {
      this.dialogVisible1 = false;
    }
  }
};
</script>
<style lang="scss"></style>
