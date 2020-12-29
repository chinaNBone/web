<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">培训项目</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }"
            >当前位置：首页</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/project' }"
            >培训项目</el-breadcrumb-item
          >
          <el-breadcrumb-item>需求调研</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="l-mod l-edit">
      <div class="l-mod-tool">
        <h2>问卷详情</h2>
        <div @click="toBlock()">返回 &gt;</div>
      </div>
      <div class="l-con">
        <div class="d-title">
          <h2>
            <i class="el-icon-arrow-left d-title-icon" @click="toBlock()"></i>
            {{ projectDate.title }}
            <span class="d-title-type">
              {{ ["未发布", "已发布", "已关闭"][projectDate.status] }}
            </span>
          </h2>
          <el-button
            @click="getPdf(projectDate.title ? projectDate.title : '问卷详情')"
            :loading="pdfLoading"
            type="warning"
            >导出PDF</el-button
          >
          <el-button class="btn-add1" @click="closeQuestionnaire(2)"
            >关闭问卷</el-button
          >
        </div>
        <div class="d-margin">
          <span class="d-margin-des">
            收集时间：
            <span v-if="projectDate.collectDateBegin"
              >{{ projectDate.collectDateBegin }}至{{
                projectDate.collectDateEnd
              }}</span
            >
            <span v-else>不限</span>
          </span>
          <el-popover
            placement="bottom"
            trigger="click"
            v-if="projectDate.status != 0"
          >
            <canvas class="clocking-qrcode" v-qrcode="qrcodeUrl"></canvas>
            <span slot="reference" class="color-orange f-pointer">二维码</span>
          </el-popover>
          <span class="color-gray" v-if="projectDate.status != 0">|</span>
          <span
            v-if="projectDate.status != 0"
            class="color-orange f-pointer"
            v-clipboard:copy="qrcodeUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onCopyError"
            >复制链接</span
          >
        </div>
        <div class="d-options" id="pdfDom">
          <el-tabs v-model="tagDetail" type="card" @tab-click="pathRoute">
            <el-tab-pane label="汇总统计" name="1">
              <div class="d-sum">
                <!-- <el-button type="primary" @click="exportResults()">导出统计结果</el-button> -->
                <span>
                  填报人数：
                  <i>{{ answerNum }}</i
                  >,
                </span>
                <span>
                  有效答卷:
                  <i>{{ answerNum }}</i
                  >,
                </span>
                <span>
                  有效率：
                  <i>{{ answerNum == 0 ? "0%" : "100%" }}</i>
                </span>
              </div>
              <ul class="d-con">
                <li v-for="(item, index) of result" :key="index">
                  <div class="m-flex d-border-d">
                    <div class="d-con-que">
                      <span class="d-title-count">{{ index + 1 }}</span>
                      <span class="d-title-type d-title-type-color">
                        {{ ["", "问答题", "单选题", "多选题"][item.type] }}
                      </span>
                      <span>{{ index + 1 }}. {{ item.title }}</span>
                    </div>
                    <div class="d-content" v-if="item.type === 1">
                      <span>本题答题人数: {{ answerNum }}人</span>
                    </div>
                  </div>
                  <div v-if="item.type === 1">
                    <span
                      class="color-green"
                      style="cursor: pointer"
                      @click="check(item.detailId, item.title)"
                      >查看答题结果 &gt;</span
                    >
                  </div>
                  <ul class="d-con-progress" v-else-if="item.type === 2">
                    <li v-for="(val, idx) in item.opt" :key="idx">
                      <span>{{ idx + 1 }}.{{ val.option }}</span>
                      <span>
                        <el-progress
                          :show-text="false"
                          :stroke-width="14"
                          :percentage="
                            val.num ? (val.num / answerNum) * 100 : 0
                          "
                        ></el-progress>
                      </span>
                      <span
                        >{{
                          val.num ? keepTwo((val.num / answerNum) * 100) : 0
                        }}%</span
                      >
                      <span>
                        <i v-if="val.num">{{ val.num }}人</i>
                        <i v-else>0人</i>
                      </span>
                    </li>
                  </ul>
                  <ul class="d-con-progress" v-else-if="item.type === 3">
                    <li v-for="(val, idx) of item.opt" :key="idx">
                      <span>{{ idx + 1 }}.{{ val.option }}</span>
                      <span>
                        <el-progress
                          :show-text="false"
                          :stroke-width="14"
                          :percentage="
                            val.num ? (val.num / answerNum) * 100 : 0
                          "
                        ></el-progress>
                      </span>
                      <span
                        >{{
                          val.num ? keepTwo((val.num / answerNum) * 100) : 0
                        }}%</span
                      >
                      <span>
                        <i v-if="val.num">{{ val.num }}人</i>
                        <i v-else>0人</i>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
              <el-dialog
                title="答题结果"
                :visible.sync="dialogVisible"
                width="600px"
                style="margin: 50px 0 0 50px"
                :closeOnClickModal="false"
                :before-close="handleClose"
              >
                <div class="down-exl">
                  <el-button type="warning" size="medium" @click="downloadExl"
                    >导出</el-button
                  >
                </div>

                <!-- table表格 -->
                <h3>1.{{ title }}</h3>
                <el-table :data="question" highlight-current-row>
                  <el-table-column label="头像" width="80">
                    <template slot-scope="scope">
                      <div class="image-logo-box">
                        <img
                          width="40"
                          height="40"
                          :src="
                            scope.row.avatar == null || scope.row.avatar == ''
                              ? defineImg
                              : imgUrl + scope.row.avatar
                          "
                          alt
                        />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="realName"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column
                    prop="answer"
                    label="结果"
                    width="200"
                  ></el-table-column>
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
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="答卷详情" name="2">
              <div class="d-sum d-space-between">
                <div class="d-data">
                  <!-- <el-button type="primary" @click="exportData()">导出问卷数据</el-button> -->
                  <span>
                    共收集答卷
                    <i>{{ answerNum }}</i
                    >份，
                  </span>
                  <span>
                    有效答卷
                    <i>{{ answerNum }}</i
                    >份
                  </span>
                </div>
                <div class="m-search">
                  <el-input
                    v-model="search"
                    placeholder="输入用户姓名搜索"
                  ></el-input>
                  <el-button class="btn-search" @click="getAnswerList('search')"
                    >搜索</el-button
                  >
                </div>
              </div>
              <!-- table表格 -->
              <el-table :data="listTable" v-loading="loading">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="头像">
                  <template slot-scope="scope">
                    <div class="image-logo-box">
                      <img
                        :src="
                          scope.row.avatar
                            ? imgUrl + scope.row.avatar
                            : defineImg
                        "
                        alt
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="realName" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column
                  prop="mergerName"
                  label="所在区域"
                ></el-table-column>
                <el-table-column
                  prop="createdDt"
                  label="提交时间"
                  width="150px"
                >
                  <template slot-scope="scope">{{
                    scope.row.createdDt | moment("YYYY-MM-DD HH:mm")
                  }}</template>
                </el-table-column>
                <el-table-column
                  prop="answertime"
                  label="答卷时长(秒)"
                ></el-table-column>
                <el-table-column prop="option" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click="viewanswer(scope.row)"
                      >查看答卷</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import projectDetailVue from "../projectList/projectDetail.vue";
