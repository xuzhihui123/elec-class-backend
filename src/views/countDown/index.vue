<template>
  <div class="app-container">
    <el-card>
      <el-form ref="form" :model="form" label-width="180px" :rules="formRules">
        <el-form-item label="请输入倒计时（天）" style="width:50%" prop="name">
          <el-input v-model="form.name" type='number'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { initCountDown, getCountDown } from "@/api/countdown";
export default {
  name: "",
  components: {},
  data() {
    return {
      form: {
        name: null
      },
      formRules:{
        name:[
          {required:true,trigger:'change',message:'请输入天数！'}
        ]
      }
    };
  },
  methods: {
    //确认
    onSubmit() {
      
    }
  }
};
</script>
<style lang='less' scoped>
</style>