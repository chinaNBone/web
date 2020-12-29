<template>
  <div class="course-detail">
    <transition name="fade">
      <div class="course-type" v-if="dataType">
        <i class="el-icon-warning-outline"></i>
        张树义申请修改课表
      </div>
    </transition>
    <div class="course-con">
      <div class="course-btn">
        <el-button type="warning">驳回申请</el-button>
        <el-button type="primary">同意申请</el-button>
      </div>
      <el-tabs v-model="activeTab" type="card" class="m-tabs" @tab-click="handleClick">
        <el-tab-pane label="总课表" name="first">
          <!-- table表格 -->
          <el-table
            :data="detailData"
            :span-method="objectSpanMethod"
            v-if="!isshow"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="id" label="上课日期" width="180"></el-table-column>
            <el-table-column prop="name" label="上课时间"></el-table-column>
            <el-table-column prop="amount1" label="培训内容"></el-table-column>
            <el-table-column prop="amount2" label="上课地点"></el-table-column>
            <el-table-column prop="amount3" label="授课教师"></el-table-column>
            <el-table-column prop="amount4" label="课程状态"></el-table-column>
            <el-table-column label="操作" align="center" v-if="dataType">
              <template slot-scope="scope">
                <div class="operation">
                  <el-button
                    type="primary"
                    style="background:#fff;color:#00be6e; border:none"
                    size="small"
                    @click="todetail(scope.row.id)"
                  >修改</el-button>
                  <el-button
                    type="warning"
                    style="background:#fff;color:#FF0000; border:none"
                    size="small"
                    @click="tocode(scope.row.id)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="isshow">
            <div class="detail-top">
              <div class="file-name">
                <span>
                  <i
                    class="el-icon-arrow-left"
                    style="border:1px solid #ccc;padding:3px; color:#ccc;margin-right:7px"
                  ></i>
                  {{}}阶梯教室一（30人教室设备齐全）
                </span>
                <span class="free">空闲</span>
                <span class="nouse">禁用</span>
              </div>
              <div class="d-margin">
                <span class="color-orange">二维码</span>
                <span class="color-gray">|</span>
                <span class="color-orange">复制链接</span>
              </div>
            </div>
            <el-form label-width="100px" style="width:550px" size="small">
              <!-- <el-form-item label="学员头像">
                <div class="pic-show-thumbnail square" v-preview.sync="userForm.avatar">
                  <img :src="userForm.avatar" alt />
                </div>
              </el-form-item>-->
              <el-form-item label="上课日期">{{userForm.userName}}</el-form-item>
              <el-form-item label="上课时间">{{userForm.gender==1?'男':"女"}}</el-form-item>
              <el-form-item label="授课老师">{{userForm.mobile}}</el-form-item>
              <el-form-item label="备注">{{userForm.unit}}</el-form-item>
              <el-form-item label="考勤问卷">{{userForm.unit}}</el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="老师课表" name="second">
          <!-- table表格 -->
          <el-table
            :data="detailData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="id" label="上课日期" width="180"></el-table-column>
            <el-table-column prop="name" label="上课时间"></el-table-column>
            <el-table-column prop="amount1" label="培训内容"></el-table-column>
            <el-table-column prop="amount2" label="上课地点"></el-table-column>
            <el-table-column prop="amount3" label="授课教师"></el-table-column>
            <el-table-column prop="amount4" label="课程状态"></el-table-column>
            <el-table-column label="操作" align="center" v-if="dataType">
              <template slot-scope="scope">
                <div class="operation">
                  <el-button
                    type="primary"
                    style="background:#fff;color:#00be6e; border:none"
                    size="small"
                    @click="todetail(scope.row.id)"
                  >修改</el-button>
                  <el-button
                    type="warning"
                    style="background:#fff;color:#FF0000; border:none"
                    size="small"
                    @click="tocode(scope.row.id)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="学生课表" name="third">
          <!-- table表格 -->
          <el-table
            :data="detailData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="id" label="上课日期" width="180"></el-table-column>
            <el-table-column prop="name" label="上课时间"></el-table-column>
            <el-table-column prop="amount1" label="培训内容"></el-table-column>
            <el-table-column prop="amount2" label="上课地点"></el-table-column>
            <el-table-column prop="amount3" label="授课教师"></el-table-column>
            <el-table-column prop="amount4" label="课程状态"></el-table-column>
            <el-table-column label="操作" align="center" v-if="dataType">
              <template slot-scope="scope">
                <div class="operation">
                  <el-button
                    type="primary"
                    style="background:#fff;color:#00be6e; border:none"
                    size="small"
                    @click="todetail(scope.row.id)"
                  >修改</el-button>
                  <el-button
                    type="warning"
                    style="background:#fff;color:#FF0000; border:none"
                    size="small"
                    @click="tocode(scope.row.id)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
