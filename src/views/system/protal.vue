<!-- 门户配置 -->
<template>
  <div class="protal">
    <div class="l-mod-tool">
      <h2>平台信息设置</h2>
    </div>
    <el-tabs v-model="protalName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="rules"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="网站名称:" prop="title">
            <el-input v-model.trim="addForm.title" placeholder="请输入网站名称"></el-input>
          </el-form-item>
          <el-form-item label="页眉logo:" prop="logo" class="unload-row">
            <el-upload
              class="avatar-uploader1"
              :action="saveUrl"
              :show-file-list="false"
              accept=".jpg, .jpeg, .png"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              style="text-align:left;"
            >
              <div v-if="addForm.logo" class="image-con">
                <img :src="imgUrl + addForm.logo" class="avatar" />
                <div class="imang_hover">
                  <span>更换图片</span>
                </div>
              </div>
              <div v-else class="image-icon">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div class="imang_hover">
                  <span>上传图片</span>
                </div>
              </div>
              <div class="image-detail">
                <p style>
                  logo最佳尺寸为200*30px
                  <br />大小不超过1MB
                  <br />支持jpg、jpeg、png、bmp格式图片
                </p>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="页脚logo:" prop="footLogo" class="unload-row">
            <el-upload
              class="avatar-uploader1"
              :action="saveUrl"
              :show-file-list="false"
              accept=".jpg, .jpeg, .png"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload1"
              style="text-align:left;"
            >
              <div v-if="addForm.footLogo" class="image-con">
                <img :src="imgUrl + addForm.footLogo" class="avatar" />
                <div class="imang_hover">
                  <span>更换图片</span>
                </div>
              </div>
              <div v-else class="image-icon">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div class="imang_hover">
                  <span>上传图片</span>
                </div>
              </div>
              <div class="image-detail">
                <p style>
                  logo最佳尺寸为200*30px
                  <br />大小不超过1MB
                  <br />支持jpg、jpeg、png、bmp格式图片
                </p>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="版权信息:" prop="copyright">
            <el-input v-model.trim="addForm.copyright" placeholder="请输入版权信息" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-button type="primary" @click="addConfig">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="友情链接" name="second">
        <div class="table-toor">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-plus"
            @click="openDialog('flag')"
          >添加友情链接</el-button>
        </div>
        <el-table :data="tableList" style="width: 100%">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="link" label="地址"></el-table-column>
          <el-table-column prop="createdDt" label="添加时间">
            <template slot-scope="scope">{{ scope.row.createdDt | moment("YYYY-MM-DD HH:mm") }}</template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="openDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="medium" @click="delRow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="m-pages">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,total"
            :current-page.sync="listPage.pageNo"
            :page-size="listPage.pageSize"
            :total="listPage.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="banner设置" name="third">
        <div class="table-toor">
          <el-button type="primary" size="medium" @click="addBanner('add')">添加banner</el-button>
        </div>
        <el-table :data="bannerList" style="width: 100%">
          <el-table-column label="封面">
            <template slot-scope="scope">
              <img :src="imgUrl+scope.row.path" alt class="bannerImg" />
            </template>
          </el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">{{ scope.row.createTime | moment("YYYY-MM-DD HH:mm") }}</template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="addBanner(scope.row)">修改</el-button>
              <el-button type="text" size="medium" @click="delBanner(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="m-pages">
          <el-pagination
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            layout="prev, pager, next,total"
            :current-page.sync="listPage2.pageNo"
            :page-size="listPage2.pageSize"
            :total="listPage2.total"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      class="link-con"
    >
      <el-form
        ref="linkForm"
        :rules="rulesLink"
        :model="linkForm"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="名称:" prop="name">
          <el-input v-model.trim="linkForm.name" placeholder="请输入链接名称"></el-input>
        </el-form-item>
        <el-form-item label="链接地址:" prop="link">
          <el-input v-model.trim="linkForm.link" placeholder="请输入链接地址">
            <template slot="prepend">http://</template>
          </el-input>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="dialogTitle == '编辑友情链接'" type="primary" @click="editLink">保存</el-button>
          <el-button v-else type="primary" @click="addLink">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="banner"
      :visible.sync="dialogVisible2"
      width="620px"
      :before-close="handleClose2"
      class="link-con"
    >
      <el-form
        ref="bannerForm"
        :rules="bannerRulse"
        :model="bannerForm"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="banner设置:" prop="path" class="unload-row">
          <el-upload
            class="avatar-uploader1 banner-upload"
            :action="saveUrl"
            :show-file-list="false"
            accept=".jpg, .jpeg, .png"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload2"
            style="text-align:left;"
          >
            <div v-if="bannerForm.path" class="image-con">
              <img :src="imgUrl + bannerForm.path" class="avatar" />
              <div class="imang_hover">
                <span>更换图片</span>
              </div>
            </div>
            <div v-else class="image-icon">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div class="imang_hover">
                <span>上传图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item align="right" class="dialog-btns">
          <el-button @click="handleClose2">取消</el-button>
          <el-button v-if="banner == '修改banner'" type="primary" @click="editBanner">保存</el-button>
          <el-button v-else type="primary" @click="saveBanner">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { request } from "http";
