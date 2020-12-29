<!-- 问卷试题库 -->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>问卷试题库</h2>
    </div>

    <div class="m-search">
      <div>
        <el-button type="primary" @click="addQuestion">添加题目</el-button>
      </div>
      <div>
        <el-select v-model="list.type" placeholder="题目类型  " class="s-el-input">
          <el-option label="全部" value></el-option>
          <el-option label="教师授课问卷" :value="1"></el-option>
          <el-option label="学员学习问卷" :value="2"></el-option>
        </el-select>
        <el-input v-model="list.search" placeholder="输入试题关键字搜索" class="s-el-input searchInput"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <div class="d-list" v-loading="loading">
      <ul>
        <li class="quesList" v-for="(item, index) in listTable" :key="index">
          <h3>{{ index + 1 }}. {{ item.title }}</h3>
          <div class="type">
            上传人：{{item.realName}}
            <div class="type-v">{{['','教师授课问卷','学员学习问卷','项目综合评价问卷'][item.type]}}</div>
          </div>
          <div class="icon">
            <i
              class="el-icon-edit editIcon"
              style="font-size:16px;color:#aaa;cursor: pointer;"
              @click="editList(item.id)"
            ></i>
            <i
              class="el-icon-delete"
              style="font-size:16px;color:#aaa;cursor: pointer;"
              @click="delList(item.id)"
            ></i>
          </div>
          <p>A. 非常好</p>
          <p>B. 好</p>
          <p>C. 一般</p>
          <p>D. 不好</p>
          <p>E. 非常不好</p>
        </li>
      </ul>
    </div>
    <div class="m-pages">
      <el-pagination
        v-if="listPage && listPage.total > 0"
        background
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
        layout="prev, pager, next,total"
        :current-page.sync="listPage.pageNo"
        :page-size="listPage.pageSize"
        :total="listPage.total"
      ></el-pagination>
    </div>
    <Empty v-if="!listPage || listPage.total == 0" msg="暂无数据"></Empty>
    <el-dialog
      title="创建问卷试题"
      :visible.sync="dialogUserVisible"
      :close-on-click-modal="false"
      @close="onCloseDialog"
      style="margin-top: 15vh;"
      width="480px"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="50px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="题目类型  " class="dialog-input">
            <el-option label="教师授课问卷" :value="1"></el-option>
            <el-option label="学员学习问卷" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onCloseDialog">取消</el-button>
          <el-button type="primary" @click="onSubmit">{{id==''?'创建':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Empty from "@/components/Empty";
export default {
  components: {
    Empty
  },
  data() {
    return {
      loading: false,
      imgUrl: this.$setting.imageUrl,
      list: {
        search: "",
        type: ""
      },
      form: {
        title: "",
        type: ""
      },
      dialogUserVisible: false,
      listTable: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      id: "",
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    addQuestion() {
      this.dialogUserVisible = true;
    },
    delList(id) {
      this.$confirm("请确认是否执行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            templateId: id
          };
          this.$http
            .post("/api/questionnaire/template/delete", par)
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
    editList(id) {
      let par = {
        templateId: id
      };
      this.$http
        .post("/api/questionnaire/template/getTemplate", par)
        .then(res => {
          this.form = res.data;
          this.id = res.data.id;
        })
        .catch(msg => {});
      this.dialogUserVisible = true;
    },
    onCloseDialog() {
      this.dialogUserVisible = false;
      this.id = "";
      this.form.title = "";
      this.form.type = "";
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let par = {
            title: this.form.title,
            type: this.form.type,
            id: this.id
          };
          this.$http
            .post("/api/questionnaire/template/addOrEdit", par)
            .then(() => {
              this.getList();
              this.dialogUserVisible = false;
              this.form.title = "";
              this.id = "";
            });
        }
      });
    },
    // 获取list
    async getList(val) {
      this.loading = true;
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      let par = {
        type: this.list.type,
        search: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .post("/api/questionnaire/template/list", par)
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.searchInput {
  width: 222px;
}
.quesList {
  padding: 25px 0;
  border-bottom: 1px solid #ddd;
  position: relative;
  h3 {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
  }
  p {
    text-indent: 20px;
    margin-top: 16px;
  }
  .type {
    position: absolute;
    right: 0;
    top: 25px;
    .type-v {
      margin-top: 16px;
      text-align: right;
    }
  }
  .icon {
    position: absolute;
    bottom: 25px;
    right: 0;
    .editIcon {
      margin-right: 15px;
    }
  }
}
.dialog-input {
  width: 390px !important;
}
</style>
