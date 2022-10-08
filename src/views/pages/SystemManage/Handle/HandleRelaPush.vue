<template>
  <div class="handle_rela_push">
    <div class="top_search_wrap handle_form_wrap">
      <TreeSelect ref="TreeRefSelect"
      :treeOptionData="$store.state.data.handleAreaOptions"
      :propTreeSelId="'TreeSelect' +new Date().getTime()" 
      :nodeClickEffect="true" :modelValue="areaIdVal" 
      class="ipt_tree_sel" style="width:140px" 
      @selectTreeVal="selectTreeVal"/>
      <el-select class="ipt_words" v-model="filter.villageId" placeholder="小区/村居" clearable filterable style="width:150px;margin-left:10px;">
        <el-option
          v-for="item in villageOptions.list"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <dict-select class="ipt_words" mode="isRela" size="default" v-model="filter.rel" style="width:120px;margin-left:10px;" placeholder="关联状态"></dict-select>
      <el-input size="default" v-model="filter.keyword" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <div class="table_list_part">
      <el-table
        ref="listTable"
        :data="tableData.list"
        class="table_height"
        size="default"
        height="400"
        @selection-change="handleSelectionChange"
        @select="seledCheckIpt"
        @select-all="selectAll"
      >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <el-table-column type="selection" width="55" />
        <table-column prop="$index" label="序号" width="65" />
        <table-column prop="areaName" label="区域" min-width="140" cancopy />
        <table-column prop="villageName" label="小区/村居" min-width="140" cancopy/>
        <table-column prop="buildingName" label="楼栋名称" min-width="140" cancopy/>
        <table-column prop="monitorName" label="监测点" min-width="140" cancopy/>
      </el-table>
      <el-pagination
        class="choose_page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tablePage"
        :page-sizes="[20, 30, 40,50,100,150,200,300]"
        :page-size="tablePageSize"
        background
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotal"
      ></el-pagination>
    </div>
    <div class="control_dialog" style="margin-top:30px;">
      <el-button @click="quit(false)">关 闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { villageFromArea } from "@/api/requestData/opsBasicInfo"
