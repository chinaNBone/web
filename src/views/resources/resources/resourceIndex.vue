<!--专家列表-->
<template>
  <div class="g-box">
    <div class="l-mod-tool">
      <h2>专家列表</h2>
    </div>
    <div class="m-search">
      <div>
        <el-upload
          class="upload-demo"
          :action="saveUrl2"
          :on-success="handleSuccess"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button type="primary" size="medium">导入专家信息</el-button>
        </el-upload>
        <el-button type="warning" size="medium" @click="downloadExl"
          >导出专家信息</el-button
        >
        <el-button type="warning" size="medium" @click="downTable"
          >模板下载</el-button
        >
      </div>
      <div>
        <el-input
          v-model="list.search"
          placeholder="输入姓名/手机号搜索"
          class="s-el-input"
        ></el-input>
        <el-button class="btn-search" @click="getList('search')"
          >搜索</el-button
        >
      </div>
    </div>
    <!-- table表格 -->
    <el-table :data="listTable" v-loading="loading">
      <el-table-column label="专家姓名" width="180px">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar ? imgUrl + scope.row.avatar : defineImg"
            alt
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
            "
          />
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60px">
        <template slot-scope="scope">{{
          scope.row.gender == 1 ? "男" : "女"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="120px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="profession"
        label="专业"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="education"
        label="学历"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="title"
        label="职称"
        width="120px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="availableJson" label="可授课时间" width="100px">
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.availableJson == '' || scope.row.availableJson == null
            "
          >
            未设置
          </div>
          <div v-else>
            <el-button
              slot="reference"
              type="text"
              style="background: none; border: none; color: #000"
              @click="showJson(scope.row.availableJson)"
              >查看></el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalScore"
        label="评分"
        width="60px"
      ></el-table-column>
      <el-table-column label="操作" width="200px" v-if="$role.isSuperAdmin()">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="editUser(scope.row.userId)"
            >编辑专家信息</el-button
          >
          <el-button type="text" size="small" @click="editRow(scope.row)"
            >课程历史</el-button
          >
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
      title="导入专家信息"
      :visible.sync="dialogVisible1"
      width="500px"
      :before-close="closecourseForm"
      :close-on-click-modal="false"
    >
      <el-alert title="以下信息未导入成功" type="warning"></el-alert>
      <el-table
        :data="
          listTable2.slice(
            (upLoadPage.currentPage - 1) * upLoadPage.pageSize,
            upLoadPage.currentPage * upLoadPage.pageSize
          )
        "
      >
        <el-table-column prop="realName"></el-table-column>
        <el-table-column prop="mobile"></el-table-column>
        <el-table-column prop="profession"></el-table-column>
      </el-table>
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCuChange"
        :current-page="upLoadPage.currentPage"
        :page-size="upLoadPage.pageSize"
        :total="listTable2.length"
        layout="total, prev, pager, next"
      ></el-pagination>
      <el-form label-width="120px" label-position="right">
        <el-form-item align="right" class="dialog-btns">
          <el-button type="primary" @click="dialogVisible1 = false"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="专家授课时间"
      :visible.sync="showDialog"
      width="541px"
      :before-close="showClose"
      :close-on-click-modal="false"
    >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column width="59" prop="name"></el-table-column>
        <el-table-column label="周一" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Monday" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="周二" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Tuesday" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="周三" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Wednesday" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="周四" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Thursday" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="周五" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Friday" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="周六" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Saturday" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="周日" width="63">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.Sunday" disabled></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="编辑专家信息"
      class="editMsg"
      :visible.sync="dialogVisible"
      width="541px"
      :before-close="closeDetail"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <el-form
            label-width="80px"
            label-position="right"
            :rules="resourceFromRules"
            :model="resourceFrom"
            ref="projectFrom"
          >
            <el-form-item label="专家姓名" prop="realName">
              <el-input
                v-model="resourceFrom.realName"
                placeholder="请输入专家姓名"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <div class="headImg">
                <el-upload
                  class="avatar-uploader1"
                  :action="saveUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  style="
                    text-align: left;
                    width: 80px;
                    height: 80px;
                    margin-right: 10px;
                  "
                >
                  <div class="image-con image-name">
                    <img
                      :src="
                        resourceFrom.avatar == null || resourceFrom.avatar == ''
                          ? defineImg
                          : imgUrl + resourceFrom.avatar
                      "
                      class="avatar"
                      alt
                      style="width: 80px; height: 80px"
                    />
                    <div class="imang_hover" style="width: 80px; height: 80px">
                      <span>上传头像</span>
                    </div>
                  </div>
                </el-upload>
                <!-- <el-upload
                  class="upload-demo"
                  :action="saveUrl"
                  :on-success="handleSuccess"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                >
                  <img
                    src="../../../../public/images/avatar_normal_200.jpg"
                    alt
                    style="width:80px;height:80px"
                  />
                </el-upload>-->
                <div>
                  <p>最佳尺寸200*200px</p>
                  <p>支持jpg、jpeg、png格式图片</p>
                  <p>最大不超过1M</p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="resourceFrom.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="resourceFrom.mobile"
                placeholder="请输入手机号"
                disabled
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="profession">
              <el-input
                v-model="resourceFrom.profession"
                placeholder="请输入专业"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="学历" prop="education">
              <el-input
                v-model="resourceFrom.education"
                placeholder="请输入学历"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="职称" prop="title">
              <el-input
                v-model="resourceFrom.title"
                placeholder="请输入职称"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="所属单位" prop="unit">
              <el-input
                v-model="resourceFrom.unit"
                placeholder="请输入所属单位"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column width="59" prop="name"></el-table-column>
            <el-table-column label="周一" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Monday"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="周二" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Tuesday"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="周三" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Wednesday"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="周四" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Thursday"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="周五" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Friday"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="周六" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Saturday"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="周日" width="63">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.Sunday"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-form label-width="80px" label-position="right">
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addResource">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      saveUrl2: this.$setting.baseURL + "/api/web/trainingexperts/import",
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      defineImg: require("../../../../public/images/avatar_normal_200.jpg"),
      headers: { Authorization: this.$store.state.global.access_token },
      dialogVisible1: false,
      dialogVisible: false,
      activeName: "first",
      list: {
        search: "",
        status: "",
      },
      resourceFrom: {},
      loading: false,
      roleList: [],
      listTable: [],
      listTable2: [],
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1,
      },
      showDialog: false,
      tableData: [
        {
          name: "上午",
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
        {
          name: "下午",
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
        {
          name: "晚上",
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
      ],
      //前端分页
      upLoadPage: {
        currentPage: 1, // 当前页码
        total: 0, // 总条数
        pageSize: 5,
      },
      resourceFromRules: {
        realName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        avatar: [
          {
            required: true,
            message: "请选择头像",
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
        ],
        profession: [
          {
            required: true,
            message: "请输入专业",
            trigger: "blur",
          },
        ],
        education: [
          {
            required: true,
            message: "请输入学历",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入职称",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "请输入所属单位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //列表查看授课时间
    showClose() {
      this.showDialog = false;
    },
    showJson(json) {
      this.showDialog = true;
      this.tableData = JSON.parse(json);
    },
    handleAvatarSuccess(res, file) {
      this.resourceFrom.avatar = res.data.path;
    },
    beforeAvatarUpload(file) {
      let size = file.size / 1024 / 1024 < 1;
      if (file.type != "image/jpeg" && file.type != "image/png") {
        this.$message.error("请选择图片的格式为 jpg或png");
        return false;
      }
      if (!size) {
        this.$message.error("上传图片大小不得超过1MB");
        return false;
      }
    },
    editUser(id) {
      this.dialogVisible = true;
      this.$http
        .get(`/api/web/trainingexperts/info/${id}`)
        .then((res) => {
          this.resourceFrom = res.data;
          if (res.data.availableJson != null && res.data.availableJson != "") {
            this.tableData = JSON.parse(res.data.availableJson);
          } else {
            this.tableData = [
              {
                name: "上午",
                Monday: "",
                Tuesday: "",
                Wednesday: "",
                Thursday: "",
                Friday: "",
                Saturday: "",
                Sunday: "",
              },
              {
                name: "下午",
                Monday: "",
                Tuesday: "",
                Wednesday: "",
                Thursday: "",
                Friday: "",
                Saturday: "",
                Sunday: "",
              },
              {
                name: "晚上",
                Monday: "",
                Tuesday: "",
                Wednesday: "",
                Thursday: "",
                Friday: "",
                Saturday: "",
                Sunday: "",
              },
            ];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editRow(val) {
      this.$router.push({
        path: "/resourcesDetail",
        query: { userId: val.userId },
      });
    },
    addResource() {
      this.resourceFrom.availableJson = JSON.stringify(this.tableData);
      this.$refs["projectFrom"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/web/trainingexperts/update/teacher", this.resourceFrom)
            .then(async (res) => {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.dialogVisible = false;
              this.getList();
            })
            .catch((msg) => {});
        } else {
          this.$message.error("您的信息未填写完整");
        }
      });
    },
    //导入失败名单前端分页
    handleSizeChange(val) {
      this.upLoadPage.currentPage = 1;
      this.upLoadPage.pageSize = val;
    },
    handleCuChange(val) {
      this.upLoadPage.currentPage = val;
    },
    //导入
    handleSuccess(res, file) {
      if (res.code == 0) {
        this.dialogVisible1 = true;
        this.listTable2 = res.data;
        this.$message({
          message: res.message,
          type: "success",
        });
        if (res.data.length === 0) {
          this.dialogVisible1 = false;
        }
        this.getList();
      } else {
      }
    },
    beforeUpload(file) {},
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
        searchName: this.list.search,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo,
      };
      this.$http
        .get("/api/web/trainingexperts/page/list", { params: par })
        .then((res) => {
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
          this.listTable = res.data.records;
          this.loading = false;
        })
        .catch((msg) => {});
    },
    closecourseForm() {
      this.dialogVisible1 = false;
    },
    //导出名单
    downloadExl() {
      let param = {
        keyWord: this.list.search,
      };
      this.$http
        .get("/api/web/trainingexperts/export/list", param)
        .then((res) => {
          let exlList = res.data;
          for (let i = 0; i < exlList.length; i++) {
            exlList[i].expiredDt =
              exlList[i].expiredDt != null ? exlList[i].expiredDt : "永久有效";
          }
          let title = "专家列表";
          let sheet = "专家列表";
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/common/excel/Export2Excel"); //这里必须使用绝对路径
            let tHeader = [
              "姓名",
              "手机号",
              // "专业",
              // "学历",
              "职称",
            ];
            let filterVal = [
              "realName",
              "mobile",
              // "profession",
              // "education",
              "title",
            ]; // 导出的表头字段名
            let data = this.formatJson(filterVal, exlList);
            // 统计数据总览
            let time = new Date().getMonth() + 1 + "." + new Date().getDate();
            export_json_to_excel(tHeader, sheet, data, `${title}-${time}`); // 导出的表格名称，根据需要自己命名
          });
        })
        .catch((msg) => {});
    },
    downTable() {
      window.location.href =
        this.$setting.baseURL + `/api/web/template/download/teacher`;
    },
    formatJson(filterVal, jsonData) {
      var arr = jsonData.map((v) => filterVal.map((j) => v[j]));
      return arr;
    },
    closeDetail() {
      this.dialogVisible = false;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.m-search .s-el-input {
  width: 180px;
}
.editMsg .el-dialog__body {
  padding: 10px 30px 30px;
}
.headImg {
  display: flex;
  img {
    margin-right: 10px;
  }
  p {
    color: rgb(170, 170, 170);
    font-size: 12px;
    line-height: 22px;
  }
  .upload-demo {
    margin-right: 0;
  }
}
/deep/.cell {
  display: flex;
  align-items: center;
}
.el-dialog {
  .el-table--border {
    /deep/.cell {
      padding-left: 15px;
      text-align: center;
    }
  }
  .el-checkbox {
    margin-left: 9px;
  }
}
/deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #00be6e;
  border-color: #00be6e;
}
</style>