// import { log } from "util";
export default {
  data() {
    return {
      dataType: false,
      detailData: [
        {
          id: '2019-11-01（周五）',
          name: '09:00 ~ 9:30',
          amount1: '开班仪式',
          amount2: '明德楼403课室',
          amount3: '胡逸眉',
          amount4: '未开课'
        },
        {
          id: '2019-11-01（周五）',
          name: '9:30 ~ 12:30',
          amount1: '名家讲座：学生管理中的心理学智慧',
          amount2: '明德楼403课室',
          amount3: '谢尚旭',
          amount4: '未开课'
        },
        {
          id: '2019-11-01（周五）',
          name: '14:30 ~ 17:30',
          amount1: '浅析中小学教育发展现状',
          amount2: '明德楼403课室',
          amount3: '郦洪柯',
          amount4: '未开课'
        },
        {
          id: '2019-11-02（周六）',
          name: '9:00 ~ 12:00',
          amount1: '香港视野：如何建设学习型组织文化——香港培侨小学的故事',
          amount2: '敏行楼508课室',
          amount3: '楼阳冰',
          amount4: '未开课'
        },
        {
          id: '2019-11-02（周六）',
          name: '14:30 ~ 17:30',
          amount1: '教育改革与家校合作',
          amount2: '敏行楼508课室',
          amount3: '汪茹明',
          amount4: '未开课'
        },
      ],
      isRecommend: "",
      teacherId: "",
      roomId: "",
      obj: {},
      rooms: [
        {
          value: "选项1",
          label: "102室"
        },
        {
          value: "选项2",
          label: "109室"
        },
        {
          value: "选项3",
          label: "110室"
        },
        {
          value: "选项4",
          label: "129室"
        },
        {
          value: "选项5",
          label: "139室"
        }
      ],
      teachers: [
        {
          value: "1",
          label: "李老师"
        },
        {
          value: "2",
          label: "刘老师"
        },
        {
          value: "3",
          label: "陈老师"
        },
        {
          value: "4",
          label: "范老师"
        },
        {
          value: "5",
          label: "黄老师"
        }
      ],
      isshow: false,
      cates: [],
      catalogyId: [],
      activeTab: "first",
      filters: {
        search: ""
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      this.obj.activeTab = tab.name;
      this.$emit("func", this.obj);
      if (tab.name === 'first') {
        this.dataType = false;
      } else if (tab.name === 'second') {
        this.dataType = true;
      } else {
        this.dataType = false;
      }
      // if (tab.name === "second") {
      //   this.$http
      //     .post("/manager/enterprise/sonCompanyList", {
      //       id: this.company.id
      //     })
      //     .then(json => {
      //       this.subsidiary = json.data;
      //     });
      // }
    },
    sendTeacher(e) {
      this.obj.teacherId = e;
      this.$emit("func", this.obj);
    },
    sendRoom(event) {
      this.obj.roomId = event;
      this.$emit("func", this.obj);
    },
    handleSelectionChange(val) {},
    downloadExl() {},
    getUserList() {},
    todetail() {
      this.isshow = true;
    },
    tocode() {},
    addCourse() {
      this.$router.push({ name: "addCourse" });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  mounted() {
    console.log(111);
  }
};
</script>

<style lang="scss" scoped>
.course-con {
  position: relative;

  .course-btn {
    position: absolute;
    top: -2px;
    right: 0;
    width: 300px;
    background: #ffffff;
    text-align: right;
    padding: 2px;
    z-index: 1;

    .el-button {
      margin-right: 15px;
    }
  }
}
.course-type {
  padding: 10px 20px;
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.1);
  margin-bottom: 10px;
}
.baseinfo-label {
  padding: 20px 50px;
  font-size: 18px;
  font-weight: 400;
}
.avatar.overstep {
  width: 198px;
  height: 120px;
}
.detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: #333333;
}
.file-name {
  width: 45%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: #333333;
}
.free {
  border: 1px solid #00be6e;
  padding: 2px 15px;
  font-size: 12px;
  background: #fff;
  color: #00be6e;
}
.nouse {
  border: 1px solid #ccc;
  padding: 2px 15px;
  font-size: 12px;
  color: #ccc;
}
.operation {
  .el-button {
    background: rgb(255, 255, 255);
    border: none;
  }
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

