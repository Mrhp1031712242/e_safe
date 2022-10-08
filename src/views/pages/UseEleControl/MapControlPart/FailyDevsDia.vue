<template>
  <div class="faily_point_dia moni_table_dia">
    <el-table
      ref="listTable"
      :data="tableFailyData.list"
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
      <table-column prop="alarmTypeName" label="故障类型" min-width="120"/>
      <table-column prop="alarmName" label="故障名称" min-width="140"/>
      <table-column prop="totalCount" label="累计故障次数" width="110" />
      <table-column prop="alarmTime" label="故障开始时间" width="160"/>
      <table-column prop="ceaseTime" label="故障消除时间" width="160"/>
      <table-column prop="statusName" label="处理状态" width="100"/>
    </el-table>
    <el-pagination
      class="choose_page"
      @size-change="handleFailySizeChange"
      @current-change="handleFailyCurrentChange"
      :current-page="failyPage"
      :page-sizes="[20, 30, 40,50]"
      :page-size="failyPageSize" 
      small
      layout="total, sizes, prev, pager, next, jumper"
      :total="failyTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { defineComponent,ref ,reactive,onMounted } from 'vue'
import { selectFaultGroupList } from "@/api/requestData/useEleControl"
import { changeTimeType } from "@/utils/commonAny.js"
export default defineComponent({
  props:{
    initTableData:{
      type:Array
    }
  },
  emits:["pointRowSel"],
  setup(props,ctx){

    const tableFailyData = reactive({list:[]})
    const failyPage = ref(1);
    const failyPageSize = ref(20);
    const failyTotal = ref(0);
    const timeType = ref("");

    onMounted(() => {});

    // 显示table初始化数据
    const startInitHandle = (type)=>{
      timeType.value = type;
      tableFailyData.list = props.initTableData;
      failyPage.value = 1;
      failyPageSize.value = 20;
    }
    // 获取数据
    const getTableData = ()=>{
      let timeObj = changeTimeType(timeType.value);
      let params = {
        page:failyPage.value,
        limit:failyPageSize.value,
        startTime:timeObj.startTime,
        endTime:timeObj.endTime,
      }
      selectFaultGroupList(params).then(res=>{
        res.data.forEach((item,index)=>{
          item.$index = (failyPage.value - 1 )* failyPageSize.value + (index + 1);
        })
        tableFailyData.list = res.data;
        failyTotal.value = res.count;
      })
    }
    // 修改limit
    const handleFailySizeChange = (limit)=>{
      failyPageSize.value = limit;
      getTableData();
    }
    // 修改page
    const handleFailyCurrentChange = (page)=>{
      failyPage.value = page;
      getTableData();
    }
    // 选择某一行
    const rowHandle = (row)=>{
      ctx.emit("pointRowSel",row)
    }
    return {
      tableFailyData,
      failyPage,
      failyPageSize,
      failyTotal,
      handleFailySizeChange,
      handleFailyCurrentChange,
      startInitHandle,
      timeType,
      rowHandle,
    }
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
.faily_point_dia{
  height: 100%;
}
@import "./index.scss";
</style>