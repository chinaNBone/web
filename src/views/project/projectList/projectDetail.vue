<template>
  <div class="d-from f-clearfix">
    <div class="saveDraft" v-if="projectFrom.id == '' || isClone">
      <el-button type="warning" @click="add('save')">保存草稿</el-button>
      <el-button type="warning" @click="saveDraft">导入草稿</el-button>
    </div>
    <el-form
      :inline="true"
      :model="projectFrom"
      :rules="projectData"
      ref="projectFrom"
      label-width="120px"
      class="demo-form-inline"
      :class="{ 'detail-from': flag }"
    >
      <el-form-item label="项目名称" prop="title" class="el-maxl">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.title"
          placement="top"
          :open-delay="800"
        >
          <el-input
            v-model="projectFrom.title"
            placeholder="请输入项目名称"
            maxlength="50"
            show-word-limit
            :disabled="flag"
          ></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="'承担院系\n（公章）'"
        prop="hostDepartment"
        class="cachet"
      >
        <el-select
          v-model="projectFrom.hostDepartment"
          placeholder="请选择院系"
          :disabled="flag"
        >
          <el-option
            v-for="item in hostDepartments"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="院系负责人" prop="departmentPersonId">
        <el-select
          ref="depart"
          v-model="projectFrom.departmentPersonId"
          filterable
          remote
          placeholder="请选择院系负责人"
          :remote-method="getUserDepartmentList"
          @focus="userDepartmentClick"
          :disabled="flag"
        >
          <el-option
            v-for="item in departmentPersonIds"
            :key="item.id"
            :label="item.realName + '_' + item.mobile"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目负责人" prop="principalPersonId">
        <el-select
          ref="princ"
          v-model="projectFrom.principalPersonId"
          filterable
          remote
          placeholder="请选择项目负责人"
          :remote-method="getUserPrincipalList"
          @focus="userPrincipalClick"
          :disabled="flag"
        >
          <el-option
            v-for="item in principalPersonIds"
            :key="item.id"
            :label="item.realName + '_' + item.mobile"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目执行人" prop="executivePersonId">
        <el-select
          ref="execu"
          v-model="projectFrom.executivePersonId"
          filterable
          remote
          placeholder="请选择项目执行人"
          :remote-method="getUserExecutiveList"
          @focus="userExecutiveClick"
          :disabled="flag"
        >
          <el-option
            v-for="item in executivePersonIds"
            :key="item.id"
            :label="item.realName + '_' + item.mobile"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统筹管理部门" prop="managementDepartment">
        <el-select
          v-model="projectFrom.managementDepartment"
          placeholder="请选择统筹管理部门"
          :disabled="flag"
        >
          <el-option
            v-for="item in managementDepartments"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训目标" prop="trainingTarget">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.trainingTarget"
          placement="top"
          :open-delay="800"
        >
          <el-input
            v-model="projectFrom.trainingTarget"
            placeholder="请输入培训目标"
            :disabled="flag"
          ></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="培训人数" prop="trainingNumber" class="el-maxl">
        <el-input
          v-model.number="projectFrom.trainingNumber"
          placeholder="请输入培训人数"
          maxlength="11"
          show-word-limit
          :disabled="flag"
        ></el-input>
      </el-form-item>
      <el-form-item label="计划开班时间" prop="planBegin">
        <el-date-picker
          v-model="projectFrom.planBegin"
          type="date"
          placeholder="请选择计划开班时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="expireTimeOption"
          :disabled="flag"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培训方式" prop="trainingStyle" class="trainingStyle">
        <el-select
          v-model="projectFrom.trainingStylef"
          multiple
          placeholder="请选择培训方式"
          :disabled="flag"
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
        <el-form-item label="集中培训" prop="periodFocus">
          {{ projectFrom.dayFocus * 6 }}
        </el-form-item>
        <el-form-item label="跟岗学习" prop="periodFollow">
          {{ projectFrom.dayFollow * 6 }}
        </el-form-item>
        <el-form-item label="其他学习" prop="periodOther">
          {{ projectFrom.dayOther * 6 }}
        </el-form-item>
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
        <el-form-item label="集中培训" prop="dayFocus" class="el-maxl">
          <el-input
            v-model="projectFrom.dayFocus"
            maxlength="5"
            show-word-limit
            placeholder="请输入集中培训"
            :disabled="flag"
          ></el-input>
        </el-form-item>
        <el-form-item label="跟岗学习" prop="dayFollow" class="el-maxl">
          <el-input
            v-model="projectFrom.dayFollow"
            maxlength="5"
            show-word-limit
            placeholder="请输入跟岗学习"
            :disabled="flag"
          ></el-input>
        </el-form-item>
        <el-form-item label="其他学习" prop="dayOther" class="el-maxl">
          <el-input
            v-model="projectFrom.dayOther"
            maxlength="5"
            show-word-limit
            placeholder="请输入其他学习"
            :disabled="flag"
          ></el-input>
        </el-form-item>
        <el-form-item label="合计">
          {{
            sum(
              projectFrom.dayFocus == "" ? 0 : projectFrom.dayFocus,
              projectFrom.dayFollow == "" ? 0 : projectFrom.dayFollow,
              projectFrom.dayOther == "" ? 0 : projectFrom.dayOther
            )
          }}
        </el-form-item>
      </el-form-item>
      <el-form-item label="培训层次" prop="trainingLevel">
        <el-select
          v-model="projectFrom.trainingLevel"
          placeholder="请选择培训层次"
          :disabled="flag"
        >
          <el-option
            v-for="item in trainingLevels"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训类别" prop="trainingType">
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
          :disabled="flag"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="实施年度" prop="implementationYear">
        <el-date-picker
          v-model="projectFrom.implementationYear"
          :picker-options="expireTimeOption2"
          type="year"
          placeholder="请选择实施年度"
          format="yyyy"
          value-format="yyyy"
          :disabled="flag"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培训对象" prop="trainee">
        <el-cascader
          v-model="projectFrom.traineef"
          :options="trainees"
          :props="{
            expandTrigger: 'hover',
            value: 'id',
            label: 'title',
            children: 'childrenList',
          }"
          placeholder="请选择培训对象"
          :disabled="flag"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="培训基地" prop="trainingBase" class="el-maxl">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.trainingBase"
          placement="top"
          :open-delay="800"
        >
          <el-input
            v-model="projectFrom.trainingBase"
            maxlength="50"
            show-word-limit
            placeholder="请输入培训基地"
            :disabled="flag"
          ></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="项目级别" prop="level">
        <el-select
          v-model="projectFrom.level"
          placeholder="请选择项目级别"
          :disabled="flag"
        >
          <el-option label="国家" :value="1"></el-option>
          <el-option label="省级" :value="2"></el-option>
          <el-option label="市级" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="电子签名"
        class="el-from-cell3"
        prop="electronicSignature"
      >
        <div class="orginUploader">
          <el-upload
            class="avatar-uploader1"
            :action="saveUrl"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="text-align: left"
            :disabled="flag"
          >
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
              <div class="imang_hover">
                <span>更换电子签名</span>
              </div>
            </div>
            <div v-else class="image-con image-name">
              <!-- <div class="imang_hover"> -->
              <span>上传电子签名</span>
              <!-- </div> -->
            </div>
          </el-upload>
          <!-- <div class="image-detail">
              <p>
                图片最佳尺寸为200x200px
                <br />大小不超过1MB
                <br />支持jpg、jpeg、png、bmp等格式图片
              </p>
          </div>-->
        </div>
      </el-form-item>
      <el-form-item label="资源整合" prop="resource" class="resource">
        <el-tooltip
          class="item"
          effect="light"
          :content="projectFrom.resource"
          placement="top"
          :open-delay="800"
        >
          <el-input
            v-model="projectFrom.resource"
            placeholder="请输入资源整合"
            :disabled="flag"
          ></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="经费来源" prop="budgetSource" class="expenditure">
        <el-select
          v-model="projectFrom.budgetSource"
          placeholder="请选择经费来源"
          :disabled="flag"
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
        <el-form-item
          class="el-maxl"
          :label="index == 0 ? '考核维度' : ''"
          :prop="`latitudes.${index}.latitude`"
          :rules="{
            required: true,
            message: '请输入考核维度',
            trigger: 'blur',
          }"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item.latitude"
            placement="top"
            :open-delay="800"
          >
            <el-input
              v-model="item.latitude"
              maxlength="50"
              show-word-limit
              placeholder="请输入考核维度"
              :disabled="flag"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          class="el-maxl"
          :label="index == 0 ? '所占比例%' : ''"
          :prop="`latitudes.${index}.percent`"
          :rules="{
            required: true,
            message: '请输入正确所占比例%',
            trigger: 'blur',
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/,
          }"
        >
          <el-input
            v-model="item.percent"
            maxlength="5"
            show-word-limit
            placeholder="请输入所占比例%"
            :disabled="flag"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="index == 0 ? '具体内容' : ''"
          :prop="`latitudes.${index}.content`"
          :rules="{
            required: true,
            message: '请输入具体内容',
            trigger: 'blur',
          }"
          class="el-from-row3-last el-maxl"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item.content"
            placement="top"
            :open-delay="800"
          >
            <el-input
              v-model="item.content"
              maxlength="1000"
              show-word-limit
              placeholder="请输入具体内容"
              :disabled="flag"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <i
          v-if="!flag"
          class="el-icon-error el-from-icoDel"
          @click="latitudeDel(index)"
        ></i>
      </el-form-item>

      <el-button v-if="!flag" class="d-add btn-add1" @click="latitudeAdd"
        >添加</el-button
      >

      <el-form-item
        :label="'经费预算标准\n（元/人）'"
        prop="budgetStandard"
        class="cachet border-top el-maxl"
        :style="style2"
      >
        <el-input
          v-model="projectFrom.budgetStandard"
          maxlength="10"
          show-word-limit
          placeholder="请输入经费预算标准"
          :disabled="flag"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="'经费预算总额\n（万元）'"
        prop="budgetAmount"
        class="cachet border-top el-maxl"
        :style="style"
      >
        <el-input
          v-model="projectFrom.budgetAmount"
          maxlength="10"
          show-word-limit
          placeholder="请输入经费预算总额"
          :disabled="flag"
        ></el-input>
      </el-form-item>

      <el-form-item
        class="el-from-row5"
        v-for="(item2, index) in projectFrom.expenditures"
        :key="'info' + index"
      >
        <el-form-item
          :label="index == 0 ? '具体经费支出名目' : ''"
          :prop="`expenditures.${index}.expenditure`"
          :rules="{
            required: true,
            message: '请输入具体经费支出名目',
            trigger: 'blur',
          }"
          class="row5-expenditure el-maxl"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item2.expenditure"
            placement="top"
            :open-delay="800"
          >
            <div class="row5-index">{{ index + 1 }}</div>
            <el-input
              v-model="item2.expenditure"
              maxlength="50"
              show-word-limit
              placeholder="请输入具体经费支出名目"
              :disabled="flag"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          class="el-maxl"
          :label="index == 0 ? '预算经费支出额度（万元）' : ''"
          :prop="`expenditures.${index}.amount`"
          :rules="{
            required: true,
            message: '请输入正确预算经费支出额度',
            trigger: 'blur',
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/,
          }"
        >
          <el-input
            v-model="item2.amount"
            maxlength="10"
            show-word-limit
            placeholder="请输入预算经费支出额度（万元）"
            :disabled="flag"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="index == 0 ? '经费支出说明' : ''"
          :prop="`expenditures.${index}.description`"
          :rules="{
            required: true,
            message: '请输入经费支出说明',
            trigger: 'blur',
          }"
          class="el-from-row5-last el-maxl"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item2.description"
            placement="top"
            :open-delay="800"
          >
            <el-input
              v-model="item2.description"
              maxlength="200"
              show-word-limit
              placeholder="请输入经费支出说明"
              :disabled="flag"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <i
          v-if="!flag"
          class="el-icon-error el-from-icoDel"
          @click="expenditureDel(index)"
        ></i>
      </el-form-item>
      <el-button v-if="!flag" class="d-add btn-add1" @click="expenditureAdd"
        >添加</el-button
      >

      <el-form-item
        label="指导思想"
        prop="guidingIdeology"
        class="el-from-row2"
      >
        <el-input
          type="textarea"
          v-model="projectFrom.guidingIdeology"
          placeholder="请输入指导思想"
          :rows="6"
          maxlength="1000"
          show-word-limit
          :readonly="flag"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="需求分析"
        prop="requirementAnalysis"
        class="el-from-row2"
      >
        <el-input
          type="textarea"
          v-model="projectFrom.requirementAnalysis"
          placeholder="请输入需求分析"
          :rows="6"
          maxlength="1000"
          show-word-limit
          :readonly="flag"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="培训特色与创新"
        prop="trainingInnovations"
        class="feature el-from-row2"
      >
        <el-input
          type="textarea"
          v-model="projectFrom.trainingInnovations"
          placeholder="请输入培训特色与创新"
          :rows="6"
          maxlength="1000"
          show-word-limit
          :readonly="flag"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="附件"
        class="el-from-row el-form-rowRight"
        prop="fileIds"
      >
        <el-button
          v-if="!flag"
          size="medium"
          icon="el-icon-plus"
          class="btn-add1"
          @click="addFileList"
          >从资源库选择</el-button
        >
        <ul>
          <li
            v-for="(item, index) in showFileName"
            :key="index"
            @click="downFiled(item)"
          >
            <span class="file-style">{{ item.fileName }}</span>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="备注" class="el-from-row el-maxl">
        <el-input
          v-model="projectFrom.remark"
          maxlength="100"
          show-word-limit
          placeholder="请输入备注"
          :disabled="flag"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-dialog
      title="资源列表"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="closecourseForm"
      :close-on-click-modal="false"
      ref="fileList"
    >
      <div style="margin-bottom: 10px">
        <el-input
          v-model="dialogFileName"
          placeholder="通过资源名称搜索"
          clearable
          style="width: 50%"
        ></el-input>
        <el-button type="primary" @click="getOssList('search')">搜索</el-button>
      </div>
      <el-table
        :data="fileListTable"
        v-loading="loading"
        ref="multipleTable"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column prop="fileName" label="资源名称"></el-table-column>
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
      <div style="margin-top: 20px" class="select-file">
        <el-button @click="closecourseForm">取消</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </div>
    </el-dialog>
    <div v-if="!flag">
      <el-button
        v-if="projectFrom.status != 4 || projectFrom.status != 1"
        type="primary"
        @click="add('add')"
        >保 存</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl + "/",
      //判断是否复制，复制id制空
      isClone: this.$route.query.isClone,
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
      dialogFileName: "",
      dialogVisible: false,
      fileListTable: [], //资源文件列表
      fileIdList: [], //选中的资源文件
      showFileName: [], //选中的文件渲染列表
      loading: false,
      listPage: {
        pageSize: 5,
        total: 0,
        pageNo: 1,
      },
      // ---表单验证---
      projectData: {
        hostDepartment: [
          {
            required: true,
            message: "请选择承担院系公章",
            trigger: "blur",
          },
        ],
        executivePersonId: [
          {
            required: true,
            message: "请选择项目执行人",
            trigger: "blur",
          },
        ],
        latitudes: [
          { required: true, message: "请输入考核维度", trigger: "blur" },
        ],
        trainee: [
          { required: true, message: "请选择培训对象", trigger: "blur" },
        ],
        percent: [
          { required: true, message: "请输入所占比例%", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入具体内容", trigger: "blur" },
        ],
        expenditures: [
          {
            required: true,
            message: "请输入具体经费支出名目",
            trigger: "blur",
          },
        ],
        description: [
          { required: true, message: "请输入经费支出说明", trigger: "blur" },
        ],
        trainingTarget: [
          { required: true, message: "请输入培训目标", trigger: "blur" },
        ],
        trainingLevel: [
          { required: true, message: "请选择培训层次", trigger: "blur" },
        ],
        trainingType: [
          { required: true, message: "请选择培训类别", trigger: "blur" },
        ],
        trainingBase: [
          { required: true, message: "请输入培训基地", trigger: "blur" },
        ],
        resource: [
          { required: true, message: "请输入资源整合", trigger: "blur" },
        ],
        requirementAnalysis: [
          { required: true, message: "请输入需求分析", trigger: "blur" },
        ],
        trainingInnovations: [
          { required: true, message: "请输入培训特色与创新", trigger: "blur" },
        ],
        budgetSource: [
          {
            required: true,
            message: "请输入经费来源",
            trigger: "blur",
          },
        ],
        budgetStandard: [
          {
            required: true,
            message: "请输入正确经费预算标准",
            trigger: "blur",
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/,
          },
        ],
        budgetAmount: [
          {
            required: true,
            message: "请输入正确经费预算总额",
            trigger: "blur",
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/,
          },
        ],
        guidingIdeology: [
          { required: true, message: "请输入指导思想", trigger: "blur" },
        ],
        budget: [
          { required: true, message: "请输入资金预算", trigger: "blur" },
        ],
        contactPersonId: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        dayFocus: [
          {
            required: true,
            message: "请输入正确集中培训时长",
            trigger: "blur",
            pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/,
          },
        ],
        dayFollow: [
          {
            required: true,
            message: "请输入正确跟岗学习时长",
            trigger: "blur",
            pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{0,4})))$/,
          },
        ],
        dayOther: [
          {
            required: true,
            message: "请输入正确其它学习时长",
            trigger: "blur",
            pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,4})))$/,
          },
        ],
        departmentPersonId: [
          { required: true, message: "请输入部门负责人", trigger: "blur" },
        ],
        electronicSignature: [
          { required: true, message: "请输入电子签名", trigger: "blur" },
        ],
        fileIds: [{ required: true, message: "请上传附件", trigger: "blur" }],
        implementationYear: [
          { required: true, message: "请选择实施年度", trigger: "blur" },
        ],
        level: [{ required: true, message: "请选择项目级别", trigger: "blur" }],
        managementDepartment: [
          { required: true, message: "请选择管理部门", trigger: "blur" },
        ],
        number: [
          { required: true, message: "请输入项目编号", trigger: "blur" },
        ],
        periodFocus: [
          { required: true, message: "请输入学时集中培训", trigger: "blur" },
        ],
        periodFollow: [
          { required: true, message: "请输入学时跟岗学习", trigger: "blur" },
        ],
        periodOther: [
          { required: true, message: "请输入学时其它学习", trigger: "blur" },
        ],
        planBegin: [
          { required: true, message: "请输入计划开班时间", trigger: "blur" },
        ],
        principalDepartment: [
          { required: true, message: "请输入负责部门", trigger: "blur" },
        ],
        principalPersonId: [
          { required: true, message: "请输入项目负责人", trigger: "blur" },
        ],
        source: [
          { required: true, message: "请输入项目来源", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入项目标题", trigger: "blur" }],
        trainingNumber: [
          { required: true, message: "请输入培训人数", trigger: "blur" },
        ],
        trainingStyle: [
          { required: true, message: "请输入培训方式", trigger: "blur" },
        ],
      },
      style: "border-left:none!important;border-right:1px solid #ccc",
      style2: "border-right:1px solid #ccc",
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 86400000;
        },
      },
      expireTimeOption2: {
        disabledDate(date) {
          return date.getTime() < Date.now();
        },
      },
    };
  },
  mounted() {
    this.projectFrom.id = this.$route.query.id || "";
    if (this.projectFrom.id != "") {
      this.getDetail(this.projectFrom.id);
    } else {
      this.projectFrom.title = this.$route.query.title;
    }
    // this.getdeList();
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
        let tempVal = parseFloat(value).toFixed(5);
        realVal = tempVal.substring(0, tempVal.length - 1);
      } else {
        realVal = "--";
      }
      return realVal;
    },
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    downFiled(item) {
      var id = item.fileId ? item.fileId : item.id;
      window.location.href =
        this.$setting.baseURL + `/oss/download/downloadById?fileId=${id}`;
    },
    addFileList() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.multipleTable.selection.splice(
          0,
          this.$refs.multipleTable.selection.length
        );
        for (var i of this.fileListTable) {
          for (var j of this.showFileName) {
            if (j.fileId == i.id || j.id == i.id) {
              this.$refs.multipleTable.selection.push(i);
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
    getOssList(val) {
      if (val == "search") {
        this.listPage.pageNo = 1;
      }
      let par = {
        fileName: this.dialogFileName,
        pageNo: this.listPage.pageNo,
        pageSize: this.listPage.pageSize,
      };
      if (this.userId == 1) {
        this.$http
          .post("/oss/oss/pageList", par)
          .then((res) => {
            this.fileListTable = res.data.records;
            this.listPage.pageNo = res.data.current;
            this.listPage.total = res.data.total;
          })
          .catch((msg) => {});
      } else {
        this.$http
          .post("/oss/oss/managerPageList", par)
          .then((res) => {
            this.fileListTable = res.data.records;
            this.listPage.pageNo = res.data.current;
            this.listPage.total = res.data.total;
          })
          .catch((msg) => {});
      }
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
      if (this.projectFrom.latitudes.length > 14) {
        this.$message({
          message: "考核维度最多15条",
          type: "warning",
        });
        return;
      }
      this.projectFrom.latitudes.push({
        latitude: "",
        percent: "",
        content: "",
      });
    },
    expenditureAdd() {
      if (this.projectFrom.expenditures.length > 14) {
        this.$message({
          message: "经费支出名目最多15条",
          type: "warning",
        });
        return;
      }
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
      return new Promise((reslove, reject) => {
        this.$http
          .post("/api/upms/user/getUserList", {
            pageNo: 1,
            pageSize: 7,
            name: search || "",
          })
          .then((res) => reslove(res.data));
      });
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
    getDetail(val) {
      let par = {
        projectId: val,
      };
      this.$http
        .post("/api/edu/project/getProjectInfo", par)
        .then((res) => {
          localStorage.setItem("projectStatus", res.data.status);
          // 搜索框逻辑
          // 必须进行设置操作，否则搜索无法显示名称
          this.departmentPersonIds.push({
            id: res.data.departmentPersonId,
            realName: res.data.departmentPerson,
            mobile: res.data.departmentPersonMobile,
          });
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
          this.projectFrom.traineef = res.data.trainee;
          if (this.isClone) {
            this.projectFrom.title = this.projectFrom.title + "(副本)";
          }
          this.projectFrom = { ...this.projectFrom };
        })
        .catch((msg) => {});
    },
    //恢复草稿
    saveDraft() {
      if (JSON.parse(localStorage.getItem("draft"))) {
        this.projectFrom = JSON.parse(localStorage.getItem("draft"));
        this.showFileName = this.projectFrom.fileList;
        this.departmentPersonIds.push({
          id: this.projectFrom.departmentPersonId
            ? this.projectFrom.departmentPersonId
            : null,
          realName: this.projectFrom.departmentPerson
            ? this.projectFrom.departmentPerson
            : null,
          mobile: this.projectFrom.departmentPersonMobile
            ? this.projectFrom.departmentPersonMobile
            : null,
        });
        this.principalPersonIds.push({
          id: this.projectFrom.principalPersonId
            ? this.projectFrom.principalPersonId
            : null,
          realName: this.projectFrom.principalPerson
            ? this.projectFrom.principalPerson
            : null,
          mobile: this.projectFrom.principalPersonMobile
            ? this.projectFrom.principalPersonMobile
            : null,
        });
        this.executivePersonIds.push({
          id: this.projectFrom.executivePersonId
            ? this.projectFrom.executivePersonId
            : null,
          realName: this.projectFrom.executivePerson
            ? this.projectFrom.executivePerson
            : null,
          mobile: this.projectFrom.executivePersonMobile
            ? this.projectFrom.executivePersonMobile
            : null,
        });
        this.projectFrom.title = this.$route.query.title;
      } else {
        this.projectFrom = {
          level: 1,
          id: "",
          dayFocus: "",
          dayFollow: "",
          dayOther: "",
          latitudes: [{ latitude: "", percent: "", content: "" }],
          expenditures: [{ expenditure: "", amount: "", description: "" }],
        };
      }
    },
    //保存时两个状态，1.保存到列表，2.保存到草稿
    async add(item) {
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
      if (this.isClone) {
        this.projectFrom.id = "";
        this.projectFrom.timetablePublish = 0;
      }
      if (item == "add") {
        this.$refs["projectFrom"].validate((valid) => {
          if (valid) {
            this.$http
              .post("/api/edu/project/addOrEditProject", this.projectFrom)
              .then(async (res) => {
                this.$message({
                  message: res.message,
                  type: "success",
                });
                this.$emit("getRouteLeave", true);
                this.$router.push({ path: "/project" });
              })
              .catch((msg) => {});
          } else {
            this.$message.error("您的方案信息未填写完整");
          }
        });
      } else {
        //直接ref获取选择人员名字和电话赋值，防止恢复草稿时只显示id
        if (this.$refs.depart.query != "") {
          this.projectFrom.departmentPerson = this.$refs.depart.query.split(
            "_"
          )[0];
          this.projectFrom.departmentPersonMobile = this.$refs.depart.query.split(
            "_"
          )[1];
        }
        if (this.$refs.princ.query != "") {
          this.projectFrom.principalPerson = this.$refs.princ.query.split(
            "_"
          )[0];
          this.projectFrom.principalPersonMobile = this.$refs.princ.query.split(
            "_"
          )[1];
        }
        if (this.$refs.execu.query != "") {
          this.projectFrom.executivePerson = this.$refs.execu.query.split(
            "_"
          )[0];
          this.projectFrom.executivePersonMobile = this.$refs.execu.query.split(
            "_"
          )[1];
        }
        localStorage.setItem("draft", JSON.stringify(this.projectFrom));
        this.$message.success("草稿保存成功");
        this.$emit("getRouteLeave", true);
      }
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
.overhidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #000;
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
  position: relative;
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
  .el-form-item__error {
    top: 95%;
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
    width: 119px !important;
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
  /deep/.el-textarea__inner {
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
  }
}
.el-maxl {
  /deep/.el-input__suffix {
    top: 17px;
  }
}
.saveDraft {
  position: absolute;
  right: 115px;
  top: -122px;
}
</style>