export default {
  data() {
    return {
      protalName: "first",
      saveUrl: this.$setting.baseURL + "/oss/upload/upload",
      imgUrl: this.$setting.imageUrl + "/",
      addForm: {
        logo: "",
        title: "",
        copyright: "",
        footLogo: ""
      },
      tableList: [],
      bannerList: [],
      bannerForm: {
        path: "",
        size: "",
        title: ""
      },
      banner: "",
      bannerId: "",
      listPage: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      listPage2: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      linkForm: {
        name: "",
        link: "",
        id: ""
      },
      dialogVisible: false,
      dialogVisible2: false,
      dialogTitle: "",
      links: [{ name: "", link: "" }],
      rowFlag: false,
      rules: {
        title: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
        logo: [
          { required: true, message: "请选择页眉logo", trigger: "change" }
        ],
        // footLogo: [
        //   { required: true, message: "请选择页脚logo", trigger: "change" }
        // ],
        copyright: [
          { required: true, message: "请输入版权信息", trigger: "blur" }
        ]
      },
      rulesLink: {
        name: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
        link: [{ required: true, message: "请输入网站名称", trigger: "blur" }]
      },
      bannerRulse: {
        path: [{ required: true, message: "请选择图片", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      this.listPage.pageSize = val;
      this.getLinks();
    },
    handleCurrentChange(val) {
      this.listPage.pageNo = val;
      this.getLinks();
    },
    handleSizeChange2(val) {
      this.listPage2.pageSize = val;
      this.getBannerList();
    },
    handleCurrentChange2(val) {
      this.listPage2.pageNo = val;
      this.getBannerList();
    },
    handleAvatarSuccess(res, file) {
      let size = file.size / 1024 / 1024 < 2;
      if (file.raw.type != "image/jpeg" && file.raw.type != "image/png") {
        this.$message.error("请选择图片的格式为 jpg或png");
        return false;
      }
      if (!size) {
        this.$message.error("上传图片大小不得超过1MB");
        return false;
      }
      this.addForm.logo = res.data.path;
    },
    beforeAvatarUpload(file) {},
    handleAvatarSuccess1(res, file) {
      let size = file.size / 1024 / 1024 < 2;
      if (file.raw.type != "image/jpeg" && file.raw.type != "image/png") {
        this.$message.error("请选择图片的格式为 jpg或png");
        return false;
      }
      if (!size) {
        this.$message.error("上传图片大小不得超过1MB");
        return false;
      }
      this.addForm.footLogo = res.data.path;
    },
    beforeAvatarUpload1(file) {},
    handleClick(tab, event) {
      if (tab == "first") {
        this.getConfig();
      } else if (tab == "second") {
        this.getLinks();
      } else {
        this.getBannerList();
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.linkForm.name = "";
      this.linkForm.link = "";
      this.linkForm.id = "";
    },
    handleClose2() {
      this.dialogVisible2 = false;
      this.bannerForm.path = "";
    },
    //打开添加与编辑弹窗
    openDialog(val) {
      if (val == "flag") {
        this.dialogTitle = "添加友情链接";
        this.linkForm = {};
      } else {
        this.dialogTitle = "编辑友情链接";
        this.linkForm.name = val.name;
        this.linkForm.link = val.link.replace("http://", "");
        this.linkForm.id = val.id;
      }
      this.dialogVisible = true;
    },
    // 删除行友情链接
    delRow(val) {
      let par = {
        id: val
      };
      this.$http
        .post("/api/sys/delLinks", par)
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getLinks();
        })
        .catch(msg => {});
    },
    // 编辑友情链接
    editLink() {
      let par = {
        name: this.linkForm.name,
        link: "http://" + this.linkForm.link,
        id: this.linkForm.id
      };
      this.$refs["linkForm"].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/sys/editLinks", par)
            .then(res => {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.getLinks();
              this.handleClose();
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    // 添加友情链接
    addLink() {
      let par = {
        name: this.linkForm.name,
        link: "http://" + this.linkForm.link
      };
      this.$refs["linkForm"].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/sys/addLinks", par)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getLinks();
              this.handleClose();
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    // t添加门户配置
    addConfig() {
      let par = {
        logo: this.addForm.logo,
        footerLogo: this.addForm.footLogo,
        title: this.addForm.title,
        // links: JSON.stringify(this.links),
        copyright: this.addForm.copyright
      };
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/sys/saveConfig", par)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getConfig();
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    //获取门户配置信息
    getConfig() {
      this.$http
        .post("/api/sys/getConfig")
        .then(res => {
          this.addForm.copyright = res.data.copyright;
          this.addForm.title = res.data.title;
          this.addForm.logo = res.data.logo;
          this.addForm.footLogo = res.data.footer_logo;
          this.linkRow();
        })
        .catch(msg => {});
    },
    //获取友情链接列表
    getLinks() {
      this.$http
        .post("/api/sys/getLinks")
        .then(res => {
          this.tableList = res.data.records;
          this.listPage.pageNo = res.data.current;
          this.listPage.total = res.data.total;
        })
        .catch(msg => {});
    },
    //获取banner列表
    getBannerList() {
      let par = {};
      this.$http
        .post("/api/manage/banner/list")
        .then(res => {
          this.bannerList = res.data.records;
          this.listPage2.pageNo = res.data.current;
          this.listPage2.total = res.data.total;
        })
        .catch(msg => {});
    },
    //添加编辑banner
    addBanner(val) {
      if (val == "add") {
        this.banner = "添加banner";
      } else {
        this.banner = "修改banner";
        this.bannerId = val.id;
        this.bannerForm.path = val.path;
      }
      this.dialogVisible2 = true;
    },
    //保存banner
    saveBanner() {
      this.$refs["bannerForm"].validate(valid => {
        if (valid) {
          let par = {
            path: this.bannerForm.path,
            size: this.bannerForm.size,
            title: this.bannerForm.title
          };
          this.$http
            .post("/api/manage/banner/add", par)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.dialogVisible2 = false;
              this.bannerForm.path = "";
              this.bannerForm.size = "";
              this.bannerForm.title = "";
              this.getBannerList();
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    //修改banner
    editBanner() {
      this.$refs["bannerForm"].validate(valid => {
        if (valid) {
          let par = {
            path: this.bannerForm.path,
            size: this.bannerForm.size,
            id: this.bannerId
          };
          this.$http
            .post("/api/manage/banner/update", par)
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.dialogVisible2 = false;
              this.bannerForm.path = "";
              this.bannerForm.size = "";
              this.bannerForm.title = "";
              this.getBannerList();
            })
            .catch(msg => {});
        } else {
          return false;
        }
      });
    },
    delBanner(val) {
      let par = {
        id: val
      };
      this.$http
        .post("/api/manage/banner/del", par)
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getBannerList();
        })
        .catch(msg => {});
    },
    handleAvatarSuccess2(res, file) {
      this.bannerForm.path = res.data.path;
      this.bannerForm.size = res.data.size;
      this.bannerForm.title = res.data.filename;
    },
    beforeAvatarUpload2(file) {
      if (file.type != "image/jpeg" && file.type != "image/png") {
        this.$message.error("请选择图片的格式为 jpg或png");
        return false;
      }
    }
  },
  mounted() {
    this.getConfig();
    this.getLinks();
    this.getBannerList();
  }
};
</script>
<style lang="scss">
.protal {
  .el-form {
    width: 450px;
    .image-con {
      width: 240px;
      height: 80px;
      text-align: left;
      overflow: hidden;
      & img {
        width: 100%;
        height: 100%;
      }
    }
    .image-icon {
      width: 240px;
      height: 80px;
      border: solid 1px #ddd;
      line-height: 80px;
      color: #ddd;
    }
    .banner-upload {
      .image-con {
        width: 400px;
        height: 170px;
        text-align: left;
        overflow: hidden;
        & img {
          width: 100%;
          height: 100%;
        }
      }
      .image-icon {
        width: 400px;
        height: 170px;
        border: solid 1px #ddd;
        line-height: 170px;
        color: #ddd;
      }
    }
    .links-box {
      width: 840px;
      .el-form-item {
        display: inline-block;
        width: 350px;
      }
      .link-button {
        margin-left: 10px;
        display: inline-block;
      }
    }
    .el-upload {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: start;
      -ms-flex-align: end;
      align-items: flex-start;
      max-width: 500px;
    }
  }
}
.protal {
  .table-toor {
    margin-bottom: 15px;
  }
  .link-con {
    .el-form {
      width: auto;
      .link-btn {
        text-align: right;
      }
    }
  }
}
.bannerImg {
  width: 90px;
  height: 44px;
}
</style>
