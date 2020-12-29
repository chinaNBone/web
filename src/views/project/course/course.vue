<template>
  <div class="course-detail time-table">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="m-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="总课表" name="all">
        <slot name="head"></slot>
        <el-table
          :data="detailData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
          v-opacity="loading"
        >
          <el-table-column label="上课日期" width="180" align="center">
            <template slot-scope="scope">
              {{ scope.row.beginTime | moment("YYYY-MM-DD") }}
            </template>
          </el-table-column>
          <el-table-column label="上课时间">
            <template slot-scope="scope">
              {{ scope.row.beginTime | moment("HH:mm") }} -
              {{ scope.row.endTime | moment("HH:mm") }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="培训内容"></el-table-column>
          <el-table-column prop="roomName" label="上课地点"></el-table-column>
          <el-table-column
            prop="teacherName"
            label="授课教师"
          ></el-table-column>
          <el-table-column prop="period" label="学时"></el-table-column>
          <el-table-column
            prop="courseStatusTitle"
            label="课程状态"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation" v-if="!showOld">
                <a
                  class="f-pointer course-operation"
                  @click="toDetail(scope.row.id)"
                  v-if="status > 0 && scope.row.courseStatus != -1"
                  >详情</a
                >
                <a
                  class="f-pointer course-operation"
                  @click="addCourse(scope.row.id)"
                  v-if="scope.row.courseStatus < 2"
                  >编辑</a
                >
                <a
                  class="f-pointer course-operation"
                  style="color: red"
                  @click="deleteCourse(scope.row.id)"
                  v-if="scope.row.courseStatus < 2"
                  >删除</a
                >
                <el-popover
                  placement="left"
                  trigger="click"
                  v-if="
                    status > 0 &&
                    scope.row.courseStatus < 2 &&
                    scope.row.courseStatus != -1
                  "
                >
                  <canvas
                    class="clocking-qrcode"
                    v-qrcode.lazy="getAttendanceUrl(scope.row)"
                  ></canvas>
                  <a
                    slot="reference"
                    class="f-pointer course-operation"
                    @click="showCode(scope.row.id)"
                    >签到二维码</a
                  >
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="教师课表" name="teacher">
        <slot name="head"></slot>
        <el-table
          :data="detailData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%; margin-top: 20px"
          v-opacity="loading"
        >
          <el-table-column
            prop="teacherName"
            width="180"
            label="授课教师"
            align="center"
          ></el-table-column>
          <el-table-column label="上课日期">
            <template slot-scope="scope">{{
              scope.row.beginTime | moment("YYYY-MM-DD")
            }}</template>
          </el-table-column>
          <el-table-column label="上课时间">
            <template slot-scope="scope">
              {{ scope.row.beginTime | moment("HH:mm") }} -
              {{ scope.row.endTime | moment("HH:mm") }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="培训内容"></el-table-column>
          <el-table-column prop="roomName" label="上课地点"></el-table-column>
          <el-table-column prop="period" label="学时"></el-table-column>
          <el-table-column
            prop="courseStatusTitle"
            label="课程状态"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation" v-if="!showOld">
                <a
                  class="f-pointer course-operation"
                  @click="toDetail(scope.row.id)"
                  v-if="status > 0 && scope.row.courseStatus != -1"
                  >详情</a
                >
                <a
                  class="f-pointer course-operation"
                  @click="addCourse(scope.row.id)"
                  v-if="scope.row.courseStatus < 2"
                  >编辑</a
                >
                <a
                  class="f-pointer course-operation"
                  style="color: red"
                  @click="deleteCourse(scope.row.id)"
                  v-if="scope.row.courseStatus < 2"
                  >删除</a
                >
                <div
                  class="f-pointer course-operation"
                  v-if="scope.row.courseStatus == 2"
                >
                  {{ scope.row.teacherCheckStatus == 0 ? "未签到" : "已签到" }}
                </div>
                <el-popover
                  placement="left"
                  trigger="click"
                  v-if="
                    status > 0 &&
                    scope.row.courseStatus < 2 &&
                    scope.row.courseStatus != -1
                  "
                >
                  <canvas
                    class="clocking-qrcode"
                    v-qrcode.lazy="getAttendanceUrl(scope.row)"
                  ></canvas>
                  <a
                    slot="reference"
                    class="f-pointer course-operation"
                    @click="showCode(scope.row.id)"
                    >签到二维码</a
                  >
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import { log } from "util";
export default {
  name: "Course",
  props: {
    status: Number,
    showOld: Boolean,
    loading: Boolean,
    detailData: {
      type: Array,
    },
  },
  data() {
    return {
      isRecommend: "",
      teacherId: "",
      roomId: "",
      obj: {},
      cates: [],
      catalogyId: [],
      tableData: [],
      activeTab: "all",
      spanCache: null,
      selectCourse: this.detailData[0],
      filters: {
        search: "",
      },
    };
  },
  methods: {
    handleClick(tab, event) {
      this.obj.activeTab = tab.name;
      this.$emit("func", this.obj);
    },
    sendTeacher(e) {
      this.obj.teacherId = e;
      this.$emit("func", this.obj);
    },
    sendRoom(event) {
      this.obj.roomId = event;
      this.$emit("func", this.obj);
    },
    // 查看详情
    toDetail(id) {
      this.$router.push({
        path: "/detailCourse",
        query: {
          id: id,
        },
      });
    },
    // 签到二维码
    showCode(id) {},
    getAttendanceUrl(item) {
      return `${this.$setting.h5URL}/center/clocking/${item.id}`;
    },
    // 添加/修改课节
    addCourse(id) {
      this.$router.push(`/addCourse${id ? "?id=" + id : ""}`);
    },
    // 删除课节
    deleteCourse(id) {
      this.$confirm("确认删除该课节?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
            .post("/api/edu/timetable/delete", { id: id })
            .then((res) => {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.$emit("refresh");
            })
            .catch((msg) => {});
        })
        .catch(() => {});
    },
    // 单元格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.num) {
          return [row.num, 1];
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
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
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  .course-operation {
    color: #00be6e;
    margin: 0 3px;
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
.clocking-qrcode {
  width: 174px;
  height: 174px;
}
</style>
<style lang="scss">
.time-table {
  .el-table tr td:first-child .cell {
    padding-left: 10px !important;
  }
}
</style>
