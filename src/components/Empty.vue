<template>
  <div class="empty-result f-clearfix">
    <img :src="img" alt />
    <div class="empty-result-tip">{{msg}}</div>
  </div>
</template>
<script>
export default {
  name: "empty",
  props: {
    img: {
      type: String,
      default: "/images/search_none.png"
    },
    msg: {
      type: String,
      default: "暂无内容"
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.empty-result {
  display: block;
  text-align: center;
  padding: 80px 0;
  color: #8e95a4;

  img {
    display: block;
    height: 150px;
    margin: 0 auto;
  }

  .empty-result-tip {
    display: block;
    font-size: 24px;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .empty-result-try {
    display: block;
    font-size: 16px;
    color: #8e95a4;
  }
}
</style>