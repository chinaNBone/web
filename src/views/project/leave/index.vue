<!-- 请假管理 -->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>请假管理</h2>
    </div>

    <div class="m-search">
      <div>
        <el-button type="primary" @click="downloadExl">导出请假名单</el-button>
      </div>
      <div>
        <el-select v-model="list.status" placeholder="处理状态" class="s-el-input">
          <el-option label="全部" value></el-option>
          <el-option label="待审批" :value="0"></el-option>
          <el-option label="已审批" :value="1"></el-option>
          <el-option label="未通过" :value="2"></el-option>
          <el-option label="已撤销" :value="3"></el-option>
        </el-select>
        <el-input v-model="list.search" placeholder="输入用户姓名/手机号" class="s-el-input searchInput"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="realName" label="申请用户" width="180">
        <template slot-scope="scope">
          <div class="d-headAll">
            <img
              :src=" (scope.row.avatar==null||scope.row.avatar=='')?defineImg:imgUrl+scope.row.avatar"
              alt
              class="d-headImg"
            />
            <div>
              <p>{{scope.row.name}}</p>
              <p class="d-headTel">{{scope.row.mobile}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">{{scope.row.type==1?'学生':'老师'}}</template>
      </el-table-column>
      <el-table-column label="请假时间段" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.absenceBeginDt| moment("YYYY-MM-DD")}}~{{scope.row.absenceEndDt| moment("YYYY-MM-DD")}}</template>
      </el-table-column>
      <el-table-column prop="applyDt" label="申请时间" width="150"></el-table-column>
      <el-table-column prop="checkDt" label="审批时间" width="150"></el-table-column>
      <el-table-column label="审批状态">
        <template
          slot-scope="scope"
        >{{scope.row.status==0?'待审核':(scope.row.status==1?'已通过':(scope.row.status==2?'未通过':'已撤销'))}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editAdmin(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
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
    <!-- 查看请假详情 -->
    <el-dialog
      title="请假详情"
      :visible.sync="dialogVisible2"
      width="600px"
      :before-close="closeDetail"
      :close-on-click-modal="false"
    >
      <ul>
        <li class="d-headAll headerAll">
          <img
            :src="(detailMsg.avatar==null||detailMsg.avatar=='')?defineImg :imgUrl+detailMsg.avatar"
            alt
            class="d-headImg"
          />
          <div>
            <p>{{detailMsg.name}}</p>
            <p class="d-headTel">{{detailMsg.mobile}}</p>
          </div>
        </li>
        <li>
          <span>开始时间：</span>
          {{detailMsg.absenceBeginDt}}
        </li>
        <li>
          <span>结束时间：</span>
          {{detailMsg.absenceEndDt}}
        </li>
        <!-- <li>
          <span>请假类型：</span>
          {{detailMsg.absenceType==1?'事假':'病假'}}
        </li>-->
        <li class="causeImg">
          <span>请假原因：</span>
          {{detailMsg.content}}
          <el-image :src="imgUrl+detailMsg.image" :preview-src-list="[imgUrl+detailMsg.image]"></el-image>
        </li>
        <div v-if="detailMsg.status!=0" style="height: 130px;" class="returnMsg">
          <el-steps direction="vertical" :active="detailMsg.status==1?2:1">
            <el-step :title="detailMsg.name+' 发起请假申请'"></el-step>
            <el-step
              :title="detailMsg.checkUserName+' '+(detailMsg.status=='1'?'已通过':(detailMsg.status==2?'未通过':''))"
              :description="detailMsg.remark"
            ></el-step>
          </el-steps>
        </div>
        <li class="last">
          <p>请假期间涉及课次</p>
          <p
            v-for="(item,index) in detailMsg.timeList"
            :key="index"
          >{{item.beginTime+'~'+item.endTime+' '+item.title}}</p>
        </li>
      </ul>
      <el-form
        v-if="detailMsg.status==0"
        ref="editPass"
        :model="editPass"
        label-width="120px"
        label-position="right"
      >
        <el-input type="textarea" v-model="editPass.text" placeholder="请输入审批回复" :rows="4"></el-input>
        <el-form-item align="right" class="dialog-btns">
          <el-button type="primary" @click="approve">审批通过</el-button>
          <el-button @click="approveReturn">审批驳回</el-button>
        </el-form-item>
      </el-form>

      <div
        v-if="detailMsg.status!=0"
        :style="detailMsg.status=='1'?style1:(detailMsg.status==2?style2:(detailMsg.status==3?style3:''))"
        class="pass"
      >{{detailMsg.status=='1'?'已通过':(detailMsg.status==2?'未通过':(detailMsg.status==3?'已撤销':''))}}</div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrl: this.$setting.imageUrl,
      dialogVisible2: false,
      defineImg: require("../../../../public/images/avatar_normal_200.jpg"),
      adminTitle: "",
      list: {
        search: "",
        status: ""
      },
      rowId: "",
      loading: false,
      roleList: [],
      listTable: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      //详情
      detailMsg: {
        status: 0
      },
      //   ------------
      editPass: {
        text: ""
      },
      style1: "border: 3px solid rgb(0, 190, 110);color: rgb(0, 190, 110)",
      style2: "border: 3px solid rgb(217, 0, 27);color: rgb(217, 0, 27);",
      style3: "border: 3px solid rgb(245, 154, 35);color: rgb(245, 154, 35);"
    };
  },
  mounted() {
    this.getList();
  },
  watch: {
    dialogVisible2(v) {
      if (v == false) {
        this.editPass.text = "";
      }
    }
  },
  methods: {
    //审批通过
    approve() {
      let par = {
        remark: this.editPass.text,
        id: this.rowId,
        status: 1
      };
      this.$http
        .post("/api/edu/absence/checkAbsence", par)
        .then(res => {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.dialogVisible2 = false;
          this.getList();
        })
        .catch(msg => {});
    },
    //审批驳回
    approveReturn() {
      let par = {
        remark: this.editPass.text,
        id: this.rowId,
        status: 2
      };
      if (this.editPass.text == "") {
        this.$message({
          message: "请输入驳回理由",
          type: "warning"
        });
        return;
      } else {
        this.$http
          .post("/api/edu/absence/checkAbsence", par)
          .then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.dialogVisible2 = false;
            this.getList();
          })
          .catch(msg => {});
      }
    },
    //详情
    editAdmin(val) {
      this.rowId = val;
      let par = {
        absenceId: val,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .post("/api/edu/absence/absenceInfo", par)
        .then(res => {
          this.dialogVisible2 = true;
          this.detailMsg = res.data;
        })
        .catch(msg => {});
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    closeDetail() {
      this.dialogVisible2 = false;
    },
    // 获取list
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        status: this.list.status,
        keyword: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
        projectId: localStorage.getItem("projectId")
      };
      this.$http
        .post("/api/edu/absence/absenceList", par)
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(msg => {});
    },
    //导出
    downloadExl() {
      let par = {
        keyword: this.list.search,
        projectId: localStorage.getItem("projectId"),
        status: this.list.status
      };
      this.$http
        .post("/api/edu/absence/exportList", par)
        .then(res => {
          let exlList = res.data;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
          }
          let title = "请假列表";
          let sheet = "请假列表";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["姓名", "开始时间", "结束时间", "申请时间"];
            let filterVal = [
              "name",
              "absenceBeginDt",
              "absenceEndDt",
              "applyDt"
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch(msg => {});
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map(v => filterVal.map(j => v[j]));
      return arr;
    }
  }
};
</script>
<style lang="scss" scoped>
li {
  line-height: 14px;
  padding: 10px 0;
  span {
    margin-right: 10px;
  }
}
.headerAll {
  margin-bottom: 20px;
  p {
    line-height: 20px;
  }
}
.causeImg {
  .el-image {
    display: block;
    width: 70px;
    height: 50px;
    margin: 8px 0 0 80px;
  }
}
.last {
  border-top: 1px solid #ccc;
  line-height: 32px;
}
.dialog-btns {
  margin-top: 24px;
  .el-button {
    width: 120px;
  }
}
.el-dialog__body {
  position: relative;
}
.pass {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  position: absolute;
  right: 35px;
  top: 80px;
}
.returnMsg {
  margin: 30px 0;
  padding-top: 30px;
  border-top: 1px solid #ccc;
}
/deep/.el-step__title {
  font-weight: 400;
  font-size: 14px;
}
/deep/.el-step__description {
  font-size: 14px;
}
.el-select-dropdown__item {
  padding-left: 10px;
}
.searchInput {
  width: 180px;
}
</style>
