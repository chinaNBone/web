<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">学员报到</h2>
      <div class="g-box-header-back" @click="back">返回></div>
    </el-header>
    <div style="margin-top:30px">
      <el-form
        ref="questionnaire"
        :rules="rules"
        :model="questionnaire"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="问卷标题:" prop="title" style="width:500px;">
          <el-input v-model.trim="questionnaire.title" maxlength="30"></el-input>
          <span
            class="u-tags-limit"
            style="top:55%;right:48px"
          >{{questionnaire.title.length + '/30'}}</span>
        </el-form-item>

        <el-form-item label="关联问卷:" prop="files" style="width:500px;">
          <el-button
            @click="Tune"
            style="background:#fff;color:#00be6e; border:1px solid #00be6e"
            icon="el-icon-plus"
          >选择问卷</el-button>
          <el-tag
            :key="tag"
            v-for="tag in selectList"
            closable
            :disable-transitions="false"
            @close="handleTag(tag)"
          >{{tag.name}}</el-tag>
        </el-form-item>
        <el-form-item label="指派用户:" prop="user" style="width:500px;">
          <el-radio v-model="questionnaire.user" :label="1">全部学员</el-radio>
          <el-radio v-model="questionnaire.user" :label="2">指定学员</el-radio>
        </el-form-item>
        <el-form-item label="收集时间:" prop="liveStartD">
          <div class="time-line">
            <el-date-picker
              v-model="questionnaire.value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item align="left" class="dialog-btns">
          <el-button
            type="primary"
            size="medium"
            style="width: 120px;height:40px"
            @click="editLecturer(questionnaire)"
          >发布问卷</el-button>
          <el-button
            type="primary"
            size="medium"
            style="width: 120px;height:40px"
            @click="editLecturer(questionnaire)"
          >保存</el-button>
          <el-button
            type="primary"
            size="medium"
            style="background:#fff;color:#00be6e;width: 120px;height:40px"
            @click="editLecturer(questionnaire)"
          >取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        title="选择问卷"
        :visible.sync="dialogVisible"
        width="850px"
        style="margin:50px 0 0 50px;"
        :before-close="handleClose"
      >
        <el-row class="search-row">
          <div class="f-fl">
            <el-input v-model="filters.search" size="medium" placeholder="输入问卷关键词搜索"></el-input>
            <el-button
              type="primary"
              style="background:rgba(255, 153, 0, 1);border:none"
              size="medium"
              @click="getUserList"
            >搜索</el-button>
          </div>
          <div class="f-fr">
            <el-button
              style="background:#fff;color:#00be6e; border:1px solid #00be6e"
              icon="el-icon-plus"
            >创建问卷</el-button>
          </div>
        </el-row>
        <!-- table表格 -->
        <el-table :data="tableData" highlight-current-row>
          <el-table-column label="问卷名称" prop="name" width="200"></el-table-column>
          <el-table-column prop="tagTitle" label="创建人"></el-table-column>
          <el-table-column prop="company" label="更新时间" width="200"></el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                type="primary"
                style="background:#fff;color:#00be6e; border:1px solid #00be6e"
                size="small"
                @click="toSelect(scope.row.id)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      filters: {
        search: ""
      },
      tableData: [
        {
          name: "选择问卷1",
          tagTitle: "李华",
          company: "2019-2-3",
          id: "11243",
          isSelect: false
        },
        {
          name: "选择问卷2",
          tagTitle: "刘玉",
          company: "2019-9-3",
          id: "11293",
          isSelect: false
        },
        {
          name: "选择问卷3",
          tagTitle: "小黑",
          company: "2019-11-5",
          id: "123243",
          isSelect: false
        }
      ],
      questionnaire: {
        title: "",
        files: "",
        user: "",
        introduction: "",
        value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
      },
      rules: {
        title: [
          { required: true, message: "请输入banner标题", trigger: "blur" },
          { max: 20, message: "可输入最大长度为20个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "备注", trigger: "blur" },
          { max: 150, message: "可输入最大长度为150个字符", trigger: "blur" }
        ],
        files: [{ required: true, message: "请上传通知文件", trigger: "blur" }]
      }
    };
  },
  computed: {
    selectList() {
      return this.tableData.filter(item => item.isSelect);
    }
  },
  methods: {
    back() {},
    handleClose() {
      this.dialogVisible = false;
    },
    Tune() {
      this.dialogVisible = true;
    },
    handleTag(tag) {
      tag.isSelect = false;
    },
    toSelect(id) {
      this.tableData.forEach(item => {
        if (item.id == id) {
          item.isSelect = true;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
