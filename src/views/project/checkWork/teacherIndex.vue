<template>
  <div>
    <div class="m-search">
      <el-button type="primary" @click="exportUser()">导出考勤数据</el-button>
      <div>
        <el-select class="s-el-input" v-model="status" placeholder="签到状态">
          <el-option label="全部" value></el-option>
          <el-option label="未签到" :value="0"></el-option>
          <el-option label="请假" :value="1"></el-option>
          <el-option label="已签到" :value="2"></el-option>
          <el-option label="补签" :value="3"></el-option>
        </el-select>
        <el-input class="s-el-input" v-model="key" placeholder="输入用户姓名搜索"></el-input>
        <el-button type class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" :span-method="objectSpanMethod" border v-loading="loading">
      <el-table-column prop="teacherName" label="授课教师"></el-table-column>
      <el-table-column prop="id" label="上课日期">
        <template slot-scope="scope">
          {{ scope.row.day }}
          <br />
          {{ scope.row.week }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="上课时间">
        <template slot-scope="scope">{{ scope.row.beginTime }} ~ {{ scope.row.endTime }}</template>
      </el-table-column>
      <el-table-column prop="title" label="培训内容" width="180"></el-table-column>
      <el-table-column prop="roomName" label="上课地点"></el-table-column>
      <el-table-column prop label="签到状态">
        <template slot-scope="scope">
          {{
          ["未签到", "请假", "已签到", "取消签到"][scope.row.status]
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="operation">
            <el-button
              type="primary"
              style="background:#fff;color:#00be6e; border:none"
              size="small"
              @click="scope.row.status == 2 ? change(scope.row) : ''"
            >{{ scope.row.status == 2 ? "取消签到" : "-" }}</el-button>
          </div>
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
  </div>
</template>
<script>
export default {
  props: ["courseList"],
  data() {
    return {
      projectId: localStorage.getItem("projectId"),
      listTable: [],
      key: "",
      status: "",
      loading: false,
      listPage: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      courseFrom: {},
      spanArr: [], //记录合并单元格
      pos: 0 //spanArr索引
    };
  },
  mounted() {
    this.getList();
    this.courseFrom = this.courseList[0];
  },
  methods: {
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    change(item) {
      let par = {
        id: item.id
      };
      this.$http
        .delete(`/api/web/check/cancel/teacher/check`, { params: par })
        .then(res => {
          this.$message({
            message: "取消签到成功",
            type: "success"
          });
          this.getList();
        })
        .catch(msg => {});
    },
    getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        projectId: this.projectId,
        status: this.status,
        keyWord: this.key,
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize
      };
      this.$http
        .post(`/api/web/check/teachercheck/page/list`, par)
        .then(res => {
          this.loading = false;
          this.listTable = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.spanArr = [];
          let item = res.data.records;
          for (let i = 0; i < item.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0;
            } else {
              // 判断当前元素与上一个元素是否相同(第1和第2列)
              if (item[i].teacherName === item[i - 1].teacherName) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
            }
          }
        })
        .catch(msg => {
          this.loading = false;
        });
    },
    // 导出
    exportUser() {
      let par = {
        projectId: this.projectId,
        status: this.status,
        keyWord: this.key
      };
      this.$http
        .post("/api/web/check/teachercheck/export/list", par)
        .then(res => {
          let exlList = res.data;
          let title = "教师列表签到";
          let sheet = "教师列表签到";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "授课教师",
              "上课日期",
              "上课开始时间",
              "上课结束时间",
              "培训内容",
              "上课地点",
              "签到状态"
            ];
            let filterVal = [
              "teacherName",
              "day",
              "beginTime",
              "endTime",
              "title",
              "roomName",
              "status"
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch(msg => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v =>
        filterVal.map(j => {
          if (j == "status") {
            // return v[j] == 1 ? "男" : "女";
            return ["未签到", "请假", "已签到", "取消签到"][v[j]];
          }
          return v[j];
        })
      );
      return arr;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        return {
          rowspan: _row,
          colspan: 1
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
