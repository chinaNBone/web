<template>
  <div class="course-detail">
    <el-tabs v-model="activeTab" type="card" class="m-tabs">
      <el-tab-pane label="报到详情" name="first">
        <el-row class="search-row">
          <div class="f-fl">
            <el-button type="primary" size="medium" @click="downloadExl">导出报到数据</el-button>
          </div>
          <div class="f-fr">
            <el-select v-model="isRecommend" size="medium" placeholder="报到状态">
              <el-option label="已报到" :value="0"></el-option>
              <el-option label="未报到" :value="1"></el-option>
            </el-select>
            <el-input v-model="filters.search" size="medium" placeholder="输入学员姓名搜索"></el-input>
            <el-button
              type="primary"
              style="background:rgba(255, 153, 0, 1);border:none"
              size="medium"
              @click="getUserList"
            >搜索</el-button>
          </div>
        </el-row>
        <!-- table表格 -->
        <el-table :data="tableData" highlight-current-row @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="照片" prop="avatar" width="100" height="100">
            <template slot-scope="scope">
              <div class="s-placeholder__img mindel">
                <img class="s-img-show" :src="getUrl(scope.row.avatar)" alt />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="gender" label="性别">
            <template slot-scope="scope">
              <div>{{scope.row.gender==1?'男':'女'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="address" label="所在地区"></el-table-column>
          <el-table-column prop="school" label="所在学校"></el-table-column>
          <el-table-column prop="time" label="报到时间"></el-table-column>
          <el-table-column prop="status" label="报到状态">
            <template slot-scope="scope">
              <div>{{scope.row.status==1?'已报到':'未报到'}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="汇总统计" name="second">
      </el-tab-pane>
      <el-tab-pane label="答卷详情" name="third">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "reportDetail",
  props: {
    detailData: {
      type: Array,
      default() {
        cover: "";
      }
    }
  },
  watch: {
    detailData(v) {
      this.tableData = v;
      console.log(v)
    }
  },
  data() {
    return {
      isRecommend: "",
      cates: [],
      catalogyId: [],
      tableData: [],
      activeTab: "first",
      filters: {
        search: ""
      },
    }
  },
  methods: {
    handleSelectionChange(val) {
   
    },
    downloadExl() {
    
    },
    getUserList() {
    },
  },
  mounted() {
 console.log(111)
  }
};
</script>

<style lang="scss" scoped>
.baseinfo-label {
  padding: 20px 50px;
  font-size: 18px;
  font-weight: 400;
}
.avatar.overstep {
  width: 198px;
  height: 120px;
}
.org-logo {
  width: 120px;
  height: 120px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .s-inset-pace {
    display: block;
    height: 120px;
    line-height: 120px;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
</style>

