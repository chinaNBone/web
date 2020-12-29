<template>
  <div class="g-nav">
    <top></top>
    <div class="l-mod l-flex">
      <div class="m-nav">
        <left-aside></left-aside>
      </div>
      <div class="m-nav-con" style="box-shadow: 0 0 15px #ccc;">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      </div>
    </div>
  </div>
</template>
<script>
import LeftAside from "./left.vue";
import Top from "./header.vue";
import list from "./index";
export default {
  components: {
    Top,
    LeftAside,
  
  },
  data() {
    return {};
  }
};
</script>