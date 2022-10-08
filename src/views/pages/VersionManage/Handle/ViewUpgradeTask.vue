<template>
  <div class="view_version table_list_part">
    <el-table :data="tableData" :height="450" element-loading-text="数据拉取中" class="table_height" size="small">
      <template #empty>
        <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
      </template>
      <table-column prop="baseId" label="设备ID"/>
      <table-column prop="updateResultChs" label="升级状态" />
      <table-column prop="result" label="升级结果"/>
      <table-column prop="updateTime" label="升级时间"/>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="choose_page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="limit"
      background
      small
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { listVersionUpdateLog } from "@/api/requestData/versionManage"
export default {
  props:{
    id:{
      type:String,
      default:"",
    }
  },
  data() {
    return {
      page:1,
      limit:20,
      pageSizes:[20,30,40],
      total:0,
      tableData:[],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取数据
    getList(){
      let params = {
        page:this.page,
        limit:this.limit,
        taskId:this.id
      }
      listVersionUpdateLog(params).then(res=>{
        this.tableData = res.data;
        this.total = res.count;
      })
    },
    // 调整当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getList();
    },
    // 调整显示数据数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getList();
    },
  },
  watch:{
    id(val){
      if(val){
        this.page = 1;
        this.limit = 20;
        this.getList();
      }
    }
  }
}
</script>
<style lang='scss'>

</style>