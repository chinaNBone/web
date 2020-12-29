<template>
  <div class="course-detail">
    <el-tabs v-model="activeTab" type="card" class="m-tabs" @tab-click="handleClick">
      <el-tab-pane label="总览" name="first">
        <el-container>
          <el-main class="g-main" style="padding:20px 0 ">
            <!-- 检索行 -->
            <el-row class="search-row">
              <div class="expert-top">
                <div>
                  <div class="expert-name">
                    <span style=" font-weight: 600;font-size: 18px;">名家讲座：学生管理中的心理学智慧</span>
                    <span class="conclusion">已结课</span>
                  </div>
                  <div class="expert-details">
                    <span>2019-11-01 （周五） 09：00~00</span>
                    <span>明德楼403教室</span>
                    <span>胡逸眉</span>
                  </div>
                </div>
                <div class="expert-click">
                  切换到其它课节
                  <i class="el-icon-arrow-down"></i>
                </div>
              </div>
              <ul class="w-center">
                <li v-for="item in List" :key="item.id">
                  <div class="signIn">
                    <div style="padding-bottom:5px">{{item.name}}</div>
                    <div>{{item.number}}</div>
                  </div>
                  <div class="img">{{item.img}}</div>
                </li>
              </ul>
              <div class="signDetail">
                <div class="sign">
                  <div class="signName">签到统计</div>
                  <div ref="echarts" class="simpleDemo"></div>
                </div>
                <div class="sign1">
                  <div class="signName">签到统计</div>
                  <div id="pieReport" style="width: 350px;height: 400px;"></div>
                </div>
              </div>
            </el-row>
            <!-- table表格 -->
          </el-main>
        </el-container>
      </el-tab-pane>
      <el-tab-pane label="学员考勤" name="second">
        <el-row class="search-row">
          <div class="expert-top">
            <div>
              <div class="expert-name">
                <span style=" font-weight: 600;font-size: 18px;">名家讲座：学生管理中的心理学智慧</span>
                <span class="conclusion">已结课</span>
              </div>
              <div class="expert-details">
                <span>2019-11-01 （周五） 09：00~00</span>
                <span>明德楼403教室</span>
                <span>胡逸眉</span>
              </div>
            </div>
            <div class="expert-click">
              切换到其它课节
              <i class="el-icon-arrow-down"></i>
            </div>
          </div>
          <div class="f-fl" style="display:flex; margin-top:15px">
            <el-button type="primary" size="medium" @click="downloadExl">导出考勤数据</el-button>
            <div class="d-margin" style="margin-left:10px">
              <span class="color-orange">二维码</span>
              <span class="color-gray">|</span>
              <span class="color-orange">复制链接</span>
            </div>
          </div>
          <div class="f-fr" style=" margin-top:15px">
            <el-select v-model="isRecommend" size="medium" placeholder="选择上课老师">
              <el-option label="已报到" :value="0"></el-option>
              <el-option label="未报到" :value="1"></el-option>
            </el-select>
            <el-select v-model="isRecommend" size="medium" placeholder="选择上课教室">
              <el-option label="已报到" :value="0"></el-option>
              <el-option label="未报到" :value="1"></el-option>
            </el-select>
          </div>
        </el-row>
        <!-- table表格 -->
        <!-- <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="id" label="上课日期" width="180"></el-table-column>
          <el-table-column prop="name" label="上课时间"></el-table-column>
          <el-table-column prop="amount1" label="培训内容"></el-table-column>
          <el-table-column prop="amount2" label="上课地点"></el-table-column>
          <el-table-column prop="amount3" label="授课教师"></el-table-column>
          <el-table-column prop="amount4" label="课程状态"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  type="primary"
                  style="background:#fff;color:#00be6e; border:none"
                  size="small"
                  @click="todetail(scope.row.id)"
                >详情</el-button>
                <el-button
                  type="primary"
                  style="background:#fff;color:#00be6e; border:none"
                  size="small"
                  @click="tocode(scope.row.id)"
                >签到二维码</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>-->
        <div class="mangeNumber">
          <span>共{{}}学员</span>
          <span>已经签到{{}}人</span>
          <span>未签到{{}}人</span>
        </div>
        <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%">
          <el-table-column prop="date" label="姓名" width="180"></el-table-column>
          <el-table-column prop="name" label="签到状态" width="180"></el-table-column>
          <el-table-column prop="address" label="签到时间"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  type="primary"
                  style="background:#fff;color:#00be6e; border:none"
                  size="small"
                  @click="todetail(scope.row.id)"
                >取消签到</el-button>
                <div style="display:flex;justify-content:space-between">
                  <el-button
                    type="primary"
                    style="background:#fff;color:#00be6e; border:none"
                    size="small"
                    @click="tocode(scope.row.id)"
                  >补签</el-button>
                  <el-button
                    type="primary"
                    style="background:#fff;color:#00be6e; border:none"
                    size="small"
                    @click="tocode(scope.row.id)"
                  >请假</el-button>
                </div>

                <el-button
                  type="primary"
                  style="background:#fff;color:#00be6e; border:none"
                  size="small"
                  @click="tocode(scope.row.id)"
                >取消请假</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- <el-pagination
            v-show="total > 0"
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15,20,30,40]"
            :current-page.sync="tableQuery.pageNo"
            :page-size="tableQuery.pageSize"
            layout="sizes,prev, pager, next,total"
            :total="total"
        ></el-pagination>-->
      </el-tab-pane>
      <el-tab-pane label="教师考勤" name="third">
        <el-row class="search-row">
          <div class="f-fl">
            <el-button type="primary" size="medium" @click="downloadExl">导出课表</el-button>
          </div>
          <div class="f-fr">
            <el-select v-model="isRecommend" size="medium" placeholder="学员">
              <el-option label="已报到" :value="0"></el-option>
              <el-option label="未报到" :value="1"></el-option>
            </el-select>
            <el-select v-model="isRecommend" size="medium" placeholder="上课教室">
              <el-option label="已报到" :value="0"></el-option>
              <el-option label="未报到" :value="1"></el-option>
            </el-select>
          </div>
        </el-row>
        <!-- table表格 -->
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="id" label="上课日期" width="180"></el-table-column>
          <el-table-column prop="name" label="上课时间"></el-table-column>
          <el-table-column prop="amount1" label="培训内容"></el-table-column>
          <el-table-column prop="amount2" label="上课地点"></el-table-column>
          <el-table-column prop="amount3" label="授课教师"></el-table-column>
          <el-table-column prop="amount4" label="课程状态"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation">
                <el-button
                  type="primary"
                  style="background:#fff;color:#00be6e; border:none"
                  size="small"
                  @click="todetail(scope.row.id)"
                >详情</el-button>
                <el-button
                  type="primary"
                  style="background:#fff;color:#00be6e; border:none"
                  size="small"
                  @click="tocode(scope.row.id)"
                >签到二维码</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import { log } from "util";
