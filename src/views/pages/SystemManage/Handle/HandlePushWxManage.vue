<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="120px" class="handle_form_wrap">
      <el-form-item label="推送用户" prop="userName">
        <el-input size="default"  v-model="handleForm.userName" clearable placeholder="请输入推送用户"></el-input>
      </el-form-item>
      <el-form-item label="用户openid" prop="openid">
        <el-input v-model="handleForm.openid" clearable placeholder="请输入用户openid"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="handleForm.remark" clearable placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { ElMessage } from "element-plus";
import { pushControlAdd, viewPushControl ,pushControlEdit} from "@/api/requestData/systemManage"
export default defineComponent({
  props:{
    id:{
      type:[String,Number]
    }
  },
  emits: ["handleAddClose"],
  setup(props,ctx){
    const ruleFormRef = ref(null);
    let handleForm = reactive({
      userName:"",
      openid:"",
      remark:"",
    })
    // 表格验证
    let handleRules = reactive({
      userName:[{ required: true, message: "请输入推送用户", trigger: "blur" }],
      openid:[{ required: true, message: "请输入用户openid", trigger: "blur" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      !!props.id && getOneIdData(props.id);
    })
    // 获取详情
    const getOneIdData = (id)=>{
      viewPushControl(id).then(res=>{
        let data = res.data;
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          handleForm.userName = data.userName;
          handleForm.openid = data.openid;
          handleForm.remark = data.remark;
        }
      })
    }
    // 提交新增/修改
    const handleSubmit = async(ruleFormRef) =>{
      if(!ruleFormRef){
        return ;
      }
      await ruleFormRef.validate((valid, fields) => {
        if (valid) {
          let paramsData = {
            id:null,
            userName:handleForm.userName,
            openid:handleForm.openid,
            remark:handleForm.remark,
          }
          if(!props.id){
            pushControlAdd(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }else{
            paramsData.id = props.id;
            pushControlEdit(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("修改成功");
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

    return {
      handleForm,
      handleRules,
      handleSubmit,
      ruleFormRef,
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

</style>