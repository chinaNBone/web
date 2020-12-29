<template>
  <div>
    <div class="l-mod-tool">
      <h2>发放管理</h2>
    </div>
    <h3 class="cert-title-search">
      <span style="font-size:17px">
        <i
          class="el-icon-arrow-left"
          style="border:1px solid #ccc; color:#ccc;margin-right:7px;cursor: pointer;"
          @click="toBlock()"
        ></i>
        {{ cert.name }}
      </span>
    </h3>
    <el-row class="search-row">
      <div class="f-fl">
        <el-button type="primary" size="medium" @click="addStudent" icon="el-icon-plus">添加学生</el-button>
        <el-button size="medium" @click="ListExport" icon="el-icon-download">导出发放信息</el-button>
      </div>
      <div class="f-fr">
        <el-input v-model="search" placeholder="输入学员姓名/手机号" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </el-row>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop label="学员照片">
        <template slot-scope="scope">
          <div class="image-logo-box">
            <img
              :src="
                scope.row.avatar
                  ? imgUrl + scope.row.avatar
                  : '/images/avatar_normal_200.jpg'
              "
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="学员姓名"></el-table-column>
      <el-table-column prop label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender == 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="mergerName" label="所在地区"></el-table-column>
      <el-table-column prop label="发放时间">
        <template slot-scope="scope">
          <span>{{ scope.row.offerTime | moment("YYYY-MM-DD HH:mm:ss") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="发放状态" :formatter="getStatus">
        <template slot-scope="scope">
          <span>{{ ["已发放", "已撤回"][scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="lookStatus(scope.row.path)"
            v-if="scope.row.status == 0"
          >查看</el-button>
          <el-button
            type="text"
            size="medium"
            @click="delRow(scope.row.offerId)"
            v-if="scope.row.status == 0"
          >撤回</el-button>
          <el-button
            type="text"
            size="medium"
            @click="preview(scope.row.offerId)"
            v-if="scope.row.status != 0"
          >重新发放</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            size="medium"
            class="color-red"
            @click="deleteRow(scope.row.offerId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total"
        :current-page.sync="listPage.pageNo"
        :page-size="listPage.pageSize"
        :total="listPage.total"
      ></el-pagination>
    </div>
    <AddOffer :show.sync="offerShow" :id="id" :cert="cert" @save="saveStudent"></AddOffer>
    <el-dialog
      :visible.sync="previewShow"
      width="1123px"
      class="dialog-image-preview dialog-cert-preview"
    >
      <div style="width: 1123px; height: 794px;">
        <img :src="imgUrl + previewImg" width="100%" height="100%" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AddOffer from "./addOffer";
// import { export_json_to_excel } from "@/common/excel/Export2Excel";
export default {
  components: {
    AddOffer,
  },
  // props: ["id"],
  data() {
    return {
      id: "",
      search: "",
      imgUrl: this.$setting.imageUrl,
      cert: {
        name: "",
      },
      listTable: [],
      loading: false,
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1,
      },
      offerShow: false,
      previewShow: false,
      previewImg: "",
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getCert();
    this.getList();
  },
  methods: {
    toBlock() {
      this.$router.push({
        path: "/letter",
      });
    },
    handleSizeChange(val) {
      this.listPage.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    getCert() {
      this.$http
        .post("api/edu/certificate/getInfo", {
          id: this.id,
        })
        .then((res) => {
          this.cert = res.data;
        })
        .catch(() => {});
    },
    //获取bannerlist
    getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      this.$http
        .post("/api/edu/certificate/offerList", {
          certificateId: this.$route.query.id,
          pageSize: this.listPage.pageSize,
          pageNo: this.listPage.pageNo,
          name: this.search,
        })
        .then((res) => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch((msg) => {
          this.$message.error(msg);
          this.loading = false;
        });
    },
    //跳转新建
    addStudent() {
      this.offerShow = true;
    },
    saveStudent() {
      this.offerShow = false;
      this.getList();
    },
    getStatus(row) {
      return row.status == 0 ? "已发放" : "已撤回";
    },
    getGender(row) {
      return row == 1 ? "男" : "女";
    },

    // 重新发放
    preview(val) {
      this.$http
        .post("/api/edu/certificate/ReReleaseOffer", {
          offerId: val,
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "发放成功!",
          });
          this.getList();
        })
        .catch((msg) => {});
    },
    lookStatus(val) {
      this.previewShow = true;
      this.previewImg = val;
    },

    //撤回当前行
    delRow(val) {
      this.$confirm("您确定要撤回该证书吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/edu/certificate/withdrawOffer", {
              offerId: val,
            })
            .then(() => {
              this.$message({
                type: "success",
                message: "撤回成功!",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    }, //撤回当前行
    deleteRow(val) {
      this.$confirm("您确定要删除该数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/edu/certificate/deleteOfferByOffId", {
              offerId: val,
            })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    ListExport() {
      this.$http
        .post("/api/edu/certificate/exportList", { certificateId: this.id })
        .then((res) => {
          let list = [];
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].gender = this.getGender(res.data[i].gender);
            list.push(res.data[i]);
          }
          let title = `证书列表导出--${this.cert.name}`;
          let sheet = "证书列表";
          import("@/common/excel/Export2Excel").then(
            ({ export_json_to_excel }) => {
              let tHeader = ["姓名", "性别", "手机号", "发放时间"];
              let filterVal = ["realName", "gender", "mobile", "offerTime"]; // 导出的表头字段名
              let data = this.formatJson(filterVal, list);

              export_json_to_excel(tHeader, sheet, data, `${title}`); // 导出的表格名称，根据需要自己命名
            }
          );
        })
        .catch((msg) => {
          console.log(msg);
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    certExport() {
      this.$http
        .post("/api/manage/cert/getOfferImgOutCacheId")
        .then((json) => {
          window.open(
            `${this.$setting.baseURL}/api/manage/cert/offerImgOut?certId=${this.id}&cacheId=${json.data}`
          );
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
  },
};
</script>
<style lang="scss">
.cert-title-search {
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}
</style>
