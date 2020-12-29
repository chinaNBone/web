<template>
  <div class="body-box">
    <div class="line"></div>
    <div class="hello">
      <div class="home">
        <img class="img" src="@/assets/logo.png" />
        <div class="home-name">
          <div class="h-N">张铭文</div>
          <div class="h-tittle">欢迎来到省级中小学教师发展中心培训平台</div>
        </div>
      </div>
      <div class="chart">
        <div class="chart-L">
          <div class="chart-line">
            <div class="cenusu">
              <div class="cenusu-t">平台活跃度</div>
              <div class="cenusu-line">
                <span style="color:#38bd8c">日活跃度统计</span>
                <span>月活跃度统计</span>
                <span>年活跃度统计</span>
              </div>
            </div>
            <div style="display:flex">
              <div ref="echarts" style="width:800px;height:400px"></div>
              <div>
                <div class="platform">
                  <div class="platformN">今日平台登陆总人数</div>
                  <div class="number">
                    <span>
                      <span style="font-size:25px;color:#38bd8c;margin-right:10px">274</span>人
                    </span>
                    <i class="el-icon-download"></i>
                  </div>
                </div>
                <div class="personal">
                  <div class="platformN">今日个人项目活跃人数</div>
                  <div class="number">
                    <span>
                      <span style="font-size:25px;color:#f5b606;margin-right:10px">23</span>人
                    </span>
                    <i class="el-icon-upload2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-b">
            <div class="project">
              <div class="project-top">
                <div class="project-L">
                  <img class="imgurl" src="@/assets/logo.png" />
                  <div>
                    <div class="p-N">12</div>
                    <div class="p-t">培训项目总数</div>
                  </div>
                </div>
                <div class="project-R">查看培训项目列表 ></div>
              </div>
              <div class="project-bottom">
                <div class="p-Box">
                  <div class="p-B-N">25</div>
                  <div class="p-B-S">参加人数</div>
                </div>
                <div class="p-Box">
                  <div class="p-B-N">34:44:55</div>
                  <div class="p-B-S">培训时长</div>
                </div>
                <div class="p-box">
                  <div class="p-B-N">27</div>
                  <div class="p-B-S">教师数</div>
                </div>
              </div>
            </div>
            <div class="funds">
              <div class="f-cenusu">
                <div class="F-cenusu-t">平台经费统计</div>
                <div style="color:#ccc">查看培训经费统计 ></div>
              </div>
              <div style="display:flex; justify-content: space-between;">
                <div id="main2" style="width: 200px;height:200px;"></div>
                <div>
                  <div class="F-platform">
                    <div class="F-number">
                      <span>
                        <span style="font-size:25px;color:#38bd8c;margin-right:10px">￥274</span>
                      </span>
                    </div>
                    <div class="F-platformN">平台总经费统计</div>
                  </div>
                  <div class="F-personal">
                    <div class="F-number">
                      <span>
                        <span style="font-size:25px;color:#38bd8c;margin-right:10px">￥23</span>
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
              <div class="cenusu-t" style="margin-bottom:15px">平台消息</div>
            </div>
            <div class="Article">
              <div class="Article-nav">
                <div class="Article-circle-top">
                  <div
                    class="Article-circle"
                    :class="selectNum==0||selectNum==1||selectNum==2||selectNum==3||selectNum==4?'active-select':''"
                  ></div>
                  <div class="line-Step"></div>
                </div>
                <div>
                  <div class="Article-title-nav">
                    <div class="L-step-content">赵雅创建了培训项目</div>
                    <div class="L-step-B">《2019年跨区域合作中小学卓越校长高级研修》</div>
                    <div class="L-step-s">查看详情</div>
                    <div class="L-step-B">2019-08-23</div>
                  </div>
                </div>
              </div>
              <div class="Article-nav">
                <div class="Article-circle-top">
                  <div
                    class="Article-circle"
                    :class="selectNum==1||selectNum==2||selectNum==3||selectNum==4?'active-select':''"
                  ></div>
                  <div class="line-Step"></div>
                </div>
                <div>
                  <div class="Article-title-nav">
                    <div class="L-step-content">赵雅创建了培训项目</div>
                    <div class="L-step-B">《2019年跨区域合作中小学卓越校长高级研修》</div>
                    <div class="L-step-s">查看详情</div>
                    <div class="L-step-B">2019-08-23</div>
                  </div>
                </div>
              </div>
              <div class="Article-nav">
                <div class="Article-circle-top">
                  <div
                    class="Article-circle"
                    :class="selectNum==2||selectNum==3||selectNum==4?'active-select':''"
                  ></div>
                  <div class="line-Step"></div>
                </div>
                <div>
                  <div class="Article-title-nav">
                    <div class="L-step-content">赵雅创建了培训项目</div>
                    <div class="L-step-B">《2019年跨区域合作中小学卓越校长高级研修》</div>
                    <div class="L-step-s">查看详情</div>
                    <div class="L-step-B">2019-08-23</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dealt">
            <div class="cenusu">
              <div class="cenusu-t">待办事项</div>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有1个开班通知待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有1个开班通知待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有1个开班通知待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有5份学员手册待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有10份学员报到问卷待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有1份学习课表待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
            <div class="dealt-T">
              <div class="e-T">
                <div class="examine">审核</div>
                <span>有36个资源文件待审核</span>
              </div>
              <i style="color:#ccc" class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
      <ul class="w-center">
        <li v-for="item in List" :key="item.id">
          <div class="W-name">{{item.name}}</div>
          <div class="signIn">
            <div>
              <div class="w-number">{{item.number}}</div>
              <div class="w-T">{{item.tName}}</div>
            </div>
            <div class="img">{{item.img}}</div>
          </div>
        </li>
      </ul>
      <div class="Exhibition">
        <div class="cenusu">
          <div class="cenusu-t">专家排行</div>
          <div class="cenusu-line-N">
            <span style="color:#38bd8c">总分</span>
            <span>校长培训</span>
            <span>教师培训</span>
            <span>园长培训</span>
          </div>
        </div>
        <div class="score-line">
          <div class="first-card">
            <div class="block">
              <el-carousel height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                  <h3 class="small">{{ item }}</h3>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div v-for="item in expertList" :key="item.index">
              <div class="expert-line">
                <div class="expert-detail">
                  <div>{{index}}</div>
                  <img class="Imgurl" :src="item.img" />
                  <div>{{item.name}}</div>
                  <div>{{item.phone}}</div>
                </div>
                <div class="score">评分：{{item.score}}</div>
              </div>
            </div>
          </div>
          <div class="last-card">
            <div class="block">
              <el-carousel height="150px">
                <el-carousel-item v-for="item in 4" :key="item">
                  <h3 class="small">{{ item }}</h3>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div v-for="item in expertList" :key="item.index">
              <div class="expert-line">
                <div class="expert-detail">
                  <div>{{index}}</div>
                  <img class="Imgurl" :src="item.img" />
                  <div>{{item.name}}</div>
                  <div>{{item.phone}}</div>
                </div>
                <div class="score">评分：{{item.score}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="programme">
        <div class="cenusu" style="margin-bottom:20px">
          <div class="cenusu-t">培训项目</div>
          <div class="cenusu-line-P">
            <span>查看更多></span>
          </div>
        </div>
        <!-- table表格 -->
        <el-table :data="tableData" highlight-current-row>
          <el-table-column label="培训项目名称" prop="name" width="300"></el-table-column>
          <el-table-column prop="gender" label="项目状态">
            <template slot-scope="scope">
              <div>{{scope.row.gender==1?'男':'女'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="项目执行人"></el-table-column>
          <el-table-column prop="unit" label="学习人数"></el-table-column>
          <el-table-column prop="address" label="创建时间"></el-table-column>
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
      tableData: [],
      expertList: [
        {
          name: "周浩来",
          phone: "15038217320",
          score: "3.0",
          img: ""
        },
        {
          name: "周浩来",
          phone: "15038217320",
          score: "3.0",
          img: ""
        },
        {
          name: "周浩来",
          phone: "15038217320",
          score: "3.0",
          img: ""
        },
        {
          name: "周浩来",
          phone: "15038217320",
          score: "3.0",
          img: ""
        },
        {
          name: "周浩来",
          phone: "15038217320",
          score: "3.0",
          img: ""
        }
      ],
      List: [
        {
          name: "平台培训项目数",
          number: "156",
          tName: "节/培训项目",
          img: ""
        },
        { name: "平台教师数", number: "234", tName: "位/教师", img: "" },
        { name: "平台教室数", number: "356", tName: "间/教室", img: "" },
        { name: "平台学生数", number: "290", tName: "位/学生", img: "" }
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
          data: [
            "11月01日",
            "11月02日",
            "11月03日",
            "11月04日",
            "11月05日",
            "11月06日",
            "11月07日"
          ],
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
            data: [30, 20, 36, 40, 50, 60, 70]
          },
          {
            name: "个人项目活跃度",
            type: "bar",
            data: [200, 310, 120, 320, 200, 100, 130]
          }
        ],
        color: ["#38bd8c", "#f5b606"]
      }
    };
  },
  methods: {
    getPage() {
      this.chart = echarts.init(this.$refs.echarts);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(this.option);
    },
    dwton() {
      var myChart2 = echarts.init(document.getElementById("main2"));
      // 指定图表的配置项和数据
      var option2 = {
        legend: {
          show: false,
          orient: "vertical",
          x: "left",
          data: ["多", "平", "__other"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            startAngle: 180,
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "top"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "多" },
              { value: 310, name: "平" },
              {
                value: 879,
                name: "__other",
                itemStyle: { normal: { color: "rgba(0,0,0,0)" } }
              }
            ]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart2.setOption(option2);
    }
  },
  mounted() {
    this.getPage();
    this.dwton();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.body-box {
  background: #f3f6f9;
  min-height: 2600px;
  margin: 0 auto;
}
.line {
  height: 40px;
  width: 100%;
}
.hello {
  width: 70%;
  margin-left: 15%;
}
.img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
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
.simpleDemo {
  width: 800px;
  height: 400px;
  text-align: left;
  /* margin: 0 auto; */
}
.simple {
  width: 200px;
  height: 200px;
  text-align: left;
}
.chart {
  display: flex;
  justify-content: space-between;
  height: 30%;
}
.chart-line {
  width: 100%;
  background: #fff;
  padding: 15px 20px;
  box-shadow: 0 0 10px #e4dcdd;
}
.chart-L {
  width: 70%;
}
.chart-R {
  width: 28%;
}
.platform,
.personal {
  width: 200px;
  height: 100px;
  margin-left: -20px;
  padding: 15px;
}
.F-platform,
.F-personal {
  width: 120px;
  height: 55px;
  text-align: left;
  padding: 0 10px 0 0;
}
.F-platform {
  margin-top: 35px;
}
.F-personal {
  margin-top: 35px;
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
  background: #fff;
  padding: 15px 20px 10px 20px;
  box-shadow: 0 0 10px #e4dcdd;
}
.dealt {
  background: #fff;
  margin-top: 35px;
  padding: 15px 20px 10px 20px;
  box-shadow: 0 0 10px #e4dcdd;
}
.cenusu-t {
  color: #5c5c5d;
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
  background: #e2e0e0;
}
.project-L {
  width: 35%;
  display: flex;
  justify-content: space-between;
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
.chart-b {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.project,
.funds {
  width: 49%;
  background: #fff;
  margin-top: 25px;
  padding: 15px 20px;
  height: 250px;
  box-shadow: 0 0 10px #e4dcdd;
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
  margin-top: -27px;
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
  align-items: center;
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
  padding: 0 20px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.w-number {
  font-size: 35px;
  text-align: center;
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
  width: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.block {
  margin: 15px 0 0 0;
}
.score {
  margin-right: 60px;
}
.Imgurl {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
