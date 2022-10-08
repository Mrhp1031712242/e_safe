<template>
  <div class="warning_point_dia moni_table_dia">
    <el-table
      ref="listTable"
      :data="tableWarningData.list"
      class="table_height left_top_table_height"
      size="small"
      highlight-current-row
      @row-click="rowHandle"
      >
      <template #empty>
        <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
      </template>
      <table-column prop="$index" label="序号" width="65"/>
      <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
      <table-column prop="baseId" label="监测设备ID" width="140"/>
      <table-column prop="alarmTypeName" label="告警类型" min-width="120"/>
      <table-column prop="alarmName" label="告警名称" min-width="140"/>
      <table-column prop="totalCount" label="累计告警次数" width="110" />
      <table-column prop="alarmTime" label="告警开始时间" width="160"/>
      <table-column prop="ceaseTime" label="告警消除时间" width="160"/>
      <table-column prop="statusName" label="处理状态" width="100"/>
      <!-- <table-column prop="operator" label="最新告警处理时间" width="140"/>
      <table-column prop="operator" label="最新告警处理结果" width="140"/> -->
    </el-table>
    <el-pagination
      class="choose_page"
      @size-change="handleWarningSizeChange"
      @current-change="handleWarningCurrentChange"
      :current-page="warningPage"
      :page-sizes="[20, 30, 40,50]"
      :page-size="warningPageSize" 
      small
      layout="total, sizes, prev, pager, next, jumper"
      :total="warningTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { defineComponent,ref ,reactive,onMounted } from 'vue'
import { selectAlarmGroupList } from "@/api/requestData/useEleControl"
import { changeTimeType } from "@/utils/commonAny.js"
export default defineComponent({
  props:{
    initTableData:{
      type:Array
    }
  },
  emits:["pointRowSel"],
  setup(props,ctx){
    const tableWarningData = reactive({list:[]})
    const warningPage = ref(1);
    const warningPageSize = ref(20);
    const warningTotal = ref(0);
    const timeType = ref("");

    onMounted(() => {});
    // 显示table初始化数据
    const startInitHandle = (type)=>{
      timeType.value = type;
      tableWarningData.list = props.initTableData;
      warningPage.value = 1;
      warningPageSize.value = 20;
    }
    // 获取数据
    const getTableData = ()=>{
      let timeObj = changeTimeType(timeType.value);
      let params = {
        page:warningPage.value,
        limit:warningPageSize.value,
        startTime:timeObj.startTime,
        endTime:timeObj.endTime,
      }
      selectAlarmGroupList(params).then(res=>{
        res.data.forEach((item,index)=>{
          item.$index = (warningPage.value - 1 )* warningPageSize.value + (index + 1);
        })
        tableWarningData.list = res.data;
        warningTotal.value = res.count;
      })
    }
    // 修改limit
    const handleWarningSizeChange = (limit)=>{
      warningPageSize.value = limit;
      getTableData();
    }
    // 修改page
    const handleWarningCurrentChange = (page)=>{
      warningPage.value = page;
      getTableData();
    }
    // 选择某一行
    const rowHandle = (row)=>{
      ctx.emit("pointRowSel",row)
    }
    return {
      tableWarningData,
      warningPage,
      warningPageSize,
      warningTotal,
      handleWarningSizeChange,
      handleWarningCurrentChange,
      timeType,
      startInitHandle,
      rowHandle,
    };
  },

  data() {
    return {

    }
  },
  created() {},
  methods: {},
})
</script>
<style lang='scss'>
.warning_point_dia{
  height: 100%;
}
@import "./index.scss";
</style>