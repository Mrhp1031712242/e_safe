<template>
  <main-content class="faily_list">
    <div class="top_search_wrap">
      <!-- <TreeSelect  propTreeSelId="failyStat" :modelValue="areaIdVal"  size="default" class="ipt_tree_sel" style="width:150px;"/> -->
      <dict-select class="ipt_words" listUrl="/api/rbac/keyValue/selectList/faultState" size="default" v-model="filter.alarmType" style="width:120px;margin-left:10px;" placeholder="故障类型"></dict-select>
      <dict-select class="ipt_words" mode="isDutyed" size="default" v-model="filter.status" style="width:120px;margin-left:10px;" placeholder="处理状态"></dict-select>
      <!-- <dict-select class="ipt_words" mode="failyDutyType" size="default" v-model="filter.result" style="width:120px;margin-left:10px;" placeholder="处理结果"></dict-select> -->
      <el-date-picker
        class="ipt_words"
        style="width:165px;margin-left:10px;"
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
        style="width:165px;margin-left:0;"
        size="default"
        v-model="filter.endTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        placeholder="结束时间">
      </el-date-picker>
      <el-input v-model="filter.keyword" clearable size="default" placeholder="关键字搜索" class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <!-- table -->
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="65"/>
        <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
        <table-column prop="deviceType" label="设备名称" />
        <table-column prop="alarmTypeName" label="故障类型" />
        <table-column prop="alarmTime" label="故障开始时间" min-width="140"/>
        <table-column prop="ceaseTime" label="故障消除时间" min-width="140"/>
        <table-column prop="statusName" label="处理状态" />
      </table-list>
    </div>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive,onMounted } from "vue"
import { failyList } from "@/api/requestData/useEleControl"

export default defineComponent({
  setup(){
    let areaIdVal = ref("");
    const listTable = ref(null);
    const filter = reactive({
      alarmType:"",
      status:"",
      result:"",
      startTime:"",
      endTime:"",
      keyword:"",
    })
    const fetch = failyList;

    const searchHandle = ()=>{
      console.log(123)
      listTable.value.reload();
    }
    onMounted(()=>{})

    return {
      listTable,
      areaIdVal,
      filter,
      searchHandle,
      fetch
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