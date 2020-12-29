<template>
  <div class="course-detail">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="m-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="基本信息" name="first">
        <div>
          <el-form label-width="100px" style="width: 550px" size="small">
            <el-form-item label="问卷标题">{{ userForm.title }}</el-form-item>
            <el-form-item label="关联问卷">{{
              userForm.linkName
            }}</el-form-item>
            <el-form-item label="收集时间">
              <span>
                {{ userForm.collectDateBegin | moment("YYYY-MM-DD HH:mm") }} -
                {{ userForm.collectDateEnd | moment("YYYY-MM-DD HH:mm") }}
              </span>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="汇总统计" name="second">
        <el-row class="search-row">
          <div class="f-fl">
            <el-button type="primary" size="medium" @click="downloadExl(2)"
              >导出统计结果</el-button
            >
            <el-button
              type="warning"
              size="medium"
              @click="getPdf(title)"
              :loading="pdfLoading"
              >导出PDF</el-button
            >
            <span class="census">填报人数：{{ collectList.total }}</span>
          </div>
        </el-row>
        <div id="pdfDom">
          <div
            class="degree-line"
            v-for="(item, index) in collectList.evaluationCountVOS"
            :key="index"
          >
            <div class="degree">
              <span class="degree-tip">{{ index + 1 }}</span>
              <span class="free">{{
                item.type == 1 ? "问答题" : item.type == 2 ? "单选题" : "多选题"
              }}</span>
              <span class="degree-title">{{ item.title }}</span>
            </div>
            <div
              class="degree-percent"
              v-for="(son, inde) in item.answerCounts"
              :key="inde"
            >
              <div class="degree-list">
                <span class="degree-number"
                  >{{ inde + 1 }}.{{ son.answer }}</span
                >
                <div class="progress-list">
                  <el-progress
                    :stroke-width="13"
                    :percentage="
                      collectList.total == 0
                        ? 0
                        : ((son.count / collectList.total) * 100) | keepTwo
                    "
                    :color="customColor"
                  ></el-progress>
                </div>
                <span class="degree-man">{{ son.count }}人</span>
              </div>
            </div>
            <div class="degree-more" v-if="item.type == 1">
              <span @click="showDegree(item.options)">查看答题结果 ></span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="答卷详情" name="third">
        <div v-if="answerNum">
          <el-row class="search-row">
            <div class="f-fl">
              <el-button type="primary" size="medium" @click="downloadExl(2)"
                >导出问卷数据</el-button
              >
              <span class="census">共收集答卷：{{ dataTotal }}份</span>
            </div>
            <div class="f-fr">
              <el-input
                v-model="filters.search"
                size="medium"
                placeholder="输入用户姓名搜索"
              ></el-input>
              <el-button
                type="primary"
                style="background: rgba(255, 153, 0, 1); border: none"
                size="medium"
                @click="getPage('search')"
                >搜索</el-button
              >
            </div>
          </el-row>
          <!-- table表格 -->
          <el-table :data="tableData" highlight-current-row>
            <el-table-column label="照片" prop="avatar" width="100">
              <template slot-scope="scope">
                <div class="s-img">
                  <img
                    :src="imgUrl + scope.row.avatar"
                    alt
                    width="40"
                    height="40"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="学员姓名"
              prop="name"
              width="100"
            ></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="city" label="所在区域"></el-table-column>
            <el-table-column label="提交时间">
              <template slot-scope="scope">{{
                scope.row.createdDt | moment("YYYY-MM-DD HH:mm")
              }}</template>
            </el-table-column>
            <el-table-column
              prop="answerTime"
              label="答卷时间（秒）"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toEdit(scope.row)"
                  >查看答卷</el-button
                >
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
        <Answer
          :editVal="editVal"
          :tableList="tableData"
          v-if="!answerNum"
          :answerNum.sync="answerNum"
        ></Answer>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="查看答题结果"
      :visible.sync="degreeOpen"
      width="500px"
      :before-close="closeDegree"
      :close-on-click-modal="false"
    >
      <el-button
        type="primary"
        size="medium"
        @click="downloadAnswer"
        style="margin-bottom: 5px"
        >导出答题结果</el-button
      >
      <el-table
        :data="
          degreeTable.slice(
            (upLoadPage.currentPage - 1) * upLoadPage.pageSize,
            upLoadPage.currentPage * upLoadPage.pageSize
          )
        "
      >
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="答案" prop="answer"></el-table-column>
      </el-table>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCuChange"
        :current-page="upLoadPage.currentPage"
        :page-size="upLoadPage.pageSize"
        :total="degreeTable.length"
        layout="total, prev, pager, next"
      ></el-pagination>
      <el-form label-width="120px" label-position="right">
        <el-form-item align="right" class="dialog-btns">
          <el-button type="primary" @click="degreeOpen = false">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import ValuteTab from "./valuteTab.vue";
