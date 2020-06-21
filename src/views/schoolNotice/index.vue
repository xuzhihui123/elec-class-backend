<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="addSchoolNotice">添加公告</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="标题：">
              <span>{{row.schoolTitle}}</span>
            </el-form-item>
            <el-form-item label="开始显示时间">
              <span>{{row.schoolStart}}</span>
            </el-form-item>
            <el-form-item label="结束显示时间">
              <span>{{row.schoolEnd}}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{row.schoolCreateTime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="标题" min-width="150px" prop="schoolTitle"></el-table-column>

      <el-table-column label="开始显示时间" min-width="150px" align="center" prop="schoolStart"></el-table-column>

      <el-table-column label="结束显示时间" min-width="150px" align="center" prop="schoolEnd"></el-table-column>

      <el-table-column label="创建时间" min-width="150px" align="center" prop="schoolCreateTime"></el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.schoolId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.schoolId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
      :pageSizes="[5,10,15,20]"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getNoticeList, removeSchoolNotice } from "@/api/schoolNotice";
export default {
  name: "",
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      list: [],
      //表格分页
      listQuery: {
        page: 1,
        limit: 5
      },
      //条数
      total: 0
    };
  },
  methods: {
    //编辑
    handleUpdate(id) {
      this.$router.push(`/home/editSchoolNotice/${id}`);
    },
    //删除
    handleDelete(id) {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.listLoading = true;
          try {
            let d = await removeSchoolNotice(id);
            if (d.code === 200) {
              this.$notify({
                type: "success",
                message: "删除成功！"
              });
              this.listLoading = false;
              this.getList();
            } else {
              this.listLoading = false;
              return this.$notify({
                type: "error",
                message: "删除失败！"
              });
            }
          } catch (e) {
            this.listLoading = false;
            return this.$notify({
              type: "error",
              message: "服务器响应失败！"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //getList
    async getList() {
      this.listLoading = true;
      let { page, limit } = this.listQuery;
      try {
        let d = await getNoticeList({
          schoolCode: "GXLZ24",
          pageNum: page,
          pageSize: limit
        });
        let [datas, count] = d.data;
        this.total = count;
        this.list = datas;
        this.listLoading = false;
      } catch (e) {
        this.listLoading = false;
        return this.$message({
          type: "error",
          message: "服务器响应失败~"
        });
      }
    },

    //添加公告
    addSchoolNotice() {
      this.$router.push("/home/addSchoolNotice");
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang='less' scoped>
</style>