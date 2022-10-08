<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="90px" class="handle_form_wrap">
      <el-form-item label="任务类型" prop="taskType">
        <el-select class="ipt_words" v-model="handleForm.taskType" placeholder="请选择任务类型" clearable filterable style="width:100%;">
          <el-option
            v-for="item in [{id:'指派任务',name:'指派任务'}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联监测点" prop="monitorName">
        <div class="rela_moni_btn"><a href="javascript:;" style="font-size:13px;color:#2DA9FA;" @click="selMonitor">选择监测点</a> </div>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" v-model="monitorName" readonly placeholder="请选择监测点"></el-input>
      </el-form-item>
      <el-form-item label="任务说明" prop="description">
        <el-input type="textarea" v-model="handleForm.description" placeholder="请输入任务说明"></el-input>
      </el-form-item>
      <el-form-item label="处理人" prop="taskHandler">
        <el-select class="ipt_words" v-model="handleForm.taskHandler" placeholder="请选择处理人" clearable filterable style="width:100%;">
          <el-option
            v-for="item in users.list"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </div>
    <!-- 点击监测点 -->
    <el-dialog
      :title="relaMonitorDialog.title"
      v-model="relaMonitorDialog.dialogVisible"
      :width="relaMonitorDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
      append-to-body
      custom-class="export_dialog"
    >
      <MonitorList @handleRelaClose="handleRelaClose" @getSeledMonitor="getSeledMonitor"/>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { taskAdd } from "@/api/requestData/taskManage"
import { ElMessage } from "element-plus";
import { userList} from "@/api/requestData/systemManage"
import MonitorList from "./CommonMonitor"
export default defineComponent({
  components:{
    MonitorList,
  },
  props:{
    id:{
      type:[String,Number]
    }
  },
  emits: ["handleAddClose"],
  setup(props,ctx){
    const ruleFormRef = ref(null);
    const monitorName = ref("")
    let handleForm = reactive({
      taskType:'',
      description:"",
      taskHandler:"",
      deviceMonitorIds:[],
      deviceMonitorNames:[],
    })
    const users = reactive({list:[]});
    const relaMonitorDialog = reactive({
      title:"选择监测点 （选择操作项不能超过8个）",
      dialogVisible:false,
      modalWidth:"1000px",
    })
    // 监测点验证
    const areaIdConfirm = (rule, value, callback) => {
      if(!monitorName.value){
        return callback(new Error('请选择监测点'))
      }else {
        callback()
      }
    }
    // 表格验证
    let handleRules = reactive({
      taskType:[{ required: true, message: "请选择任务类型", trigger: "change" }],
      monitorName: [{ required: true,validator: areaIdConfirm }],
      taskHandler:[{ required: true, message: "请选择处理人", trigger: "change" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      getUsers();
    })
    // 获取处理人
    const getUsers = () =>{
      userList({page:1,limit:1000}).then(res=>{
        users.list = res.data;
      })
    }
    // 选择监测点
    const selMonitor = ()=>{
      relaMonitorDialog.dialogVisible = true;
    }
    // 获取监测点
    const getSeledMonitor = (moniArr)=>{
      handleForm.deviceMonitorIds = moniArr.map(item=>item.monitorId);
      handleForm.deviceMonitorNames = moniArr.map(item=>item.monitorName);
      relaMonitorDialog.dialogVisible = false;
      monitorName.value = handleForm.deviceMonitorNames.join(",").replace(/,/g,'\n');
    }
    // 提交新增/修改
    const handleSubmit = async(ruleFormRef) =>{
      if(!ruleFormRef){
        return ;
      }
      await ruleFormRef.validate((valid, fields) => {
        if (valid) {
          if(!props.id){
            taskAdd(handleForm).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }
        } else {
          ElMessage.warning("提交失败");
          return;
        }
      })
    }
    // 关闭新增/修改弹窗
    const quit = (val)=>{
      ctx.emit("handleAddClose",val);
    }

    // 关闭监测点弹窗
    const handleRelaClose = (val)=>{
      relaMonitorDialog.dialogVisible = false;
    }
    return {
      selMonitor,
      monitorName,
      handleForm,
      handleRules,
      handleSubmit,
      ruleFormRef,
      quit,
      relaMonitorDialog,
      users,
      handleRelaClose,
      getSeledMonitor
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
.rela_moni_btn{
  a{
    &:hover{
      opacity: 0.8;
    }
  }
}
</style>