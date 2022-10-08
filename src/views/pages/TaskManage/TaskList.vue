<template>
  <main-content class="task_list">
    <div class="top_search_wrap">
      <dict-select class="ipt_words" listUrl="/api/rbac/keyValue/selectList/taskStatus" size="default" v-model="filter.status" style="width:120px;" placeholder="任务状态"></dict-select>
      <dict-select class="ipt_words" listUrl="/api/rbac/keyValue/selectList/taskType" size="default" v-model="filter.taskType" style="width:120px;margin-left:10px;" placeholder="任务类型"></dict-select>
      <el-input v-model="filter.keyword" clearable size="default" placeholder="任务说明/关联监测点" class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(1301)">新增</el-button>
        <el-button class="success_type2_btn" size="small" @click="exportOut" :loading="outPutLoad" v-if="permisionBtn(1304)">导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="65"/>
        <table-column prop="taskType" label="任务类型" width="90" cancopy/>
        <table-column prop="description" label="任务说明" optional min-width="220" :showTip="false">
          <template #default="scope">
            <div v-html="scope.row.description.replace(new RegExp('\n','g'),'<br/>')"></div>
          </template>
        </table-column>
        <table-column  label="关联监测点" min-width="190" optional :showTip="false">
          <template #default="scope">
            <el-popover placement="top-start" :width="200" trigger="hover" effect="dark" 
            popper-class="show_rule_popper" v-if="scope.row.deviceRelMark.length > 2">
              <template #reference>
                <div v-html="scope.row.deviceRelMoniShowStr.replace(new RegExp(',','g'),'<br/>')" class="show_rule3"></div>
              </template>
              <div v-html="scope.row.deviceMonitorName.replace(new RegExp('\n','g'),'<br/>')"></div>
            </el-popover>
            <div v-else v-html="scope.row.deviceMonitorName.replace(new RegExp('\n','g'),'<br/>')" class="show_rule3"></div>
          </template>
        </table-column>
        <table-column prop="statusName" label="任务状态" width="90"/>
        <table-column prop="taskHandlerName" label="处理人" width="100"/>
        <table-column prop="result" label="处理结果"  min-width="90"/>
        <table-column prop="createByName" label="发布人" width="100"/>
        <table-column prop="gmtCreated" label="发布时间" width="150"/>
        <table-column prop="gmtModified" label="处理时间" width="150"/>
        <table-column optional  label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="dutyHandle(scope)" v-if="scope.row.status == 0 && permisionBtn(1302)">处理</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="scope.row.status == 0 && permisionBtn(1302)">关闭</el-button>
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
      <HandleTask
        ref="HandleRoomManage"
        :id="handleAddDialog.handleId"
        @handleAddClose="handleAddClose"
      />
    </el-dialog>

    <!-- 处理 -->
    <el-dialog
      :title="handleDutyDialog.title"
      v-model="handleDutyDialog.dialogVisible"
      :width="handleDutyDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
      custom-class="export_dialog"
    >
      <DutyTask @handleDutyClose="handleDutyClose" 
      :id="handleDutyDialog.handleId"
      :alarmId="handleDutyDialog.alarmId"
      :taskType="handleDutyDialog.taskType"
      />
    </el-dialog>
  </main-content>
</template>

<script>
import { defineComponent,ref ,reactive } from "vue"
import { useRoute } from 'vue-router';
import { taskList, taskEdit , taskExportOut} from "@/api/requestData/taskManage"
import HandleTask from "./Handle/HandleTask"
import DutyTask from "./Handle/DutyTask"
import { ElMessageBox ,ElMessage} from 'element-plus'
export default defineComponent({
  components:{
    HandleTask,
    DutyTask,
  },
  setup(){
    const outPutLoad = ref(false);
    const filter = reactive({
      status:"",
      taskType:"",
      keyword:"",
    })
    const listTable = ref(null);
    const fetch = taskList;
    const $route = useRoute();
    // 定义新增/修改
    let handleAddDialog = reactive({
      title:"",
      dialogVisible:false,
      modalWidth:"600px",
      handleId:"",
    })
    // 定义处理
    let handleDutyDialog = reactive({
      dialogVisible:false,
      modalWidth:"600px",
      title:"",
      handleId:"",
      alarmId:"",
      taskType:"",
    })
    // 搜索
    function searchHandle(){
      listTable.value.reload("search");
    }
    
    // 导出
    function exportOut(){
      outPutLoad.value = true;
      taskExportOut(filter).then(res=>{
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
      dialog(true,'新增任务','')
    }
    // 处理
    function dutyHandle(p){
      handleDutyDialog.dialogVisible = true;
      handleDutyDialog.title = "处理操作";
      handleDutyDialog.handleId = p.row.id;
      handleDutyDialog.alarmId = p.row.alarmId;
      handleDutyDialog.taskType = p.row.taskType;
    }
    // 关闭新增/修改弹窗
    function handleAddClose(val){
      handleAddDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 关闭处理
    const handleDutyClose = (val)=>{
      handleDutyDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 关闭任务
    const delHandle = (p)=>{
      ElMessageBox.confirm(`关闭任务操作, 是否继续?`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id:p.row.id,
          status:2,
        }
        taskEdit(params).then(res => {
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            ElMessage.success("关闭成功!");
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
      filter,
      fetch,
      listTable,
      outPutLoad,
      exportOut,
      handleAddDialog,
      addHandle,
      dutyHandle,
      delHandle,
      handleAddClose,
      searchHandle,
      handleDutyDialog,
      handleDutyClose
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
.task_list{
  .show_rule3{
    cursor: pointer;
  }
}
.show_rule_popper{
  padding: 5px 10px!important;
  line-height: 1.7!important;
}
</style>