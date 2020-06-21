<template>
  <div class="app-container">
    <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="选择分类" prop="region">
        <el-select v-model="addData.region" placeholder="请选择分类">
          <el-option :label="item.typeName" :value="item.typeId" v-for="item in importanceOptions"
                     :key="item.typeId"></el-option>
        </el-select>
      </el-form-item>


      <!--      //文本的时候显示-->
      <el-form-item label="标题" prop="title" v-show="bpType===1">
        <el-input v-model="addData.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="内容" prop="msg" v-show="bpType===1">
        <el-input v-model="addData.msg" placeholder="请输入内容" type="textarea" :rows="5"></el-input>
      </el-form-item>

      <!--      选择图片的时候显示-->
      <el-form-item label="选择图片" prop="msg" v-show="bpType===2">
        <el-upload
          ref="upload1"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :multiple="false"
          accept="image/png,image/jpeg,image/jpg"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
        </el-upload>
      </el-form-item>


      <el-form-item v-show="fileList.length === 1 && bpType===2">
        <el-image :preview-src-list="bigImage" :src="imgSrc" style="width:200px;">

        </el-image>
      </el-form-item>


      <!--      选择视频的时候显示-->
      <el-form-item label="选择视频" prop="msg" v-show="bpType===3">
        <el-upload
          ref="upload2"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemoveVideo"
          :on-change="handleChangeVideo"
          :multiple="false"
          accept="video/mp4,video/ogg,video/webm"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceedVideo"
          :file-list="fileListVideo">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">选择视频文件，不超过50M</div>
        </el-upload>
      </el-form-item>

      <el-form-item v-show="isShowVideo && bpType===3">
        <video :src="videoSrc" controls width="400">

        </video>
      </el-form-item>


      <el-form-item v-show="isShowPro && bpType===3">
        <el-progress type="circle" :percentage="percentage" :color="colors"></el-progress>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getBpClass, insertBpContent, upload} from '@/api/class'
  import {fileToBase} from "@/utils/fileToBase64";

  export default {
    name: "AddItem",
    data() {
      return {
        submitLoading: false,
        classCode: '',
        //表单数据
        addData: {
          region: null,
          title: '',
          msg: ''
        },
        bpType: null,
        //表单规则
        rules: {},
        importanceOptions: [],

        fileList: [],
        //大图预览
        bigImage: [],
        //
        imgSrc: '',


        //视频
        fileListVideo: [],
        videoSrc: '',
        //进度条
        percentage: 0,
        //是否显示进度条
        isShowPro: false,
        isShowVideo: false,
        timeId: null,
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ]
      }
    },
    methods: {
      getCd() {
        let d = localStorage.getItem('Cn')
        this.classCode = d
      },
      //获取分类的四种类型
      async getBpClass() {
        let d = await getBpClass(this.classCode)
        this.importanceOptions = d.data
      },


      //确认
      async submitForm() {
        let {title, msg, region} = this.addData
        if(!region){
          return this.$message({
            type: 'error',
            message: '请选择分类！'
          })
        }
        //上传文字的话
        if (this.bpType === 1) {
          if (!title || !msg) {
            return this.$message({
              type: 'warning',
              message: '请检查表单信息是否完整！'
            })
          }
          this.submitLoading = true
          try {
            let d = await insertBpContent({
              title,
              msg,
              classCode: this.classCode,
              typeId: region
            })
            if (d.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.submitLoading = false
              this.$router.go(-1)
            } else {
              this.$message({
                type: 'error',
                message: '添加失败'
              })
              this.submitLoading = false
            }
          } catch (e) {
            this.submitLoading = false
            return this.$message({
              type: 'error',
              message: '服务器响应失败！'
            })
          }
          //上传图片
        } else if (this.bpType === 2) {
          if (this.fileList.length === 0) {
            return this.$message({
              type: 'error',
              message: '请选择图片！'
            })
          }
          this.submitLoading = true
          let fileD = this.fileList[0].fileData
          let f = new FormData()
          f.append('file', fileD)
          try {
            let d = await upload(f)
            let data = await insertBpContent({
              classCode: this.classCode,
              typeId: region,
              imgUrl: d
            })
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.submitLoading = false
              this.$router.go(-1)
            } else {
              this.$message({
                type: 'error',
                message: '添加失败'
              })
              this.submitLoading = false
            }
          } catch (e) {
            this.submitLoading = false
            return this.$message({
              type: 'error',
              message: '服务器响应失败！'
            })
          }
          //上传视频
        } else {
          if (this.fileListVideo.length === 0) {
            return this.$message({
              type: 'error',
              message: '请选择视频！'
            })
          }
          this.$message({
            type: 'success',
            message: '正在添加中，请稍后~'
          })
          this.submitLoading = true
          let fileD = this.fileListVideo[0].fileData
          let f = new FormData()
          f.append('file', fileD)
          try {
            let d = await upload(f)
            let data = await insertBpContent({
              classCode: this.classCode,
              typeId: region,
              mp4Url: d
            })
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.submitLoading = false
              this.$router.go(-1)
            } else {
              this.$message({
                type: 'error',
                message: '添加失败'
              })
              this.submitLoading = false
            }
          } catch (e) {
            this.submitLoading = false
            return this.$message({
              type: 'error',
              message: '服务器响应失败！'
            })
          }
        }
      },

      handleExceed(files, fileList) {
        this.$message.warning(`只能选择一张图片哦~`);
      },

      handleExceedVideo(file, fileList) {
        this.$message.warning(`只能上传一个视频！`);
      },

      //选择图片
      async handleChange(file, fileList) {
        if (file.size / 1024 / 1024 > 5) {
          this.$refs.upload1.clearFiles()
          return this.$message({
            type: 'warning',
            message: '上传的图片不能大于5M！'
          })
        }
        let d = await fileToBase(file.raw)
        this.fileList.push({name: file.name, src: d, fileData: file.raw})
        this.imgSrc = d
        this.bigImage.push(d)
      },
      //删除图片
      handleRemove(file, fileList) {
        this.fileList.pop()
        this.imgSrc = ''
      },

      //删除视频
      handleRemoveVideo(file, fileList) {
        this.fileListVideo.pop()
        this.videoSrc = ''
        this.isShowVideo = false
        this.percentage = 0
        this.isShowPro = false
      },
      //选择视频
      async handleChangeVideo(file, fileList) {
        if (file.size / 1024 / 1024 > 50) {
          this.$refs.upload2.clearFiles()
          return this.$message({
            type: 'warning',
            message: '上传的视频不能大于50M!'
          })
        }
        //显示进度条
        this.isShowPro = true
        this.timeId = setInterval(() => {
          this.percentage += 5
        }, 100)
        let d = await fileToBase(file.raw)
        this.fileListVideo.push({name: file.name, src: d, fileData: file.raw})
        this.videoSrc = d
      }
    },
    created() {
      this.getCd()
      this.getBpClass()
    },
    watch: {
      percentage: {
        deep: true,
        handler: function (newV) {
          if (newV >= 100) {
            clearInterval(this.timeId)
            this.isShowPro = false
            this.isShowVideo = true
            this.percentage = 0
          }
        }
      },
      'addData.region': {
        deep: true,
        handler: function (newV) {
          this.importanceOptions.some(item => {
            if (item.typeId === newV) {
              this.bpType = item.bpType
              return true
            }
          })
        }
      },
    }
  }
</script>

<style scoped lang="less">

</style>
