<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="120px" class="handle_form_wrap">
      <el-form-item label="选择区域" prop="areaId">
        <TreeSelect ref="TreeRefSelect"
        :treeOptionData="$store.state.data.handleAreaOptions"
        :propTreeSelId="'TreeSelect' +new Date().getTime()" 
        :nodeClickEffect="true" :modelValue="areaIdVal" 
        class="ipt_tree_sel" style="width:100%" 
        @selectTreeVal="selectTreeVal"/>
      </el-form-item>
      <el-form-item label="小区/村居名称" prop="name">
        <el-input size="default"  v-model="handleForm.name" clearable placeholder="请输入小区/村居名称"></el-input>
      </el-form-item>
      <el-form-item label="电价" prop="electrovalence">
        <el-input type="number" v-model="handleForm.electrovalence" clearable placeholder="请输入电价"></el-input>
      </el-form-item>
      <el-form-item label="最大透支用电" prop="maxBeyondQuantity">
        <el-input type="number" v-model="handleForm.maxBeyondQuantity" clearable placeholder="请输入最大透支用电"></el-input>
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
import { villageAdd, villageEdit, villageInfo } from "@/api/requestData/opsBasicInfo"
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default defineComponent({
  props:{
    id:{
      type:[String,Number]
    }
  },
  emits: ["handleAddClose"],
  setup(props,ctx){
    const store = useStore();
    const ruleFormRef = ref(null);
    const TreeRefSelect = ref(null);
    const areaIdVal = ref("");
    let handleForm = reactive({
      areaId:'',
      name:"",
      electrovalence:"",
      maxBeyondQuantity:"",
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
      areaId: [{ required: true,validator: areaIdConfirm, trigger: "change" }],
      name:[{ required: true, message: "请输入小区/村居名称", trigger: "blur" }],
      electrovalence:[{ required: true, message: "请输入电价", trigger: "blur" }],
      maxBeyondQuantity:[{ required: true, message: "请输入最大透支用电", trigger: "blur" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      areaIdVal.value = store.state.data.cacheData.areaId + '_'+ new Date().getTime() || "";
      handleForm.areaId = store.state.data.cacheData.areaId;
      !!props.id && getOneIdData(props.id);
    })
    // 获取详情
    const getOneIdData = (id)=>{
      villageInfo(id).then(res=>{
        let data = res.data;
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          handleForm.areaId = data.areaId;
          handleForm.name = data.name;
          handleForm.electrovalence = data.electrovalence;
          handleForm.maxBeyondQuantity = data.maxBeyondQuantity;
          areaIdVal.value = handleForm.areaId + '_'+ new Date().getTime() || "";
        }
      })
    }
    // 选择区域
    const selectTreeVal = (val)=>{
      handleForm.areaId = val;
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
            areaId:handleForm.areaId,
            name:handleForm.name,
            electrovalence:handleForm.electrovalence,
            maxBeyondQuantity:handleForm.maxBeyondQuantity,
          }
          if(!props.id){
            villageAdd(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }else{
            paramsData.id = props.id;
            villageEdit(paramsData).then(res=>{
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
      TreeRefSelect.value.initValue();
      ctx.emit("handleAddClose",val);
    }

    return {
      TreeRefSelect,
      areaIdVal,
      selectTreeVal,
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