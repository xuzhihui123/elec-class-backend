<template>
  <div class="app-container">
    <el-form
      :model="editData"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!--      //文本的时候显示-->
      <el-form-item label="标题" prop="title" v-show="bpType===1">
        <el-input v-model="editData.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="msg" v-show="bpType===1">
        <el-input v-model="editData.msg" placeholder="请输入内容" type="textarea" :rows="5"></el-input>
      </el-form-item>

      <!--      选择图片的时候显示-->
      <el-form-item label="选择图片" v-show="bpType===2">
        <el-upload
          ref="upload1"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :multiple="false"
          accept="image/png, image/jpeg, image/jpg"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
        </el-upload>
      </el-form-item>

      <el-form-item v-show="bpType===2">
        <el-image :preview-src-list="bigImage" :src="imgSrc" style="width:200px;"></el-image>
      </el-form-item>

      <!--      选择视频的时候显示-->
      <el-form-item label="选择视频" v-show="bpType===3">
        <el-upload
          ref="upload2"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemoveVideo"
          :on-change="handleChangeVideo"
          :multiple="false"
          accept="video/mp4, video/ogg, video/webm"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceedVideo"
          :file-list="fileListVideo"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">选择视频文件，不超过50M</div>
        </el-upload>
      </el-form-item>

      <el-form-item v-show="bpType===3 && !isShowpercentage">
        <video :src="videoSrc" controls width="400"></video>
      </el-form-item>

      <el-form-item v-show="bpType===3 && isShowpercentage">
        <el-progress type="circle" :percentage="percentage" :color="colors"></el-progress>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getContentById,
  getBpClassByTypeId,
  updateBpContent,
  upload
} from "@/api/class";
import { fileToBase } from "@/utils/fileToBase64";

export default {
  name: "EditContent",
  data() {
    return {
      timeId: null,
      rules: {},
      //确认编辑 加载
      submitLoading: false,
      //表单数据
      editData: {},
      bpType: null,
      msgId: null,
      classCode: null,
      fileList: [],
      bigImage: [],
      imgSrc: "",
      fileListVideo: [],
      videoSrc: "",
      percentage: 0,
      //显示进度条
      isShowpercentage: false,
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ]
    };
  },
  methods: {
    //获取msgid
    getMsgId() {
      this.msgId = this.$route.params.id;
      this.classCode = localStorage.getItem("Cn");
    },
    //根据msgid获取信息
    async getDataInfo() {
      try {
        let d = await getContentById(this.msgId);
        let datas = await getBpClassByTypeId(d.typeId);
        this.bpType = datas.data.bpType;
        this.editData = d;
      } catch (e) {
        return this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    },
    //选择图片
    async handleChange(file, fileList) {
      if (file.size / 1024 / 1024 > 5) {
        this.$refs.upload1.clearFiles();
        return this.$message({
          type: "warning",
          message: "上传的图片不能大于5M！"
        });
      }
      let d = await fileToBase(file.raw);
      this.fileList.push({ name: file.name, src: d, fileData: file.raw });
      this.imgSrc = d;
      this.bigImage = [];
      this.bigImage.push(d);
    },
    //删除图片
    handleRemove(file, fileList) {
      this.bigImage = [];
      this.fileList.pop();
      this.imgSrc = this.editData.imgUrl;
      this.bigImage.push(this.imgSrc);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能选择一张图片哦~`);
    },

    handleExceedVideo(file, fileList) {
      this.$message.warning(`只能上传一个视频！`);
    },
    //删除视频
    handleRemoveVideo(file, fileList) {
      this.fileListVideo.pop();
      //赋值原来的数据
      this.videoSrc = this.editData.mp4Url;
      this.percentage = 0;
    },
    //选择视频
    async handleChangeVideo(file, fileList) {
      if (file.size / 1024 / 1024 > 50) {
        this.$refs.upload2.clearFiles();
        return this.$message({
          type: "warning",
          message: "上传的视频不能大于50M!"
        });
      }
      //显示进度条
      this.isShowpercentage = true;
      this.timeId = setInterval(() => {
        this.percentage += 5;
      }, 100);
      let d = await fileToBase(file.raw);
      this.fileListVideo.push({ name: file.name, src: d, fileData: file.raw });
      this.videoSrc = d;
    },

    async submitForm() {
      //更新的是文字
      if (this.bpType === 1) {
        if (!this.editData.title || !this.editData.msg) {
          return this.$message({
            type: "warning",
            message: "请检查表单信息是否完整！"
          });
        }
        this.submitLoading = true;
        try {
          let d = await updateBpContent({
            msgId: this.msgId,
            title: this.editData.title,
            msg: this.editData.msg
          });
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.submitLoading = false;
          this.$router.go(-1);
        } catch (e) {
          this.submitLoading = false;
          return this.$message({
            type: "error",
            message: "服务器响应失败！"
          });
        }
      } else if (this.bpType === 2) {
        if (this.fileList.length === 0) {
          return this.$message({
            type: "warning",
            message: "请选择图片修改！"
          });
        }
        this.submitLoading = true;
        let fileD = this.fileList[0].fileData;
        let f = new FormData();
        f.append("file", fileD);
        try {
          let d = await upload(f);
          let data = await updateBpContent({
            msgId: this.msgId,
            imgUrl: d
          });
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.submitLoading = false;
          this.$router.go(-1);
        } catch (e) {
          this.submitLoading = false;
          return this.$message({
            type: "error",
            message: "服务器响应失败！"
          });
        }
        //更新的是视频
      } else {
        if (this.fileListVideo.length === 0) {
          return this.$message({
            type: "warning",
            message: "请选择视频！"
          });
        }
        this.submitLoading = true;
        this.$message({type:'success',message:'正在上传中，请稍后~',duration:3000})
        let fileD = this.fileListVideo[0].fileData;
        let f = new FormData();
        f.append("file", fileD);
        try {
          let d = await upload(f);
          let data = await updateBpContent({
            msgId: this.msgId,
            mp4Url: d
          });
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.submitLoading = false;
          this.$router.go(-1);
        } catch (e) {
          this.submitLoading = false;
          return this.$message({
            type: "error",
            message: "服务器响应失败！"
          });
        }
      }
    }
  },
  watch: {
    bpType: {
      deep: true,
      handler: function(newV) {
        //显示图片
        if (newV === 2) {
          this.imgSrc = this.editData.imgUrl;
          this.bigImage.push(this.imgSrc);
          //显示视频
        } else if (newV === 3) {
          this.videoSrc = this.editData.mp4Url;
        }
      }
    },
    percentage: {
      deep: true,
      handler: function(newV) {
        if (newV >= 100) {
          clearInterval(this.timeId);
          //显示视频
          this.isShowpercentage = false;
          this.percentage = 0;
        }
      }
    }
  },
  created() {
    this.getMsgId();
    this.getDataInfo();
  }
};
</script>

<style scoped lang="less">
</style>
