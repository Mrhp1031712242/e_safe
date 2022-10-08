<template>
  <main-content class="ops_point_list">
    <div class="top_search_wrap">
      <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions"
      :propTreeSelId="'treeId'+new Date().getTime()" 
      @selectTreeVal="(val)=>filter.areaId=val"
      :modelValue="areaIdVal"  size="default" class="ipt_tree_sel" 
      style="width:150px;"/>
      <el-input v-model="filter.keyword" clearable size="default" placeholder="关键字搜索" class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(180501)">新增</el-button>
        <el-button class="success_type1_btn" size="small" @click="exportIn" v-if="permisionBtn(180505)">导入</el-button>
        <el-button class="success_type2_btn" size="small" @click="exportOut" :loading="outPutLoad" v-if="permisionBtn(180506)">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="65" />
        <table-column prop="areaStr" label="区域" min-width="120" cancopy />
        <table-column prop="roomName" label="房号" min-width="100" cancopy />
        <table-column prop="monitorName" label="监测点" min-width="120" :showTip="false" cancopy/>
        <table-column prop="deviceId" label="监测设备ID" min-width="130" cancopy/>
        <table-column prop="port" label="端口" min-width="80"/>
        <table-column prop="meterId" label="电表编号" min-width="80" cancopy/>
        <table-column label="断/上电" min-width="80" optional v-if="permisionBtn(180507)">
          <template #default="scope">
            <el-tooltip :content="scope.row.portOnline == true ? '上电' : '断电'" placement="top" v-if="scope.row.portOnline!= null">
              <el-switch
                :class="[scope.row.portOnline == false ? 'switchActive' : '' ]"
                v-model="scope.row.portOnline"
                :active-value="true"
                :inactive-value="false"
                active-color="#fff"
                inactive-color="#C4C4C4"
                @change="changeActiveOpt(scope)"
              ></el-switch>
            </el-tooltip>
            <span v-else>-</span>
          </template>
        </table-column>
        <table-column optional  label="操作" width="100" fixed="right">
          <template #default="scope">
            <!-- <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(180503)">修改</el-button> -->
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(180502)">删除</el-button>
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
      <HandleOpsPointManage
        ref="HandleOpsPointManage"
        :id="handleAddDialog.handleId"
        @handleAddClose="handleAddClose"
      />
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      title="监测点导入"
      v-model="handleExportDialog.dialogVisible"
      :width="handleExportDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
      custom-class="export_dialog"
    >
      <ExportOpsPoint @handleExportClose="handleExportClose" />
    </el-dialog>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive } from "vue"
import { useRoute } from 'vue-router';
import { moniPointList, moniPointDel , moniPointExportOut , activeOrInactivePort} from "@/api/requestData/opsBasicInfo"
import HandleOpsPointManage from "./OpsPointPart/HandleOpsPointManage"
import ExportOpsPoint from "./OpsPointPart/ExportOpsPoint"
import { ElMessageBox ,ElMessage} from 'element-plus'
export default defineComponent({
  components:{
    HandleOpsPointManage,
    ExportOpsPoint,
  },
  setup(){
    const areaIdVal = ref("");
    const outPutLoad = ref(false);
    const filter = reactive({
      areaId:"",
      keyword:"",
    })
    const listTable = ref(null);
    const fetch = moniPointList;
    const $route = useRoute();
    // 定义新增/修改
    let handleAddDialog = reactive({
      title:"",
      dialogVisible:false,
      modalWidth:"700px",
      handleId:"",
    })
    // 定义导入
    let handleExportDialog = reactive({
      dialogVisible:false,
      modalWidth:"1200px",
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
      moniPointExportOut(filter).then(res=>{
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
    function addHandle(p){
      dialog(true,'新增监测点','')
    }
    // 修改
    function editHandle(p){
      dialog(true,'修改监测点',p.row.id,'')
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
      ElMessageBox.confirm(`确定删除监测点 ${p.row.monitorName}, 是否继续?`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        moniPointDel(p.row.id).then(res => {
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
    // 上断电
    const changeActiveOpt = (p)=>{
      let msg = p.row.portOnline == true ? "上电" : "断电";
      ElMessageBox.confirm(`${msg}操作，是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            meterId:p.row.meterId,
            port:p.row.port,
            statusValue:p.row.portOnline == false ? "0" : "1",
          }
          activeOrInactivePort(params).then(res=>{
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              ElMessage.success(`已${msg}`);
            }else{
              p.row.portOnline = !p.row.portOnline;
            }
          }).catch(error=>{
            p.row.portOnline = !p.row.portOnline;
          })
        })
        .catch(() => {
          p.row.portOnline = !p.row.portOnline;
          return false;
        });
    }
    return {
      areaIdVal,
      filter,
      fetch,
      listTable,
      outPutLoad,
      exportIn,
      exportOut,
      handleAddDialog,
      addHandle,
      editHandle,
      delHandle,
      handleAddClose,
      searchHandle,
      handleExportDialog,
      handleExportClose,
      changeActiveOpt
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