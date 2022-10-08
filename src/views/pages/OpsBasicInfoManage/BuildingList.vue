<template>
  <main-content class="building_list">
    <div class="top_search_wrap">
      <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions" 
      propTreeSelId="timeSavingStat" :modelValue="areaIdVal"  
      @selectTreeVal="(val)=>filter.areaId=val"
      size="default" class="ipt_tree_sel" 
      style="width:150px;"/>
      <el-input v-model="filter.keyWord" clearable size="default" placeholder="关键字搜索" class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(180201)">新增</el-button>
        <el-button class="success_type1_btn" size="small" @click="exportIn" v-if="permisionBtn(180205)">导入</el-button>
        <el-button class="success_type2_btn" size="small" @click="exportOut" :loading="outPutLoad" v-if="permisionBtn(180206)">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="65"/>
        <table-column prop="areaStr" label="区域" min-width="120" cancopy/>
        <table-column prop="villageName" label="小区/村居" min-width="100" cancopy/>
        <table-column prop="name" label="楼栋名称" min-width="110" cancopy/>
        <table-column prop="address" label="具体地址" min-width="130" cancopy/>
        <table-column prop="longitude" label="经度" min-width="80"/>
        <table-column prop="latitude" label="纬度" min-width="80"/>
        <table-column prop="linkMan" label="楼栋负责人" min-width="100"/>
        <table-column prop="phone" label="手机号" min-width="90"/>
        <table-column prop="pmc" label="物业公司" />
        <table-column optional  label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(180203)">修改</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(180202)">删除</el-button>
          </template>
        </table-column>
      </table-list>
    </div>

    <!-- 新增/修改 -->
    <el-dialog
      :title="handleAddDialog.title"
      v-model="handleAddDialog.dialogVisible"
      :width="handleAddDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
    >
      <HandleBuilding
        ref="HandleBuilding"
        :id="handleAddDialog.handleId"
        @handleAddClose="handleAddClose"
      />
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      title="楼栋导入"
      v-model="handleExportDialog.dialogVisible"
      :width="handleExportDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
      custom-class="export_dialog"
    >
      <ExportInBuilding @handleExportClose="handleExportClose" />
    </el-dialog>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive } from "vue"
import { useRoute } from 'vue-router';
import { buildingList, buildingDel , buildingExportOut} from "@/api/requestData/opsBasicInfo"
import HandleBuilding from "./BuildingListPart/HandleBuilding"
import ExportInBuilding from "./BuildingListPart/ExportInBuilding"
import { ElMessageBox ,ElMessage} from 'element-plus'
export default defineComponent({
  components:{
    HandleBuilding,
    ExportInBuilding,
  },
  setup(){
    const areaIdVal = ref("");
    const outPutLoad = ref(false);
    const filter = reactive({
      areaId:"",
      keyWord:"",
    })
    const listTable = ref(null);
    const fetch = buildingList;
    const $route = useRoute();
    // 定义新增/修改
    let handleAddDialog = reactive({
      title:"",
      dialogVisible:false,
      modalWidth:"600px",
      handleId:"",
    })
    // 定义导入
    let handleExportDialog = reactive({
      dialogVisible:false,
      modalWidth:"1100px",
    })
    // 搜索
    function searchHandle(){
      listTable.value.reload("search");
    }
    // 导入
    function exportIn(){
      handleExportDialog.dialogVisible = true;
    }
    // 导出
    function exportOut(){
      outPutLoad.value = true;
      buildingExportOut(filter).then(res=>{
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
          ElMessage.error(res.msg || "没有足够的权限");
          return;
        }
      })
    }
    // 新增修改封装
    const dialog = (bool, title, handleId)=>{
      handleAddDialog.dialogVisible = bool;
      handleAddDialog.title = title;
      handleAddDialog.handleId = handleId;
    }
    // 新增
    function addHandle(){
      dialog(true,'新增楼栋','')
    }
    // 修改
    function editHandle(p){
      dialog(true,'修改楼栋',p.row.id,'')
    }
    // 关闭新增/修改弹窗
    function handleAddClose(val){
      handleAddDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 关闭导入
    const handleExportClose = (val)=>{
      handleExportDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 删除
    const delHandle = (p)=>{
      ElMessageBox.confirm(`确定删除楼栋 ${p.row.name}, 是否继续?`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        buildingDel(p.row.id).then(res => {
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            ElMessage.success("删除成功!");
            listTable.value.reload(); 
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch((error) => {
        return false;
      });
    }
    return {
      areaIdVal,
      outPutLoad,
      filter,
      listTable,
      fetch,
      exportIn,
      exportOut,
      handleAddDialog,
      addHandle,
      editHandle,
      delHandle,
      handleAddClose,
      searchHandle,
      handleExportDialog,
      handleExportClose
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