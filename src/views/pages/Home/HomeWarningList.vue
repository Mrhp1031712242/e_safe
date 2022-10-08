<template>
  <div class="ys_home_table">
    <el-table
      ref="listTable"
      :data="tableData.list"
      :height="265"
      size="small"
      >
      <template #empty>
        <ShowNomoreImg :imgTop="6" :imgWidth="200"/>
      </template>
      <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
      <table-column prop="baseId" label="监测设备ID" min-width="140"/>
      <table-column prop="alarmTypeName" label="告警类型" />
      <table-column prop="alarmTime" label="告警开始时间" min-width="140"/>
      <table-column prop="ceaseTime" label="告警消除时间" min-width="140"/>
      <table-column prop="statusName" label="处理状态" />
    </el-table>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { getAlarmList } from "@/api/requestData/home"
export default defineComponent({
  setup(){
    const tableData = reactive({list:[]})
    onMounted(()=>{
      getHomeTableData();
    })
    // 获取数据
    const getHomeTableData = ()=>{
      getAlarmList({page:1,limit:20}).then(res=>{
        tableData.list = res.data;
      })
    }

    return {
      tableData,
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

</style>