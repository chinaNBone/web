<!--培训场地管理-->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>培训场地管理</h2>
    </div>
    <div class="m-search">
      <div>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="openDialog(1)">添加场地</el-button>
        <el-button type="warning" size="medium" @click="downloadExl">导出数据</el-button>
      </div>
      <div>
        <!-- <el-select v-model="list.status" placeholder="场地状态" class="s-el-input">
          <el-option label="未使用" :value="1"></el-option>
          <el-option label="使用中" :value="2"></el-option>
          <el-option label="使用过" :value="3"></el-option>
        </el-select>-->
        <el-input v-model="list.search" placeholder="输入场地名称搜索" class="s-el-input"></el-input>
        <el-button class="btn-search" @click="getList('search')">搜索</el-button>
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column prop="title" label="场地名称"></el-table-column>
      <el-table-column prop="area" label="所在地区"></el-table-column>
      <el-table-column prop="useCount" label="使用次数" width="100px"></el-table-column>
      <el-table-column label="操作" width="220px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailRow(scope.row)">详情</el-button>
          <el-button
            type="text"
            size="small"
            @click="openRoom(scope.row.id,'UN_DISABLE')"
            v-if="scope.row.status==1"
          >启用</el-button>
          <el-button type="text" size="small" @click="openRoom(scope.row.id,'DISABLE')" v-else>禁用</el-button>
          <el-button type="text" size="small" @click="editRow(scope.row.id,2)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            style="background:#fff;color:#FF0000; border:none"
            v-if="scope.row.useCount==0"
            @click="deleteRow(scope.row.id)"
          >删除</el-button>
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
    <el-dialog
      :title="type==1?'添加场地':'编辑场地'"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeField"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px" label-position="right" :rules="rules" ref="form" :model="field">
        <el-form-item label="场地名称" prop="title">
          <el-input v-model="field.title" placeholder="请输入场地名称" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="所在地区">
          <el-input v-model="field.area" placeholder="请输入所在地区" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="field.remark" placeholder="输入备注信息" type="textarea"></el-input>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="type==1?addField():editField()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      list: {
        search: "",
        status: ""
      },
      field: { title: "", area: "", remark: "" },
      loading: false,
      roleList: [],
      listTable: [],
      listTable2: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1
      },
      //区别新增和编辑
      type: 1,
      //编辑时的id
      editId: "",
      rules: {
        title: [{ required: true, message: "请填写名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    //启用禁用
    openRoom(id, val) {
      let par = {
        roomStatus: val
      };
      this.$http
        .get(`/api/resource/room/change/${id}`, { params: par })
        .then(res => {
          this.$message.success("操作成功");
          this.getList();
        })
        .catch(msg => {});
    },
    openDialog(val) {
      this.dialogVisible = true;
      this.type = val;
    },
    detailRow(val) {
      this.$router.push({
        path: "/fieldDetail",
        query: { room: JSON.stringify(val) }
      });
    },
    editRow(id, val) {
      this.dialogVisible = true;
      this.type = val;
      this.editId = id;
      this.detail(id);
    },
    //场地详情
    detail(id) {
      let par = { id: id };
      this.$http
        .post("/api/resource/room/getInfo", par)
        .then(res => {
          this.field = res.data;
        })
        .catch(msg => {});
    },
    deleteRow(id) {
      this.$confirm("您确定要删除该场地吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .delete(`/api/resource/room/logic/${id}`)
          .then(res => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch(msg => {});
      });
    },
    //添加场地
    addField() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let par = {
            area: this.field.area,
            title: this.field.title,
            remark: this.field.remark
          };
          this.$http
            .post("/api/resource/room/add", par)
            .then(res => {
              this.dialogVisible = false;
              this.getList();
              this.field.title = "";
              this.field.area = "";
              this.field.remark = "";
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    editField() {
      let par = {
        area: this.field.area,
        title: this.field.title,
        id: this.editId,
        remark: this.field.remark
      };
      this.$http
        .post("/api/resource/room/edit", par)
        .then(res => {
          this.dialogVisible = false;
          this.getList();
        })
        .catch(msg => {});
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getList();
    },
    // 获取list
    async getList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      this.loading = true;
      let par = {
        status: this.list.status,
        search: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .post("/api/resource/room/list", par)
        .then(res => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch(msg => {});
    },
    //导出名单
    downloadExl() {
      let par = {
        status: this.list.status,
        search: this.list.search
      };
      this.$http
        .post("/api/resource/room/list/all", par)
        .then(res => {
          let exlList = res.data;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
          }
          let title = "场地列表";
          let sheet = "场地列表";
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = ["场地名称", "所在地区", "使用次数"];
            let filterVal = ["title", "area", "useCount"]; // 导出的表头字段名
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
    },
    closeField() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style lang="scss">
.upload-demo {
  margin-right: 10px;
}
.el-dialog__body .el-select {
  width: 380px;
}
</style>