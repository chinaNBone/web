<template>
  <div v-if="isShow" class>
    <el-row class="g-doc">
      <Header></Header>
      <section class="g-bd el-col el-col-24">
    
      <!--页面路由 开始-->
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      </section>
    </el-row>
  </div>
</template>

<script>
// import LeftAside from "./layout/Left.vue";
import Header from "./layout/Top.vue";

export default {
  name: "home",
  components: {
    Header,
    // LeftAside
  },
  data: () => {
    return {
      apiData: "",
      isShow: true
    };
  },
  methods: {},
  created() {
    //this.getCurrentUser()
  },
  mounted() {
    // todo 获取当前用户信息及菜单列表
    // this.$store.dispatch('updateUserInfo', {loginName: 'will', age: 15})
    // console.log(this.$store.getters.getUserInfo)
    // console.log(this.$store)
  }
};
</script>

<style lang="scss" scoped>
.g-doc {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
