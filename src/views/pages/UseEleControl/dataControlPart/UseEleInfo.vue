<template>
  <div class="useEleInfo">
    <div class="top_search_wrap">
      <dict-select class="ipt_words" mode="timeTypes" size="default" v-model="filter.dateType" style="width:120px;" placeholder="时间类型" :clearable="false"></dict-select>
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:10px;"
        size="default"
        v-model="filter.startTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="false"
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
        :clearable="false"
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
        :data="tableUseEleData.list"
        class="table_height"
        size="small"
        >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <table-column prop="$index" label="序号" width="65"/>
        <table-column prop="time" label="抄表时间" min-width="140"/>
        <table-column prop="startElectricity" label="起始读数" min-width="80" :needFixed="2" />
        <table-column prop="endElectricity" label="结束读数" min-width="80"  :needFixed="2"/>
        <table-column prop="electricity" label="用电量(度)" min-width="120"  :needFixed="2"/>
        <table-column prop="energyCharge" label="电费(元)"  :needFixed="2"/>
      </el-table>
      <el-pagination
        class="choose_page"
        @current-change="handleUseEleCurrentChange"
        :current-page="useElePage"
        :page-sizes="[20, 30, 40,50]"
        :page-size="useElePageSize"
        background
        small
        layout="total, prev, pager, next, jumper"
        :total="useEleTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref,reactive, onMounted } from "vue";
import { useElePriceList } from "@/api/requestData/useEleControl"
export default defineComponent({
  components: {

  },
  setup() {
    const monitorId = ref("");
    const deviceId = ref("");
    const electrovalence = ref("");
    const filter = reactive({
      dateType:"HOUR",
      startTime:new Date().parse("yyyy-MM-dd 00:00:00"),
      endTime:new Date().parse("yyyy-MM-dd HH:mm:ss"),
    })

    const tableUseEleData = reactive({list:[]})
    const useElePage = ref(1);
    const useElePageSize = ref(20);
    const useEleTotal = ref(0);
    const tableDataMark = reactive({list:[]})

    onMounted(() => {});

    // startReqData
    const startReqData = (moniItem)=>{
      useElePage.value = 1;
      useElePageSize.value = 20;
      useEleTotal.value = 0;
      tableUseEleData.list = tableDataMark.list = [];
      monitorId.value = moniItem.id;
      deviceId.value = moniItem.deviceId;
      electrovalence.value = moniItem.electrovalence;
      getTableData();
    }
    // 获取table 数据
    const getTableData = ()=>{
      let params = {
        monitorId:monitorId.value,
        deviceId:deviceId.value,
        electrovalence:electrovalence.value,
        ...filter
      }
      useElePriceList(params).then(res=>{
        if(!!res.data){
          tableDataMark.list = JSON.parse(JSON.stringify(res.data));
          useEleTotal.value = tableDataMark.list.length;
          tableUseEleData.list = tableDataMark.list.slice(0,useElePageSize.value);
          tableUseEleData.list.forEach((item,index)=>{
            item.$index = (useElePage.value- 1 )* useElePageSize.value + (index + 1);
          })
        }
      })
    }
    // 搜索
    const searchHandle = ()=>{
      useElePage.value = 1;  
      useElePageSize.value = 20;  
      getTableData();
    }
    // 修改page
    const handleUseEleCurrentChange = (page)=>{
      useElePage.value = page;
      tableUseEleData.list = tableDataMark.list.slice((page - 1) * useElePageSize.value,useElePageSize.value * page)
      tableUseEleData.list.forEach((item,index)=>{
        item.$index = (useElePage.value - 1 )* useElePageSize.value + (index + 1);
      })
    }
    return {
      filter,
      searchHandle,
      tableUseEleData,
      useElePage,
      useElePageSize,
      useEleTotal,
      handleUseEleCurrentChange,
      startReqData,
      monitorId,
      tableDataMark,
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
.useEleInfo {
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