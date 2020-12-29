<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">问卷管理</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">当前位置：首页</el-breadcrumb-item>
          <el-breadcrumb-item>问卷管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod">
      <div class="m-search">
        <div>
          <el-select v-model="type" placeholder="全部问卷类型">
            <el-option label="全部" value></el-option>
            <el-option label="需求调研" :value="1"></el-option>
            <el-option label="报名问卷" :value="2"></el-option>
            <el-option label="考勤问卷" :value="3"></el-option>
            <el-option label="教师授课问卷" :value="4"></el-option>
            <el-option label="学员学习问卷" :value="5"></el-option>
            <el-option label="项目综合评价问卷" :value="6"></el-option>
          </el-select>

          <el-select v-model="status" placeholder="发布状态">
            <el-option label="全部" value></el-option>
            <el-option label="待发布" :value="0"></el-option>
            <el-option label="已发布" :value="1"></el-option>
            <el-option label="已关闭" :value="2"></el-option>
          </el-select>
          <el-input v-model="key" placeholder="输入项目关键词搜索"></el-input>
          <el-button class="btn-search" @click="getList('search')">搜索</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">创建问卷</el-button>
        </div>
      </div>
      <div class="m-mod" v-loading="loading">
        <ul class="d-list">
          <li v-for="item in listTable" :key="item.id">
            <div class="d-msg">
              <h2>
                <span class="d-title-type">
                  {{
                  [
                  "",
                  "需求调研",
                  "报名问卷",
                  "考勤问卷",
                  "教师授课问卷",
                  "学员学习问卷",
                  "项目综合评价问卷",
                  ][item.type]
                  }}
                </span>
                {{ item.title }}
              </h2>
              <p>
                <span v-if="item.createdBy">创建人：{{ item.realName }}</span>
                <span>更新时间：{{ item.updatedDt | moment("YYYY-MM-DD HH:mm") }}</span>
              </p>
            </div>
            <div class="d-start">
              <div class="d-start-msg">
                <span :class="['', 'color-green', 'color-red'][item.status]">
                  {{
                  ["未发布", "已发布", "已关闭"][item.status]
                  }}
                </span>
              </div>
              <div class="d-start-btn">
                <span v-if="item.status != 1" @click="publish(item.id)">发布</span>
                <span v-if="item.status == 0" @click="edit(item.id, item.type)">编辑</span>
                <span v-if="item.status != 1" class="color-red" @click="del(item.id)">删除</span>
                <span v-if="item.status == 1" class="color-green" @click="toDetail(item.id)">查看</span>
                <span v-if="item.status == 1" class="color-red" @click="close(item.id)">关闭</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="m-pages">
        <el-pagination
          v-if="pageList && pageList.total > 0"
          background
          :hide-on-single-page="true"
          @current-change="handleCurrentChange"
          :page-size="pageList.pageSize"
          layout=" prev, pager, next,total"
          :total="pageList.total"
        ></el-pagination>
      </div>
      <Empty v-if="!pageList || pageList.total == 0" msg="暂无相关问卷"></Empty>
    </div>
    <el-dialog title="创建问卷" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form
        :model="addFrom"
        :rules="rules"
        ref="addFrom"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="问卷标题" prop="title">
          <el-input v-model.trim="addFrom.title" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="问卷类型" prop="type">
          <el-radio v-model="addFrom.type" :label="1">需求调研</el-radio>
          <p class="el-radio-text">可用于培训需求调研</p>
          <el-radio v-model="addFrom.type" :label="2">报名问卷</el-radio>
          <p class="el-radio-text">可用于培训过程中的学员报名</p>
          <el-radio v-model="addFrom.type" :label="3">考勤问卷</el-radio>
          <p class="el-radio-text">可用于培训过程中的学员考勤</p>
          <el-radio v-model="addFrom.type" :label="4">教师授课问卷</el-radio>
          <p class="el-radio-text">可用于培训反馈教师的评价与评估</p>
          <el-radio v-model="addFrom.type" :label="5">学员学习问卷</el-radio>
          <p class="el-radio-text">可用于培训反馈学员的评价与评估</p>
          <el-radio v-model="addFrom.type" :label="6">项目综合评价问卷</el-radio>
          <p class="el-radio-text">可用于培训反馈项目整体的评价与评估</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="add('addFrom')">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import list from "./projectList";
import Empty from "@/components/Empty";
export default {
  components: {
    // list
    Empty
  },
  data() {
    return {
      activeName: "first",
      dialogVisible: false,
      ruleForm: [],
      // ---
      loading: false,
      type: "",
      status: "",
      key: "",
      pageList: {
        pageNo: 1,
        pageSize: 20,
        total: 1
      },
      addFrom: {
        title: "",
        type: 1
      },
      listTable: [],
      rules: {
        title: [{ required: true, message: "请输入问卷标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择问卷类型", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageList.pageNo = val;
      this.getList();
    },
    handleClick(tab, event) {},
    handleClose() {
      this.dialogVisible = false;
      this.addFrom = {
        title: "",
        type: 1
      };
    },
    edit(val, type) {
      this.$router.push({
        path: type != 4 && type != 5 ? "/detailRule" : "/questionDetail",
        query: {
          id: val
        }
      });
    },
    toDetail(val) {
      this.$router.push({
        path: "detailIndex",
        query: {
          id: val
        }
      });
    },
    add(addForm) {
      this.$refs[addForm].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/questionnaire/add", this.addFrom)
            .then(res => {
              this.$message({
                message: "创建成功",
                type: "success"
              });
              // this.getList();
              // this.handleClose();
              this.edit(res.data, this.addFrom.type);
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    del(val) {
      this.$confirm("请确认是否执行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            questionId: val
          };
          this.$http
            .post("/api/questionnaire/delete", par)
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    // 发布
    publish(val) {
      this.$confirm("请确认是否执行发布操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            questionId: val
          };
          this.$http
            .post("/api/questionnaire/publish", par)
            .then(res => {
              this.$message({
                message: "发布成功",
                type: "success"
              });
              this.getList();
            })
            .catch(msg => {});
        })
        .catch(() => {});
    },
    close(val) {
      this.$confirm("请确认是否执行关闭操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let par = {
          questionId: val
        };
        this.$http
          .post("/api/questionnaire/close", par)
          .then(res => {
            this.$message({
              message: "关闭成功",
              type: "success"
            });
            this.getList();
          })
          .catch(msg => {});
      });
    },
    // 获取list
    getList(val) {
      if (val == "search") {
        this.pageList.pageNo = 1;
      }
      this.loading = true;
      let par = {
        type: this.type,
        status: this.status,
        search: this.key,
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize
      };
      this.$http
        .post("/api/questionnaire/list", par)
        .then(res => {
          this.pageList.pageNo = res.data.current;
          this.pageList.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(msg => {});
    }
  }
};
</script>
