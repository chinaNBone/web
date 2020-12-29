<template>
  <div>
    <div id="pdfDom">
      <el-row class="search-row">
        <!-- <div class="f-fl">
        <el-button type="primary" size="medium" @click="exportUser()"
          >导出统计结果</el-button
        >
        <span class="census">填报人数：{{ collectList.total }}</span>
      </div>-->
      </el-row>
      <div
        class="degree-line"
        v-for="(item, index) in collectList.evaluationCountVOS"
        :key="index"
        v-loading="loading"
      >
        <div class="degree">
          <span class="degree-tip">{{ index + 1 }}</span>
          <span class="free">{{
            item.type == 1 ? "问答题" : item.type == 2 ? "单选题" : "多选题"
          }}</span>
          <span class="degree-title">{{ item.title }}</span>
        </div>
        <div v-if="item.type === 1" class="degree-content">
          <span class="color-green" style="cursor: pointer" @click="check(item)"
            >查看答题结果 &gt;</span
          >
        </div>
        <div
          class="degree-percent"
          v-for="(son, inde) in item.answerCounts"
          :key="inde"
        >
          <div class="degree-list">
            <span class="degree-number">{{ inde + 1 }}.{{ son.answer }}</span>
            <div class="progress-list">
              <el-progress
                :stroke-width="14"
                :percentage="
                  collectList.total == 0
                    ? '0'
                    : ((son.count / collectList.total) * 100) | keepTwo
                "
              ></el-progress>
            </div>
            <span class="degree-man">{{ son.count }}人</span>
          </div>
        </div>
      </div>
      <el-dialog
        title="答题结果"
        :visible.sync="dialogVisible"
        width="600px"
        style="margin: 50px 0 0 50px"
        :closeOnClickModal="false"
        :before-close="handleClose"
      >
        <!-- table表格 -->
        <el-button @click="downloadExl" type="warning">导出</el-button>
        <h3 style="line-height: 50px">1.{{ title }}</h3>
        <el-table :data="question" highlight-current-row>
          <el-table-column label="头像" width="80">
            <template slot-scope="scope">
              <div class="image-logo-box">
                <img
                  width="40"
                  height="40"
                  :src="
                    scope.row.avatar == null || scope.row.avatar == ''
                      ? '/images/avatar_normal_200.jpg'
                      : imgUrl + scope.row.avatar
                  "
                  alt
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名"></el-table-column>
          <el-table-column
            prop="answer"
            label="结果"
            width="200"
          ></el-table-column>
        </el-table>
        <div class="m-pages">
          <el-pagination
            background
            :hide-on-single-page="true"
            @current-change="handleCurrentChange"
            :page-size="pageList.pageSize"
            layout=" prev, pager, next,total"
            :total="pageList.total"
          ></el-pagination>
        </div>
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
      collectList: [],
      id: "",
      loading: false,
      item: "",
      pageList: {
        pageNo: 1,
        pageSize: 6,
        total: 0,
      },
      dialogVisible: false,
      question: [],
      title: "",
      imgUrl: this.$setting.imageUrl + "/",
    };
  },
  filters: {
    keepTwo(val) {
      val = Number(val);
      return val.toFixed(2);
    },
  },

  mounted() {
    this.id = this.$route.query.id;
    this.getList();
  },
  methods: {
    downloadExl() {
      let par = {
        pageNo: this.pageList.pageNo,
        pageSize: 1000,
        detailId: this.item.id,
      };
      this.$http
        .post("/api/edu/projectQuestion/answerList", par)
        .then((res) => {
          let exlList = res.data.records;
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
            let tHeader = ["姓名", "答题结果"];
            let filterVal = ["realName", "answer"]; // 导出的表头字段名
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
    handleClose() {
      this.dialogVisible = false;
    },
    handleCurrentChange(val) {
      this.pageList.pageNo = val;
      this.check(this.item);
    },
    check(obj) {
      this.item = obj;
      let par = {
        pageNo: this.pageList.pageNo,
        pageSize: this.pageList.pageSize,
        detailId: obj.id,
      };
      this.$http
        .post("/api/edu/projectQuestion/answerList", par)
        .then((res) => {
          this.title = obj.title;
          this.pageList.pageNo = res.data.current;
          this.pageList.total = res.data.total;
          this.question = res.data.records;
          this.dialogVisible = true;
        });
    },
    getList() {
      this.loading = true;
      this.$http
        .post(`/api/web/studentReport/manager/count`, { id: this.id })
        .then((res) => {
          this.collectList = res.data;
          this.loading = false;
        })
        .catch((msg) => {
          this.loading = true;
        });
    },
    // 导出
    exportUser() {
      let par = {
        id: this.id,
      };
      this.$http
        .post("/api/web/studentReport/manager/count", par)
        .then((res) => {
          let exlList = res.data;
          let title = "汇总统计";
          let sheet = "汇总统计";
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "姓名",
              "手机号",
              "省份",
              "城市",
              "提交时间",
              "答卷时长(秒)",
            ];
            let filterVal = [
              "realName",
              "mobile",
              "province",
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
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) =>
        filterVal.map((j) => {
          if (j == "gender") {
            return v[j] == 1 ? "男" : "女";
          }
          return v[j];
        })
      );
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped>
.degree-content {
  padding: 20px;
}
.degree span {
  margin: 0 8px;
}
.degree-line {
  border: 1px dashed #e6e6e6;
  // padding: 25px 0 0 0;
  margin-top: 30px;
  .degree {
    border-bottom: 1px dashed #e6e6e6;
    height: 60px;
    display: flex;
    align-items: center;
    .free {
      border: 1px solid #ccc;
      padding: 2px 10px;
      font-size: 12px;
      color: #ccc;
    }
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
/deep/.degree-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0;
  font-size: 16px;
  color: #777;
  .degree-number {
    min-width: 15%;
    max-width: 25%;
    margin-left: 40px;
  }
  /deep/.progress-list {
    flex: 1;
    .el-progress {
      .el-progress-bar {
        margin-right: -60px !important;
        width: 95%;
      }
      .el-progress__text {
        font-size: 16px !important;
      }
    }
  }
  .degree-man {
    flex: 1;
    max-width: 5%;
    margin-left: 3%;
  }
}
</style>
