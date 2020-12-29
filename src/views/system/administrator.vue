<!-- 管理员管理 -->
<template>
  <div>
    <div class="l-mod-tool">
      <h2>账号管理</h2>
    </div>
    <div class="m-search">
      <div>
        <el-button type="primary" @click="addAdmin('add')">添加账号</el-button>
        <el-button class="btn-add1" @click="importUsers()">导入账号</el-button>
        <el-button class="btn-add1" @click="exportUser()">导出账号</el-button>
        <el-button class="btn-add1" @click="downTable()">模板下载</el-button>
      </div>
      <div>
        <el-input
          v-model="list.search"
          placeholder="输入姓名或手机号搜索"
          class="s-el-input search-input"
        ></el-input>
        <el-select
          v-model="list.status"
          placeholder="请选择"
          class="s-el-input"
        >
          <el-option label="全部" value></el-option>
          <el-option label="已激活" :value="0"></el-option>
          <el-option label="已冻结" :value="1"></el-option>
        </el-select>
        <el-button class="btn-search" @click="getList('search')"
          >搜索</el-button
        >
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="image-logo-box">
            <img
              :src="
                scope.row.avatar
                  ? imgUrl + scope.row.avatar
                  : '/images/avatar_normal_200.jpg'
              "
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">{{
          ["", "男", "女"][scope.row.gender]
        }}</template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="110"
      ></el-table-column>
      <el-table-column prop="createdDt" label="状态">
        <template slot-scope="scope">{{
          ["已激活", "已冻结"][scope.row.status]
        }}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        width="280"
        v-if="$role.isSuperAdmin()"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editAdmin(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="scope.row.id != 1"
            @click="changeStatus(scope.row)"
            >{{ ["冻结", "激活"][scope.row.status] }}</el-button
          >
          <el-button
            v-if="scope.row.wxOpenId"
            type="text"
            size="small"
            @click="delBind(scope.row.id)"
            >解绑</el-button
          >
          <el-button
            v-if="scope.row.id != 1"
            type="text"
            size="small"
            @click="delAdmin(scope.row.id)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.id != 1"
            type="text"
            size="small"
            @click="openPass(scope.row)"
            >重置密码</el-button
          >
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
    <!--添加、 编辑管理员 -->
    <el-dialog
      :title="adminTitle"
      :visible.sync="dialogVisible1"
      width="500px"
      :before-close="closeEditMsg"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editMsg"
        :rules="editMsgRules"
        :model="editMsg"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="头像:" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="saveUrl"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="text-align: left"
          >
            <div v-if="editMsg.avatar" class="image-con image-logo">
              <img :src="imgUrl + editMsg.avatar" class="avatar" />
              <div class="imang_hover">
                <span>更换图片</span>
              </div>
            </div>
            <div v-else class="image-icon image-logo">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div class="imang_hover">
                <span>上传图片</span>
              </div>
            </div>
            <div class="image-detail">
              <p style>
                注：图片大小1M以内，
                <br />支持格式png/jpg/jpeg
              </p>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名:" prop="userName" style="width: 420px">
          <el-input v-model.trim="editMsg.userName"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" prop="realName" style="width: 420px">
          <el-input v-model.trim="editMsg.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-radio v-model="editMsg.gender" :label="1">男</el-radio>
          <el-radio v-model="editMsg.gender" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile" style="width: 420px">
          <el-input v-model.trim="editMsg.mobile"></el-input>
        </el-form-item>
        <el-form-item label="单位:" prop="unit" style="width: 420px">
          <el-input v-model.trim="editMsg.unit"></el-input>
        </el-form-item>
        <el-form-item label="地址:" prop="address" style="width: 420px">
          <el-input v-model.trim="editMsg.address"></el-input>
        </el-form-item>

        <el-form-item label="角色:" prop="roleId" style="width: 420px">
          <el-radio v-model="editMsg.roleId" :label="4">学员</el-radio>
          <el-radio v-model="editMsg.roleId" :label="3">讲师</el-radio>
          <el-radio v-model="editMsg.roleId" :label="2">管理员</el-radio>
        </el-form-item>

        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closeEditMsg">取消</el-button>
          <el-button
            v-if="adminTitle == '添加账户'"
            type="primary"
            @click="addUser()"
            >保存</el-button
          >
          <el-button v-else type="primary" @click="setEditMsg">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="closePassword"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editPass"
        :rules="editPassRules"
        :model="editPass"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="用户名:">{{ editPass.userName }}</el-form-item>
        <el-form-item label="登录密码:" style="width: 420px" prop="password">
          <el-input
            v-model.trim="editPass.password"
            placeholder="6-16位密码，不能用空格，区分大小写"
          ></el-input>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closePassword">取消</el-button>
          <el-button type="primary" @click="setPassword">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="导入用户"
      :visible.sync="dialogUserVisible"
      :close-on-click-modal="false"
      @close="onCloseDialog"
      style="margin-top: 15vh"
      width="480px"
    >
      <div>
        <el-upload
          class="avatar-uploader1"
          :action="fileUrl"
          :show-file-list="false"
          :on-success="importUsersSuccess"
          style="text-align: left"
        >
          <!-- :data="{ file: importFile }" -->
          <el-button
            style="background: rgba(255, 153, 0, 1); border: none"
            type="primary"
            >选择文件导入</el-button
          >
        </el-upload>
        <div slot="tip" class="slot-line">
          <span class="slot-center"
            >点击左上角“选择文件”按钮选择文件进行学员名单导入</span
          >
          <div class="faileList-box" v-if="importFile.failList.length > 0">
            <h3>导入异常：</h3>
            <div
              class="faileList"
              v-for="item in importFile.failList"
              :key="item.id"
            >
              第{{ item.rowNum }}行，失败原因{{ item.errorMsg }}
            </div>
          </div>
        </div>
        <el-form label-width="120px" label-position="right">
          <el-form-item align="right" class="dialog-btns">
            <el-button type="primary" @click="dialogUserVisible = false"
              >关闭</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pathFlag: "list",
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      fileUrl: this.$setting.baseURL + "/api/upms/user/importUsers",
      fileFlag: false,
      importFile: { failList: [] },
      adminTitle: "",
      list: {
        search: "",
        status: "",
      },
      // -------
      dialogVisible1: false,
      dialogVisible2: false,
      dialogUserVisible: false,
      // ----------------
      loading: false,
      roleList: [],
      listTable: [],
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1,
      },
      editMsg: {
        id: "",
        avatar: "",
        userName: "",
        realName: "",
        gender: 1,
        mobile: "",
        unit: "",
        userName: "",
        roleId: 4,
      },
      editPass: {
        id: "",
        userName: "",
        password: "",
      },
      editMsgRules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        realName: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: "blur",
          },
        ],

        avatar: [{ required: true, message: "请选择头像", trigger: "change" }],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9])[0-9]{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
      editPassRules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/,
            message: "请输入6-16位且包含数组大小写字母的密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getRoleList();
    this.getList();
  },
  watch: {
    dialogUserVisible(newv, oldv) {
      if (newv == false) {
        this.importFile = { failList: [] };
      }
    },
  },
  methods: {
    onCloseDialog() {
      this.dialogUserVisible = false;
      // this.fildIdsFlag = "";
    },
    importUsers() {
      this.dialogUserVisible = true;
    },
    importUsersSuccess(res, file) {
      if (res.code == 0) {
        this.importFile = res.data;
        if (res.data.failList.length == 0) {
          this.dialogUserVisible = false;
        }
        this.getList();
      } else {
        this.importFile = { failList: [] };
      }
    },
    handleCurrentChange(val) {
      console.log(val);
      this.listPage.pageNo = val;
      this.getList();
    },
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
    addUser() {
      this.$refs["editMsg"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/upms/user/add", this.editMsg)
            .then((res) => {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.getList();
              this.closeEditMsg();
            })
            .catch((msg) => {});
        }
      });
    },
    // 编辑管理员
    editAdmin(val) {
      this.$parent.pathChild("adminEdit", val);
      this.$parent.$route.query.id = val.id;
    },
    // 编辑管理员
    addAdmin(val) {
      this.dialogVisible1 = true;
      if (val == "add") {
        this.adminTitle = "添加账户";
      } else {
        this.adminTitle = "编辑账户";
        this.editMsg = val;

        // for (let j = 0; j < this.roleList.length; j++) {
        //   if (val.roleName == this.roleList[j].roleName) {
        //     this.editMsg.roleId = this.roleList[j].id;
        //   }
        // }
      }
    },
    closeEditMsg() {
      this.dialogVisible1 = false;
      this.editMsg = {
        id: "",
        avatar: "",
        userName: "",
        realName: "",
        gender: 1,
        mobile: "",
        unit: "",
        userName: "",
        roleId: 4,
      };
    },
    setEditMsg() {
      this.$refs["editMsg"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/upms/user/edit", this.editMsg)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.getList();
              this.closeEditMsg();
            })
            .catch((msg) => {});
        }
      });
    },
    // 更变状态
    changeStatus(val) {
      let statusText = ["冻结", "激活"][val.status];
      let status = 1;
      if (val.status == 1) {
        status = 0;
      } else {
        status = 1;
      }
      let par = {
        id: val.id,
        status: status,
      };
      this.$confirm("您确定要" + statusText + "该账号吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/upms/user/freeze", par)
            .then((res) => {
              this.$message({
                type: "success",
                message: statusText + "成功!",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    // 重置密码

    // 编辑密码
    openPass(val) {
      let par = {
        id: val.id,
      };
      this.$confirm("您确定要重置该管理员的密码吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/upms/user/resetPassword", par)
            .then((res) => {
              this.$message({
                message: "重置成功",
                type: "success",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});

      // this.dialogVisible2 = true;
      // this.editPass.id = val.id;
      // this.editPass.userName = val.userName;
    },
    closePassword() {
      this.dialogVisible2 = false;
      this.editPass = {};
    },
    setPassword() {
      this.$refs["editPass"].validate((valid) => {
        if (valid) {
          let par = {
            id: this.editPass.id,
            password: this.editPass.password,
          };
          this.$http
            .post("/api/upms/user/resetPassword", par)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.getList();
              this.closePassword();
            })
            .catch((msg) => {});
        }
      });
    },
    delBind(val) {
      let par = {
        id: val,
      };
      this.$confirm("您确定要解绑该用户账号吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/upms/user/unbind", par)
            .then((res) => {
              this.$message({
                type: "success",
                message: "解绑成功!",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    delAdmin(val) {
      let par = {
        id: val,
      };
      this.$confirm("您确定要删除该用户账号吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/upms/user/delete", par)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    // 导出
    exportUser() {
      let par = {
        status: this.list.status,
        search: this.list.search,
        pageSize: this.listPage.pageSize,
        currentPage: this.listPage.pageNo,
      };
      this.$http
        .post("/api/upms/user/export", par)
        .then((res) => {
          let exlList = res.data;
          let title = "账号列表";
          let sheet = "账号列表";
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["用户名", "姓名", "性别", "手机号", "角色"];
            let filterVal = [
              "userName",
              "realName",
              "gender",
              "mobile",
              "roleName",
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch((msg) => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) =>
        filterVal.map((j) => {
          if (j == "gender") {
            return v[j] == 1 ? "男" : v[j] == 2 ? "女" : "";
          }
          return v[j];
        })
      );
      return arr;
    },
    // 获取角色列表
    getRoleList() {
      this.$http
        .post("/api/upms/role/list")
        .then((res) => {
          this.roleList = res.data;
        })
        .catch((msg) => {});
    },
    downTable() {
      window.location.href =
        this.$setting.baseURL + `/api/web/template/download/user`;
    },
    // 获取list
    getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        status: this.list.status,
        search: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
      };
      this.$http
        .post("/api/upms/user/list", par)
        .then((res) => {
          let list = {};
          let item = res.data.records;
          for (let i = 0; i < item.length; i++) {
            for (let j = 0; j < this.roleList.length; j++) {
              if (item[i].roleIds == this.roleList[j].id) {
                item[i].roleTitle = this.roleList[j].roleName;
              }
            }
          }
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = item;
          this.loading = false;
        })
        .catch((msg) => {});
    },
  },
};
</script>
<style lang="scss">
.search-input {
  width: 180px !important;
}
</style>
