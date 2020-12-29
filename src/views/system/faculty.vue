<!--院系管理-->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>院系管理</h2>
    </div>
    <div class="m-search">
      <div>
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="openDialog(1)"
          >添加院系</el-button
        >
      </div>
      <div>
        <!-- <el-select v-model="list.status" placeholder="场地状态" class="s-el-input">
          <el-option label="未使用" :value="1"></el-option>
          <el-option label="使用中" :value="2"></el-option>
          <el-option label="使用过" :value="3"></el-option>
        </el-select>-->
        <el-input
          v-model="list.search"
          placeholder="输入院系名称搜索"
          class="s-el-input"
        ></el-input>
        <el-button class="btn-search" @click="getList('search')"
          >搜索</el-button
        >
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="title" label="院系名称"></el-table-column>
      <el-table-column prop="manager" label="管理员"></el-table-column>
      <el-table-column prop="projectNum" label="包含项目"></el-table-column>
      <el-table-column prop="createdDt" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="220px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editRow(scope.row.id)">{{
            scope.row.manager ? "修改用户" : "关联用户"
          }}</el-button>
          <el-button
            type="text"
            size="small"
            style="background: #fff; color: #ff0000; border: none"
            v-if="scope.row.projectNum == 0 && scope.row.manager == null"
            @click="deleteRow(scope.row.id)"
            >删除</el-button
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
    <el-dialog
      title="添加院系"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeField"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="80px"
        label-position="right"
        :rules="rules"
        ref="form"
        :model="field"
      >
        <el-form-item label="院系名称" prop="title">
          <el-input
            v-model="field.title"
            placeholder="请输入院系名称"
            show-word-limit
            maxlength="30"
          ></el-input>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closeField">取消</el-button>
          <el-button type="primary" @click="addField">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="关联用户"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="closeField2"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="80px"
        label-position="right"
        ref="form"
        :model="form"
      >
        <p class="select-msg">
          注：每个负责人只可关联一个院系，关联多个院系无效
        </p>
        <el-form-item label="院系名称">
          <el-select
            v-model="form.parentId"
            placeholder="院系负责人"
            class="s-el-input"
            @change="select"
            remote
            filterable
            :remote-method="getUserDepartmentList"
            @focus="userDepartmentClick"
            clearable
          >
            <el-option
              v-for="item in departmentPersonIds"
              :key="item.index"
              :label="item.realName + '-' + item.mobile"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <ul v-if="selectItem && selectItem.length > 0">
          <li
            class="select-item"
            v-for="(item, index) in selectItem"
            :key="index"
          >
            <div>{{ item.realName }}-{{ item.mobile }}</div>
            <span @click="delItem(index)"><i class="el-icon-close"></i></span>
          </li>
        </ul>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="closeField2">取消</el-button>
          <el-button
            type="primary"
            @click="relevance"
            :disabled="selectItem.length > 0 ? false : true"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      list: {
        search: "",
        status: "",
      },
      field: { title: "", area: "", remark: "" },
      form: { id: "", parentId: "" },
      loading: false,
      roleList: [],
      listTable: [],
      listTable2: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1,
      },
      selectItem: [],
      departmentId: "",
      departmentPersonIds: [],
      userDepartmentInit: false,
      //区别新增和编辑
      type: 1,
      //编辑时的id
      editId: "",
      rules: {
        title: [{ required: true, message: "请填写名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    select(val) {
      if (val) {
        var arr = [];
        for (var i of this.selectItem) {
          arr.push(i.id);
        }
        if (arr.indexOf(val.id) == -1) {
          this.selectItem.push(val);
          this.form.parentId = "";
        } else {
          this.form.parentId = "";
        }
      }
    },
    delItem(index) {
      this.selectItem.splice(index, 1);
    },
    openDialog(val) {
      this.dialogVisible = true;
    },
    editRow(val) {
      this.dialogVisible2 = true;
      this.departmentId = val;
      this.getDetail(val);
    },
    getDetail(val) {
      let par = {
        deptId: this.departmentId,
      };
      this.$http
        .post("api/edu/department/getManagerByDeptId", par)
        .then((res) => {
          this.selectItem = res.data;
        })
        .catch((msg) => {});
    },
    deleteRow(id) {
      this.$confirm("您确定要删除该院系吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let par = {
          deptId: id,
        };
        this.$http
          .post("api/edu/department/delete", par)
          .then((res) => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch((msg) => {});
      });
    },
    //添加院校
    addField() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let par = {
            id: "",
            title: this.field.title,
          };
          this.$http
            .post("/api/edu/department/add", par)
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
              this.field.title = "";
            })
            .catch((msg) => {});
        } else {
          return false;
        }
      });
    },
    //关联人员
    relevance() {
      var arr = [];
      for (var i of this.selectItem) {
        arr.push(i.id);
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let par = {
            departmentId: this.departmentId,
            ids: arr.toString(),
          };
          this.$http
            .post("/api/upms/role/distribute", par)
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.dialogVisible2 = false;
              this.getList();
              this.form.id = "";
              this.form.parentId = "";
              this.selectItem = [];
            })
            .catch((msg) => {});
        } else {
          return false;
        }
      });
    },
    userDepartmentClick() {
      if (!this.userDepartmentInit || this.departmentPersonIds.length < 1) {
        this.getUserDepartmentList();
        this.userDepartmentInit = true;
      }
    },
    async getUserDepartmentList(search) {
      this.departmentPersonIds = await this.getUserList(search);
    },
    getUserList(search) {
      return new Promise((reslove, reject) => {
        this.$http
          .post("/api/upms/user/getUserList", {
            pageNo: 1,
            pageSize: 7,
            name: search || "",
          })
          .then((res) => reslove(res.data));
      });
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
        keyword: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
      };
      this.$http
        .post("/api/edu/department/list", par)
        .then((res) => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch((msg) => {});
    },
    closeField() {
      this.dialogVisible = false;
    },
    closeField2() {
      this.dialogVisible2 = false;
      this.selectItem = [];
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="scss">
.upload-demo {
  margin-right: 10px;
}
.el-dialog__body .el-select {
  width: 380px;
}
.select-item {
  padding: 5px 80px;
  display: flex;
  justify-content: space-between;
  span {
    cursor: pointer;
  }
}
.select-msg {
  padding: 0 10px 10px 13px;
  color: rgb(255, 153, 0);
}
</style>