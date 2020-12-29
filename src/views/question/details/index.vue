<template>
  <div class="g-nav">
    <div class="tool-bar">
      <div class="m-tool">
        <div class="m-tool-title">编辑问卷</div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">当前位置：首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/question' }">问卷管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑问卷</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="l-mod l-edit">
      <div class="l-mod-tool">
        <h2>编辑问卷</h2>
        <div @click="toBlock()">返回 &gt;</div>
      </div>
      <div class="l-con">
        <div class="d-title">
          <h2>
            <span class="d-title-type">
              {{
              [
              "",
              "需求调研",
              "报名问卷",
              "考勤问卷",
              "教师授课问卷",
              "学员学习问卷",
              "项目综合评价问卷"
              ][info.type]
              }}
            </span>
            <span v-show="!isEsit">
              {{ info.title }}
              <i class="el-icon-edit-outline" @click="isEsit = !isEsit"></i>
            </span>
            <el-input v-show="isEsit" v-model.trim="info.title" placeholder>
              <i
                slot="suffix"
                class="el-input__icon el-icon-edit-outline"
                @click="isEsit = !isEsit"
              ></i>
            </el-input>
          </h2>
        </div>
        <div class="d-info">
          <div class="d-des">
            <el-input type="textarea" :rows="4" v-model.trim="info.description" placeholder="请输入说明"></el-input>
          </div>
          <h2>
            题目设置
            <span>总题数：{{ selectList.length }}题</span>
          </h2>
          <div class="d-list">
            <ul>
              <li class="quesList" v-for="(item, index) in selectList" :key="index">
                <h3>
                  {{ index + 1 }}. {{ item.title }}
                  <i
                    class="el-icon-delete"
                    style="font-size:16px;color:#aaa;cursor: pointer;"
                    @click="delList(index)"
                  ></i>
                </h3>
                <p>A. 非常好</p>
                <p>B. 好</p>
                <p>C. 一般</p>
                <p>D. 不好</p>
                <p>E. 非常不好</p>
              </li>
            </ul>
          </div>
          <div class="selectList">
            <div
              @click="showSelectTable"
              class="course"
              v-show="selectList.length >= 10 ? false : true"
              :style="style"
            >
              <div class="small">
                <p>+点击选择问卷题目</p>
              </div>
            </div>
            <el-dialog
              title="选择题目"
              :visible.sync="dialogVisible"
              width="660px"
              style="margin:50px 0 0 50px;"
              :closeOnClickModal="false"
              :before-close="handleClose"
            >
              <el-row class="search-row">
                <div class="f-fl">
                  <el-input v-model="list.search" size="medium" placeholder="输入试题关键字搜索"></el-input>
                  <el-input v-model="list.people" size="medium" placeholder="输入上传人搜索"></el-input>
                  <!-- <el-select v-model="list.status" placeholder="题目类型" class="s-el-input">
                    <el-option label="教师授课问卷" :value="1"></el-option>
                    <el-option label="学员学习问卷" :value="2"></el-option>
                  </el-select>-->
                  <el-button
                    type="primary"
                    style="background:rgba(255, 153, 0, 1);border:none"
                    size="medium"
                    @click="getQuesList('search')"
                  >搜索</el-button>
                </div>
              </el-row>
              <!-- table表格 -->
              <el-table
                :data="tableData"
                highlight-current-row
                :row-key="getRowKey"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column label="题目" prop="title" show-overflow-tooltip></el-table-column>
                <el-table-column prop="realName" label="上传人" width="100"></el-table-column>
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
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addList">确定</el-button>
              </span>
            </el-dialog>
          </div>

          <div class="d-set">
            <div>
              <el-button type="primary" @click="edit('flag')">保 存</el-button>
              <el-button
                type="primary"
                @click="publish('publish')"
                :disabled="selectList.length == 10 ? false : true"
              >发布问卷</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
      tagsName: "1",
      formInline: {},
      id: "",
      isEsit: false,
      info: {},
      editFlagId: "",
      question: [],
      questionSet: {
        title: "",
        type: 2,
        sortId: 1,
        required: false,
        options: [
          {
            option: ""
          }
        ]
      },
      //选择弹窗对应数据
      dialogVisible: false,
      list: {
        search: "",
        status: "",
        people: ""
      },
      //题目列表
      tableData: [],
      //已选中题目
      selectTable: [],
      //确定选中题目列表
      selectList: [],
      listPage: {
        pageSize: 8,
        total: 0,
        pageNo: 1
      },
      style: ""
    };
  },
  watch: {
    selectList: {
      handler() {
        if (this.selectList.length == 0) {
          this.style = "height:190px";
        } else {
          this.style = "height:90px";
        }
      },
      deep: true
    }
  },
  computed: {
    // 直接通过问卷类型判断题目类型
    type() {
      return [0, 0, 0, 0, 1, 2][this.info.type || 0];
    }
  },
  async mounted() {
    this.id = this.$route.query.id;
    this.getDetail();
    await this.getInfo();
  },
  watch: {
    dialogVisible(newV, oldV) {
      if (newV == true) {
        this.getQuesList();
      }
    }
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //弹窗获取题目列表
    getQuesList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      // 直接通过问卷类型判断需要选择的题目
      let par = {
        type: this.type,
        search: this.list.search,
        user: this.list.people,
        pageSize: this.listPage.pageSize,
        pageNo: this.listPage.pageNo
      };
      this.$http
        .post("/api/questionnaire/template/list", par)
        .then(res => {
          this.listPage.total = res.data.total;
          this.tableData = res.data.records;
          this.$nextTick(() => {
            this.tableData.forEach(item => {
              this.selectList.forEach(item2 => {
                if (item.id == item2.id) {
                  this.$refs.multipleTable.toggleRowSelection(item, true);
                }
              });
            });
          });
        })
        .catch(msg => {});
    },
    showSelectTable() {
      this.dialogVisible = true;
    },
    //弹窗选择题目
    handleSelectionChange(val) {
      this.selectTable = val;
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getQuesList();
    },
    //确定添加题目
    addList() {
      let newList = JSON.parse(JSON.stringify(this.selectList));
      let obj = {};
      for (var i of this.selectTable) {
        newList.push(i);
      }
      newList = newList.reduce((cur, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []);
      if (newList.length > 10) {
        this.$message({
          message: "题目最大数为10",
          type: "warning"
        });
        return;
      } else {
        this.selectList = JSON.parse(JSON.stringify(newList));
        this.dialogVisible = false;
      }
    },

    //删除题目
    delList(index) {
      this.$confirm("您确定要删除该题目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.selectList.splice(index, 1);
        })
        .catch(() => {});
    },
    handleClick(tab, event) {},
    // 返回上级「
    toBlock() {
      this.$router.push({
        path: "/question"
      });
    },
    // 保存编辑-之前接口暂保留
    // edit(flag) {
    //   let par = {
    //     id: this.id,
    //     title: this.info.title,
    //     description: this.info.description,
    //     question: JSON.stringify(this.selectList)
    //   };
    //   return this.$http
    //     .post("/api/questionnaire/edit", par)
    //     .then(res => {
    //       if (flag != "publish") {
    //         this.$message({
    //           message: "保存成功",
    //           type: "success"
    //         });

    //         this.$router.push({
    //           path: "/question"
    //         });
    //       }
    //       console.log("保存");
    //     })
    //     .catch(msg => {});
    // },
    // 保存编辑
    edit(flag) {
      let newList = [];
      for (var i of this.selectList) {
        newList.push(i.id);
      }
      let par = {
        id: this.id,
        title: this.info.title,
        status: 0,
        description: this.info.description,
        bankIds: newList
      };
      return this.$http
        .put("/api/web/evaluation/question/update", par)
        .then(res => {
          if (flag != "publish") {
            this.$message({
              message: "保存成功",
              type: "success"
            });

            this.$router.push({
              path: "/question"
            });
          }
          console.log("保存");
        })
        .catch(msg => {});
    },
    // 发布问卷
    async publish(flag) {
      await this.edit(flag);
      let par = {
        questionId: this.id
      };
      this.$http
        .post("/api/questionnaire/publish", par)
        .then(res => {
          this.$message({
            message: "发布成功",
            type: "success"
          });
          this.$router.push({
            path: "/question"
          });
        })
        .catch(msg => {});
    },
    getDetail() {
      let par = {
        questionId: this.id
      };
      this.$http
        .post("/api/questionnaire/getDetails", par)
        .then(res => {
          this.selectList = res.data;
          for (let i = 0; i < this.selectList.length; i++) {
            this.selectList[i].id = JSON.parse(this.selectList[i].parentId);
            this.selectList[i].options = JSON.parse(this.selectList[i].options);
          }
          this.questionSet.sortId = this.selectList.length + 1;
        })
        .catch(msg => {});
    },
    getInfo() {
      let par = {
        questionId: this.id
      };
      return this.$http
        .post("/api/questionnaire/getInfo", par)
        .then(res => {
          this.info = res.data;
        })
        .catch(msg => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.d-info {
  min-height: 700px;
  .d-des {
    margin: 20px 0;
  }
  h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 14px;
    }
  }
  .d-set {
    margin-top: 55px;
    div {
      margin-left: auto;
      .el-button {
        width: 120px;
      }
    }
  }
}
.quesList {
  padding: 25px 0;
  border-bottom: 1px solid #ddd;
  h3 {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
  }
  p {
    text-indent: 20px;
    margin-top: 16px;
  }
}
.search-row .el-input {
  width: 188px;
}
/deep/.search-row .el-select .el-input {
  width: 145px;
}
/deep/.search-row .el-select .el-input .el-input__inner {
  height: 36px;
}
.course {
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin-top: 30px;
  cursor: pointer;
  .big {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .stip {
      color: #00be6e;
      font-size: 100px;
    }
  }
  .small {
    p {
      color: #00be6e;
    }
  }
}
.el-pagination {
  margin: 30px 0 0;
}
.dialog-footer {
  .el-button {
    width: 88px;
  }
}
</style>
