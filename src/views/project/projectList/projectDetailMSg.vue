<template>
  <div class="d-from f-clearfix">
    <!-------------------------------------已审核查看详情-------------------------------------------------------->
    <el-form
      :inline="true"
      :model="projectFrom"
      ref="projectFrom"
      label-width="120px"
      class="demo-form-inline detail-from"
    >
      <el-form-item label="项目名称">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.title"
          placement="top"
          :open-delay="800"
        >
          <el-button type="text" class="project-title overhidden" style>{{
            projectFrom.title
          }}</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="'承担院系\n（公章）'" class="cachet">
        <el-select
          v-model="projectFrom.hostDepartment"
          placeholder="请选择院系"
          disabled
        >
          <el-option
            v-for="item in hostDepartments"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院系负责人">
        <el-select
          v-model="projectFrom.departmentPersonId"
          placeholder="请选择院系负责人"
          disabled
        >
          <el-option
            v-for="item in departmentPersonIds"
            :key="item.index"
            :label="item.realName + '_' + item.mobile"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目负责人">
        <el-select
          v-model="projectFrom.principalPersonId"
          placeholder="请选择项目负责人"
          disabled
        >
          <el-option
            v-for="item in principalPersonIds"
            :key="item.index"
            :label="item.realName + '_' + item.mobile"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目执行人">
        <el-select
          v-model="projectFrom.executivePersonId"
          placeholder="请选择项目执行人"
          disabled
        >
          <el-option
            v-for="item in executivePersonIds"
            :key="item.index"
            :label="item.realName + '_' + item.mobile"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统筹管理部门">
        <el-select
          v-model="projectFrom.managementDepartment"
          placeholder="请选择统筹管理部门"
          disabled
        >
          <el-option
            v-for="item in managementDepartments"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训目标">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.trainingTarget"
          placement="top"
          :open-delay="800"
        >
          <el-button type="text" class="project-train overhidden" style>{{
            projectFrom.trainingTarget
          }}</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="培训人数">{{
        projectFrom.trainingNumber
      }}</el-form-item>
      <el-form-item label="计划开班时间">
        <el-date-picker
          v-model="projectFrom.planBegin"
          type="date"
          placeholder="请选择计划开班时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培训方式" class="trainingStyle">
        <el-select
          v-model="projectFrom.trainingStylef"
          multiple
          placeholder="请选择培训方式"
          disabled
        >
          <el-option
            v-for="item in trainingStyles"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- todo -->
      <el-form-item label="培训学时" class="el-from-cell4">
        <el-form-item label="集中培训">{{
          projectFrom.dayFocus * 6
        }}</el-form-item>
        <el-form-item label="跟岗学习">{{
          projectFrom.dayFollow * 6
        }}</el-form-item>
        <el-form-item label="其他学习">{{
          projectFrom.dayOther * 6
        }}</el-form-item>
        <el-form-item label="合计">
          {{
            sum(
              projectFrom.dayFocus * 6,
              projectFrom.dayFollow * 6,
              projectFrom.dayOther * 6
            )
          }}
        </el-form-item>
      </el-form-item>
      <el-form-item label="培训时长(天)" class="el-from-cell4">
        <el-form-item label="集中培训">{{ projectFrom.dayFocus }}</el-form-item>
        <el-form-item label="跟岗学习">{{
          projectFrom.dayFollow
        }}</el-form-item>
        <el-form-item label="其他学习">{{ projectFrom.dayOther }}</el-form-item>
        <el-form-item label="合计">
          {{
            sum(
              projectFrom.dayFocus,
              projectFrom.dayFollow,
              projectFrom.dayOther
            )
          }}
        </el-form-item>
      </el-form-item>
      <el-form-item label="培训层次">
        <el-select
          v-model="projectFrom.trainingLevel"
          placeholder="请选择培训层次"
          disabled
        >
          <el-option
            v-for="item in trainingLevels"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训类别">
        <el-cascader
          v-model="projectFrom.trainingTypef"
          :options="trainingTypes"
          :props="{
            expandTrigger: 'hover',
            value: 'id',
            label: 'title',
            children: 'childrenList',
          }"
          placeholder="请选择培训类别"
          disabled
        ></el-cascader>
      </el-form-item>
      <el-form-item label="实施年度">
        <el-date-picker
          v-model="projectFrom.implementationYear"
          type="year"
          placeholder="请选择实施年度"
          format="yyyy"
          value-format="yyyy"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培训对象">
        <el-cascader
          disabled
          v-model="projectFrom.traineef"
          :options="trainees"
          :props="{
            expandTrigger: 'hover',
            value: 'id',
            label: 'title',
            children: 'childrenList',
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="培训基地">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.trainingBase"
          placement="top"
          :open-delay="800"
        >
          <el-button type="text" class="project-trainBase overhidden" style>{{
            projectFrom.trainingBase
          }}</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="项目级别">
        <el-select
          v-model="projectFrom.level"
          placeholder="请选择项目级别"
          disabled
        >
          <el-option label="国家" :value="1"></el-option>
          <el-option label="省级" :value="2"></el-option>
          <el-option label="市级" :value="3"></el-option>
          <el-option label="市级" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="电子签名" class="el-from-cell3">
        <div class="orginUploader">
          <div
            v-if="projectFrom.electronicSignature"
            class="image-con image-name"
          >
            <img
              :src="imgUrl + projectFrom.electronicSignature"
              class="avatar"
              alt
              style="width: 295px; height: 100px"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="资源整合" class="resource">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.resource"
          placement="top"
          :open-delay="800"
        >
          <el-button type="text" class="project-res overhidden" style>{{
            projectFrom.resource
          }}</el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="经费来源" class="expenditure">
        <el-select
          v-model="projectFrom.budgetSource"
          placeholder="请选择经费来源"
          disabled
        >
          <el-option
            v-for="item in budgetSources"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="width: 900px; border-bottom: 1px solid #ccc"></div>
      <el-form-item
        class="el-from-row3"
        v-for="(item, index) in projectFrom.latitudes"
        :key="index"
      >
        <el-form-item :label="index == 0 ? '考核维度' : ''">
          <el-tooltip
            class="item"
            effect="light"
            :content="item.latitude"
            placement="top"
            :open-delay="800"
          >
            <el-button type="text" class="project-latit overhidden" style>{{
              item.latitude
            }}</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="index == 0 ? '所占比例%' : ''">{{
          item.percent
        }}</el-form-item>
        <el-form-item
          :label="index == 0 ? '具体内容' : ''"
          class="el-from-row3-last"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item.content"
            placement="top"
            :open-delay="800"
          >
            <el-button type="text" class="project-content overhidden" style>{{
              item.content
            }}</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form-item>

      <el-form-item
        :label="'经费预算标准\n（元/人）'"
        class="cachet border-top"
        :style="style2"
        >{{ projectFrom.budgetStandard }}</el-form-item
      >
      <el-form-item
        :label="'经费预算总额\n（万元）'"
        class="cachet border-top"
        :style="style"
        >{{ projectFrom.budgetAmount }}</el-form-item
      >

      <el-form-item
        class="el-from-row5"
        v-for="(item2, index) in projectFrom.expenditures"
        :key="'info' + index"
      >
        <el-form-item
          :label="index == 0 ? '具体经费支出名目' : ''"
          class="row5-expenditure"
        >
          <div class="row5-index">{{ index + 1 }}</div>
          <div class="row5-value">
            <el-tooltip
              class="item"
              effect="light"
              :content="item2.expenditure"
              placement="top"
              :open-delay="800"
            >
              <el-button type="text" class="project-expend overhidden" style>{{
                item2.expenditure
              }}</el-button>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item :label="index == 0 ? '预算经费支出额度（万元）' : ''">{{
          item2.amount
        }}</el-form-item>
        <el-form-item
          :label="index == 0 ? '经费支出说明' : ''"
          class="el-from-row5-last"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item2.description"
            placement="top"
            :open-delay="800"
          >
            <el-button type="text" class="project-desc overhidden" style>{{
              item2.description
            }}</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form-item>

      <el-form-item label="指导思想" class="el-from-row2">{{
        projectFrom.guidingIdeology
      }}</el-form-item>
      <el-form-item label="需求分析" class="el-from-row2">{{
        projectFrom.requirementAnalysis
      }}</el-form-item>
      <el-form-item label="培训特色与创新" class="feature el-from-row2">{{
        projectFrom.trainingInnovations
      }}</el-form-item>

      <el-form-item label="附件" class="el-from-row el-form-rowRight">
        <ul v-if="showFileName.length > 0">
          <li
            v-for="(item, index) in showFileName"
            :key="index"
            @click="downFiled(item)"
          >
            <span class="file-style">{{ item.fileName }}</span>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="备注" class="el-from-row msg">{{
        projectFrom.remark
      }}</el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  // props: { proName },
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl,
      projectFrom: {
        hostDepartment: "",
        budget: "",
        contactPersonId: "",
        dayFocus: "",
        dayFollow: "",
        dayOther: "",
        departmentPersonId: "",
        electronicSignature: "",
        fileIds: "",
        implementationYear: "",
        level: 1,
        managementDepartment: "",
        number: "",
        periodFocus: "",
        periodFollow: "",
        periodOther: "",
        planBegin: "",
        principalDepartment: "",
        principalPersonId: "",
        source: "",
        title: "",
        trainingNumber: "",
        trainingStylef: [],
        assessmentDirection: "",
        id: "",
        remark: "",
        timetablePublish: "",
        trainingType: "",
        trainingTypef: [],
        traineef: [],
        trainingTypefVal: "",
        traineefVal: "",
        latitudes: [{ latitude: "", percent: "", content: "" }],
        expenditures: [{ expenditure: "", amount: "", description: "" }],
      },
      //下拉框数据列
      userDepartmentInit: false,
      userPrincipalInit: false,
      userExecutiveInit: false,
      departmentPersonIds: [],
      hostDepartments: [],
      principalPersonIds: [],
      executivePersonIds: [],
      managementDepartments: [],
      trainingStyles: [],
      trainingLevels: [],
      trainingTypes: [],
      budgetSources: [],
      trainees: [],
      addForm: {
        docIds: [],
      },
      fileList: [],
      //关联资源文件
      dialogVisible: false,
      fileListTable: [], //资源文件列表
      fileIdList: [], //选中的资源文件
      showFileName: [], //选中的文件渲染列表
      loading: false,
      listPage: {
        pageSize: 10,
        total: 0,
        pageNo: 1,
      },
      style: "border-left:none!important;border-right:1px solid #ccc",
      style2: "border-right:1px solid #ccc",
      valArr: [],
      valArr2: [],
    };
  },
  mounted() {
    // this.projectFrom.id = this.$route.query.id || "";
    // if (this.projectFrom.id != "") {
    //   this.getDetail(this.projectFrom.id);
    //   // this.getFileList(this.projectFrom.id);
    // } else {
    //   this.projectFrom.title = this.$route.query.title;
    // }
    // this.getdeList();
    this.getDetail();
    this.gettrList();
    this.gettraList();
    this.getbuList();
    this.getmaList();
    this.gettypeList();
    this.getlevelList();
    this.gethostList();
    this.getOssList();
  },
  filters: {
    numFilter(value) {
      let realVal = "";
      if (!isNaN(value) && value !== "") {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3);
        realVal = tempVal.substring(0, tempVal.length - 1);
      } else {
        realVal = "--";
      }
      return realVal;
    },
  },
  methods: {
    downFiled(item) {
      window.location.href =
        this.$setting.baseURL +
        `/oss/download/downloadById?fileId=${item.fileId}`;
    },
    addFileList() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.multipleTable.selection.splice(
          0,
          this.$refs.multipleTable.selection.length
        );
        for (var i of this.showFileName) {
          for (var j of this.fileListTable) {
            if (i.fileId == j.id) {
              this.$refs.multipleTable.selection.push(j);
            }
          }
        }
      });
    },
    delChild(arr) {
      if (arr.length) {
        for (let i in arr) {
          if (arr[i].childrenList.length) {
            this.delChild(arr[i].childrenList);
          } else {
            delete arr[i].childrenList;
          }
        }
      }
      return arr;
    },
    closecourseForm() {
      this.dialogVisible = false;
    },
    //获取资源列表
    getOssList() {
      let par = {
        fileName: "",
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize,
      };
      this.$http
        .post("/oss/oss/pageList", par)
        .then((res) => {
          this.fileListTable = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
        })
        .catch((msg) => {});
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getOssList();
    },
    //选择资源
    handleSelectionChange(val) {
      this.fileIdList = val;
    },
    //确定选择的文件
    handleClose() {
      this.projectFrom.fileIds = "";
      for (var i of this.fileIdList) {
        this.projectFrom.fileIds = this.projectFrom.fileIds + i.id + ",";
      }
      this.showFileName = this.fileIdList;
      this.dialogVisible = false;
    },
    //动态表单
    latitudeAdd() {
      this.projectFrom.latitudes.push({
        latitude: "",
        percent: "",
        content: "",
      });
    },
    expenditureAdd() {
      this.projectFrom.expenditures.push({
        expenditure: "",
        amount: "",
        description: "",
      });
    },
    latitudeDel(index) {
      if (this.projectFrom.latitudes.length <= 1) {
        return;
      } else {
        this.projectFrom.latitudes.splice(index, 1);
      }
    },
    expenditureDel(index) {
      if (this.projectFrom.expenditures.length <= 1) {
        return;
      } else {
        this.projectFrom.expenditures.splice(index, 1);
      }
    },
    //人员搜索
    userDepartmentClick() {
      if (!this.userDepartmentInit || this.departmentPersonIds.length < 1) {
        this.getUserDepartmentList();
        this.userDepartmentInit = true;
      }
    },
    async getUserDepartmentList(search) {
      this.departmentPersonIds = await this.getUserList(search);
    },
    userPrincipalClick() {
      if (!this.userPrincipalInit || this.principalPersonIds.length < 1) {
        this.getUserPrincipalList();
        this.userPrincipalInit = true;
      }
    },
    async getUserPrincipalList(search) {
      this.principalPersonIds = await this.getUserList(search);
    },
    userExecutiveClick() {
      if (!this.userExecutiveInit || this.executivePersonIds.length < 1) {
        this.getUserExecutiveList();
        this.userExecutiveInit = true;
      }
    },
    async getUserExecutiveList(search) {
      this.executivePersonIds = await this.getUserList(search);
    },
    getUserList(search) {
      return this.$http
        .post("/api/upms/user/getUserList", {
          pageNo: 1,
          pageSize: 7,
          name: search || "",
        })
        .then((res) => res.data.list);
    },
    //------------------------
    //院系公章
    gethostList() {
      this.$http
        .post("/api/edu/department/deptList")
        .then((res) => {
          this.hostDepartments = res.data;
        })
        .catch((msg) => {});
    },
    //统筹管理部门
    getmaList() {
      let par = {
        typeName: "managementDepartment",
      };
      this.$http
        .post("/api/edu/project/getOptionList", par)
        .then((res) => {
          this.managementDepartments = res.data;
        })
        .catch((msg) => {});
    },
    //培训方式
    gettrList() {
      let par = {
        typeName: "trainingStyle",
      };
      this.$http
        .post("/api/edu/project/getOptionList", par)
        .then((res) => {
          this.trainingStyles = res.data;
        })
        .catch((msg) => {});
    },
    //培训层次
    getlevelList() {
      let par = {
        typeName: "trainingLevel",
      };
      this.$http
        .post("/api/edu/project/getOptionList", par)
        .then((res) => {
          this.trainingLevels = res.data;
        })
        .catch((msg) => {});
    },
    //培训类别
    gettypeList() {
      let par = {
        layer: 1,
        typeName: "trainingType",
      };
      this.$http
        .post("/api/edu/project/getCascadeOptionList", par)
        .then((res) => {
          this.trainingTypes = res.data;
          this.delChild(this.trainingTypes);
        })
        .catch((msg) => {});
    },

    //培训对象
    gettraList() {
      let par = {
        layer: 1,
        typeName: "trainee",
      };
      this.$http
        .post("/api/edu/project/getCascadeOptionList", par)
        .then((res) => {
          this.trainees = res.data;
          this.delChild(this.trainees);
        })
        .catch((msg) => {});
    },
    //经费来源
    getbuList() {
      let par = {
        typeName: "budgetSource",
      };
      this.$http
        .post("/api/edu/project/getOptionList", par)
        .then((res) => {
          this.budgetSources = res.data;
        })
        .catch((msg) => {});
    },
    //----------------------------------------------
    handleAvatarSuccess(res, file) {
      this.projectFrom.electronicSignature = res.data.path;
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
    sum(a, b, c) {
      let sum = Number(a) + Number(b) + Number(c);
      return sum;
    },
    getDetail() {
      let par = {
        projectId: localStorage.getItem("projectId"),
      };
      this.$http
        .post("/api/edu/project/getProjectInfo", par)
        .then((res) => {
          // 搜索框逻辑
          // 必须进行设置操作，否则搜索无法显示名称
          this.departmentPersonIds.push({
            id: res.data.departmentPersonId,
            realName: res.data.departmentPerson,
            mobile: res.data.departmentPersonMobile,
          });
          console.log(res);
          this.principalPersonIds.push({
            id: res.data.principalPersonId,
            realName: res.data.principalPerson,
            mobile: res.data.principalPersonMobile,
          });
          this.executivePersonIds.push({
            id: res.data.executivePersonId,
            realName: res.data.executivePerson,
            mobile: res.data.executivePersonMobile,
          });

          // 项目逻辑
          this.projectFrom = res.data;
          this.showFileName = res.data.fileList;
          this.projectFrom.fileIds = "";
          for (var i of res.data.fileList) {
            this.projectFrom.fileIds =
              this.projectFrom.fileIds + i.fileId + ",";
          }
          let expenditureLists = [];
          for (var i of res.data.expenditureList) {
            expenditureLists.push({
              expenditure: i.expenditure,
              amount: i.amount,
              description: i.description,
            });
          }
          let latitudeLists = [];

          for (var i of res.data.latitudeList) {
            latitudeLists.push({
              latitude: i.latitude,
              percent: i.percent,
              content: i.content,
            });
          }
          this.projectFrom.expenditures = expenditureLists;
          this.projectFrom.latitudes = latitudeLists;
          var list = [];
          for (var i of res.data.trainingStyleList) {
            list.push(i.id);
          }
          this.projectFrom.trainingStylef = list;
          this.projectFrom.trainingTypef = res.data.trainingType;
          // 培训类别
          if (this.projectFrom.trainingTypef) {
            let arr = [];
            let allList = this.listArr(this.trainingTypes, arr);
            this.projectFrom.trainingTypefVal = this.returnName(
              allList,
              this.projectFrom.trainingTypef,
              this.valArr
            )
              .reverse()
              .join("/");
          }
          this.projectFrom.traineef = res.data.trainee;
          // 培训对象
          if (this.projectFrom.traineef) {
            let arr = [];
            let allList = this.listArr(this.trainees, arr);
            this.projectFrom.traineefVal = this.returnName(
              allList,
              this.projectFrom.traineef,
              this.valArr2
            )
              .reverse()
              .join("/");
          }
          this.projectFrom = { ...this.projectFrom };
          this.fun(this.projectFrom);
        })
        .catch((msg) => {});
    },
    returnName(arr, id, arr2) {
      arr.forEach((item) => {
        if (item.id == id) {
          arr2.push(item.title);
          if (item.layer != 1) {
            this.returnName(arr, item.parentId, arr2);
          }
        }
      });
      return arr2;
    },
    listArr(arr, arr2) {
      for (var v of arr) {
        arr2.push(v);
        if (Array.isArray(v.childrenList)) {
          this.listArr(v.childrenList, arr2);
        }
      }
      return arr2;
    },
    fun(obj) {
      this.$emit("detail", obj);
    },
    async add() {
      this.projectFrom.expenditure = JSON.stringify(
        this.projectFrom.expenditures
      );
      this.projectFrom.latitude = JSON.stringify(this.projectFrom.latitudes);
      if (Array.isArray(this.projectFrom.trainingStylef)) {
        this.projectFrom.trainingStyle = this.projectFrom.trainingStylef.join(
          ","
        );
      } else {
        this.projectFrom.trainingStyle = this.projectFrom.trainingStylef;
      }
      if (Array.isArray(this.projectFrom.trainingTypef)) {
        this.projectFrom.trainingType = this.projectFrom.trainingTypef
          .slice(-1)
          .join(",");
      } else {
        this.projectFrom.trainingType = this.projectFrom.trainingTypef;
      }
      if (Array.isArray(this.projectFrom.traineef)) {
        this.projectFrom.trainee = this.projectFrom.traineef
          .slice(-1)
          .join(",");
      } else {
        this.projectFrom.trainee = this.projectFrom.traineef;
      }
      this.projectFrom.periodFocus = this.projectFrom.dayFocus * 6;
      this.projectFrom.periodFollow = this.projectFrom.dayFollow * 6;
      this.projectFrom.periodOther = this.projectFrom.dayOther * 6;
      this.$refs["projectFrom"].validate((valid) => {
        if (valid) {
          this.$http
            .post("/api/edu/project/addOrEditProject", this.projectFrom)
            .then(async (res) => {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.$router.push({ path: "/project" });
            })
            .catch(() => {});
        } else {
          this.$message.error("您的方案信息未填写完整");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.file-style {
  cursor: pointer;
  display: inline-block;
  margin: 4px 0;
  padding: 0 8px;
  border-radius: 4px;
  border: 1px solid #00be6e;
  color: #00be6e;
}
.cachet {
  /deep/.el-form-item__label {
    line-height: 20px;
    white-space: pre-line;
  }
}
.d-from {
  // /deep/.el-form-item__content {
  //   padding: 4px 10px;
  // }
  width: 900px;
  .resource {
    border-right: none;
  }
  /deep/.el-form-item__content {
    padding: 8px 10px;
    .el-input__inner {
      height: 35px;
    }
  }
  .el-cascader {
    width: 100%;
  }
  .border-top {
    border-top: 1px solid #ccc;
  }
  .expenditure {
    border-right: none;
    margin-bottom: 20px;
  }
  .feature {
    border-bottom: 1px solid #ccc;

    /deep/.el-form-item__label {
      padding: 10px 5px;
    }
  }
  .d-add {
    margin: 10px 0;
    display: block;
  }

  .row5-expenditure {
    /deep/.el-form-item__content {
      display: flex;
      .el-form-item__error {
        left: 70px;
      }
      .row5-index {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 75px;
        border-right: 1px solid #ccc;
        box-sizing: border-box;
      }
      .el-input,
      .el-date-editor {
        margin-right: 0;
      }
    }
  }
}
/deep/.el-form-item__error {
  top: 78%;
  left: 10px;
}
/deep/.el-from-row2 {
  /deep/.el-form-item__label {
    min-height: 220px !important;
    border-right: none;
  }
  .el-form-item__error {
    top: 95%;
  }
  .el-form-item__content {
    min-height: 220px !important;
    border-left: 1px solid #ccc;
    line-height: normal;
  }
}
/deep/.el-from-row3,
/deep/.el-from-row5 {
  .el-form-item__error {
    top: 75%;
  }
}
/deep/.el-form-rowRight {
  .el-form-item__content {
    padding: 10px;
  }
  .el-form-item__label {
    height: 100%;
    border-right: none;
  }
  .el-form-item__content {
    border-left: 1px solid #ccc;
  }
}
.trainingStyle {
  /deep/.el-select__tags {
    overflow: hidden;
    overflow-x: auto;
    & > span {
      display: flex;
    }
  }
}
.select-file {
  display: flex;
  justify-content: flex-end;
}
//已审核通过样式修改
.detail-from {
  .border-top {
    border-top: none;
  }
  /deep/.el-form-item__content {
    padding: 10px;
  }
  /deep/.el-input__inner {
    border: none;
    color: #000;
    background: none;
    margin-left: -15px;
  }
  /deep/.el-input__suffix,
  /deep/.el-input__prefix {
    display: none;
  }
  /deep/.el-date-editor {
    .el-input__inner {
      margin-left: -29px;
    }
  }
  /deep/.el-form-rowRight {
    .el-form-item__content {
      min-height: 61px;
    }
  }
  /deep/.el-from-row3 {
    .el-form-item__content {
      text-align: center;
    }
  }
  /deep/.el-from-row5 {
    .el-form-item__content {
      text-align: center;
    }
  }
  .row5-value {
    margin: 0 auto;
    button {
      width: 224px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.msg {
  /deep/.el-form-item__label {
    width: 121px !important;
  }
  .el-form-item__content {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.overhidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
}
.project-title {
  width: 90%;
  text-align: left;
}
.project-train,
.project-trainBase,
.project-res {
  width: 300px;
  text-align: left;
}

.project-latit,
.project-content {
  width: 90%;
  text-align: center;
}
.roject-expend {
  width: 200px;
  text-align: center;
}
.project-desc {
  width: 280px;
  text-align: center;
}
</style>
