<template>
  <div class="warningInfo">
    <div class="top_search_wrap">
      <dict-select class="ipt_words" listUrl="/api/rbac/keyValue/selectList/alarmType" size="default" v-model="filter.alarmType" style="width:120px;" placeholder="告警类型"></dict-select>
      <dict-select class="ipt_words" mode="isDutyed" size="default" v-model="filter.status" style="width:120px;margin-left:10px;" placeholder="处理状态"></dict-select>
      <!-- <dict-select class="ipt_words" mode="failyDutyType" size="default" v-model="filter.result" style="width:120px;margin-left:10px;" placeholder="处理结果"></dict-select> -->
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:10px;"
        size="default"
        v-model="filter.startTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
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
        :data="tableWarningData.list"
        class="table_height"
        size="small"
        >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <table-column prop="alarmTypeName" label="告警类型" min-width="120"/>
        <table-column prop="alarmName" label="告警名称" min-width="120"/>
        <table-column prop="alarmTime" label="告警开始时间" min-width="120"/>
        <table-column prop="ceaseTime" label="告警消除时间" min-width="120"/>
        <table-column prop="statusName" label="处理状态" min-width="120"/>
        <!-- <table-column prop="optCloseTime" label="处理结果" min-width="120"/> -->
      </el-table>
      <el-pagination
        class="choose_page"
        @size-change="handleWarningSizeChange"
        @current-change="handleWarningCurrentChange"
        :current-page="warningPage"
        :page-sizes="[20, 30, 40,50]"
        :page-size="warningPageSize"
        background
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="warningTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref,reactive, onMounted } from "vue";
import { warningList } from "@/api/requestData/useEleControl"
export default defineComponent({
  setup() {
    const filter = reactive({
      alarmType:null,
      status:null,
      startTime:new Date().parse("yyyy-MM-dd 00:00:00"),
      endTime:new Date().parse("yyyy-MM-dd hh:mm:ss"),
      monitorId:null,
    })

    const tableWarningData = reactive({list:[]})
    const warningPage = ref(1);
    const warningPageSize = ref(20);
    const warningTotal = ref(0);

    onMounted(() => {});
    // 开始请求
    const startReqData = (moniItem)=>{
      warningPage.value = 1;
      warningPageSize.value = 20;
      filter.monitorId = moniItem.id || null;
      getWarningListData();
    }
    // 获取告警数据
    const getWarningListData = ()=>{
      if(Object.keys(filter).length > 0){
        for(let i in filter){
          if(!filter[i]){
            delete filter[i]
          }
        }
      }
      let params = {
        page:warningPage.value,
        limit:warningPageSize.value,
        ...filter
      }
      warningList(params).then(res=>{
        tableWarningData.list = res.data;
        warningTotal.value = res.count;
      })
    }
    // 搜索
    const searchHandle = ()=>{
      warningPage.value = 1;
      warningPageSize.value = 20;
      getWarningListData();
    }
    // 修改limit
    const handleWarningSizeChange = (limit)=>{
      warningPageSize.value = limit;
      getWarningListData();
    }
    // 修改page
    const handleWarningCurrentChange = (page)=>{
      warningPage.value = page;
      getWarningListData();
    }
    return {
      startReqData,
      filter,
      searchHandle,
      tableWarningData,
      warningPage,
      warningPageSize,
      warningTotal,
      handleWarningSizeChange,
      handleWarningCurrentChange,
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
.warningInfo {
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