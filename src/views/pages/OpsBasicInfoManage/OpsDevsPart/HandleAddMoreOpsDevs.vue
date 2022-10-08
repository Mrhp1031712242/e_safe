<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="80px" class="handle_form_wrap">
      <el-form-item label="设备类型" prop="deviceType">
        <dict-select listUrl="/api/device/dev/getDeviceType" v-model="handleForm.deviceType" placeholder="请选择设备类型" style="width:100%"></dict-select>
      </el-form-item>
      <el-form-item label="监测设备ID" prop="baseId">
        <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 16 }"  v-model="handleForm.baseId" clearable placeholder="请输入监测设备ID，一行一个监测设备ID"></el-input>
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
      deviceType:"",
      baseId:"",
    })
    // 区域验证
    const areaIdConfirm = (rule, value, callback) => {
      if(!handleForm.areaId){
        return callback(new Error('请选择区域'))
      }else {
        callback()
      }
    }
    // 表格验证
    let handleRules = reactive({
      deviceType: [{ required: true,message: "请选择设备类型", trigger: "change" }],
      baseId:[{ required: true, message: "请输入监测设备ID", trigger: "blur" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      
    })
    // 提交新增/修改
    const handleSubmit = async(ruleFormRef) =>{
      if(!ruleFormRef){
        return ;
      }
      await ruleFormRef.validate((valid, fields) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!', fields)
        }
      })
    }
    // 关闭新增/修改弹窗
    const quit = (val)=>{
      ctx.emit("handleAddMoreClose",val)
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