import { getRelMonitor, relaPush } from "@/api/requestData/systemManage"
import { ElMessage } from "element-plus";
import { delArrRepeat } from "@/utils/commonAny"
export default defineComponent({
  emits:["handleRelaPushClose"],
  props:{
    id:{
      type:[String,Number]
    }
  },
  setup(props,ctx){
    const areaIdVal = ref(null);
    const villageOptions = reactive({list:[]})
    const filter = reactive({
      pushId:props.id,
      areaId:"",
      villageId:"",
      keyword:"",
      rel:""
    })
    // 列表
    const tableData = reactive({list:[]})
    const tablePage = ref(1);
    const tablePageSize = ref(20);
    const tableTotal = ref(0);
    const listTable = ref(null);
    const originalTableSeledRows = reactive({list:[]});
    const originalTableSeledRowsMark = reactive({list:[]});
    const onePageSeledRows = reactive({obj:{}});
    onMounted(()=>{
      filter.pushId = props.id;
      tablePage.value = 1;
      tablePageSize.value = 20;
      tableTotal.value = 0;
      onePageSeledRows.obj = {};
      originalTableSeledRows.list = [];
      originalTableSeledRowsMark.list = [];
      getTableDataList().then(data=>{
        getAllTableDataList(data || 10000);
      })
    })
    // 选择区域
    const selectTreeVal = (val)=>{
      filter.villageId = "";
      villageOptions.list = [];
      filter.areaId = val;
      if(!!val){
        villageFromArea({areaId:val}).then(res=>{
          villageOptions.list = res.data;
        })
      }
    }
    // 获取所有table 数据
    const getAllTableDataList = (limit)=>{
      getRelMonitor({pushId:props.id,page:1,limit:limit,rel:"1"}).then(res=>{
        originalTableSeledRows.list = res.data;
        originalTableSeledRowsMark.list = JSON.parse(JSON.stringify(res.data))
      })
    }
    // 获取数据
    async function getTableDataList(){
      if(Object.keys(filter).length > 0){
        for(let i in filter){
          if(!filter[i]){
            delete filter[i]
          }
        }
      }
      let params = {
        page:tablePage.value,
        limit:tablePageSize.value,
        ...filter
      }
      let res = await getRelMonitor(params);
      res.data.forEach((item,index)=>{
        item.$index = (tablePage.value - 1 )* tablePageSize.value + (index + 1);
      })
      tableData.list = res.data;
      if(onePageSeledRows.obj[tablePage.value] && onePageSeledRows.obj[tablePage.value].length > 0){
        tableData.list.forEach(item=>{
          onePageSeledRows.obj[tablePage.value].forEach(rowItem=>{
            if(item.monitorId == rowItem.monitorId){
              setTimeout(() => {
                listTable.value.toggleRowSelection(item,true)
              })
            }
          })
        })
      }else{
        tableData.list.forEach((item,index)=>{
          item.$index = (tablePage.value - 1 )* tablePageSize.value + (index + 1);
          if(item.rel == "1"){
            setTimeout(() => {
              listTable.value.toggleRowSelection(item,true)
            })
          }
        })
      }
      tableTotal.value = res.count;
      return res.count;
    }
    // 勾选选项获取当前页所有rows
    const handleSelectionChange = (rows)=>{
      onePageSeledRows.obj[tablePage.value] = rows;
    }
    // 全页勾选
    const selectAll = (rows)=>{
      if(rows.length == 0){
        let tableDataMark = JSON.parse(JSON.stringify(tableData.list))
        originalTableSeledRows.list = delArrRepeat(originalTableSeledRowsMark.list,tableDataMark,'monitorId');
      }
    }
    // 勾选checkbox
    const seledCheckIpt = (rows,rowItem)=>{
      let selected = rows.length && rows.indexOf(rowItem) !== -1;
      if(!!selected){
        if(originalTableSeledRows.list.some(item=>item.monitorId == rowItem.monitorId)){
          return;
        }else{
          originalTableSeledRows.list.push(rowItem)
        }
      }else{
        let rowIndex = 0;
        originalTableSeledRows.list.forEach((item,index)=>{
          if(rowItem.monitorId == item.monitorId){
            rowIndex = index;
          }
        })
        originalTableSeledRows.list.splice(rowIndex,1)
      }
    }
    // 选择limit
    const handleSizeChange = (limit)=>{
      tablePage.value = 1;
      tablePageSize.value = limit;
      onePageSeledRows.obj = {};
      originalTableSeledRows.list = originalTableSeledRowsMark.list;
      getTableDataList();
    }
    // 选择page
    const handleCurrentChange = (page)=>{
      tablePage.value = page;
      getTableDataList();
    }

    // 搜索
    const searchHandle = (val)=>{
      tablePage.value = 1;
      tablePageSize.value = 20;
      onePageSeledRows.obj = {};
      originalTableSeledRows.list = originalTableSeledRowsMark.list;
      getTableDataList();
    }
    // 获取表格当前勾选的所有数据
    const getPageSeledRowIds = (seledObj)=>{
      let newArr = [];
      if(Object.keys(seledObj).length > 0){
        for(let i in seledObj){
          if(seledObj[i].length > 0){
            seledObj[i].forEach(item=>{
              newArr.push(item);
            })
          }
        }
      }
      return newArr.map(item=>item.monitorId);
    }
    // 提交
    const handleSubmit = () =>{
      let pageSeledRowIds = getPageSeledRowIds(onePageSeledRows.obj);
      let originalAndChosoedIds = originalTableSeledRows.list.map(item=>item.monitorId);
      let allIds = [...new Set(pageSeledRowIds.concat(...originalAndChosoedIds))];
      let params = {
        detail:allIds,
        pushId:props.id
      }
      if(allIds.length == 0){
        ElMessage.warning("暂未选择操作项");
        return;
      } 
      relaPush(params).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          ElMessage.success("提交成功");
          quit(false);
        }
      })
    }

    // 退出
    const quit = (val)=>{
      ctx.emit("handleRelaPushClose",val)
    }
    return {
      areaIdVal,
      villageOptions,
      filter,
      selectTreeVal,
      searchHandle,

      tableData,
      tablePage,
      tablePageSize,
      tableTotal,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      listTable,
      seledCheckIpt,
      selectAll,

      handleSubmit,
      quit,
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
.handle_rela_push{
  .choose_page{
    float: left;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner,
  .el-checkbox__input.is-checked .el-checkbox__inner{
    --el-checkbox-checked-bg-color:#1EC695;
    --el-checkbox-checked-input-border-color:#1EC695;
  }
}
</style>