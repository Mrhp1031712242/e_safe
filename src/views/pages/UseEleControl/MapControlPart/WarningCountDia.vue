<template>
  <div class="warning_point_dia moni_table_dia">
    <div class="title_part">
      <b>{{title}}</b>
      <i class="fa fa-times" @click="closeMarkerCountInfo"></i>
    </div>
    <el-table
      ref="listTable"
      :data="tableWarningData.list"
      class="table_height table_mid_height"
      size="small"
      >
      <template #empty>
        <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
      </template>
      <table-column prop="$index" label="序号" width="65"/>
      <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
      <table-column prop="baseId" label="监测设备ID" min-width="140"/>
      <table-column prop="alarmTypeName" label="告警类型" min-width="120"/>
      <table-column prop="alarmName" label="告警名称" min-width="140"/>
      <table-column prop="alarmTime" label="告警开始时间" width="160"/>
      <table-column prop="ceaseTime" label="告警消除时间" width="160"/>
      <table-column prop="statusName" label="处理状态" min-width="100"/>
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
import { warningList } from "@/api/requestData/useEleControl"
export default defineComponent({
  emits:["closeMidWarningCount"],
  setup(props,ctx){
    const title = ref("--");

    const tableWarningData = reactive({list:[]})
    const warningPage = ref(1);
    const warningPageSize = ref(20);
    const warningTotal = ref(0);
    const pointInfoObj = reactive({obj:{}})

    onMounted(() => {});
    // startShowData
    const startShowData = (pointWarningCountInfo)=>{
      title.value = pointWarningCountInfo.monitorName;
      warningPage.value = 1;
      warningPageSize.value = 20;
      pointInfoObj.obj = pointWarningCountInfo;
      getWarningListData(pointWarningCountInfo);
    }
    // 获取数据
    const getWarningListData = (pointWarningCountInfo)=>{
      let params = {
        page:warningPage.value,
        limit:warningPageSize.value,
        monitorId:pointWarningCountInfo.id,
      }
      warningList(params).then(res=>{
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
      getWarningListData(pointInfoObj.obj);
    }
    // 修改page
    const handleWarningCurrentChange = (page)=>{
      warningPage.value = page;
      getWarningListData(pointInfoObj.obj);
    }
    // 关闭弹框
    const closeMarkerCountInfo = ()=>{
      ctx.emit("closeMidWarningCount")
    }

    return {
      title,
      tableWarningData,
      warningPage,
      warningPageSize,
      warningTotal,
      handleWarningSizeChange,
      handleWarningCurrentChange,
      closeMarkerCountInfo,
      startShowData
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