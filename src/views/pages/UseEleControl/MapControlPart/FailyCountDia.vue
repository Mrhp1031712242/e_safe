<template>
  <div class="faily_point_dia moni_table_dia">
    <div class="title_part">
      <b>{{title}}</b>
      <i class="fa fa-times" @click="closeMarkerFaiCountInfo"></i>
    </div>
    <el-table
      ref="listTable"
      :data="tableFailyData.list"
      class="table_height"
      size="small"
      >
      <template #empty>
        <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
      </template>
      <table-column prop="$index" label="序号" width="65"/>
      <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
      <table-column prop="baseId" label="监测设备ID" min-width="140"/>
      <table-column prop="alarmTypeName" label="故障类型" min-width="120"/>
      <table-column prop="alarmName" label="故障名称" min-width="140"/>
      <table-column prop="alarmTime" label="故障开始时间" width="160"/>
      <table-column prop="ceaseTime" label="故障消除时间" width="160"/>
      <table-column prop="statusName" label="处理状态" min-width="100"/>
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
import { failyList } from "@/api/requestData/useEleControl"
export default defineComponent({
  emits:["closeMidFailyCount"],
  setup(props,ctx){

    const title = ref("--");
    const tableFailyData = reactive({list:[]})
    const failyPage = ref(1);
    const failyPageSize = ref(20);
    const failyTotal = ref(0);
    const pointInfoObj = reactive({obj:{}})

    onMounted(() => {});

    // startShowData
    const startShowData = (pointFailyCountInfo)=>{
      title.value = pointFailyCountInfo.monitorName;
      failyPage.value = 1;
      failyPageSize.value = 20;
      pointInfoObj.obj = pointFailyCountInfo;
      getFailyListData(pointFailyCountInfo);
    }
    // 获取数据
    const getFailyListData = (pointFailyCountInfo)=>{
      let params = {
        page:failyPage.value,
        limit:failyPageSize.value,
        monitorId:pointFailyCountInfo.id,
      }
      failyList(params).then(res=>{
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
      getFailyListData(pointInfoObj.obj);
    }
    // 修改page
    const handleFailyCurrentChange = (page)=>{
      failyPage.value = page;
      getFailyListData(pointInfoObj.obj);
    }
    // 关闭弹框
    const closeMarkerFaiCountInfo = ()=>{
      ctx.emit("closeMidFailyCount")
    }
    return {
      title,
      tableFailyData,
      failyPage,
      failyPageSize,
      failyTotal,
      handleFailySizeChange,
      handleFailyCurrentChange,
      closeMarkerFaiCountInfo,
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
.faily_point_dia{
  height: 100%;
}
@import "./index.scss";
</style>