import echarts from "echarts";
export default {
  name: "Work",
  props: {
    detailData: {
      type: Array
    }
  },
  data() {
    return {
      isRecommend: "",
      teacherId: "",
      roomId: "",
      obj: {},
      List: [
        { name: "签到人数：（人）", number: "56", img: "" },
        { name: "请假人数：（人）", number: "56", img: "" },
        { name: "补签人数：（人）", number: "56", img: "" },
        { name: "未签人数：（人）", number: "56", img: "" }
      ],
      rooms: [
        {
          value: "选项1",
          label: "102室"
        },
        {
          value: "选项2",
          label: "109室"
        },
        {
          value: "选项3",
          label: "110室"
        },
        {
          value: "选项4",
          label: "129室"
        },
        {
          value: "选项5",
          label: "139室"
        }
      ],
      teachers: [
        {
          value: "1",
          label: "李老师"
        },
        {
          value: "2",
          label: "刘老师"
        },
        {
          value: "3",
          label: "陈老师"
        },
        {
          value: "4",
          label: "范老师"
        },
        {
          value: "5",
          label: "黄老师"
        }
      ],
      isshow: false,
      cates: [],
      catalogyId: [],
      tableData: [],
      activeTab: "first",
      filters: {
        search: ""
      },
      charts: "",
      opinion: ["及格人数", "未及格人数"],
      opinionData: [
        { value: 12, name: "及格人数", itemStyle: "#1ab394" },
        { value: 18, name: "未及格人数", itemStyle: "#79d2c0" }
      ],
      myChart: null,
      option: {
        title: {},
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["09:00", "09:10", "09:20", "09:30"]
        },
        yAxis: {
          max: 50,
          min: 0,
          boundaryGap: [0.2, 0.2]
        },
        series: [
          {
            type: "bar",
            data: [5, 20, 36, 10]
          }
        ],
        color: ["#00be6e"]
      }
    };
  },
  methods: {
    drawPie(id) {
      this.charts = this.$echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: this.opinion
        },
        series: [
          {
            name: "状态",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              color: function(params) {
                //自定义颜色
                var colorList = ["#1ab394", "#79d2c0"];
                return colorList[params.dataIndex];
              }
            },
            data: this.opinionData
          }
        ]
      });
    },

    handleClick(tab, event) {
      console.log(tab, event);
      this.obj.activeTab = tab.name;
      this.$emit("func", this.obj);
      // if (tab.name === "second") {
      //   this.$http
      //     .post("/manager/enterprise/sonCompanyList", {
      //       id: this.company.id
      //     })
      //     .then(json => {
      //       this.subsidiary = json.data;
      //     });
      // }
    },
    getPage() {
      this.chart = echarts.init(this.$refs.echarts);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(this.option);
    },

    sendTeacher(e) {
      this.obj.teacherId = e;
      this.$emit("func", this.obj);
    },
    sendRoom(event) {
      this.obj.roomId = event;
      this.$emit("func", this.obj);
    },
    handleSelectionChange(val) {},
    downloadExl() {},
    getUserList() {},
    todetail() {
      this.isshow = true;
    },
    tocode() {},
    addCourse() {
      this.$router.push({ name: "addCourse" });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  mounted() {
    this.getPage();
    this.$nextTick(function() {
      this.drawPie("pieReport");
    });
  }
};
</script>

