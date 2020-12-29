<!-- 管理员管理 -->
<template>
  <div>
    <div v-if="!flag" class="m-search">
      <div>
        <el-button type="primary" @click="addAdmin()" icon="el-icon-plus">添加课程</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading" border>
      <el-table-column prop="stage" label="阶段" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="module" label="模块" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="title" label="专题名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="period" label="学时" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="内容要点" show-overflow-tooltip></el-table-column>
      <el-table-column prop="realName" label="授课专家" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unit" label="工作单位" show-overflow-tooltip></el-table-column>
      <el-table-column prop="position" label="职称" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="left" width="94" v-if="!flag">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editAdmin(scope.row)" class="color-green">修改</el-button>
          <el-button
            type="text"
            size="small"
            @click="rowDel(scope.row.indexKey)"
            class="color-red"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!flag" style="margin:20px 0;">
      <el-button type="primary" @click="addCourseFrom()">保 存</el-button>
    </div>
    <!--添加、 编辑管理员 -->
    <el-dialog
      :title="adminTitle"
      :visible.sync="dialogVisible1"
      v-if="dialogVisible1"
      width="500px"
      :before-close="closecourseForm"
      :close-on-click-modal="false"
    >
      <el-form
        ref="courseForm"
        :rules="courseFormRules"
        :model="courseForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="阶段:" prop="stage" style="width: 420px;">
          <el-input v-model.trim="courseForm.stage" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="模块:" prop="module" style="width: 420px;">
          <el-input v-model.trim="courseForm.module" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="专题名称:" prop="title" style="width: 420px;">
          <el-input v-model.trim="courseForm.title" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="学时:" prop="period" style="width: 420px;">
          <el-input v-model.number="courseForm.period" maxlength="2"></el-input>
        </el-form-item>
        <el-form-item label="内容要点:" prop="content" style="width: 420px;">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            :rows="2"
            v-model.trim="courseForm.content"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="授课专家:" prop="userId" style="width: 420px;" class="user">
          <el-select
            v-model="courseForm.userId"
            :remote-method="getUserExecutiveList"
            @focus="userExecutiveClick"
            remote
            filterable
            placeholder="请选择授课专家"
          >
            <el-option v-for="item in list" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closecourseForm">取消</el-button>
          <el-button type="primary" @click="addCourse()">保存</el-button>
        </el-form-item>
      </el-form>
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
      adminTitle: "",
      list: [],
      dialogVisible1: false,
      // ----------------
      //项目状态判断只读
      projectStatus: localStorage.getItem("projectStatus"),
      loading: false,
      listTable: [],
      courseForm: {
        stage: "",
        module: "",
        title: "",
        period: "",
        content: "",
        userId: "",
        isParctice: 0
      },
      courseFormRules: {
        stage: [{ required: true, message: "请输入阶段", trigger: "blur" }],
        module: [{ required: true, message: "请输入模块", trigger: "blur" }],
        title: [{ required: true, message: "请输入专题名称", trigger: "blur" }],
        period: [
          {
            type: "number",
            required: true,
            message: "请输入学时",
            trigger: "blur"
          }
        ],
        content: [
          { required: true, message: "请输入内容要点", trigger: "blur" }
        ],
        userId: [{ required: true, message: "请选择授课专家", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.isClone != 1) {
      this.getList();
    }
  },
  methods: {
    addCourse() {
      this.$refs["courseForm"].validate(valid => {
        if (valid) {
          if (this.adminTitle == "添加课程") {
            let name = this.list.find(val => {
              return val.id == this.courseForm.userId;
            });
            this.courseForm.realName = name.realName;
            this.courseForm.unit = name.unit;
            this.courseForm.position = name.position;
            this.listTable.push(this.courseForm);
            for (var i = 0; i < this.listTable.length; i++) {
              this.listTable[i].indexKey = i;
            }
            this.closecourseForm();
          } else {
            let name2 = this.list.find(val => {
              return val.id == this.courseForm.userId;
            });
            console.log(name2);
            this.courseForm.realName = name2.realName;
            this.courseForm.unit = name2.unit;
            this.courseForm.position = name2.position;
            this.listTable.splice(this.courseForm.indexKey, 1, this.courseForm);
            this.closecourseForm();
          }
        }
      });
    },
    //添加
    addAdmin() {
      this.dialogVisible1 = true;
      this.adminTitle = "添加课程";
      this.courseForm = {
        isParctice: 0
      };
    },
    // 编辑管理员
    editAdmin(val) {
      this.dialogVisible1 = true;
      this.adminTitle = "编辑课程";
      this.courseForm = JSON.parse(JSON.stringify(val));
    },
    userExecutiveClick() {
      if (!this.userExecutiveInit || this.executivePersonIds.length < 1) {
        this.getUserExecutiveList();
      }
    },
    async getUserExecutiveList(search) {
      this.list = await this.getUserList(search);
    },
    getUserList(search) {
      return new Promise((reslove, reject) => {
        this.$http
          .post("/api/upms/user/getUserList", {
            pageNo: 1,
            pageSize: 7,
            name: search || ""
          })
          .then(res => reslove(res.data));
      });
    },
    closecourseForm() {
      this.dialogVisible1 = false;
    },

    rowDel(val) {
      this.$confirm("您确定要移除该课程吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          for (var i = 0; i < this.listTable.length; i++) {
            if (this.listTable[i].indexKey == val) {
              this.listTable.splice(i, 1);
            }
          }
        })
        .catch(() => {});
    },
    // 保存课程
    addCourseFrom() {
      let par = {
        // TODO
        projectId: this.$route.query.id,
        courses: JSON.stringify(this.listTable)
      };
      this.$http
        .post("/api/edu/project/addOrEditProjectCourse", par)
        .then(res => {
          // let list = {};
          // let item = res.data;
          // for (let i = 0; i < item.length; i++) {
          //   for (let j = 0; j < this.list.length; j++) {
          //     if (item[i].teacherId == this.list[j].id) {
          //       item[i].teacherName = this.list[j].name;
          //     }
          //   }
          // }
          this.getList();
          this.loading = false;
          this.$message({
            message: res.message,
            type: "success"
          });
        })
        .catch(msg => {});
    },
    // 获取角色列表
    // getRoleList() {
    //   this.$http
    //     .post("/api/upms/role/list")
    //     .then(res => {
    //       this.roleList = res.data;
    //     })
    //     .catch(msg => {});
    // },
    // 获取list
    async getList() {
      this.loading = true;
      let par = {
        // TODO
        projectId: this.$route.query.id
      };
      this.$http
        .post("/api/edu/project/getCourseList", par)
        .then(res => {
          this.listTable = res.data;
          for (var i = 0; i < this.listTable.length; i++) {
            this.listTable[i].indexKey = i;
          }
          this.$emit("listTable", this.listTable);
          this.loading = false;
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table .el-button {
  margin-right: 0;
}
.user {
  .el-select {
    width: 320px;
  }
}
</style>
