<template>
  <main-content class="village_manage_list">
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
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(180401)">新增</el-button>
        <!-- <el-button class="normal_type1_btn" size="small" @click="addMoreHandle">批量新增</el-button>
        <el-button class="success_type1_btn" size="small" @click="editMoreHandle">批量修改</el-button> -->
        <el-button class="danger_type_btn" size="small" @click="delMoreHandle" v-if="permisionBtn(180402)">批量删除</el-button>
        <el-button class="success_type1_btn" size="small" @click="exportIn" v-if="permisionBtn(180405)">导入</el-button>
        <el-button class="success_type2_btn" size="small" @click="exportOut" :outPutLoad="outPutLoad" v-if="permisionBtn(180406)">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter"  @selectTableRows="selectTableRows">
        <el-table-column type="selection" width="55" />
        <table-column prop="$index" label="序号" width="65"/>
        <table-column prop="id" label="监测设备ID" min-width="140" cancopy/>
        <table-column prop="hardwareV" label="硬件版本号" min-width="100" />
        <table-column prop="softwareV" label="软件版本号" min-width="100" />
        <!-- <table-column prop="deviceModelName" label="产品型号" width="100" cancopy/> -->
        <!-- <table-column prop="versionType" label="固件版本" width="100" cancopy/> -->
        <!-- <table-column prop="IMEI" label="IMEI" width="100" cancopy/> -->
        <table-column prop="linkMan" label="设备负责人" width="100" cancopy/>
        <table-column prop="phone" label="手机号" min-width="120" cancopy/>
        <table-column prop="areaStr" label="区域" width="130" cancopy/>
        <table-column prop="address" label="安装位置" min-width="100" cancopy/>
        <!-- <table-column prop="onlineName" label="在线状态" min-width="100" />
        <table-column prop="alarmStatusName" label="告警状态" min-width="100"/>
        <table-column prop="faultTypeName" label="故障状态" min-width="100"/> -->
        <table-column prop="gmtCreated" label="创建时间" min-width="130" />
        <table-column optional  label="操作" width="100" fixed="right">
          <template #default="scope">
            <!-- <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(180403)">修改</el-button> -->
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(180402)">删除</el-button>
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
      <HandleOpsDevsManage
        ref="HandleOpsDevsManage"
        :id="handleAddDialog.handleId"
        @handleAddClose="handleAddClose"
      />
    </el-dialog>
    <!-- 批量新增 -->
    <el-dialog
      title="批量新增"
      v-model="handleAddMoreDialog.dialogVisible"
      width="600px"
      :close-on-click-modal="false" destroy-on-close
    >
      <HandleAddMoreOpsDevsManage
        ref="HandleAddMoreOpsDevs"
        @handleAddMoreClose="handleAddMoreClose"
      />
    </el-dialog>

    <!-- 批量修改 -->
    <el-dialog
      title="批量修改"
      v-model="handleEditMoreDialog.dialogVisible"
      width="1000px"
      :close-on-click-modal="false" destroy-on-close
    >
      <HandleEditMoreOpsDevsManage
        ref="HandleAddMoreOpsDevs"
        @handleEditMoreClose="handleEditMoreClose"
      />
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      title="监测设备导入"
      v-model="handleExportDialog.dialogVisible"
      :width="handleExportDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
      custom-class="export_dialog"
    >
      <ExportInOpsDevs @handleExportClose="handleExportClose" />
    </el-dialog>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive } from "vue"
import { useRoute } from 'vue-router';
import { moniDevsList, moniDevDel ,moniDevMoreDel, moniDevExportOut} from "@/api/requestData/opsBasicInfo"
import HandleOpsDevsManage from "./OpsDevsPart/HandleOpsDevsManage"
import ExportInOpsDevs from "./OpsDevsPart/ExportInOpsDevs"
import HandleAddMoreOpsDevsManage from "./OpsDevsPart/HandleAddMoreOpsDevs"
import HandleEditMoreOpsDevsManage from "./OpsDevsPart/HandleEditMoreOpsDevs"
import { ElMessageBox ,ElMessage} from 'element-plus'
export default defineComponent({
  components:{
    HandleOpsDevsManage,
    ExportInOpsDevs,
    HandleAddMoreOpsDevsManage,
    HandleEditMoreOpsDevsManage
  },
  setup(){
    const areaIdVal = ref("");
    const outPutLoad = ref(false);
    const selections = reactive({list:[]})
    const filter = reactive({
      areaId:"",
      keyWord:"",
    })
    const listTable = ref(null);
    const fetch = moniDevsList;
    const $route = useRoute();
    // 选择rows
    const selectTableRows = (rows) =>{
      selections.list = rows;
    }
    // 定义新增/修改
    let handleAddDialog = reactive({
      title:"",
      dialogVisible:false,
      modalWidth:"800px",
      handleId:"",
    })
    // 定义批量新增
    let handleAddMoreDialog = reactive({
      dialogVisible:false,
    })
    // 定义批量修改
    let handleEditMoreDialog = reactive({
      dialogVisible:false,
    })
    // 定义导入
    let handleExportDialog = reactive({
      dialogVisible:false,
      modalWidth:"1200px",
    })
    
    // 导入
    function exportIn(){
      handleExportDialog.dialogVisible = true;
    }
    // 导出
    function exportOut(){
      outPutLoad.value = true;
      moniDevExportOut(filter).then(res=>{
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
      dialog(true,'新增监测设备','')
    }
    // 批量新增
    function addMoreHandle(){
      handleAddMoreDialog.dialogVisible = true;
    }
    // 批量修改
    function editMoreHandle(){
      handleEditMoreDialog.dialogVisible = true;
    }
    // 批量删除
    function delMoreHandle(){
      if(selections.list.length == 0){
        ElMessage.warning("请选择设备");
        return;
      }else{
        let paramsStr = selections.list.map(item=>item.id).join(",");
        ElMessageBox.confirm(`确定删除所选设备, 是否继续?`, '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          moniDevMoreDel({idStr:paramsStr}).then(res => {
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              ElMessage.success("删除成功!");
              listTable.value.reload(); 
            }
          }).catch(error => {
            console.log(error);
          });
        }).catch((error) => {
          return false;
        })
      }
    }
    // 修改
    function editHandle(p){
      dialog(true,'修改监测设备',p.row.id,'')
    }
    // 关闭新增/修改弹窗
    function handleAddClose(val){
      handleAddDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 关闭批量新增弹框
    function handleAddMoreClose(val){
      handleAddMoreDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 关闭批量修改弹框
    function handleEditMoreClose(val){
      handleEditMoreDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 搜索
    function searchHandle(){
      listTable.value.reload("search");
    }
    // 关闭导入
    const handleExportClose = (val)=>{
      handleExportDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 删除
    const delHandle = (p)=>{
      ElMessageBox.confirm(`确定删除监测设备 ${p.row.id}, 是否继续?`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        moniDevDel(p.row.id).then(res => {
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            ElMessage.success("删除成功!");
            listTable.value.reload(); 
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch((error) => {
        return false;
      })
    }
    return {
      areaIdVal,
      filter,
      fetch,
      selections,
      selectTableRows,
      listTable,
      outPutLoad,
      exportIn,
      exportOut,
      handleAddDialog,
      handleAddMoreDialog,
      handleEditMoreDialog,
      addMoreHandle,
      editMoreHandle,
      delMoreHandle,
      addHandle,
      editHandle,
      delHandle,
      handleAddClose,
      handleAddMoreClose,
      handleEditMoreClose,
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