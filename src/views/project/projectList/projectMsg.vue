<template>
  <div>
    <div style="position: relative;margin-top:20px;">
      <el-button class="exportBtn" type="success" @click="exportWord">项目导出</el-button>
      <el-tabs v-model="proName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="detail"></el-tab-pane>
        <el-tab-pane label="专家团队" name="expert"></el-tab-pane>
        <el-tab-pane label="管理团队" name="manage"></el-tab-pane>
        <el-tab-pane label="课程设置" name="course"></el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <detail @detail="getDetail" v-show="proName == 'detail'" ref="detail"></detail>
      <expert @listTable="getExpert" v-show="proName == 'expert'" ref="expert"></expert>
      <manage @manage="getManage" v-show="proName == 'manage'" ref="manage"></manage>
      <course @course="getCourse" v-show="proName == 'course'" ref="course"></course>
    </div>
  </div>
</template>
<script>
import detail from "./projectDetailMSg";
import expert from "./expertMsg";
import manage from "./manageMsg";
import course from "./courseMsg";
import docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";
import ImageModule from "docxtemplater-image-module"; //图片有关的
import axios from "axios";
export default {
  components: {
    detail,
    expert,
    manage,
    course
  },
  data() {
    return {
      proName: "detail",
      imgUrl: this.$setting.imageUrl,
      title: "",
      detailMsg: {},
      expertMsg: [],
      manageMsg: [],
      courseMsg: []
    };
  },
  methods: {
    getDetail(detail) {
      detail.dayFocus_sum = detail.dayFocus * 6;
      detail.dayFollow_sum = detail.dayFollow * 6;
      detail.dayOther_sum = detail.dayOther * 6;
      detail.dayAll_sum = detail.dayFocus_sum + detail.dayFollow_sum + detail.dayOther_sum;
      detail.dayTime_sum = detail.dayFocus + detail.dayFollow + detail.dayOther;
      detail.level = detail.level === 1 ? "国家" : detail.level === 2 ? "省级" : "市级";
      detail.imagePath = this.imgUrl + detail.electronicSignature;
      for (let a in detail.expenditures) {
        detail.expenditures[a].index = parseInt(a) + 1;
      }
      this.detailMsg = detail;
      // console.log("detailMsg :")
      // console.log(this.detailMsg)
    },
    getExpert(expert) {
      for (let i in expert) {
        expert[i].gender = expert[i].gender == 1 ? "男" : "女";
        if (expert[i].avatar) {
          expert[i].avatars = this.imgUrl + "/" + expert[i].avatar;
        } else {
          expert[i].avatars = "";
        }
        expert[i].profession = expert[i].profession ? expert[i].profession : "";
        expert[i].education = expert[i].education ? expert[i].education : "";
      }
      this.expertMsg = expert;
      // console.log("expert");
      // console.log(this.expertMsg);
    },
    getManage(manage) {
      for (let i in manage) {
        manage[i].gender = manage[i].gender == 1 ? "男" : "女";
        if (manage[i].avatar) {
          manage[i].avatars = this.imgUrl + manage[i].avatar;
        } else {
          manage[i].avatars = "";
        }
        manage[i].profession = manage[i].profession ? manage[i].profession : "";
        manage[i].education = manage[i].education ? manage[i].education : "";
        manage[i].manger = manage[i].manger ? manage[i].manger : "";
      }
      this.manageMsg = manage;
      // console.log("manage");
      // console.log(this.manageMsg);
    },
    getCourse(course) {
      this.courseMsg = course;
      // console.log("course");
      // console.log(this.courseMsg);
    },
    handleClick(tab, event) {},
    async exportWord() {
      let that = this;
      // 需要提前获取，如果使用异步获取，需要doc.resolveData，目前这个方法有问题，未解决
      // 不能使用$http.get
      let imageData = "";
      try {
        imageData = await axios
          .get(this.detailMsg.imagePath, { responseType: "arraybuffer" })
          .then(json => {
            return json.data;
          });
      } catch (error) {
        console.log("文件下载出错", error);
      }

      // 读取并获得模板文件的二进制内容
      JSZipUtils.getBinaryContent("input.docx", function(error, content) {
        // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
        // 抛出异常
        if (error) {
          throw error;
        }
        var opts = {};
        opts.centered = false;
        opts.getImage = function(tagValue, tagName) {
          // return new Promise(function(resolve, reject) {
          //   JSZipUtils.getBinaryContent(tagValue, function(error, content) {
          //     if (error) {
          //       return reject(error);
          //     }
          //     console.log(content);
          //     // return resolve(that.arrayBufferToBase64(content));
          //     return resolve(content);
          //   });
          // });
          return imageData;
        };
        //图片有关代码，没有图片的可以删除
        opts.getSize = function(img, tagValue, tagName) {
          // FOR FIXED SIZE IMAGE :
          return [200, 200]; //图片大小 （这个可以写成动态的，开发文档上有）
          // return new Promise(function (resolve, reject) {
          //   var image = new Image();
          //   image.src = url;
          //   image.onload = function () {
          //     resolve([image.width, image.height]);
          //   };
          //   image.onerror = function (e) {
          //     console.log('img, tagValue, tagName : ', img, tagValue, tagName);
          //     reject(e);
          //   }
          // });
        };
        var imageModule = new ImageModule(opts);
        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docxtemplater实例对象
        let doc = new docxtemplater().loadZip(zip).attachModule(imageModule);
        // .compile();

        // 设置模板变量的值
        doc.setData({
          ...that.detailMsg,
          trainingStyleListTable: that.detailMsg.trainingStyleList,
          budgetSourceTable: that.detailMsg.budgetSource,
          fileListTable: that.detailMsg.fileList,
          latitudesTable: that.detailMsg.latitudes,
          expendituresTable: that.detailMsg.expenditures,
          expertMsgTable: that.expertMsg,
          manageMsgTable: that.manageMsg,
          courseMsgTable: that.courseMsg
        });

        try {
          // 用模板变量的值替换所有模板变量
          doc.render();
        } catch (error) {
          // 抛出异常
          let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties
          };
          console.log(JSON.stringify({ error: e }));
          throw error;
        }

        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, that.detailMsg.title + ".docx");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.exportBtn {
  position: absolute;
  top: -5px;
  right: 0px;
  z-index: 1;
}
</style>