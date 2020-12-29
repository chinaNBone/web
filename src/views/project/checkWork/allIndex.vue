<template>
  <div>
    <div v-if="courseList.length == 0" class="no-data">
      <img src="../../../assets/no_data.png" />
      暂无数据
    </div>
    <div v-else>
      <div class="expert-top">
        <div class="item-msg">
          <div class="expert-name">
            <span class="expert-title" style=" font-weight: 600;font-size: 18px;">
              {{
              selectCourse.title
              }}
            </span>
            <span class="conclusion">
              {{
              ["即将开始", "进行中", "已结束"][changeStatus()]
              }}
            </span>
          </div>
          <div class="expert-details">
            <span>{{ selectCourse.day }}</span>
            <span>({{ selectCourse.week }})</span>
            <span>{{ selectCourse.beginTime }} ~ {{ selectCourse.endTime }}</span>
            <span>{{ selectCourse.roomName }}</span>
            <span>{{ selectCourse.teacherName }}</span>
          </div>
        </div>
        <el-dropdown class="item-change" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            切换到其它课节
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="max-height:400px;overflow-y:auto;">
            <el-dropdown-item
              v-for="(item, index) in courseList"
              :key="index"
              :command="item"
            >{{ item.title }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <ul class="w-center">
        <li>
          <div class="signIn">
            <div class="item-title">签到人数（人）</div>
            <div class="item-num">{{ numList.signInNum || "0" }}</div>
          </div>
          <div class="img" style="background:#E16F60;">
            <i class="el-icon-folder-checked"></i>
          </div>
        </li>
        <li>
          <div class="signIn">
            <div class="item-title">请假人数（人）</div>
            <div class="item-num">{{ numList.leaveNum || "0" }}</div>
          </div>
          <div class="img" style="background:#7EC198;">
            <i class="el-icon-tickets"></i>
          </div>
        </li>
        <li>
          <div class="signIn">
            <div class="item-title">补签人数（人）</div>
            <div class="item-num">{{ numList.patchNum || "0" }}</div>
          </div>
          <div class="img" style="background:#4486CF;">
            <i class="el-icon-edit"></i>
          </div>
        </li>
        <li>
          <div class="signIn">
            <div class="item-title">未签到人数（人）</div>
            <div class="item-num">{{ numList.noCheckNum || "0" }}</div>
          </div>
          <div class="img" style="background:#FFCC33;">
            <i class="el-icon-folder-delete"></i>
          </div>
        </li>
      </ul>
      <div class="signDetail">
        <div class="sign">
          <div class="signName">签到统计</div>
          <div v-if="!lineFlag" class="no-data">
            <img src="../../../assets/no_data.png" />
            暂无数据
          </div>
          <div v-else>
            <div class="simpleDemo" id="lineReport"></div>
          </div>
        </div>
        <div class="sign1">
          <div class="signName">签到统计</div>
          <div id="pieReport" style="width: 350px;height: 400px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["courseList", "selectCourse"],
  data() {
    return {
      numList: [],
      numData: [],
      lineFlag: false,
      projectId: localStorage.getItem("projectId")
    };
  },
  computed: {},
  watch: {
    selectCourse() {
      this.getNum();
      this.getLineData();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.selectCourse) {
        this.getNum();
        this.getLineData();
      }
    },
    handleCommand(command) {
      this.$emit("select", command);
    },
    getNum() {
      if (this.courseList.length == 0) {
        return false;
      }
      this.$nextTick(() => {
        let par = {
          projectId: this.projectId,
          timeTableId: this.selectCourse.id
        };
        this.$http
          .post(`/api/web/check/sum`, par)
          .then(res => {
            this.numData = [];
            let item = [
              { value: parseInt(res.data.signInNum), name: "签到人数" },
              { value: parseInt(res.data.leaveNum), name: "请假人数" },
              { value: parseInt(res.data.patchNum), name: "补签人数" },
              { value: parseInt(res.data.noCheckNum), name: "未签到人数" }
            ];
            this.numList = res.data;
            this.numData = item;
            this.drawPie("pieReport");
          })
          .catch(msg => {});
      });
    },
    getLineData() {
      let par = {
        projectId: this.projectId,
        timeTableId: this.selectCourse.id
      };
      this.$http
        .post(`/api/web/check/counttable`, par)
        .then(res => {
          let time = [];
          let num = [];
          let item = res.data;
          if (item.length == 0) {
            this.lineFlag = false;
          } else {
            this.lineFlag = true;
          }
          for (let i = 0; i < item.length; i++) {
            time.push(item[i].time);
            num.push(item[i].count);
          }
          this.getLine(time, num);
        })
        .catch(msg => {});
    },
    getLine(time, num) {
      this.$nextTick(() => {
        let line = this.$echarts.init(document.getElementById("lineReport"));
        // 使用刚指定的配置项和数据显示图表。
        line.setOption({
          xAxis: {
            type: "category",
            data: time
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: num,
              type: "line",
              lineStyle: {
                normal: {
                  color: "#00BE6E"
                }
              }
            }
          ]
        });
      });
    },
    drawPie(id) {
      this.charts = this.$echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
          left: "center",
          top: "bottom",
          data: ["签到人数", "请假人数", "补签人数", "未签到人数"]
        },
        series: [
          {
            label: {
              show: true,
              normal: {
                formatter: "{d}%",
                position: "inside"
              }
            },
            name: " 签到状态",
            type: "pie",
            radius: [80, 120],
            data: this.numData,
            itemStyle: {
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#03e5dd", "#0db8ff", "#6c73fe", "#3a85ff"];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      });
    },
    changeStatus() {
      let dateFlag = new Date().getTime();
      let dateStatus = 0;
      let str1 = (
        this.selectCourse.day +
        " " +
        this.selectCourse.beginTime
      ).toString();
      str1 = str1.replace(/-/g, "/");
      let oDate1 = new Date(str1).getTime();
      let str2 = (
        this.selectCourse.day +
        " " +
        this.selectCourse.endTime
      ).toString();
      str2 = str2.replace(/-/g, "/");
      let oDate2 = new Date(str2).getTime();
      if (dateFlag < oDate1) {
        dateStatus = 0;
      } else if (oDate1 < dateFlag && dateFlag < oDate2) {
        dateStatus = 1;
      } else if (oDate2 < dateFlag) {
        dateStatus = 2;
      }
      return dateStatus;
    }
  }
};
</script>
<style lang="scss" scoped>
.expert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background: #fafafa;
  border: 1px dashed #e6e6e6;
  .item-msg {
    .expert-title {
      max-width: 630px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .expert-name {
      margin-bottom: 10px;
      display: flex;
      .conclusion {
        border: 1px solid #777;
        color: #777;
        padding: 3px 5px;
        font-size: 12px;
        margin-left: 20px;
      }
    }
    .expert-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #b3b1b1;
    }
  }
  .item-change {
    .el-dropdown-link {
      cursor: pointer;
      color: #00be6e;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}

.w-center {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  li:nth-child(4n) {
    margin-right: 0;
  }
  li {
    padding: 15px;
    margin-right: 30px;
    flex: 1;
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .signIn {
      .item-title {
        color: #777;
        font-size: 14px;
      }
      .item-num {
        color: #333;
        font-weight: 600;
        font-size: 18px;
        line-height: 40px;
      }
    }
    .img {
      height: 40px;
      width: 40px;
      text-align: center;
      border-radius: 50%;
      i {
        color: #fff;
        font-size: 20px;
        line-height: 40px;
      }
    }
  }
}
.f-pointer {
  cursor: pointer;
  margin: 0 15px;
}
.signDetail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .sign {
    border: 1px solid #eee;
    width: 60%;
  }
  .sign1 {
    border: 1px solid #eee;
    width: 38%;
  }
  .signName {
    background: #eee;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding: 0 0 0 20px;
    color: #333;
  }
  .simpleDemo {
    width: 540px;
    height: 400px;
  }
}
.no-data {
  width: 350px;
  margin: 60px auto;
  color: #777;
  font-size: 18px;
  text-align: center;
  img {
    height: 100%;
  }
}
</style>
