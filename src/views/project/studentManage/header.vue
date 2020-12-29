<template>
  <el-col :span="24" class="g-title">
    <div class="l-title m-flex">
      <div class="l-back">
        <div>
          <div style="font-size:15px;cursor:pointer" @click="goProject">
            <i class="el-icon-arrow-left"></i>返回培训项目列表
          </div>
          <span style="font-size:24px">{{title}}</span>
        </div>
      </div>
      <div class="f-back">
        <el-button
          style=" background:#404858; color:#00be6e;"
          size="medium"
          type="primary"
          @click="endProject"
        >结束培训项目</el-button>
      </div>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "Top",
  components: {},
  props: {
    type: {
      default() {
        return "home";
      }
    }
  },
  data() {
    return {
      title: localStorage.getItem("projectTitle")
    };
  },
  methods: {
    stopTrain() {},
    goProject() {
      this.$router.push({ path: "/project" });
    },
    endProject() {
      this.$confirm("请确认是否结束项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let par = {
            projectId: localStorage.getItem("projectId"),
            type: 3
          };
          this.$http
            .post("/api/edu/project/operateProject", par)
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$router.push({ path: "/project" });
            })
            .catch(msg => {});
        })
        .catch(() => {});
    }
  },
  created() {},
  mounted() {
    // console.log(this.$route.path);
    // console.log(this.$router);
    // todo 获取菜单列表
    // this.getMenuList();
  }
};
</script>
<style scoped>
.g-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 130px;
  z-index: 2;
  background: #404858;
  margin-bottom: 20px;
  /* position: relative;
  -webkit-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08); */
}
</style>