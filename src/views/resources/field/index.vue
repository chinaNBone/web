<template>
  <div class="g-box">
    <el-header class="g-box-header f-clearfix">
      <h2 class="g-box-header-title">培训场地管理</h2>
    </el-header>
    <el-col>
      <el-container>
        <el-main class="g-main" style="padding:20px 0 ">
          <div>
            <div class="student-detail-header">
              <div class="file-name">
                <span style="font-size:16px;margin-right:15px">
                  <i
                    class="el-icon-arrow-left"
                    style="border:1px solid #ccc;padding:3px; color:#ccc;margin-right:7px;cursor:pointer"
                    @click="goList"
                  ></i>
                  {{ room.title }}
                </span>
                <div>
                  <span class="free" :style="room.status==0?style:style2">已启用</span>
                  <span class="nouse" :style="room.status==1?style:style2">已禁用</span>
                </div>
              </div>
              <div class="line"></div>
              <div class="student-detail-bottom">
                <div class="student-info-right">
                  <span class="content-right">基本信息</span>
                </div>
                <div class="student-info-right">
                  <span class="content">所在地区</span>
                  <span>{{room.area}}</span>
                </div>
                <div class="student-info-right">
                  <span class="content">备注</span>
                  <span>{{room.remark}}</span>
                </div>
              </div>
              <div class="student-detail-bottom" style="border:none">
                <div class="student-info-right">
                  <span class="content-right">使用记录（{{room.useCount}}）</span>
                </div>
                <el-table :data="tableData" highlight-current-row>
                  <el-table-column label="使用项目" prop="projectName" width="500"></el-table-column>
                  <el-table-column label="使用时间" width="280">
                    <template slot-scope="scope">{{scope.row.beginTime|moment("YYYY-MM-DD HH:mm")}}</template>
                  </el-table-column>
                  <el-table-column prop="status" label="使用状态"></el-table-column>
                </el-table>
                <div class="m-pages">
                  <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next,total"
                    :current-page.sync="listPage.pageNo"
                    :page-size="listPage.pageSize"
                    :total="listPage.total"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-col>
  </div>
</template>
<script>
// import reportDetail from "./reportDetail.vue";
import moment from "moment";
export default {
  //   components: {
  //     reportDetail
  //   },
  data() {
    return {
      total: 0,
      tableData: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      room: JSON.parse(this.$route.query.room),
      style: "border: 1px solid #00be6e;color: #00be6e;",
      style2: " border: 1px solid #ccc;color: #ccc;"
    };
  },
  methods: {
    goList() {
      this.$router.push({ path: "/fieldList" });
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    getList() {
      let param = {
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
        roomId: this.room.id
      };
      this.$http
        .post("/api/edu/timetable/getRoomUseHistory", param)
        .then(res => {
          this.tableData = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          let nowTime = this.dateFormat(new Date());
          for (var i of this.tableData) {
            i.beginTimeDate = this.dateFormat(i.beginTime);
            i.endTimeDate = this.dateFormat(i.endTime);
            if (i.beginTimeDate > nowTime) {
              i.status = "未使用";
            } else if (i.endTimeDate < nowTime) {
              i.status = "已使用";
            } else {
              i.status = "使用中";
            }
          }
        })
        .catch(msg => {});
    },
    dateFormat(val) {
      return moment(val).format("YYMMDDHHmm");
    }
  },
  mounted() {
    this.dateFormat();
    this.getList();
  }
};
</script>
<style lang='scss' scoped>
.g-box {
  width: 100%;
  .student-detail {
    display: flex;
    justify-content: space-between;
  }
  .file-name {
    // width: 45%;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    color: #333333;
  }
  .student-detail-bottom {
    line-height: 30px;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
  }
  .student-info-right {
    display: flex;
    align-items: center;
  }
  .content-right {
    color: #7f7f7f;
    font-size: 16px;
  }
  .content {
    width: 56px;
    color: #7f7f7f;
    text-align: right;
    margin-right: 24px;
  }
  .line {
    /* wdith: 100%; */
    border-bottom: 1px solid #ccc;
  }
  .free {
    padding: 2px 15px;
    font-size: 12px;
    margin-right: 10px;
  }
  .nouse {
    padding: 2px 15px;
    font-size: 12px;
  }
}

.title-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.title-info {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.verify-info {
  margin-left: 20px;
  line-height: 24px;
}
</style>