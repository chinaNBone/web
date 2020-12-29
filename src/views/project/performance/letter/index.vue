<template>
  <div>
    <div class="l-mod-tool">
      <h2>结业证书</h2>
    </div>

    <div v-if="listTable == ''" class="letter-add-btn" @click="toAdd">
      <div class="stip">+</div>
      <div class="clickoffer">点击创建结业证书</div>
    </div>
    <div v-else class="letter-list">
      <div class="item-con">
        <div class="item-num">
          <div class="item-msg">
            <p>{{ itemMsg.name }}</p>
          </div>
          <p>创建时间：{{ itemMsg.createdDt }}</p>
          <p>已发放人数：{{ itemMsg.offerNum }}</p>
        </div>
        <div class="item-btn">
          <el-button type="text" size="medium" @click="offerList(itemMsg)"
            >发放管理</el-button
          >
          <el-button type="text" size="medium" @click="preview(itemMsg.id)"
            >预览</el-button
          >
          <el-button type="text" size="medium" @click="toEdit(itemMsg)"
            >修改</el-button
          >
          <el-button
            v-if="itemMsg.offerNum == 0"
            style="color: red;"
            type="text"
            size="medium"
            @click="delRow(itemMsg.id)"
            >删除</el-button
          >
        </div>
      </div>
    </div>

    <Preview :id="previewId" :show.sync="previewShow"></Preview>
  </div>
</template>
<script>
import Preview from "./preview";
import moment from "moment";
export default {
  name: "Cert-list",
  components: {
    Preview,
  },
  data() {
    return {
      imgUrl: this.$setting.imageUrl,
      dateFormat: "YYYY-MM-DD",
      listTable: [],
      itemMsg: {
        name: "",
        offerNum: "",
        createdDt: "",
      },
      loading: false,
      previewShow: false,
      previewId: 0,
      listPage: {
        pageSize: 15,
        total: 0,
        pageNo: 1,
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.listPage.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    //获取bannerlist
    getList() {
      this.loading = true;
      this.$http
        .post("/api/edu/certificate/certificateList", {
          pageSize: this.listPage.pageSize,
          currentPage: this.listPage.pageNo,
          projectId: localStorage.getItem("projectId"),
        })
        .then((res) => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data;
          console.log(res.data);
          if (res.data.length > 0) {
            this.itemMsg = res.data[0];
          }
          this.loading = false;
        })
        .catch((msg) => {
          this.$message.error(msg);
          this.loading = false;
        });
    },
    getStudyTime(item) {
      return `${moment(item.startTime).format(this.dateFormat)}至${moment(
        item.endTime
      ).format(this.dateFormat)}`;
    },
    //跳转新建
    toAdd() {
      this.$router.push({
        path: "/letter/add",
      });
    },
    //跳转编辑
    toEdit(obj) {
      this.$router.push({
        path: "/letter/add",
        query: obj,
      });
    },

    preview(val) {
      this.previewId = val;
      this.previewShow = true;
    },
    //删除当前行
    delRow(val) {
      this.$confirm("您确定要删除该证书吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/edu/certificate/deleteCertificate", {
              id: val,
            })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            })
            .catch((msg) => {
              console.log(msg);
              this.$message.error("删除失败");
            });
        })
        .catch();
    },
    offerList(row) {
      console.log(row);
      this.$router.push({
        path: "/letter/offerList",
        query: { id: row.id },
      });
    },
  },
};
</script>
<style lang="scss">
.letter-add-btn {
  width: 70%;
  height: 260px;
  border: dashed 1px #ccc;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  margin: 60px auto 200px;
  .stip {
    color: #00be6e;
    font-size: 100px;
    margin-top: 40px;
  }
}
.letter-list {
  // display: flex;
  border: solid 1px #ccc;
  border-radius: 4px;
  margin-bottom: 200px;
  .item-img {
    // flex: 1;
    max-width: 300px;
  }

  .item-con {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-num {
      flex: 1;
      p {
        line-height: 100%;
        display: inline-block;
        margin-right: 30px;
        color: #777;
        font-size: 14px;
      }
      .item-msg {
        padding-bottom: 20px;
        p {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }
      }
    }
    .item-btn {
      flex: 1;
      max-width: 200px;
      text-align: right;
    }
  }
}
</style>
