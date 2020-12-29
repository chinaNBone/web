<template>
  <!-- <p class="page-container">404 page not found</p> -->
  <!--404页面-->
  <div>
    <Top></Top>
    <div class="m-none f-clearfix" style="padding: 200px;margin:0 auto; text-align:center;">
      <div style="font-size:120px;font-weight:700">404</div>
      <span style="display: block; padding: 20px 0; font-size: 16px; color:#999;">出错了，您访问的页面不存在</span>
    </div>
  </div>
</template>
<script>
import Top from "./layout/Top";
export default {
  name: "error404",
  components: { Top },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.page-container {
  font-size: 20px;
  text-align: center;
  color: rgb(192, 204, 218);
}
</style>
