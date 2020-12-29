<template>
  <div v-if="isShow" class>
    <el-row class="g-doc el-col el-col-24">
      <el-col :span="18" :offset="3">
        <section class="g-bd">
          <left-aside></left-aside>
          <!--页面路由 开始-->
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </section>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftAside from "./layout/Left.vue";
export default {
  name: "project",
  components: {
    LeftAside
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
