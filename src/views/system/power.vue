<!-- 角色权限 -->
<template>
  <div>
    <div class="l-mod-tool">
      <h2>角色权限管理</h2>
    </div>
    <div class="m-search">
      <el-button type="primary" @click="openEdit('addFlag')">添加角色</el-button>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <!-- <el-table-column prop="remark" label="角色描述"></el-table-column> -->
      <el-table-column prop label="创建时间">
        <template slot-scope="scope">{{ scope.row.createdDt | moment("YYYY-MM-DD HH:mm") }}</template>
      </el-table-column>
      <el-table-column prop="createName" label="创建人"></el-table-column>
      <el-table-column label="操作" align="left" width="300">
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.id != 1 &&
                scope.row.id != 2 &&
                scope.row.id != 3 &&
                scope.row.id != 4 &&
                scope.row.id != 11
            "
          >
            <el-button type="text" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="text" size="small" @click="openMenber(scope.row)"
              >成员维护</el-button
            >
            <el-button type="text" size="small" @click="openPower(scope.row)"
              >权限维护</el-button
            >-->
            <el-button type="text" size="small" @click="rowDel(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 创建、编辑角色 -->
    <el-dialog
      :title="powerTitle"
      :visible.sync="dialogVisible1"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :model="editForm" label-width="100px" label-position="right">
        <el-form-item
          label="角色名称:"
          prop="roleName"
          :rules="[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            {
              min: 1,
              max: 20,
              message: '角色名称最大长度为20',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            class="name-input"
            placeholder="请输入角色名称"
            v-model.trim="editForm.roleName"
            maxlength="20"
          ></el-input>
          <span style="padding-left:15px;">{{ editForm.roleName.length }}/20</span>
        </el-form-item>
        <el-form-item label="角色描述:">
          <el-input
            type="textarea"
            :rows="4"
            style="width: 340px;"
            placeholder="请输入角色描述"
            v-model.trim="editForm.remark"
          ></el-input>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closeEdit">取消</el-button>
          <el-button v-if="powerTitle == '添加角色'" type="primary" @click="addPower">保存</el-button>
          <el-button v-else type="primary" @click="editPower">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 成员维护 -->
    <el-dialog
      :visible.sync="dialogVisible2"
      :before-close="closeMenber"
      width="600px"
      class="menber-dialog"
      title="普通管理员 &gt; 成员维护"
      :close-on-click-modal="false"
    >
      <div class="menber-box">
        <!-- 左边待选择成员 -->
        <div class="left-menber menber-content">
          <div class="select-box">
            <el-input class="select-input" v-model.trim="roleName" placeholder></el-input>
            <el-button class="select-btn" type="primary" @click="getAdminList">查询</el-button>
          </div>
          <div class="menber-list">
            <ul>
              <li v-for="(item, index) in adminList" :key="index" class="menber-item">
                <span>
                  <i class="el-icon-user-solid"></i>
                  <span>{{ item.userName }}</span>
                </span>
                <span>
                  <i class="el-icon-circle-plus" @click="addItemAdmin(item, index)"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 中间间隔符 -->
        <div class="menber-line">
          <i class="el-icon-arrow-right"></i>
        </div>
        <!-- 左边待选择成员 -->
        <div class="right-menber menber-content">
          <div class="select-box f-f-clearfix">
            <span class="select-text">以选择{{ roleList.length || 0 }}项</span>
            <el-button class="select-clear" @click="removeAllAdmin">清空</el-button>
          </div>
          <div class="menber-list">
            <ul>
              <li v-for="(item, index) in roleList" :key="index" class="menber-item">
                <span>
                  <i class="el-icon-user-solid"></i>
                  <span>{{ item.userName }}</span>
                </span>
                <span>
                  <i class="el-icon-error" @click="removeItemAdmin(item, index)"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="menber-fooler">
        <el-button @click="closeMenber">取 消</el-button>
        <el-button type="primary" @click="setRoleAdmin">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限维护 -->
    <el-dialog
      title="普通管理员 &gt; 权限维护"
      :visible.sync="dialogVisible3"
      width="750px"
      class="power-dialog"
      :before-close="closePower"
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :model="powerForm" label-width="120px" label-position="right">
        <div v-for="(item, index) in powerList" :key="index">
          <el-form-item :label="item.title" size="small" style="margin: 0;">
            <el-checkbox v-model="powerForm[item.id]" :label="item.title" border></el-checkbox>
          </el-form-item>
          <el-divider></el-divider>
        </div>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closePower">取消</el-button>
          <el-button type="primary" @click="setPower">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { constants } from "crypto";
