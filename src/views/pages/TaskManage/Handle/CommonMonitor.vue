<template>
  <div class="handle_rela_push">
    <div class="top_search_wrap handle_form_wrap">
      <TreeSelect ref="TreeRefSelect"
      :treeOptionData="$store.state.data.handleAreaOptions"
      :propTreeSelId="'TreeSelect' +new Date().getTime()" 
      :nodeClickEffect="true" :modelValue="areaIdVal" 
      class="ipt_tree_sel" style="width:140px" 
      @selectTreeVal="(val)=>filter.areaId = val"/>
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
      >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <el-table-column type="selection" width="55" />
        <table-column prop="$index" label="序号" width="65" />
        <table-column prop="areaStr" label="区域" min-width="140" cancopy />
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
import { moniPointList } from "@/api/requestData/opsBasicInfo"
import { ElMessage } from "element-plus";
export default defineComponent({
  emits:["handleRelaClose","handleSeledMonitor"],
  props:{
    id:{
      type:[String,Number]
    }
  },
  setup(props,ctx){
    const areaIdVal = ref(null);
    const filter = reactive({
      areaId:"",
      keyword:"",
    })
    // 列表
    const tableData = reactive({list:[]})
    const tablePage = ref(1);
    const tablePageSize = ref(20);
    const tableTotal = ref(0);
    const listTable = ref(null);
    const onePageSeledRows = reactive({obj:{}});
    onMounted(()=>{
      tablePage.value = 1;
      tablePageSize.value = 20;
      tableTotal.value = 0;
      onePageSeledRows.obj = {};
      getTableDataList();
    })
    // 获取数据
    const getTableDataList = ()=>{
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
      moniPointList(params).then(res=>{
        res.data.forEach((item,index)=>{
          item.$index = (tablePage.value - 1 )* tablePageSize.value + (index + 1);
        })
        tableData.list = res.data;
        if(Object.keys(onePageSeledRows.obj).length > 0){
          if(onePageSeledRows.obj[tablePage.value] && onePageSeledRows.obj[tablePage.value].length > 0){
            tableData.list.forEach(item=>{
              onePageSeledRows.obj[tablePage.value].forEach(rowItem=>{
                if(item.id == rowItem.id){
                  setTimeout(() => {
                    listTable.value.toggleRowSelection(item,true)
                  })
                }
              })
            })
          }
        }
        tableTotal.value = res.count;
      })
    }
    // 勾选选项获取当前页所有rows
    const handleSelectionChange = (rows)=>{
      onePageSeledRows.obj[tablePage.value] = rows;
    }
    // 选择limit
    const handleSizeChange = (limit)=>{
      tablePage.value = 1;
      tablePageSize.value = limit;
      onePageSeledRows.obj = {};
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
      getTableDataList();
    }
    // 提交
    const handleSubmit = () =>{
      let newArr = [];
      for(let i in onePageSeledRows.obj){
        if(onePageSeledRows.obj[i] && onePageSeledRows.obj[i].length > 0){
          onePageSeledRows.obj[i].forEach(item=>{
            let newObj = {monitorId:'',monitorName:''};
            newObj.monitorId = item.id;
            newObj.monitorName = item.monitorName;
            newArr.push(newObj)
          })
        }
      }
      if(newArr.length == 0){
        ElMessage.warning("暂未选择操作项");
        return;
      } 
      if(newArr.length  > 8){
        ElMessage.warning("选择操作项不能超过8个");
        return;
      } 
      ctx.emit("getSeledMonitor",newArr)
    }

    // 退出
    const quit = (val)=>{
      ctx.emit("handleRelaClose",val)
    }
    return {
      areaIdVal,
      filter,
      searchHandle,

      tableData,
      tablePage,
      tablePageSize,
      tableTotal,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      listTable,

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