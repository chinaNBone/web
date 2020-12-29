<template>
  <!-- 项目统计 -->
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>项目统计</h2>
    </div>
    <div class="p-top">
      <div class="projectNum d-flex">
        <div class="projectNum-l">
          <span>总项目数（个）</span>
          <span class="total">{{ projectProportion.projectNum }}</span>
          <el-progress :percentage="checkingNum" color="#e6a23c"></el-progress>
          <span>待审核项目数</span>
          <el-progress :percentage="pendingNum" color="#f56c6c"></el-progress>
          <span>未开始项目数</span>
        </div>
        <div class="projectNum-r">
          <el-progress type="circle" :percentage="inProgressNum"></el-progress>
          <br />进行中项目数
        </div>
      </div>
      <div class="yearDate">
        <div id="main1" style="width:290px;height:180px"></div>
      </div>
      <div class="weekDate">
        <div id="main2" style="width:290px;height:180px"></div>
      </div>
    </div>
    <div class="p-center">
      <div class="d-title">
        <div class="d-flex-1">年度项目申报情况</div>
      </div>
      <div class="d-flex">
        <div class="d-flex-1">项目数</div>
        <div>
          <span>选择年度:&nbsp;</span>
          <el-select v-model="values" placeholder="请选择" @change="yearChange">
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div id="main" style="width: 940px;height:450px;"></div>
    </div>
    <div class="p-search">
      <div class="top">
        <el-input v-model.trim="searchVal.title" placeholder="输入项目名搜索" clearable></el-input>
        <el-date-picker
          v-model.trim="searchVal.implementationYear"
          type="year"
          placeholder="请选择实施年度"
          format="yyyy"
          value-format="yyyy"
        ></el-date-picker>
        <el-date-picker v-model.trim="searchVal.planBegin" type="date" placeholder="参训时间"></el-date-picker>
        <el-input v-model.trim="searchVal.credit" placeholder="培训量" clearable></el-input>
        <el-input v-model.trim="searchVal.budgetAmount" placeholder="培训经费" clearable></el-input>
        <el-input v-model.trim="searchVal.trainingBase" placeholder="教室使用情况" clearable></el-input>
        <el-button type="warning" class="btn-search" @click="getProjectList('search')">搜索</el-button>
        <el-button type="primary" class="btn-export" @click="exportProjectDate">导出项目数据</el-button>
      </div>
    </div>
    <div class="p-btm">
      <!-- table表格 -->
      <el-table :data="projectList" highlight-current-row v-loading="loading">
        <el-table-column label="项目名称" prop="title" width="200"></el-table-column>
        <el-table-column label="参加时间" prop="planBegin">
          <template slot-scope="scope">
            <span>{{ scope.row.planBegin | moment("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="培训量(课时)"></el-table-column>
        <el-table-column prop="budgetAmount" label="培训经费(万元)"></el-table-column>
        <el-table-column prop="trainingBase" label="课室使用情况"></el-table-column>
        <el-table-column prop="implementationYear" label="培训年度"></el-table-column>
      </el-table>
      <div class="m-pages">
        <el-pagination
          v-show="pageList.total > 0"
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="pageList.pageNo"
          :page-size="pageList.pageSize"
          :total="pageList.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
export default {
  mounted() {
    this.getProjectProportion();
    this.getProjectList();
    this.getYearDate();
    this.getDayDate();
  },
  data() {
    return {
      planBegin: [],
      searchVal: {},
      values: "",
      yearOptions: [],
      loading: false,
      projectList: [],
      inProgressNum: 0,
      pendingNum: 0,
      checkingNum: 0,
      projectProportion: {},
      pageList: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      yearDate: {},
      monthDate: {},
      dayDate: {},
      mainOption: {
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          data: ["项目数"]
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            // symbol: "none",
            name: "项目数",
            type: "line",
            data: [],
            lineStyle: {
              normal: {
                color: "#00be6e",
                width: 5
              }
            }
          }
        ]
      },
      main1Option: {
        title: {
          text: "历年项目数趋势"
        },
        tooltip: {},
        legend: {
          data: []
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: "项目数",
            type: "line",
            data: [],
            lineStyle: {
              normal: {
                color: "#4458ff",
                width: 5
              }
            }
          }
        ]
      },
      main2Option: {
        title: {
          text: "七日新增项目数"
        },
        tooltip: {},
        legend: {
          data: []
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: "项目数",
            type: "bar",
            barWidth: 10, // 柱图宽度
            barMaxWidth: 30, // 最大宽度
            data: [],
            itemStyle: {
              normal: {
                color: "#00be6e"
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    exportProjectDate() {
      let par = {
        budgetAmount: this.searchVal.budgetAmount,
        credit: this.searchVal.credit,
        implementationYear: this.searchVal.implementationYear,
        planBegin: this.searchVal.planBegin
          ? moment(this.searchVal.planBegin).format("YYYY-MM-DD")
          : "",
        title: this.searchVal.title,
        trainingBase: this.searchVal.trainingBase,
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize
      };
      this.$http
        .post("/api/web/statistic/exportStatistic", par)
        .then(res => {
          let exlList = res.data;
          let title = "项目数据列表";
          let sheet = "项目数据列表";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "项目名称",
              "项目执行人",
              "统筹管理部门",
              "实施年度",
              "项目级别",
              "培训层次",
              "培训基地",
              "原计划经费",
              "原计划学时",
              "原计划学员人数",
              "实际学时",
              "实际经费",
              "实际报道学员人数",
              "最终证书学员人数"
            ];
            let filterVal = [
              "title",
              "executivePerson",
              "managementDepartmentName",
              "implementationYear",
              "levelStr",
              "trainingLevelName",
              "trainingBase",
              "budgetAmount",
              "credit",
              "trainingNumber",
              "period",
              "expenditure",
              "checkNum",
              "offerNum"
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch();
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v => filterVal.map(j => v[j]));
      return arr;
    },
    yearChange(val) {
      this.getMonthDate(toString(val));
    },
    dwton() {
      var myChart = echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = this.mainOption;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    dwton1() {
      var myChart2 = echarts.init(document.getElementById("main1"));
      var option2 = this.main1Option;
      myChart2.setOption(option2);
    },
    dwton2() {
      var myChart2 = echarts.init(document.getElementById("main2"));
      var option2 = this.main2Option;
      myChart2.setOption(option2);
    },
    getYearDate() {
      this.$http
        .post("/api/web/statistic/projectYearDistribution")
        .then(res => {
          let arr = [];
          let arr1 = [];
          this.yearDate = res.data;
          this.yearDate.forEach(item => {
            arr.push(item.year + "年");
            arr1.push(item.projectNum);
            this.yearOptions.push({
              value: item.year,
              label: item.year + "年度"
            });
          });
          this.values = this.yearOptions[0].label;
          this.main1Option.xAxis.data = arr;
          this.main1Option.series[0].data = arr1;
          this.getMonthDate(toString(this.values));
          this.dwton1();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMonthDate(val) {
      this.$http
        .post("/api/web/statistic/projectMonthDistribution", {
          year: val
        })
        .then(res => {
          let arr = [];
          let arr1 = [];
          this.monthDate = res.data;
          this.monthDate.forEach(item => {
            arr.push(item.month + "月");
            arr1.push(item.projectNum);
          });
          this.mainOption.xAxis.data = arr;
          this.mainOption.series[0].data = arr1;
          this.dwton();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDayDate() {
      this.$http
        .post("/api/web/statistic/projectDateDistribution")
        .then(res => {
          let arr = [];
          let arr1 = [];
          this.dayDate = res.data;
          this.dayDate.forEach(item => {
            arr.push(item.day + "日");
            arr1.push(item.projectNum);
          });
          this.main2Option.xAxis.data = arr;
          this.main2Option.series[0].data = arr1;
          this.dwton2();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getProjectProportion() {
      this.$http
        .post("/api/web/statistic/projectProportion")
        .then(res => {
          this.projectProportion = res.data;
          this.inProgressNum = parseInt(
            (
              this.projectProportion.inProgressNum /
              this.projectProportion.projectNum
            ).toFixed(2) * 100
          );
          this.pendingNum = parseInt(
            (
              this.projectProportion.pendingNum /
              this.projectProportion.projectNum
            ).toFixed(2) * 100
          );
          this.checkingNum = parseInt(
            (
              this.projectProportion.checkingNum /
              this.projectProportion.projectNum
            ).toFixed(2) * 100
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    getProjectList(val) {
      if (val == "search") {
        this.pageList.pageNo = 1;
      }
      this.loading = true;
      let par = {
        budgetAmount: this.searchVal.budgetAmount,
        credit: this.searchVal.credit,
        implementationYear: this.searchVal.implementationYear,
        planBegin: this.searchVal.planBegin
          ? moment(this.searchVal.planBegin).format("YYYY-MM-DD")
          : "",
        title: this.searchVal.title,
        trainingBase: this.searchVal.trainingBase,
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize
      };
      this.$http
        .post("/api/web/statistic/projectList", par)
        .then(res => {
          this.projectList = res.data.records;
          this.pageList.pageNo = res.data.current;
          this.pageList.pageSize = res.data.size;
          this.pageList.total = res.data.total;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      this.pageList.pageNo = val;
      this.getProjectList();
    }
  }
};
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
  justify-content: center;

  .d-flex-1 {
    flex: 1;
  }
}
.p-top {
  display: flex;
  margin-bottom: 20px;
  & > div {
    flex: 1;
    padding: 10px;
    border: 1px solid #f2f2f2;
    margin-right: 20px;
  }
  div:nth-child(2),
  div:nth-child(3) {
    padding: 0;
  }
  div:last-child {
    margin: 0;
  }
  .projectNum {
    text-align: center;
    .projectNum-l {
      margin-right: 15px;
      span {
        display: block;
        color: #c0c0c0;
        line-height: 30px;
      }
      .total {
        color: #000000;
        font-size: 28px;
      }
    }
  }
}
.p-center {
  .d-title {
    padding: 0 15px;
    font-size: 16px;
    line-height: 60px;
    background: #f2f2f2;
  }
  .d-flex {
    padding: 0 20px 0 50px;
    line-height: 60px;
    font-size: 15px;
    .el-select {
      width: 120px;
    }
  }
}
.p-search {
  .top {
    .el-input {
      width: 220px;
      margin-right: 15px;
      margin-bottom: 12px;
    }
    .el-select {
      width: 220px;
      margin-right: 15px;
    }
  }
  .btn-export {
    margin-right: 15px;
  }
}
</style>