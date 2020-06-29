<template>
  <div class="app-container">
    <div class="app-container">
      <el-form ref="form" :model="form" label-width="150px" :rules="FormRules">
        <el-form-item label="标题：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="选择时区：" prop="time">
          <el-date-picker
            :disabled="true"
            v-model="form.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始显示时间"
            end-placeholder="结束显示时间"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="公告内容：">
          <edita @getVaue="getValue" :baseValue="baseValue" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="loadingBtn">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Edita from "@/views/Edita";
import { updateSchoolNotice, getNoticeById } from "@/api/schoolNotice";
export default {
  name: "",
  components: {
    Edita
  },
  data() {
    return {
      schoolId: null,
      schoolCode:null,
      loadingBtn: false,
      form: {
        name: "",
        time: null,
        content: ""
      },
      baseValue: "",
      FormRules: {
        name: [{ required: true, trigger: "change", message: "请输入标题！" }],
        time: [
          { required: true, trigger: "change", message: "请选择时间区段！" }
        ]
      }
    };
  },
  methods: {
    getSchoolCode(){
        this.schoolCode = localStorage.getItem('Sn')
    },
    getValue(value) {
      this.form.content = value;
    },
    submit() {
      this.$refs.form.validate(async r => {
        this.loadingBtn = true;
        if (r) {
          if (!this.form.content) {
            this.loadingBtn = false;
            return this.$message({
              type: "warning",
              message: "请输入公告内容！"
            });
          } else {
            let { content, name, time } = this.form;
            let schoolStart = time[0];
            let schoolEnd = time[1];
            try {
              let d = await updateSchoolNotice({
                schoolCode: this.schoolCode,
                schoolId: this.schoolId,
                schoolTitle: name,
                schoolContent: content,
                schoolStart,
                schoolEnd
              });
              if (d.code === 500) {
                this.loadingBtn = false;
                return this.$message({
                  type: "warning",
                  message: `${d.msg}`
                });
              } else {
                this.loadingBtn = false;
                this.$message({
                  type: "success",
                  message: "编辑公告成功~"
                });
                this.$router.go(-1);
              }
            } catch (e) {
              this.loadingBtn = false;
              return this.$message({
                type: "error",
                message: "服务器响应失败"
              });
            }
          }
        } else {
          this.loadingBtn = false;
          return this.$message({
            type: "warning",
            message: "请检查表单信息是否完整！"
          });
        }
      });
    },

    //根据id获取数据
    async getDataById() {
      this.loadingBtn = true;
      this.schoolId = this.$route.params.id;
      try {
        let d = await getNoticeById(this.schoolId);
        this.baseValue = d.schoolContent;
        this.form.name = d.schoolTitle;
        this.form.time = [];
        this.form.time[0] = d.schoolStart;
        this.form.time[1] = d.schoolEnd;
        this.loadingBtn = false;
      } catch (e) {
        this.loadingBtn = false;
        return this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    }
  },
  created() {
    this.getSchoolCode()
    this.getDataById();
  }
};
</script>
<style lang='less' scoped>
</style>