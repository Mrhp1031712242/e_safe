<template>
  <div class="failyInfo">
    <div class="top_search_wrap">
      <dict-select class="ipt_words" listUrl="/api/rbac/keyValue/selectList/faultState" size="default" v-model="filter.alarmType" style="width:120px;" placeholder="故障类型"></dict-select>
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
        :data="tableFailyData.list"
        class="table_height"
        size="small"
        >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <table-column prop="deviceType" label="设备名称" min-width="120" cancopy/>
        <table-column prop="alarmTypeName" label="故障类型" min-width="120"/>
        <table-column prop="alarmTime" label="故障开始时间" min-width="120"/>
        <table-column prop="ceaseTime" label="故障消除时间" min-width="120"/>
        <table-column prop="statusName" label="处理状态" min-width="120"/>
        <!-- <table-column prop="statusName" label="处理结果" min-width="120"/> -->
      </el-table>
      <el-pagination
        class="choose_page"
        @size-change="handleFailySizeChange"
        @current-change="handleFailyCurrentChange"
        :current-page="failyPage"
        :page-sizes="[20, 30, 40,50]"
        :page-size="failyPageSize"
        background
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="failyTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref,reactive, onMounted } from "vue";
import { failyList } from "@/api/requestData/useEleControl"
export default defineComponent({
  setup() {
    const filter = reactive({
      alarmType:null,
      status:null,
      startTime:new Date().parse("yyyy-MM-dd 00:00:00"),
      endTime:new Date().parse("yyyy-MM-dd hh:mm:ss"),
      monitorId:null,
    })

    const tableFailyData = reactive({list:[]})
    const failyPage = ref(1);
    const failyPageSize = ref(20);
    const failyTotal = ref(0);

    onMounted(() => {});
    // 开始请求
    const startReqData = (moniItem)=>{
      failyPage.value = 1;
      failyPageSize.value = 20;
      filter.monitorId = moniItem.id || null;
      getFailyListData();
    }
    // 获取告警数据
    const getFailyListData = ()=>{
      if(Object.keys(filter).length > 0){
        for(let i in filter){
          if(!filter[i]){
            delete filter[i]
          }
        }
      }
      let params = {
        page:failyPage.value,
        limit:failyPageSize.value,
        ...filter
      }
      failyList(params).then(res=>{
        tableFailyData.list = res.data;
      })
    }
    // 搜索
    const searchHandle = ()=>{
      failyPage.value = 1;
      failyPageSize.value = 20;
      getFailyListData();
    }
    // 修改limit
    const handleFailySizeChange = (limit)=>{
      failyPageSize.value = limit;
      getFailyListData();
    }
    // 修改page
    const handleFailyCurrentChange = (page)=>{
      failyPage.value = page;
      getFailyListData();
    }
    return {
      startReqData,
      filter,
      searchHandle,
      tableFailyData,
      failyPage,
      failyPageSize,
      failyTotal,
      handleFailySizeChange,
      handleFailyCurrentChange,
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
.failyInfo {
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