<template>
  <div class="eleUseRecords">
    <div class="top_search_wrap">
      <!-- <dict-select class="ipt_words" mode="timeTypes" size="default" v-model="filter.dateType" style="width:120px;" placeholder="时间类型"></dict-select> -->
      <el-date-picker
        class="ipt_words"
        style="width:185px;"
        size="default"
        v-model="filter.startTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="true"
        placeholder="开始时间">
      </el-date-picker>
      <span class="mid_words"> — </span>
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:0;"
        size="default"
        v-model="filter.endTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="true"
        placeholder="结束时间">
      </el-date-picker>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <!-- 表格部分 -->
    <div class="table_list_part moni_table_part">
      <el-table
        ref="listTable"
        :data="tableData.list"
        class="table_height"
        size="small"
        >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <table-column prop="$index" label="序号" width="65"/>
        <table-column prop="name" label="电器名称" min-width="140"/>
        <table-column prop="gmtCreated" label="启用时间" min-width="120"/>
      </el-table>
      <el-pagination
        class="choose_page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tablePage"
        :page-sizes="[20, 30, 40,50]"
        :page-size="tablePageSize"
        background
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref,reactive, onMounted } from "vue";
import { selectLoadEventList } from "@/api/requestData/useEleControl"
export default defineComponent({
  setup() {
    const filter = reactive({
      // startTime:new Date().parse("yyyy-MM-dd 00:00:00"),
      // endTime:new Date().parse("yyyy-MM-dd HH:mm:ss"),
      startTime:"",
      endTime:"",
      monitorId:null,
      meterId:null,
    })

    const tableData = reactive({list:[]})
    const tablePage = ref(1);
    const tablePageSize = ref(20);
    const tableTotal = ref(0);

    onMounted(() => {});
    // 开始请求
    const startReqData = (moniItem)=>{
      tablePage.value = 1;
      tablePageSize.value = 20;
      tableTotal.value = 0;
      // filter.monitorId = moniItem.id;
      filter.meterId = moniItem.id;
      getListData();
    }
    // 获取告警数据
    const getListData = ()=>{
      if(Object.keys(filter).length > 0){
        for(let i in filter){
          if(!filter[i]){
            delete filter[i]
          }
        }
      }
      let params = {
        page:tablePage.value,
        limit:tablePageSize.value,
        ...filter
      }
      selectLoadEventList(params).then(res=>{
        res.data.forEach((item,index)=>{
          item.$index = (tablePage.value - 1 )* tablePageSize.value + (index + 1);
        })
        tableData.list = res.data;
        tableTotal.value = res.count;
      })
    }
    // 搜索
    const searchHandle = ()=>{
      tablePage.value = 1;
      tablePageSize.value = 20;
      getListData();
    }
    // 修改limit
    const handleSizeChange = (limit)=>{
      tablePageSize.value = limit;
      getListData();
    }
    // 修改page
    const handleCurrentChange = (page)=>{
      tablePage.value = page;
      getListData();
    }
    return {
      startReqData,
      filter,
      searchHandle,
      tableData,
      tablePage,
      tablePageSize,
      tableTotal,
      handleSizeChange,
      handleCurrentChange,
    };
  },

  data() {
    return {

    };
  },
  created() {},
  methods: {},
});
</script>
<style lang='scss'>
.eleUseRecords {
  height: 100%;
  .moni_table_part{
    height: calc(100% - 55px);
    .table_height{
      height: calc(100% - 40px);
    }
    .el-table__body-wrapper{
      height: calc(100% - 50px);
    }
  }
}
</style>