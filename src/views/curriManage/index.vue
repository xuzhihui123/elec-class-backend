<template>
  <div class="app-container">
    <el-card v-loading="isShowTable">
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        stripe
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column label="星期/节数" width="180" align="center" prop="cl"></el-table-column>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="一" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week1"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="二" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week2"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="三" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week3"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="四" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week4"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="五" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week5"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="六" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week6"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="日" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.week7"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <div class="save">
        <el-button type="primary" @click="saveData" :loading="isLoadingBtn">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getTimeTable, insertCourse } from "@/api/curriManage";
export default {
  name: "CurriManage",
  components: {},
  data() {
    return {
      tableData: [],
      classCode: null,
      isShowTable: false,
      isLoadingBtn: false
    };
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 进入提示
    tips() {
      this.$message({
        title: "提示",
        message: "修改输入框点击保存即可",
        type: "success",
        duration: 3000
      });
    },

    //获取课程表
    async getCurriMange() {
      this.classCode = localStorage.getItem("Cn");
      try {
        this.isShowTable = true;
        let d = await getTimeTable(this.classCode);
        d.data.forEach((item, i) => {
          if (i === 0) {
            item.cl = "上午";
          }
          if (i === 4) {
            item.cl = "下午";
          }
        });
        this.tableData = d.data;
        this.isShowTable = false;
      } catch (e) {
        this.isShowTable = false;
        return this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    },

    //确认修改
    async saveData() {
      this.isLoadingBtn = true;
      let submitData = [];
      this.tableData.forEach(item => {
        let items = {};
        items.classId = item.classId;
        items.classCode = this.classCode
        items.week1 = item.week1;
        items.week2 = item.week2;
        items.week3 = item.week3;
        items.week4 = item.week4;
        items.week5 = item.week5;
        items.week6 = item.week6;
        items.week7 = item.week7;
        submitData.push(items);
      });
      try {
        let d = await insertCourse(submitData);
        this.$message({
          type: "success",
          message: "保存成功~"
        });
        this.isLoadingBtn = false;
        this.getCurriMange();
      } catch (e) {
         this.isLoadingBtn = false;
        return this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    }
  },
  created() {
    this.tips();
    this.getCurriMange();
  }
};
</script>
<style lang='scss' scoped>
.save {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
