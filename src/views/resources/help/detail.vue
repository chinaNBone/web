<template>
  <section class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">帮助详情</h2>
      <div class="g-box-header-back f-pointer" @click="back">返回></div>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding:20px 0 ">
          <el-form :model="form" label-width="80px">
            <el-form-item label="标题">{{form.title}}</el-form-item>
            <el-form-item label="创建时间">{{form.createdDt}}</el-form-item>
            <el-form-item label="内容">
              <div class="content" v-html="form.content"></div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-col>
  </section>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.query.id,
      form: {}
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/userHelp"
      });
    },
    getInfo() {
      this.$http
        .get(`/api/resource/help/details/${this.id}`)
        .then(res => {
          this.form = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 10px;
}
/deep/.content {
  img {
    max-width: 100%;
  }
}
</style>
