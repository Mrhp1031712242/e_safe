<template>
  <main-content class="real_time_list">
    <div class="top_search_wrap">
      <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions"
      :propTreeSelId="'treeId'+new Date().getTime()" 
      :modelValue="areaIdVal"  size="default" class="ipt_tree_sel"
      @selectTreeVal="(val)=>filter.areaId=val" 
      style="width:150px;"/>
      <el-input v-model="filter.keyWord" clearable size="default" placeholder="关键字搜索" class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <!-- table -->
    <div class="table_list_part page_table_list">
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
        <table-column prop="areaStr" label="区域" min-width="120" cancopy/>
        <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
        <table-column prop="baseId" label="监测设备ID" min-width="150" cancopy/>
        <table-column prop="meterId" label="电表ID" min-width="130"/>
        <table-column prop="time" label="时间" min-width="150"/>
        <table-column prop="deviceOnline" label="监测设备状态" min-width="120" cancopy/>
        <table-column prop="meterOnline" label="电表状态" min-width="100" cancopy/>
        <table-column prop="E01" label="电流(A)" :needFixed="2" width="90"/>
        <table-column prop="U01" label="电压(v)" :needFixed="2" width="90"/>
        <table-column prop="P01" label="功率(w)" :needFixed="2" width="90"/>
        <table-column prop="C01" label="电表读数(kw·h)" width="130" :needFixed="2"/>
      </el-table>
      <el-pagination
        class="choose_page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="tablePage"
        :page-sizes="[20,30,40,50,60,70,80,90,100]"
        :page-size="tablePageSize"
        background
        small
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableTotal"
      ></el-pagination>
    </div>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive,onMounted } from "vue"
import { realTimeList } from "@/api/requestData/useEleControl"
export default defineComponent({
  setup(){
    let areaIdVal = ref("");
    const tableData = reactive({list:[]});
    const tablePage = ref(1);
    const tablePageSize = ref(20);
    const tableTotal = ref(0);
    const tableDataMark = reactive({list:[]})

    const filter = reactive({
      areaId:"",
      keyWord:"",
    })
    onMounted(()=>{
      getTableData();
    })
    // 获取table 数据
    const getTableData = ()=>{
      tableData.list = tableDataMark.list = []; 
      tableTotal.value = 0;
      if(Object.keys(filter).length > 0){
        for(let i in filter){
          if(!filter[i]){
            delete filter[i]
          }
        }
      }
      realTimeList(filter).then(res=>{
        if(!!res.data){
          tableDataMark.list = JSON.parse(JSON.stringify(res.data));
          tableTotal.value = tableDataMark.list.length;
          tableData.list = tableDataMark.list.slice(0,tablePageSize.value);
          tableData.list.forEach((item,index)=>{
            item.$index = (tablePage.value- 1 )* tablePageSize.value + (index + 1);
          })
        }
      })
    }
    function searchHandle(){
      tablePage.value = 1;  
      tablePageSize.value = 20;  
      getTableData();
    }
    // 修改page
    const handleCurrentChange = (page)=>{
      tablePage.value = page;
      tableData.list = tableDataMark.list.slice((tablePage.value - 1) * tablePageSize.value,tablePageSize.value * tablePage.value)
      tableData.list.forEach((item,index)=>{
        item.$index = (tablePage.value - 1 )* tablePageSize.value + (index + 1);
      })
    }
    // 修改limit
    const handleSizeChange = (limit)=>{
      tablePage.value = 1;
      tablePageSize.value = limit;
      tableData.list = tableDataMark.list.slice((tablePage.value - 1) * tablePageSize.value,tablePageSize.value * tablePage.value)
      tableData.list.forEach((item,index)=>{
        item.$index = (tablePage.value - 1 )* tablePageSize.value + (index + 1);
      })
    }
    return {
      areaIdVal,
      filter,
      searchHandle,
      tableData,
      tablePage,
      tablePageSize,
      tableTotal,
      handleCurrentChange,
      handleSizeChange,
      tableDataMark,
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