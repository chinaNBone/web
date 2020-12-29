<template>
  <div class="aaaa">
    <div class="evalute-tip" v-for="(son,index) in list_a" :key="index">
      <div class="degree">
        <div class="degree-tip">{{index+1}}</div>
        <div class="free">{{son.type}}</div>
        <div class="degree-title">{{son.question }}</div>
      </div>

      <div class="answer">
        <li v-for="(sson,index1) in son.answer" :key="index1">
          <span
            :class="(sson.value==son.choose) ? 'color-green' : ''"
            @click="changeList(sson.value,index)"
          >{{sson.label}}</span>
        </li>
        <div style="clear: both"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ValuteTab",
  data: function() {
    return {
      all_list: [],
    };
  },
  props: ["list_a"],

  methods: {
    changeList(value, index) {
      this.list_a[index].choose = value;
    }
  },
  mounted(){
    console.log(this.list_a);
  }
};
</script>
<style scoped>
li {
  list-style: none;
}
.evalute-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border: 1px dashed #ccc;
  background: #f4fcf8;
  margin: 10px 0;
  padding: 0 10px 0 0;
}
.free {
  border: 1px solid #ccc;
  padding: 2px 10px;
  margin: 0 15px;
  font-size: 12px;
  color: #ccc;
}

.degree-line {
  border: 1px dashed #e6e6e6;
}
.degree {
  width: 50%;
  height: 60px;
  display: flex;
  align-items: center;
}
.color-green {
  color: #0eda74;
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
.answer li {
  height: 20px;
  float: left;
}
.answer span {
  float: left;
  margin:0 5px;
}
</style>