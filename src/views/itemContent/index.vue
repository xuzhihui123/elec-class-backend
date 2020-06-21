<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.importance"
        placeholder="请选择分类名称"
        clearable
        style="width: 180px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item.typeId"
          :label="item.typeName"
          :value="item.typeId"
        />
      </el-select>
      <el-input
        v-model="listQuery.title"
        placeholder="请输入标题"
        clearable
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-date-picker
        v-model="listQuery.time"
        type="daterange"
        value-format="yyyy-MM-dd"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        :loading="searchBtnLoading"
        style="margin-bottom: 20px"
      >搜索</el-button>

      <el-button class="filter-item" type="success" @click="clearAll" :loading="clearLoading">清空</el-button>

      <el-button class="filter-item" type="danger" @click="addContent">添加</el-button>
    </div>

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
              <span v-show="row.title">{{row.title}}</span>
              <span v-show="!row.title">无</span>
            </el-form-item>
            <el-form-item label="内容：">
              <span v-show="row.msg">{{row.msg}}</span>
              <span v-show="!row.msg">无</span>
            </el-form-item>
            <el-form-item label="图片：">
              <el-image
                :src="row.imgUrl"
                v-show="row.imgUrl"
                style="width: 100px"
                :preview-src-list="bigImage"
              ></el-image>
              <span v-show="!row.imgUrl">无</span>
            </el-form-item>
            <el-form-item label="视频：">
              <video :src="row.mp4Url" v-show="row.mp4Url" width="350" controls></video>
              <span v-show="!row.mp4Url">无</span>
            </el-form-item>
            <el-form-item label="班级编号：">
              <span>{{row.classCode}}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ row.createtime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span v-show="row.title">{{row.title}}</span>
          <span v-show="!row.title">无</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="170px" align="center" sortable>
        <template slot-scope="{row}">
          <span>{{ row.createtime}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row.msgId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.msgId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0 && !isShowSearchPag"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
      :pageSizes="[5,10,15,20]"
    />

    <!--    //查询的分页-->
    <pagination
      v-show="totalSearch>0 && isShowSearchPag"
      :total="totalSearch"
      :page.sync="listQuerySearch.page"
      :limit.sync="listQuerySearch.limit"
      @pagination="handleFilter"
      :pageSizes="[5,10,15,20]"
    />
  </div>
</template>

<script>
import { selectContent, getBpClass, removeBpContent } from "@/api/class";
import Pagination from "@/components/Pagination";

export default {
  name: "ItemContent",
  components: {
    Pagination
  },
  data() {
    return {
      classCode: "",
      //表格加载
      listLoading: false,
      //搜索按钮加载
      searchBtnLoading: false,
      //清空按钮加载
      clearLoading: false,
      //表格内容
      list: [],

      //分类的四种类型
      importanceOptions: [],

      //分页
      listQuery: {
        page: 1,
        limit: 5,
        title: "",
        importance: null,
        time: null
      },
      //分页总数
      total: 0,

      //搜索的分页
      listQuerySearch: {
        page: 1,
        limit: 5
      },

      //搜索的总数
      totalSearch: 0,

      //显示搜索分页
      isShowSearchPag: false,

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      //大图显示
      bigImage: []
    };
  },
  methods: {
    //获取classCode
    getCd() {
      let d = localStorage.getItem("Cn");
      this.classCode = d;
    },
    //获取分类的四种类型
    async getBpClass() {
      let d = await getBpClass(this.classCode);
      this.importanceOptions = d.data;
    },

    //获取分页的
    async getList() {
      this.listLoading = true;
      this.bigImage = [];
      let { page, limit } = this.listQuery;
      try {
        let d = await selectContent({
          classCode: this.classCode,
          pageNum: page,
          pageSize: limit
        });
        let [data, count] = d.data;
        this.list = data;
        this.list.forEach(item => {
          this.bigImage.push(item.imgUrl);
        });
        this.total = count;
        this.listLoading = false;
      } catch (e) {
        this.$message({
          type: "error",
          message: "服务器响应失败！"
        });
      }
    },

    //handleUpdate 编辑
    handleUpdate(id) {
      this.$router.push(`/home/editContent/${id}`);
    },

    // 删除
    handleDelete(id) {
      this.$confirm("确认删除该条内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let d = await removeBpContent(id);
            if (d.code === 200) {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              //是查询的 执行查询的
              if (this.isShowSearchPag) {
                this.handleFilter();
              } else {
                this.getList();
              }
            } else {
              this.$notify({
                title: "失败",
                message: "删除失败",
                type: "error",
                duration: 2000
              });
            }
          } catch (e) {
            this.$notify({
              title: "失败",
              message: "服务器响应失败",
              type: "error",
              duration: 2000
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

    //确认搜索
    async handleFilter() {
      this.listLoading = true;
      this.searchBtnLoading = true;
      let { title, time, importance } = this.listQuery;
      if (!title && !time && !importance) {
        this.listLoading = false;
        this.searchBtnLoading = false;
        return this.$message({
          type: "warning",
          message: "请输入搜索条件！"
        });
      }
      //显示搜索的分页

      if (!time && !importance) {
        let d = await selectContent({
          title,
          classCode: this.classCode,
          pageNum: this.listQuerySearch.page,
          pageSize: this.listQuerySearch.limit
        });

        let [data, count] = d.data;

        //设置分页的总数和
        if (count === 0) {
          this.listLoading = false;
          this.searchBtnLoading = false;
          return this.$message({
            type: "success",
            message: "搜索到0条记录！"
          });
        }
        this.bigImage = [];
        this.isShowSearchPag = true;
        this.listLoading = false;
        this.searchBtnLoading = false;
        this.list = data;
        this.list.forEach(item => {
          this.bigImage.push(item.imgUrl);
        });
        this.totalSearch = count;
      } else if (!time) {
        let d = await selectContent({
          title,
          typeId: importance,
          classCode: this.classCode,
          pageNum: this.listQuerySearch.page,
          pageSize: this.listQuerySearch.limit
        });

        let [data, count] = d.data;

        //设置分页的总数和
        if (count === 0) {
          this.listLoading = false;
          this.searchBtnLoading = false;
          return this.$message({
            type: "success",
            message: "搜索到0条记录！"
          });
        }
        this.bigImage = [];
        this.isShowSearchPag = true;
        this.listLoading = false;
        this.searchBtnLoading = false;
        this.list = data;
        this.list.forEach(item => {
          this.bigImage.push(item.imgUrl);
        });
        this.totalSearch = count;
      } else if (!importance) {
        let d = await selectContent({
          title,
          before: time[0],
          after: time[1],
          classCode: this.classCode,
          pageNum: this.listQuerySearch.page,
          pageSize: this.listQuerySearch.limit
        });

        let [data, count] = d.data;

        //设置分页的总数和
        if (count === 0) {
          this.listLoading = false;
          this.searchBtnLoading = false;
          return this.$message({
            type: "success",
            message: "搜索到0条记录！"
          });
        }
        this.bigImage = [];
        this.isShowSearchPag = true;
        this.listLoading = false;
        this.searchBtnLoading = false;
        this.list = data;
        this.list.forEach(item => {
          this.bigImage.push(item.imgUrl);
        });
        this.totalSearch = count;
      } else {
        let d = await selectContent({
          title,
          typeId: importance,
          before: time[0],
          after: time[1],
          classCode: this.classCode,
          pageNum: this.listQuerySearch.page,
          pageSize: this.listQuerySearch.limit
        });

        let [data, count] = d.data;

        //设置分页的总数和
        if (count === 0) {
          this.listLoading = false;
          this.searchBtnLoading = false;
          return this.$message({
            type: "success",
            message: "搜索到0条记录！"
          });
        }
        this.bigImage = [];
        this.isShowSearchPag = true;
        this.listLoading = false;
        this.searchBtnLoading = false;
        this.list = data;
        this.list.forEach(item => {
          this.bigImage.push(item.imgUrl);
        });
        this.totalSearch = count;
      }
    },

    //清空
    clearAll() {
      this.clearLoading = true;
      this.listQuery.page = 1;
      this.listQuery.limit = 5;
      this.listQuery.title = "";
      this.listQuery.importance = null;
      this.listQuery.time = null;
      this.isShowSearchPag = false;
      this.listQuerySearch.page = 1;
      this.listQuerySearch.limit = 5;
      this.getList();
      this.clearLoading = false;
    },

    //添加
    addContent() {
      this.$router.push("/home/addItem");
    }
  },
  created() {
    this.getCd();
    this.getBpClass();
    this.getList();
  }
};
</script>

<style scoped lang="less">
</style>
<style>
.el-pagination {
  white-space: normal;
}
</style>