export default {
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      powerTitle: "",
      // ---------------------
      loading: false,
      listTable: [],
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1
      },
      editForm: {
        id: "",
        roleName: "",
        remark: ""
      },
      // 成员维护部分
      roleId: "",
      roleName: "",
      roleList: [],
      adminList: [],
      // 权限维护部分
      powerList: [],
      powerForm: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    add() {
      this.dialogVisible1 = true;
    },
    handleClose() {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
      this.$refs["ruleForm"].resetFields();
    },
    // 权限维护
    openPower(val) {
      this.dialogVisible3 = true;
      this.roleId = val.id;
      this.getRolePowerList();
    },
    closePower() {
      this.dialogVisible3 = false;
      this.roleId = "";
      this.powerList = [];
      this.powerForm = {};
    },
    setPower() {
      let ids = [];
      Object.keys(this.powerForm).forEach(item => {
        ids.push(item);
      });
      if (ids.length == 0) {
        this.$message({
          message: "请先选择权限功能",
          type: "warning"
        });
        return false;
      }
      let par = {
        roleId: this.roleId,
        permissionIds: ids.toString()
      };
      this.$http
        .post("/api/upms/role/changeRolePermission", par)
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getList();
          this.closePower();
        })
        .catch(msg => {});
    },
    // 成员维护
    openMenber(val) {
      this.dialogVisible2 = true;
      this.roleId = val.id;
      this.getRoleAdmin();
      this.getAdminList();
    },
    closeMenber() {
      this.dialogVisible2 = false;
      this.roleId = "";
      this.roleName = "";
      this.roleList = [];
      this.adminList = [];
    },
    addItemAdmin(val, index) {
      // if (this.roleList.length > 0) {
      //   this.$message({
      //     message: "每个角色只能添加一个成员",
      //     type: "warning"
      //   });
      //   return false;
      //   // for (let i = 0; i < this.roleList.length; i++) {
      //   //   if (this.roleList[i].adminId == val.adminId) {

      //   //   }
      //   // }
      // }
      this.roleList.push(val);
      this.adminList.splice(index, 1);
    },
    removeItemAdmin(val, index) {
      if (this.adminList.length > 0) {
        for (let i = 0; i < this.adminList.length; i++) {
          if (this.adminList[i].adminId == val.adminId) {
            this.roleList.splice(index, 1);
            return false;
          }
        }
      }
      this.adminList.push(val);
      this.roleList.splice(index, 1);
    },
    removeAllAdmin() {
      if (this.roleList.length > 0) {
        for (let i = 0; i < this.roleList.length; i++) {
          for (let j = 0; j < this.adminList.length; j++) {
            if (this.adminList[j].adminId == this.roleList[i].adminId) {
              this.roleList.splice(i, 1);
              // break;
              if (this.roleList.length == 0) {
                return;
              }
            }
          }
          this.adminList.push(this.roleList[i]);
        }
        this.roleList = [];
      }
    },
    setRoleAdmin() {
      let ids = [];
      for (let i = 0; i < this.roleList.length; i++) {
        ids.push(this.roleList[i].adminId);
      }
      let par = {
        roleId: this.roleId,
        adminIds: ids.toString()
      };
      this.$http
        .post("/api/upms/role/changeRoleAdmin", par)
        .then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getList();
          this.closeMenber();
        })
        .catch(msg => {});
    },
    // 编辑角色
    openEdit(val) {
      this.dialogVisible1 = true;
      if (val == "addFlag") {
        this.powerTitle = "添加角色";
      } else {
        this.powerTitle = "编辑角色";
        this.editForm.id = val.id;
        this.editForm.roleName = val.roleName;
        this.editForm.remark = val.remark;
      }
    },
    closeEdit() {
      this.dialogVisible1 = false;
      this.editForm = {
        id: "",
        roleName: "",
        remark: ""
      };
    },
    addPower() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/upms/role/add", this.editForm)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getList();
              this.closeEdit();
            })
            .catch(msg => {});
        }
      });
    },
    editPower() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/upms/role/edit", this.editForm)
            .then(res => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.getList();
              this.closeEdit();
            })
            .catch(msg => {});
        }
      });
    },
    // 删除当前行操作
    rowDel(val) {
      let par = {
        id: val
      };
      this.$confirm("您确定要删除该角色吗？?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("/api/upms/role/delete", par)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取权限列表
    getRolePowerList() {
      let par = {
        roleId: this.roleId
      };
      this.$http
        .post("/api/upms/role/getPermission", par)
        .then(res => {
          this.powerList = res.data;
          this.getRolePower();
        })
        .catch(msg => {});
    },
    // 获取角色权限列表
    getRolePower() {
      let par = {
        roleId: this.roleId
      };
      this.$http
        .post("/api/upms/role/getRolePermission", par)
        .then(res => {
          let flag = {};
          for (let item in res.data) {
            flag[res.data[item].permissionId] = true;
          }
          this.powerForm = flag;
        })
        .catch(msg => {});
    },
    // 获取角色成员列表
    getRoleAdmin() {
      let par = {
        roleId: this.roleId
      };
      this.$http
        .post("/api/upms/role/getRoleAdmin", par)
        .then(res => {
          this.roleList = res.data;
        })
        .catch(msg => {});
    },

    // 获取管理员列表
    getAdminList() {
      let par = {
        roleId: this.roleId,
        name: this.roleName
      };
      this.$http
        .post("/api/upms/role/getAvailableManagerList")
        .then(res => {
          this.adminList = res.data;
        })
        .catch(msg => {});
    },
    // 获取列表
    getList() {
      this.loading = true;
      this.$http
        .post("/api/upms/role/list")
        .then(res => {
          this.listTable = res.data;
          this.loading = false;
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss">
//   成员维护部分样式
.menber-dialog {
  & .menber-box {
    width: 100%;
    height: 400px !important;
    margin-bottom: 20px;
    & .menber-content {
      border: solid 1px #ccc;
      width: 260px;
      height: 400px;
      overflow-y: auto;
      display: inline-block;
      .select-box {
        padding: 10px;
        border-bottom: solid 1px #ccc;
        .select-input,
        .select-text {
          width: 150px;
          margin-right: 15px;
        }
        .select-text {
          display: inline-block;
        }
      }
      .menber-list {
        list-style: none;
        padding: 0;
        margin: 0;
        .menber-item {
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .el-icon-user-solid {
            padding: 0 5px;
          }
          .el-icon-error,
          .el-icon-circle-plus {
            cursor: pointer;
            padding: 0 5px;
          }
        }
      }
    }
    .menber-line {
      margin: 0 13px;
      display: inline-block;
      vertical-align: top;
      .el-icon-arrow-right {
        line-height: 400px;
        font-weight: bold;
      }
    }
  }
  .menber-fooler {
    text-align: right;
  }
}
//权限管理弹窗部分样式
.power-dialog {
  .el-form-item {
    .el-checkbox__label {
      font-size: 14px !important;
    }
  }
  .el-divider {
    margin: 8px 0;
    background-color: #ebeef5;
  }
}
</style>
