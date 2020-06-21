<template>
  <div class="app-container">
    <template>
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="typeName"
          label="分类名称"
        >
        </el-table-column>
        <el-table-column
          prop="t"
          label="分类类型">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editItem(scope.row.typeId)"><i class="el-icon-edit"></i>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
  import {getBpClass} from '@/api/class'

  export default {
    name: 'ItemClass',
    data() {
      return {
        tableData: [],
        classCode:null
      }
    },
    methods: {
            //获取classCode
      getCd() {
        let d = localStorage.getItem('Cn')
        this.classCode = d
      },
      editItem(id) {
        this.$router.push(`/home/editItem/${id}`)
      },
      //获取班排分类
      async getBpClass() {
        try {
          let d = await getBpClass(this.classCode)
          let datas = d.data
          datas.forEach(item => {
            let t;
            switch (item.bpType) {
              case 1:
                t = '文字';
                break;
              case 2:
                t = '图片';
                break;
              case 3:
                t = '视频';
                break;
            }
            let items = {...item,t}
            this.tableData.push(items)
          })
        } catch (e) {
          this.$message({
            type: 'error',
            message: '服务器响应失败！'
          })
        }
      }
    },
    created() {
      this.getCd()
      this.getBpClass()
    }
  }
</script>

<style scoped lang="scss">

</style>
