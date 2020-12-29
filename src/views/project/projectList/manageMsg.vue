<!-- 管理员管理 -->
<template>
  <div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column label="头像">
        <template slot-scope="scope">
          <div class="image-logo-box">
            <img
              :src="(scope.row.avatar==null||scope.row.avatar=='')?defineImg:imgUrl+scope.row.avatar"
              alt
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column label="性别" width="60" prop="gender">
        <!-- <template slot-scope="scope">{{ scope.row.gender==1?'男':'女' }}</template> -->
      </el-table-column>
      <el-table-column prop="profession" label="专业"></el-table-column>
      <el-table-column prop="education" label="学历"></el-table-column>
      <el-table-column prop="title" label="职务" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120px"></el-table-column>
      <el-table-column prop="manger" label="负责事务" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.manger}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/api/edu/project/importUserTeam",
      imgUrl: this.$setting.imageUrl + "/",
      defineImg: require("../../../../public/images/avatar_normal_200.jpg"),
      headers: { Authorization: this.$store.state.global.access_token },
      upData: {
        type: 2,
        projectId: this.$route.query.id
      },
      adminTitle: "",
      list: {
        search: "",
        status: ""
      },
      // -------
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      listTable2: [],
      indexUserId: "",
      // ----------------
      loading: false,
      roleList: [],
      listTable: [],
      rowIndex: 0,
      rowAffair: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      let par = {
        projectId: localStorage.getItem("projectId"),
        type: 2,
        keyword: this.list.search
      };
      this.$http
        .post("/api/edu/project/getUserTeam", par)
        .then(res => {
          this.loading = false;
          this.listTable = res.data;
          this.$emit("listTable", this.listTable);
          this.$emit("manage", this.listTable);
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss"></style>
