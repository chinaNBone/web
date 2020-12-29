<!--项目列表-->
<template>
  <div>
    <div class="m-search">
      <div>
        <div class="top">
          <el-input
            v-model="searchVal.title"
            placeholder="输入项目关键词搜索"
            clearable
          ></el-input>
          <el-cascader
            clearable
            v-model="searchVal.trainee"
            :options="trainees"
            collapse-tags
            placeholder="请选择培训对象"
            :props="{
              expandTrigger: 'hover',
              value: 'id',
              label: 'title',
              children: 'childrenList',
              checkStrictly: true,
            }"
          ></el-cascader>
          <el-select
            v-if="userRole"
            v-model="searchVal.hostDepartment"
            placeholder="承担院系"
            class="s-el-input"
            filterable
            clearable
          >
            <el-option
              v-for="item in hostDepartments"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchVal.departmentPersonId"
            placeholder="院系负责人"
            class="s-el-input"
            remote
            filterable
            :remote-method="getUserDepartmentList"
            @focus="userDepartmentClick"
            clearable
          >
            <el-option
              v-for="item in departmentPersonIds"
              :key="item.index"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchVal.principalPersonId"
            placeholder="项目负责人"
            class="s-el-input"
            remote
            filterable
            :remote-method="getUserPrincipalList"
            @focus="userPrincipalClick"
            clearable
          >
            <el-option
              v-for="item in principalPersonIds"
              :key="item.index"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="searchVal.executivePersonId"
            remote
            filterable
            placeholder="项目执行人"
            :remote-method="getUserExecutiveList"
            @focus="userExecutiveClick"
            class="s-el-input"
            clearable
          >
            <el-option
              v-for="item in executivePersonIds"
              :key="item.index"
              :label="item.realName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <el-select
          v-model="searchVal.trainingStyle"
          placeholder="培训方式"
          class="s-el-input"
          filterable
          clearable
        >
          <el-option
            v-for="item in trainingStyles"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="searchVal.scoreSort"
          placeholder="项目评分"
          class="s-el-input"
          clearable
        >
          <el-option label="评分最高" :value="1"></el-option>
          <el-option label="评分最低" :value="2"></el-option>
        </el-select>
        <el-select
          v-model="searchVal.budgetSource"
          placeholder="经费来源"
          class="s-el-input"
          clearable
        >
          <el-option
            v-for="item in budgetSources"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="searchVal.implementYear"
          type="year"
          placeholder="请选择实施年度"
          format="yyyy"
          value-format="yyyy"
        ></el-date-picker>
        <el-input
          v-model="searchVal.trainingBase"
          placeholder="输入项目培训基地搜索"
        ></el-input>
        <el-select
          v-model="searchVal.status"
          placeholder="项目状态"
          class="s-el-input"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>-->
        <el-button type class="btn-search" @click="getList('search')"
          >搜索</el-button
        >
      </div>
      <div class="addPorject">
        <!-- <el-button type="primary">导入项目</el-button> -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-if="userRole"
          @click="dialogVisible = true"
          >创建项目</el-button
        >
      </div>
    </div>
    <div class="m-mod" v-loading="loading">
      <div style="min-height: 400px" v-if="!init"></div>
      <ul class="d-list">
        <li v-for="item in listTable" :key="item.id">
          <div
            class="d-icon"
            v-if="$role.isSuperAdmin() && item.timetablePublish == 3"
            @click="toCourse(item)"
          >
            课
          </div>
          <div class="d-msg">
            <h2>{{ item.title }}</h2>
            <!-- 预留描述 -->
            <!-- <p class="d-msg-text"></p> -->
            <p>
              <span v-if="item.departmentPerson != null"
                >院系负责人：{{ item.departmentPerson }}</span
              >
              <span v-if="item.principalPerson != null"
                >项目负责人：{{ item.principalPerson }}</span
              >
              <!-- <span v-if="item.executivePerson != null"
                >项目执行人：{{ item.executivePerson }}</span
              > -->
              <span v-if="item.budgetAmount != null"
                >经费：{{ item.budgetAmount }}万元</span
              >
            </p>
          </div>
          <div class="d-start">
            <div class="d-start-msg">
              <i class="el-icon-time"></i>
              <span>{{ item.createdDt }}</span>
              <span
                style="margin-left: 30px"
                :class="
                  ['', 'color-green', 'color-red', '', 'color-green', '', ''][
                    item.status
                  ]
                "
              >
                {{
                  [
                    "未发布",
                    "已发布",
                    "已撤回",
                    "审核中",
                    "已审核",
                    "审核未通过",
                    "专家审核中",
                    "已关闭",
                  ][item.status]
                }}
              </span>
              <!-- <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
              >-->
              <!-- <el-tooltip class="item" effect="light" content="Top Left 提示文字" placement="top-start">
                <i
                  class="el-icon-question"
                  style="color:red;font-size:16px;margin-left:10px"
                  v-if="item.status==3||item.status==5||item.status==6"
                ></i>
              </el-tooltip>-->
              <!-- </el-popover> -->
            </div>
            <div class="d-start-btn">
              <span @click="clone(item.id, item.title)">复制</span>
              <span
                class="color-red"
                v-if="item.status == 0 || item.status == 5 || item.status == 2"
                @click="delCell(item.id)"
                >删除</span
              >
              <span v-if="item.status == 4" @click="release(item.id)"
                >发布</span
              >
              <span v-if="item.status == 3" @click="recall(item.id)">撤回</span>
              <span
                v-if="item.status == 0 || item.status == 5 || item.status == 2"
                @click="toEdit(item.id, item.title, 'edit')"
                >编辑</span
              >
              <!-- todo -->
              <span
                v-if="item.status == 1 || item.status == 7"
                @click="toManager(item)"
                >管理</span
              >
            </div>
          </div>
        </li>
      </ul>
      <div class="m-pages">
        <el-pagination
          v-if="init && pageList && pageList.total > 0"
          :hide-on-single-page="true"
          background
          @current-change="handleCurrentChange"
          :page-size="pageList.pageSize"
          layout=" prev, pager, next,total"
          :total="pageList.total"
          :current-page.sync="pageList.pageNo"
        ></el-pagination>
      </div>
    </div>
    <Empty v-if="!pageList || pageList.total == 0" msg="暂无相关项目"></Empty>

    <el-dialog
      title="创建项目"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="addFrom"
        status-icon
        :rules="rules"
        ref="addFrom"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="title">
          <el-input
            v-model.trim="addFrom.title"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toAdd('add')">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Empty from "@/components/Empty";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      init: false,
      listTable: [],
      implementationYear: "",
      level: "",
      managementDepartment: "",
      source: "",
      pageList: {
        pageNo: 1,
        pageSize: 20,
        total: 1,
      },
      dialogVisible: false,
      ruleForm: [],
      addFrom: {
        title: "",
      },
      statusList: [
        { id: 0, title: "未发布" },
        { id: 1, title: "已发布" },
        { id: 2, title: "已撤回" },
        { id: 3, title: "审核中" },
        { id: 4, title: "已审核" },
        { id: 5, title: "审核未通过" },
        { id: 6, title: "专家审核中" },
        { id: 7, title: "已关闭" },
      ],
      userDepartmentInit: false,
      userPrincipalInit: false,
      userExecutiveInit: false,
      searchVal: { trainee: [] },
      rules: {
        title: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
      },
      //培训对象
      trainees: [],
      //院系负责人
      departmentPersonIds: [],
      //项目负责人
      principalPersonIds: [],
      //项目执行人
      executivePersonIds: [],
      //培训方式
      trainingStyles: [],
      //经费来源
      budgetSources: [],
      //院系公章
      hostDepartments: [],
      userRole: true,
    };
  },
  mounted() {
    this.init = false;
    this.getList();
    this.gettraList();
    this.gettrList();
    this.getbuList();
    this.gethostList();
    if (
      this.$role.isSuperAdmin() != true &&
      this.$store.state.global.role.indexOf("2") == -1
    ) {
      this.userRole = false;
    }
  },
  methods: {
    // 课表审核跳转
    toCourse(val) {
      localStorage.setItem("projectId", val.id);
      localStorage.setItem("projectTitle", val.title);
      this.$router.push({
        path: "/course",
      });
    },
    //院系公章
    gethostList() {
      this.$http
        .post("/api/edu/department/deptList")
        .then((res) => {
          this.hostDepartments = res.data;
        })
        .catch((msg) => {});
    },
    //培训对象
    gettraList() {
      let par = {
        layer: 1,
        typeName: "trainee",
      };
      this.$http
        .post("/api/edu/project/getCascadeOptionList", par)
        .then((res) => {
          this.trainees = res.data;
          this.delChild(this.trainees);
        })
        .catch((msg) => {});
    },
    delChild(arr) {
      if (arr.length) {
        for (let i in arr) {
          if (arr[i].childrenList.length) {
            this.delChild(arr[i].childrenList);
          } else {
            delete arr[i].childrenList;
          }
        }
      }
      return arr;
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
    userPrincipalClick() {
      if (!this.userPrincipalInit || this.principalPersonIds.length < 1) {
        this.getUserPrincipalList();
        this.userPrincipalInit = true;
      }
    },
    async getUserPrincipalList(search) {
      this.principalPersonIds = await this.getUserList(search);
    },
    userExecutiveClick() {
      if (!this.userExecutiveInit || this.executivePersonIds.length < 1) {
        this.getUserExecutiveList();
        this.userExecutiveInit = true;
      }
    },
    async getUserExecutiveList(search) {
      this.executivePersonIds = await this.getUserList(search);
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
    //培训方式
    gettrList() {
      let par = {
        typeName: "trainingStyle",
      };
      this.$http
        .post("/api/edu/project/getOptionList", par)
        .then((res) => {
          this.trainingStyles = res.data;
        })
        .catch((msg) => {});
    },
    //经费来源
    getbuList() {
      let par = {
        typeName: "budgetSource",
      };
      this.$http
        .post("/api/edu/project/getOptionList", par)
        .then((res) => {
          this.budgetSources = res.data;
        })
        .catch((msg) => {});
    },
    handleCurrentChange(val) {
      this.pageList.pageNo = val;
      this.getList();
    },
    handleClose() {
      this.dialogVisible = false;
      this.addFrom.title = "";
    },
    toAdd(type) {
      this.$refs["addFrom"].validate((valid) => {
        if (valid) {
          this.$router.push({
            path: "/projectAdd",
            query: {
              title: this.addFrom.title,
              type: type,
            },
          });
        } else {
          return false;
        }
      });
    },
    toEdit(val, title, type) {
      this.$router.push({
        path: "/projectAdd",
        query: {
          id: val,
          title: title,
          type: type,
          pathFlag: "first",
        },
      });
    },
    toManager(val) {
      localStorage.setItem("projectId", val.id);
      localStorage.setItem("projectTitle", val.title);
      this.$router.push({
        path: "/projectMsg",
      });
    },
    clone(val, title) {
      this.$router.push({
        path: "/projectAdd",
        query: {
          id: val,
          title: title + "(副本)",
          isClone: 1,
        },
      });
    },
    delCell(val) {
      this.$confirm("请确认是否执行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            projectId: val,
          };
          this.$http
            .post("/api/edu/project/deleteProject", par)
            .then((res) => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    //撤回
    recall(val) {
      this.$confirm("请确认是否撤回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            projectId: val,
            type: 1,
          };
          this.$http
            .post("/api/edu/project/operateProject", par)
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    //发布
    release(val) {
      this.$confirm("请确认是否发布?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            projectId: val,
            type: 2,
          };
          this.$http
            .post("/api/edu/project/operateProject", par)
            .then((res) => {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    // 获取list
    getList(val) {
      if (val == "search") {
        this.pageList.pageNo = 1;
      }
      this.loading = true;
      let par = {
        budgetSource: this.searchVal.budgetSource,
        departmentPersonId: this.searchVal.departmentPersonId,
        executivePersonId: this.searchVal.executivePersonId,
        hostDepartment: this.searchVal.hostDepartment,
        implementationYear: this.searchVal.implementYear,
        principalPersonId: this.searchVal.principalPersonId,
        scoreSort: this.searchVal.scoreSort,
        title: this.searchVal.title,
        trainee: this.searchVal.trainee[0],
        trainingBase: this.searchVal.trainingBase,
        trainingStyle: this.searchVal.trainingStyle,
        status: this.searchVal.status,
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize,
      };
      this.$http
        .post("/api/edu/project/projectList", par)
        .then((res) => {
          this.init = true;
          this.loading = false;
          this.pageList.pageNo = res.data.current;
          this.pageList.total = res.data.total;
          this.listTable = res.data.records;
        })
        .catch((msg) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.addPorject {
  position: absolute;
  right: 0;
  top: -10px;
}
.top {
  margin-bottom: 15px;
}
</style>