<style lang="scss" scoped>
.baseinfo-label {
  padding: 20px 50px;
  font-size: 18px;
  font-weight: 400;
}
.avatar.overstep {
  width: 198px;
  height: 120px;
}
.conclusion {
  border: 1px solid #e6e6e6;
  color: #e6e6e6;
  padding: 5px;
  font-size: 12px;
  margin-left: 20px;
}
.mangeNumber{
  width:30%;
  color: #b3b1b1;
  display: flex;
  justify-content: space-between;
}
.detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: #333333;
}
.expert-name {
  margin-bottom: 10px;
}
.expert-click {
  color: #00be6e;
}
.expert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  height: 80px;
  background: #f4fcf8;
  border: 1px dashed #e6e6e6;
}
.expert-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #b3b1b1;
}
.w-center {
  width: 120;
  height: 60px;
  overflow: hidden;
  margin: 15px 0;
  li:nth-child(4n) {
    margin-right: 0;
  }
  li {
    float: left;
    width: 20%;
    padding: 7px;
    margin-right: 6.66%;
    border: 1px solid #e6e6e6;
  }
}

.signDetail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sign {
  border: 1px solid #e6e6e6;
  width: 60%;
}
.sign1 {
  border: 1px solid #e6e6e6;
  width: 38%;
}
.signName {
  background: #e5e3e3;
  font-size: 16px;
  height: 40px;
  display: flex;
  align-items: center;
}
.file-name {
  width: 45%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: #333333;
}
.free {
  border: 1px solid #00be6e;
  padding: 2px 15px;
  font-size: 12px;
  background: #fff;
  color: #00be6e;
}
.nouse {
  border: 1px solid #ccc;
  padding: 2px 15px;
  font-size: 12px;
  color: #ccc;
}
.simpleDemo {
  width: 540px;
  height: 400px;
}
.operation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.org-logo {
  width: 120px;
  height: 120px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .s-inset-pace {
    display: block;
    height: 120px;
    line-height: 120px;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>

