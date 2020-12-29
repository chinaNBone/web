<template>
  <div class="g-nav" style="background: #f3f6f9;">
    <div class="line"></div>
    <div class="hello">
      <div class="home">
        <img class="home-img" :src="`${imgUrl + userInfo.avatar}`" />
        <div class="home-name">
          <div class="h-N">{{ userInfo.realName }}</div>
          <div class="h-tittle">欢迎来到省级中小学教师发展中心培训平台</div>
        </div>
      </div>
      <div class="chart">
        <div class="chart-L">
          <div class="chart-line">
            <div class="cenusu">
              <div class="cenusu-t">平台活跃度</div>
              <div class="cenusu-line">
                <span
                  @click="changeTab(1, 'day')"
                  :style="statistics == 1 ? 'color:#38bd8c' : ''"
                  class="changeTab"
                  >日活跃度统计</span
                >
                <span
                  @click="changeTab(1, 'mouth')"
                  :style="statistics == 2 ? 'color:#38bd8c' : ''"
                  class="changeTab"
                  >月活跃度统计</span
                >
                <span
                  @click="changeTab(2)"
                  :style="statistics == 3 ? 'color:#38bd8c' : ''"
                  class="changeTab"
                  >年活跃度统计</span
                >
              </div>
            </div>
            <div class="load-all">
              <div ref="echarts" style="width:700px;height:400px"></div>
              <div>
                <div class="platform">
                  <div class="platformN">
                    {{ statistics == 3 ? "本月" : "今日" }}平台登陆总人数
                  </div>
                  <div class="number">
                    <span>
                      <span class="load-allnum">{{logNum}}</span>人
                    </span>
                    <i class="el-icon-top"></i>
                  </div>
                </div>
                <div class="personal">
                  <div class="platformN">
                    {{ statistics == 3 ? "本月" : "今日" }}个人项目活跃人数
                  </div>
                  <div class="number">
                    <span>
                      <span class="load-person">{{projectLogNum}}</span>人
                    </span>
                    <i class="el-icon-top"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="height-line"></div>
          <div class="chart-b">
            <div class="project">
              <div class="project-top">
                <div class="project-L">
                  <img class="imgurl" src="@/assets/index-project.png" />
                  <div class="project-L-content">
                    <div class="p-N">{{ allVal.projectNum }}</div>
                    <div class="p-t">培训项目总数</div>
                  </div>
                </div>
                <div
                  class="project-R"
                  style="cursor:pointer"
                  @click="goProject"
                >
                  查看培训项目列表 >
                </div>
              </div>
              <div class="project-bottom">
                <div class="p-Box">
                  <div class="p-B-N">{{ allVal.studentNum }}</div>
                  <div class="p-B-S">参加人数</div>
                </div>
                <div class="p-Box">
                  <div class="p-B-N">{{ allVal.periodTime }}</div>
                  <div class="p-B-S">培训时长</div>
                </div>
                <div class="p-box">
                  <div class="p-B-N">{{ allVal.teacherNum }}</div>
                  <div class="p-B-S">教师数</div>
                </div>
              </div>
            </div>
            <div class="funds">
              <div class="f-cenusu">
                <div class="F-cenusu-t">平台经费统计</div>
                <div style="color:#ccc"></div>
              </div>

              <div class="founds-expend">
                <div class="foundes-expend-s">
                  <div style="font-size:18px" v-if="!allVal.budgetAmount">0%</div>
                  <div style="font-size:18px" v-else>{{(allVal.todayAmount*100/allVal.budgetAmount)|m()}}%</div>
                  <div style="color:rgb(153, 153, 153)">经费占比</div>
                </div>
                <div id="main2" style="width: 240px;height:200px;"></div>
                <div>
                  <div class="F-platform">
                    <div class="F-number">
                      <span>
                        <span class="foundes-expend-all">
                          ￥{{allVal.budgetAmount}}
                          <span style="font-size:12px">/万元</span>
                        </span>
                      </span>
                    </div>
                    <div class="F-platformN">平台总经费统计</div>
                  </div>
                  <div class="F-personal">
                    <div class="F-number">
                      <span>
                        <span class="foundes-expend-today">
                          ￥{{allVal.todayAmount}}
                          <span style="font-size:12px">/万元</span>
                        </span>
                      </span>
                    </div>
                    <div class="F-platformN">今日平台经费统计</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-R">
          <div class="l-Step">
            <div class="cenusu">
              <div class="cenusu-t">平台消息</div>
              <div class="cenusu-line-P">
                <span @click="goMsg" style="cursor:pointer">查看更多></span>
              </div>
            </div>
            <div class="Article">
              <div
                class="Article-nav"
                v-for="(item, index) in msgList"
                :key="index"
              >
                <div class="Article-circle-top">
                  <div
                    class="Article-circle"
                    :class="
                      selectNum == 0 ||
                      selectNum == 1 ||
                      selectNum == 2 ||
                      selectNum == 3 ||
                      selectNum == 4
                        ? 'active-select'
                        : ''
                    "
                  ></div>
                  <div class="line-Step"></div>
                </div>
                <div>
                  <div class="Article-title-nav">
                    <div class="L-step-content">{{item.description}}</div>
                    <div class="L-step-B">{{item.model}}</div>
                    <div class="L-step-B">{{item.createdDt}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="height-line"></div>
          <div class="dealt">
            <div class="cenusu">
              <div class="cenusu-t">待办事项</div>
            </div>
            <div
              class="dealt-T"
              v-for="(item, index) in checkList"
              :key="index"
            >
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有{{item.num}}个{{['开班通知','课表','学员手册','学员报到','资源审核','项目审核'][item.type-1]}}待审核</span>
              </div>
              <!-- <i style="color:#ccc" class="el-icon-arrow-right"></i> -->
            </div>
          </div>
        </div>
      </div>
      <ul class="w-center">
        <li v-for="item in List" :key="item.id">
          <div class="W-name">{{ item.name }}</div>
          <div class="signIn">
            <div>
              <div class="w-number">{{ item.number }}</div>
              <div class="w-T">{{ item.tName }}</div>
            </div>
            <div class="img" :style="item.style">
              <img :src="item.img" alt style="width:24px;height:24px" />
            </div>
          </div>
        </li>
      </ul>
      <div class="Exhibition">
        <div class="cenusu">
          <div class="cenusu-t">专家排行</div>
          <div class="cenusu-line-N">
            <span
              @click="changeTap('')"
              :style="this.type == '' ? 'color:#38bd8c' : ''"
              class="changeTab"
              >总分</span
            >
            <span
              @click="changeTap(1)"
              :style="this.type == 1 ? 'color:#38bd8c' : ''"
              class="changeTab"
              >校长培训</span
            >
            <span
              @click="changeTap(2)"
              :style="this.type == 2 ? 'color:#38bd8c' : ''"
              class="changeTab"
              >教师培训</span
            >
            <span
              @click="changeTap(3)"
              :style="this.type == 3 ? 'color:#38bd8c' : ''"
              class="changeTab"
            >园长培训</span>
            <span
              @click="changeTap(4)"
              :style="this.type==4?'color:#38bd8c':''"
              class="changeTab"
            >其他</span>
          </div>
        </div>
        <div class="score-line">
          <div class="first-card">
            <div class="block">
              <img
                src="@/assets/first.png"
                alt
                style="width:625px;height:150px"
              />
            </div>
            <el-table :data="firstExpertList">
              <el-table-column type="index" width="30"></el-table-column>
              <el-table-column width="60px">
                <template slot-scope="scope">
                  <div class="image-logo-box">
                    <img
                      :src="(scope.row.avatar==null||scope.row.avatar=='')?defineImg:imgUrl+scope.row.avatar"
                      alt
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="realName" width="100px"></el-table-column>
              <el-table-column prop="mobile" width="300px"></el-table-column>
              <el-table-column width="100px">
                <template
                  slot-scope="scope"
                >{{'评分：'+[scope.row.totalScore,scope.row.headmasterScore,scope.row.teacherScore,scope.row.principalScore,scope.row.otherScore][type==''?0:type]}}</template>
              </el-table-column>
            </el-table>
          </div>
          <div class="last-card">
            <div class="block">
              <img
                src="@/assets/end.png"
                alt
                style="width:625px;height:150px"
              />
            </div>
            <el-table :data="lastExpertList">
              <el-table-column type="index" width="30"></el-table-column>
              <el-table-column width="60px">
                <template slot-scope="scope">
                  <div class="image-logo-box">
                    <img
                      :src="(scope.row.avatar==null||scope.row.avatar=='')?defineImg:imgUrl+scope.row.avatar"
                      alt
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="realName" width="100px"></el-table-column>
              <el-table-column prop="mobile" width="300px"></el-table-column>
              <el-table-column width="100px">
                <template
                  slot-scope="scope"
                >{{'评分：'+[scope.row.totalScore,scope.row.headmasterScore,scope.row.teacherScore,scope.row.principalScore,scope.row.otherScore][type==''?0:type]}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="programme">
        <div class="cenusu" style="margin-bottom:20px">
          <div class="cenusu-t">培训项目</div>
          <div class="cenusu-line-P">
            <span @click="goProject" style="cursor:pointer">查看更多></span>
          </div>
        </div>
        <!-- table表格 -->
        <el-table :data="projectTable" highlight-current-row>
          <el-table-column
            label="培训项目名称"
            prop="title"
            width="300"
          ></el-table-column>
          <el-table-column label="项目状态">
            <template slot-scope="scope">
              <el-tag
                :type="
                  scope.row.status == 1 || scope.row.status == 4
                    ? 'success'
                    : scope.row.status == 5
                    ? 'danger'
                    : 'warning'
                "
              >
                {{[
                "未发布",
                "已发布",
                "已撤回",
                "审核中",
                "已审核",
                "审核未通过",
                '专家审核中',
                '已关闭'
                ][scope.row.status]}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="departmentPerson"
            label="院系负责人"
          ></el-table-column>
          <el-table-column
            prop="principalPerson"
            label="项目负责人"
          ></el-table-column>
          <el-table-column prop="createdDt" label="创建时间"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "HelloWorld",
  data() {
    return {
      imgUrl: this.$setting.imageUrl,
      defineImg: require("../../../public/images/avatar_normal_200.jpg"),
      tableData: [],
      //专家排行
      firstExpertList: [],
      lastExpertList: [],
      checkList: [],
      msgList: [],
      //项目列表
      projectTable: [],
      allVal: {},
      //切换排行
      type: "",
      //统计切换
      statistics: 1,
      //统计列表
      statisticsList: [],
      //平台总登录数
      logNum: 0,
      projectLogNum: 0,
      List: [
        {
          name: "平台课程数",
          number: 0,
          tName: "节/课程",
          img: require("../../assets/project.png"),
          id: 1,
          style: "background: rgba(255, 243, 243, 1)"
        },
        {
          name: "平台教师数",
          number: 0,
          tName: "位/教师",
          img: require("../../assets/tea.png"),
          id: 2,
          style: "background: rgba(255, 161, 89, 0.098)"
        },
        {
          name: "平台教室数",
          number: 0,
          tName: "间/教室",
          img: require("../../assets/room.png"),
          id: 3,
          style: "background: rgba(105, 216, 170, 0.098)"
        },
        {
          name: "平台学生数",
          number: 0,
          tName: "位/学生",
          img: require("../../assets/stu.png"),
          id: 4,
          style: "background: rgba(86, 108, 254, 0.098)"
        }
      ],
      chart: null,
      selectNum: 0,
      option: {
        title: {},
        tooltip: {},
        legend: {
          y: "375px",
          data: ["平台活跃度", "个人项目活跃度"]
        },
        xAxis: {
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#8c8e90"
            }
          },
          splitLine: {
            show: false,
            //  改变轴线颜色
            lineStyle: {
              // 使用深浅的间隔色
              color: "#fff"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ccc" // x坐标轴的轴线颜色
            }
          }
        },
        yAxis: {
          axisLabel: {
            show: true,
            textStyle: {
              color: "#8c8e90"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "平台活跃度",
            type: "bar",
            data: []
          },
          {
            name: "个人项目活跃度",
            type: "bar",
            data: []
          }
        ],
        color: ["#38bd8c", "#f5b606"]
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getUserInfo;
    }
  },
  methods: {
    goProject() {
      window.location.href = "/project";
    },
    goMsg() {
      window.location.href = "/system?t=sysLog";
    },
    //专家排行切换
    changeTap(val) {
      this.type = val;
      this.getFirstExpertList(val);
      this.getLastExpertList(val);
    },
    //专家排行
    getFirstExpertList(val) {
      let par = {
        sortType: 1,
        type: val
      };
      this.$http
        .post("/api/web/index/getExpertList", par)
        .then(res => {
          this.firstExpertList = res.data;
        })
        .catch(msg => {});
    },
    //活跃统计切换
    changeTab(val, val2) {
      if (val2 == "day") {
        this.statistics = 1;
      } else if (val2 == "mouth") {
        this.statistics = 2;
      } else {
        this.statistics = 3;
      }
      let starTime,
        endTime = "";
      if (val == 1 && val2 == "day") {
        starTime = this.getDay(-7);
        endTime = this.getDay(0);
      }
      if (val == 1 && val2 == "mouth") {
        starTime = this.getMounth();
        endTime = this.getDay(0);
      }
      if (val == 2) {
        starTime = new Date().getFullYear() + "-01-01";
        endTime = new Date().getFullYear() + "-12-31";
      }
      this.getStatistics(val, starTime, endTime);
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    getMounth() {
      var myDate = new Date();
      var tYear = myDate.getFullYear();
      var tMonth = myDate.getMonth();
      tMonth = this.doHandleMonth(tMonth + 1);
      return tYear + "-" + tMonth + "-01";
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },

    //活跃统计
    getStatistics(val, star, end) {
      let par = {
        startD: star,
        endD: end,
        type: val
      };
      this.$http
        .post("/api/web/index/getLoginNum", par)
        .then(res => {
          this.statisticsList = res.data;
          this.logNum = 0;
          this.projectLogNum = 0;
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          for (var i of this.statisticsList) {
            if (val == 2) {
              this.option.xAxis.data.push(i.month + "月");
            } else {
              this.option.xAxis.data.push(i.month + "月" + i.day + "日");
            }
            this.option.series[0].data.push(i.logNum);
            this.option.series[1].data.push(i.projectLogNum);
          }
          if (val == 1) {
            if (
              this.statisticsList[this.statisticsList.length - 1].day ==
              new Date().getDate()
            ) {
              this.logNum = this.statisticsList[
                this.statisticsList.length - 1
              ].logNum;
              this.projectLogNum = this.statisticsList[
                this.statisticsList.length - 1
              ].projectLogNum;
            } else {
              this.logNum = 0;
              this.projectLogNum = 0;
            }
          } else {
            this.logNum = this.statisticsList[
              this.statisticsList.length - 1
            ].logNum;
            this.projectLogNum = this.statisticsList[
              this.statisticsList.length - 1
            ].projectLogNum;
          }

          this.getPage();
        })
        .catch(msg => {});
    },
    getLastExpertList(val) {
      let par = {
        sortType: "",
        type: val
      };
      this.$http
        .post("/api/web/index/getExpertList", par)
        .then(res => {
          this.lastExpertList = res.data;
        })
        .catch(msg => {});
    },
    getAllval() {
      this.$http
        .post("/api/web/index/getIndex")
        .then(res => {
          this.allVal = res.data;
          for (var i of this.List) {
            if (i.id == 1) {
              i.number = this.allVal.allCourseNum;
            }
            if (i.id == 2) {
              i.number = this.allVal.allTeacherNum;
            }
            if (i.id == 3) {
              i.number = this.allVal.allRoomNum;
            }
            if (i.id == 4) {
              i.number = this.allVal.allStudentNum;
            }
          }
          this.dwton(this.allVal.todayAmount, this.allVal.budgetAmount);
        })
        .catch(msg => {});
    },
    //代办列表
    getCheck() {
      this.$http
        .post("/api/web/index/checkList")
        .then(res => {
          this.checkList = res.data;
          this.checkList.splice(8, this.checkList.length - 1);
        })
        .catch(msg => {});
    },
    //平台消息
    getMsg() {
      this.$http
        .post("/api/web/index/logList")
        .then(res => {
          this.msgList = res.data;
          this.msgList.splice(3, this.msgList.length - 1);
        })
        .catch(msg => {});
    },
    getList() {
      let par = {
        pageNo: 1,
        pageSize: 6
      };
      this.$http
        .post("/api/edu/project/projectList", par)
        .then(res => {
          this.projectTable = res.data.records;
        })
        .catch(msg => {});
    },
    getPage() {
      this.chart = echarts.init(this.$refs.echarts);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(this.option);
    },
    dwton(val1, val2) {
      console.log(val1, val2)
      var myChart2 = echarts.init(document.getElementById("main2"));
      // 指定图表的配置项和数据
      var option2 = {
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)"
        },
        legend: {
          show: false,
          orient: "vertical",
          x: 'left',
          data: ['今日平台经费', '平台总经费'],
        },
        series: [
          {
            name: "经费统计",
            type: "pie",
            radius: ["60%", "70%"],
            startAngle: 180,
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: "top"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "normal"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: val1,
                itemStyle: { normal: { color: "#FF9B0A" } },
                name: "今日平台经费"
              },
              {
                value: val2,
                itemStyle: { normal: { color: "#5A6EF5" } },
                name: "平台总经费"
              },
            ]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart2.setOption(option2);
    }
  },
  mounted() {
    // 获取用户信息
    this.$store.dispatch("getUserInfo");
    this.changeTab(1, "day");
    this.getList();
    this.getMsg();
    this.getCheck();
    this.getAllval();
    this.getFirstExpertList();
    this.getLastExpertList();
  }
};
</script>
<style lang="scss" scoped>
.line {
  height: 40px;
  width: 100%;
}
.hello {
  width: 1330px;
  margin-left: 15%;
}
.img {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.home {
  box-shadow: 0 0 10px #e4dcdd;
  width: 100%;
  display: flex;
  height: 120px;
  align-items: center;
  padding-left: 10px;
  background: #fff;
  /* margin: 40px 0; */
  margin-bottom: 40px;
  .home-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 22px;
  }
}
.home-name {
  text-align: left;
}
.h-N {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
}
.h-tittle {
  color: #747272;
}

.simple {
  width: 200px;
  height: 200px;
  text-align: left;
}
.chart {
  display: flex;
  justify-content: space-between;
  height: 718px;
}
.chart-line {
  width: 100%;
  height: 63%;
  background: #fff;
  padding: 15px 20px;
  box-shadow: 0 0 10px #e4dcdd;
}
.height-line {
  height: 4%;
}
.chart-L {
  width: 70%;
}
.chart-R {
  width: 28%;
}
.platform,
.personal {
  width: 206px;
  height: 110px;
  padding: 15px;
  margin-left: -30px;
}
.F-platform,
.F-personal {
  width: 150px;
  text-align: left;
  padding: 0 10px 0 0;
}
.F-platform {
  margin-top: 36px;
}
.F-personal {
  margin-top: 25px;
}
.platform {
  border: 2px solid #daf4eb;
  margin-top: 50px;
}
.personal {
  border: 2px solid #f5b606;
  margin-top: 55px;
}
.F-platformN {
  color: #868788;
  font-size: 12px;
  text-align: left;
}
.platformN {
  color: #868788;
  font-size: 14px;
  text-align: left;
}
.number {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.number span {
  color: #ccc;
  font-size: 15px;
}
.f-cenusu {
  font-size: 14px;
  color: #868788;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}
.F-cenusu-t {
  color: #5c5c5d;
  font-size: 15px;
  border-left: 3px solid #38bd8c;
  padding-left: 10px;
}
.cenusu {
  font-size: 14px;
  color: #868788;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cenusu-line {
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.Exhibition {
  background: #fff;
  padding: 15px 20px;
  box-shadow: 0 0 10px #e4dcdd;
}
.programme {
  margin-top: 20px;
  background: #fff;
  padding: 15px 20px;
  min-height: 400px;
  box-shadow: 0 0 10px #e4dcdd;
}
.cenusu-line-N {
  width: 20%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.L-step-content {
  color: #5c5c5d;
  font-size: 15px;
}
.L-step-B {
  color: #ccc;
  font-size: 10px;
}
.L-step-s {
  color: #38bd8c;
  font-size: 14px;
}
.l-Step {
  height: 48%;
  background: #fff;
  padding: 15px 20px 10px 20px;
  box-shadow: 0 0 10px #e4dcdd;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dealt {
  height: 48%;
  background: #fff;
  padding: 15px 20px 10px 20px;
  box-shadow: 0 0 10px #e4dcdd;
}
.cenusu-t {
  color: #000;
  font-weight: 600;
  font-size: 15px;
  border-left: 3px solid #38bd8c;
  padding-left: 10px;
}
.cenusu-line-P {
  color: #ccc;
}
.project-top {
  padding: 0 5px;
  display: flex;
  height: 100px;
  justify-content: space-between;
}
.project-bottom {
  padding: 10px 0;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(242, 242, 242, 0.8);
}
.project-L {
  width: 33%;
  display: flex;
  justify-content: space-between;
  flex: 1;
  .project-L-content {
    flex: 1;
    margin-left: 15px;
  }
}
.p-N {
  margin-bottom: 10px;
  font-size: 26px;
}
.p-B-N {
  width: 137px;
  font-size: 26px;
  text-align: center;
}
.p-t {
  color: #ccc;
}
.imgurl {
  width: 50px;
  height: 60px;
}
.project-R {
  color: #ccc;
  font-size: 14px;
}
.project,
.funds {
  width: 447px;
  background: #fff;
  padding: 15px 20px;
  box-shadow: 0 0 10px #e4dcdd;
  height: 100%;
}
.project {
  margin-right: 4%;
}
.p-Box {
  border-right: 2px solid #fff;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.p-box {
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-b {
  height: 33%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.L-step-box {
  text-align: left;
  line-height: 30px;
  margin: 10px;
}

.Article {
  width: 100%;
  margin: 10px 0;
  align-items: center;
}
.Article-title {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.Article-title-nav {
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  display: flex;
  flex-direction: column;
}
.line-Step {
  width: 2px;
  height: 70px;
  margin: 5px 0;
  background-color: #daf4eb;
}
.Article-nav {
  display: flex;
}
.Article-circle-top {
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.Article-circle {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  border: 2px solid #38bd8c;
}
.active-select {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  border: 2px solid #38bd8c;
}
.dealt-T {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.e-T {
  width: 88%;
  display: flex;
  align-items: center;
  color: #ccc;
}
.examine {
  width: 45px;
  margin-right: 10px;
  color: #ff515b;
  background: #fbf0f1;
  text-align: center;
}
.p-B-S {
  color: #a5a4a4;
}
.w-center {
  overflow: hidden;
  margin: 25px 0;
  li:nth-child(4n) {
    margin-right: 0;
  }
  li:nth-child(1) {
    border-bottom: 5px solid #ff515b;
  }
  li:nth-child(2) {
    border-bottom: 5px solid #f5b606;
  }
  li:nth-child(3) {
    border-bottom: 5px solid #38bd8c;
  }
  li:nth-child(4) {
    border-bottom: 5px solid #566cfe;
  }
  li {
    float: left;
    width: 23.5%;
    padding: 7px;
    background: #fff;
    margin-right: 2%;
    box-shadow: 0 0 10px #e4dcdd;
  }
}
.W-name {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #747272;
}
.signIn {
  height: 60px;
  padding: 0 25px 0 40px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.w-number {
  font-size: 35px;
}
.w-T {
  color: #ccc;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.score-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /deep/.el-table__header-wrapper {
    display: none;
  }
}
.first-card,
.last-card {
  width: 48%;
  text-align: center;
}
.expert-line {
  display: flex;
  width: 94%;
  margin-left: 3%;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeaea;
}
.expert-detail {
  width: 32%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.block {
  margin: 15px 0 0 0;
}
.score {
  width: 140px;
  text-align: left;
}
.Imgurl {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.changeTab {
  cursor: pointer;
}
.load-all {
  display: flex;
  justify-content: space-between;
  .load-allnum,
  .load-person {
    font-size: 25px;
    margin-right: 10px;
  }
  .load-allnum {
    color: #38bd8c;
  }
  .load-person {
    color: #f5b606;
  }
}
.founds-expend {
  display: flex;
  justify-content: space-between;
  position: relative;
  .foundes-expend-s {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 54%;
    top: 50%;
    margin-top: -30px;
    margin-left: -150px;
    text-align: center;
  }
  .foundes-expend-all {
    font-size: 25px;
    color: #38bd8c;
    margin-right: 10px;
  }
  .foundes-expend-today {
    font-size: 25px;
    color: #ff515b;
    margin-right: 10px;
  }
}
</style>
