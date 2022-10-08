<template>
  <main-content class="use_ele_list">
    <div class="top_search_wrap">
      <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions"
      :propTreeSelId="'treeId'+new Date().getTime()" 
      :modelValue="areaIdVal"  size="default" class="ipt_tree_sel"
      @selectTreeVal="(val)=>filter.areaId=val" 
      style="width:150px;"/>
      <dict-select class="ipt_words" mode="timeTypes" size="default" v-model="filter.dateType" style="width:120px;margin-left:10px;" placeholder="时间类型"></dict-select>
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
      <el-input v-model="filter.keyWord" clearable size="default" placeholder="关键字搜索" class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="success_type2_btn" @click="outPutHandle" :loading="outPutLoad" v-if="permisionBtn(170503)">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table_list_part page_table_list">
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
        <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
        <table-column prop="time" label="抄表时间" min-width="140"/>
        <table-column prop="electricity" label="用电量(度)" min-width="120" :needFixed="2"/>
        <table-column prop="energyCharge" label="电费(元)" :needFixed="2"/>
      </el-table>
      <el-pagination
        class="choose_page"
        @current-change="handleUseEleCurrentChange"
        @size-change="handleUseEleSizeChange"
        :current-page="useElePage"
        :page-sizes="[20,30,40,50,60,70,80,90,100]"
        :page-size="useElePageSize"
        background
        small
        layout="total,sizes, prev, pager, next, jumper"
        :total="useEleTotal"
      ></el-pagination>
    </div>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive,onMounted } from "vue"
import { useEleTotalList ,exportElectricityTotalList} from "@/api/requestData/useEleControl"
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router';
export default defineComponent({
  setup(){
    let areaIdVal = ref("");
    const tableUseEleData = reactive({list:[]});
    const useElePage = ref(1);
    const useElePageSize = ref(20);
    const useEleTotal = ref(0);
    const tableDataMark = reactive({list:[]})

    const $route = useRoute();

    const filter = reactive({
      areaId:"",
      dateType:"HOUR",
      startTime:new Date().parse("yyyy-MM-dd 00:00:00"),
      endTime:new Date().parse("yyyy-MM-dd 23:59:59"),
      keyWord:"",
    })
    const outPutLoad = ref(false);
    onMounted(()=>{
      getTableData();
    })
    // 获取table 数据
    const getTableData = ()=>{
      tableUseEleData.list = tableDataMark.list = []; 
      useEleTotal.value = 0;
      if(Object.keys(filter).length > 0){
        for(let i in filter){
          if(!filter[i]){
            delete filter[i]
          }
        }
      }
      useEleTotalList(filter).then(res=>{
        if(!!res.data){
          tableDataMark.list = JSON.parse(JSON.stringify(res.data));
          useEleTotal.value = tableDataMark.list.length;
          tableUseEleData.list = tableDataMark.list.slice(0,useElePageSize.value);
          tableUseEleData.list.forEach((item,index)=>{
            item.$index = (useElePage.value- 1 ) * useElePageSize.value + (index + 1);
          })
        }
      })
    }
    function searchHandle(){
      useElePage.value = 1;  
      useElePageSize.value = 20; 
      getTableData();
    }
    // 修改page
    const handleUseEleCurrentChange = (page)=>{
      useElePage.value = page;
      tableUseEleData.list = tableDataMark.list.slice((page - 1) * useElePageSize.value,useElePageSize.value * useElePage.value )
      tableUseEleData.list.forEach((item,index)=>{
        item.$index = (useElePage.value - 1 )* useElePageSize.value + (index + 1);
      })
    }
    // 修改limit
    const handleUseEleSizeChange = (limit)=>{
      useElePage.value = 1;
      useElePageSize.value = limit;
      tableUseEleData.list = tableDataMark.list.slice((useElePage.value - 1) * useElePageSize.value,useElePageSize.value * useElePage.value )
      tableUseEleData.list.forEach((item,index)=>{
        item.$index = (useElePage.value - 1 )* useElePageSize.value + (index + 1);
      })
    }
    // 导出
    const outPutHandle = ()=>{
      outPutLoad.value = true;
      exportElectricityTotalList(filter).then(res=>{
        outPutLoad.value = false;
        if(res.data.type == 'application/octet-stream'){
          const blob = res.data;
          let link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.setAttribute('download', `${$route.name}（${new Date().getTime()}）.xlsx`);
          link.click();
          link = null;
        }else{
          outPutLoad.value = false;
          ElMessage.error(res.msg || "导出异常，请联系管理员");
          return;
        }
      })
    }
    return {
      areaIdVal,
      filter,
      searchHandle,
      tableUseEleData,
      useElePage,
      useElePageSize,
      useEleTotal,
      handleUseEleCurrentChange,
      handleUseEleSizeChange,
      tableDataMark,

      outPutHandle,
      outPutLoad
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