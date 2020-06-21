<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px" :rules="submitRules">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="分类类型" prop="region">
        <el-select v-model="form.region" placeholder="请选择类型">
          <el-option label="文字" :value="1"></el-option>
          <el-option label="图片" :value="2"></el-option>
          <el-option label="视频" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {updateBpClass, getBpClassByTypeId} from '@/api/class'

  export default {
    name: "EditItem",
    data() {
      return {
        form: {
          name: '',
          region: null
        },
        typeId: null,
        submitLoading: false,
        submitRules: {
          name: [
            {required: true, trigger: 'blur', message: '名称不得为空！'}
          ],
          region: [
            {required: true, trigger: 'blur', message: '请选择类型！'}
          ]
        }
      }
    },
    methods: {
      //一进来获取内容
      async getContent() {
        this.typeId = this.$route.params.id
        try{
          let d = await getBpClassByTypeId(this.typeId)
          let data = d.data
          let {typeName, bpType} = data
          this.form.name = typeName
          this.form.region = bpType
        }catch (e) {
          this.$message({
            type: 'error',
            message: "服务器响应失败！"
          })
        }
      },


      onSubmit() {
        this.submitLoading = true
        this.$refs.form.validate(async r => {
          if (r) {
              try{
                let d= await updateBpClass({
                  typeId:this.typeId,
                  bpType:this.form.region,
                  typeName:this.form.name
                })
                if(d.code === 200){
                  this.submitLoading = false
                  this.$message({
                    type: 'success',
                    message: "修改成功！"
                  })
                  this.$router.go(-1)
                }else{
                  this.submitLoading = false
                  this.$message({
                    type: 'error',
                    message: "修改失败！"
                  })
                }
              }catch (e) {
                this.submitLoading = false
                this.$message({
                  type: 'error',
                  message: "服务器响应失败"
                })
              }
          } else {
            this.submitLoading = false
            this.$message({
              type: 'warning',
              message: "请检查表单信息是否正确！"
            })
          }
        })
      }
    },
    created() {
      this.getContent()
    }
  }
</script>

<style scoped lang="less">

</style>