export default {
  mounted() {
    this.surveyId = this.$route.query.surveyId;
    this.tagDetail = this.$route.query.tagDetail
      ? this.$route.query.tagDetail
      : "1";
    this.projectDetails();
  },
  data() {
    return {
      answerNum: 0,
      title: "",
      dialogVisible: false,
      imgUrl: this.$setting.imageUrl + "/",
      defineImg: require("../../../../public/images/avatar_normal_200.jpg"),
      listTable: [],
      search: "",
      loading: false,
      questionId: "",
      surveyId: "",
      projectDate: {
        title: "",
      },
      tagDetail: "1",
      formInline: {},
      id: "",
      isEsit: false,
      info: {},
      editFlagId: "",
      question: [],
      questionSet: {
        title: "",
        type: 2,
        sortId: 1,
        required: false,
        options: [
          {
            option: "",
          },
        ],
      },
      pageList: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      listPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      listPage2: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      result: [],
      checkId: "",
    };
  },
  watch: {
    dialogVisible(newV) {
      if (newV == false) {
        this.listPage.pageNo = 1;
      }
    },
  },
  computed: {
    pdfLoading() {
      return this.$store.state.global.pdfLoading;
    },
    qrcodeUrl() {
      return `${this.$setting.h5URL}/center/demand/${this.projectDate.id}?questionId=${this.projectDate.questionId}`;
    },
  },
  methods: {
    keepTwo(val) {
      return Number(val).toFixed(2);
    },
    downloadExl() {
      let par = {
        detailId: this.checkId,
      };
      this.$http
        .post("/api/edu/projectQuestion/exportAnswerList", par)
        .then((res) => {
          let exlList = res.data;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
          }
          let title = "答题结果";
          let sheet = "答题结果";
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["姓名", "问题", "结果"];
            let filterVal = ["realName", "title", "answer"]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch((msg) => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) => filterVal.map((j) => v[j]));
      return arr;
    },
    onCopy() {
      this.$notify.success({
        message: "链接复制成功",
        customClass: "notify-only-message",
      });
    },
    onCopyError() {
      this.$notify.error({
        message: "链接复制失败",
        customClass: "notify-only-message",
      });
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.check(this.checkId, this.title);
    },
    handleCurrentChange2(val) {
      this.listPage.pageNo = val;
      this.getAnswerList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    check(id, title) {
      this.checkId = id;
      this.title = title;
      let par = {
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize,
        detailId: id,
      };
      this.$http
        .post("/api/edu/projectQuestion/answerList", par)
        .then((res) => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.question = res.data.records;
          this.dialogVisible = true;
        });
    },
    getAnswerList(val) {
      if (val == "search") {
        this.pageList.pageNo = 1;
      }
      this.loading = true;
      let par = {
        questionId: this.questionId,
        realName: this.search,
      };
      this.$http
        .post("/api/edu/projectQuestion/answerPersonalList", par)
        .then((res) => {
          this.listTable = res.data;
          this.answerNum = res.data.length;
          this.loading = false;
        });
    },
    viewanswer(val) {
      this.$router.push({
        path: "demandDetailIndex",
        query: {
          userId: val.userId,
          questionId: this.questionId,
          surveyId: this.surveyId,
          avatar: val.avatar,
          realName: val.realName,
        },
      });
    },
    getResult() {
      let par = {
        // pageNo: this.pageList.pageNo,
        // pageSize: this.pageList.pageSize,
        questionId: this.questionId,
      };
      this.$http
        .post("/api/edu/projectQuestion/answerCollect", par)
        .then((res) => {
          this.result = res.data;
          // console.log(this.result);
          this.result.forEach((item) => {
            item.opt = JSON.parse(item.options);
            if (item.answerList) {
              item.answerList.forEach((val) => {
                if (val.answer.indexOf("{") != -1) {
                  val.answer = JSON.parse(val.answer).option;
                }
              });
            }
          });
          this.result.forEach((item) => {
            if (item.type != 1) {
              item.opt.forEach((item2) => {
                item.answerList.forEach((item3) => {
                  if (item2.option == item3.answer) {
                    item2.num = item3.num;
                  }
                });
              });
            }
          });
          console.log(this.result);
        });
    },
    projectDetails() {
      this.$http
        .post("/api/edu/projectQuestion/getOne", {
          surveyId: this.surveyId,
        })
        .then((res) => {
          this.projectDate = res.data;
          this.questionId = res.data.questionId;
          // this.detailId =
          this.getResult();
          this.getAnswerList();
        });
    },
    toBlock() {
      this.$router.push({
        path: "/project",
        query: {
          t: "second",
        },
      });
    },
    closeQuestionnaire(status) {
      this.$confirm("请确认是否执行关闭操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let par = {
            status: status,
            surveyId: this.surveyId,
          };
          this.$http
            .post("/api/edu/projectQuestion/publishOrCloseProjectQuestion", par)
            .then(() => {
              this.$message({
                message: "关闭成功",
                type: "success",
              });
              this.projectDetails();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    exportWord() {},
    exportResults() {},
    pathRoute(tab) {
      this.tagDetail = tab.name;
      this.$router.push({
        query: {
          t: this.tagDetail,
          surveyId: this.surveyId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.d-options {
  .d-con {
    & > li {
      padding: 10px 20px;
      border: dashed 1px #ccc;
      margin-bottom: 20px;
      & > div {
        padding: 10px 0;
        .d-title-count {
          margin-right: 15px;
        }
      }

      .d-con-progress {
        li {
          display: flex;
          padding-top: 10px;
          span {
            flex: 0 1 auto;
          }
          span:nth-child(1) {
            width: 150px;
          }
          span:nth-child(2) {
            flex: 1 1 auto;
          }
          span:nth-child(3) {
            width: 80px;
            padding-left: 20px;
          }
          span:nth-child(4) {
            width: 80px;
            text-align: right;
            padding-right: 20px;
          }
        }
      }
    }
  }
}
.d-sum,
.d-data {
  margin-bottom: 20px;
}
.down-exl {
  margin-bottom: 10px;
}
</style>