import Answer from "./answer";
export default {
  name: "DetailTap",
  props: {
    detailId: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  components: {
    ValuteTab,
    Answer,
  },
  data() {
    return {
      imgUrl: this.$setting.imageUrl,
      free: false,
      roomId: "",
      isshow: false,
      obj: {},
      userForm: {},
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1,
      },
      dataTotal: 0,
      customColor: "#409eff",
      tableData: [],
      activeTab: "first",
      filters: {
        search: "",
      },
      //汇总统计列表
      collectList: {},
      //控制答卷详情页面
      answerNum: true,
      //查看答卷对象
      editVal: {},
      degreeOpen: false,
      upLoadPage: {
        currentPage: 1,
        total: 0,
        pageSize: 5,
      },
      degreeTable: [],
    };
  },
  filters: {
    keepTwo(val) {
      val = Number(val);
      return val.toFixed(2);
    },
  },
  watch: {
    activeTab(v) {
      if (v == "first") {
        this.getDetail();
      } else if (v == "second") {
        this.getCount();
      } else {
        this.getPage();
      }
    },
  },
  computed: {
    pdfLoading() {
      return this.$store.state.global.pdfLoading;
    },
  },
  methods: {
    handleClick(tab, event) {
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

    downloadExl(val) {
      if (val == 1) {
      } else {
        let par = {
          searchName: this.filters.search,
        };
        this.$http
          .get(`/api/web/evaluation/answer/detail/all/${this.detailId}`, {
            params: par,
          })
          .then((res) => {
            let exlList = res.data;
            for (let i = 0; i < exlList.length; i++) {
              exlList[i].expiredDt =
                exlList[i].expiredDt != null
                  ? exlList[i].expiredDt
                  : "永久有效";
            }
            let title = "问卷数据";
            let sheet = "问卷数据";
            require.ensure([], () => {
              const {
                export_json_to_excel,
              } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
              let tHeader = [
                "学员姓名",
                "手机号",
                "所在区域",
                "提交时间",
                "答卷时间",
              ];
              let filterVal = [
                "name",
                "mobile",
                "city",
                "createdDt",
                "answerTime",
              ]; // 导出的表头字段名
              let data = this.formatJson(filterVal, exlList);
              // 统计数据总览
              let time = new Date().getMonth() + 1 + "." + new Date().getDate();
              export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
            });
          })
          .catch((msg) => {});
      }
    },
    downloadAnswer() {
      let par = {
        searchName: this.filters.search,
      };
      let exlList = this.degreeTable;
      for (let i = 0; i < exlList.length; i++) {
        exlList[i].expiredDt =
          exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
      }
      let title = "答题结果";
      let sheet = "答题结果";
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
        let tHeader = ["学员姓名", "答案"];
        let filterVal = ["realName", "answer"]; // 导出的表头字段名
        let data = this.formatJson(filterVal, exlList);
        // 统计数据总览
        let time = new Date().getMonth() + 1 + "." + new Date().getDate();
        export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
      });
    },
    //问答题查看
    showDegree(list) {
      if (list) {
        this.degreeTable = JSON.parse(list);
      } else {
        this.degreeTable = [];
      }
      this.degreeOpen = true;
    },
    closeDegree() {
      this.degreeOpen = false;
    },
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) => filterVal.map((j) => v[j]));
      return arr;
    },
    addCourse() {
      this.$router.push({ name: "addCourse" });
    },
    //基本信息数据
    getDetail() {
      this.$http
        .get(`/api/web/evaluation/${this.detailId}`)
        .then((res) => {
          this.userForm = res.data;
        })
        .catch((msg) => {});
    },
    //汇总统计
    getCount() {
      this.$http
        .get(`/api/web/evaluation/count/${this.detailId}`)
        .then((res) => {
          this.collectList = res.data;
        })
        .catch((msg) => {});
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getPage();
    },
    //答卷详情列表
    getPage(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      let par = {
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
        searchName: this.filters.search,
      };
      this.$http
        .get(`/api/web/evaluation/answer/detail/page/${this.detailId}`, {
          params: par,
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.dataTotal = res.data.total;
        })
        .catch((msg) => {});
    },
    toEdit(row) {
      this.answerNum = !this.answerNum;
      this.editVal = row;
    },
  },
  mounted() {
    this.getDetail();
  },
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
.detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: #333333;
}
.file-name {
  width: 45%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: #333333;
}

.census {
  margin: 0 0 0 15px;
  color: #606266;
}
.evalute {
  width: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.evalute-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border: 1px dashed #ccc;
  background: #f7f7f7;
  margin: 10px 0;
  padding: 0 10px 0 0;
  .free {
    border: 1px solid #ccc;
    padding: 2px 10px;
    font-size: 12px;
    color: #ccc;
  }
}
.free {
  border: 1px solid #ccc;
  padding: 2px 10px;
  font-size: 12px;
  color: #ccc;
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
<style lang="scss" >
.degree span {
  margin: 0 8px;
}
.degree-line {
  border: 1px dashed #e6e6e6;
  margin-bottom: 20px;
  // padding: 25px 0 0 0;
  .degree {
    border-bottom: 1px dashed #e6e6e6;
    height: 60px;
    display: flex;
    align-items: center;
  }
  .degree-tip {
    font-size: 19px;
    color: #606266;
    margin-left: 2%;
  }
  .degree-title {
    font-size: 15px;
    color: #606266;
  }
}
.degree-more {
  margin: 20px;

  span {
    cursor: pointer;
    color: #00be6e;
  }
}
.C-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
}
.C-top {
  width: 15%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.otherCenusu {
  width: 70px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #0eda74;
  background: #e5e7e7;
}
.degree-list {
  display: flex;
  margin: 25px 0;
  font-size: 17px;
  color: #606266;
  .degree-number {
    width: 5%;
    margin-left: 2%;
  }
  .progress-list {
    flex: 1;
  }
  .degree-man {
    width: 8%;
    margin-left: 3%;
    margin-top: -3px;
  }
}
.degree-list .degree-number {
  min-width: 15%;
  max-width: 25%;
}
.s-img img {
  border-radius: 50%;
}
</style>

