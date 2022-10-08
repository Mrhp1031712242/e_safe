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
      <el-form-item label="小区/村居" prop="villageId">
        <el-select v-model="handleForm.villageId" placeholder="请选择小区/村居" clearable filterable style="width:100%" @change="changeVillage">
          <el-option
            v-for="item in villageOptions.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋" prop="buildingId">
        <el-select v-model="handleForm.buildingId" placeholder="请选择楼栋" clearable filterable style="width:100%">
          <el-option
            v-for="item in buildingOptions.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房号" prop="name">
        <el-input size="default"  v-model="handleForm.name" clearable placeholder="请输入房号"></el-input>
      </el-form-item>
      <el-form-item label="业主" prop="owner">
        <el-input size="default"  v-model="handleForm.owner" clearable placeholder="请输入业主"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input size="default"  v-model="handleForm.phone" clearable placeholder="请输入手机号"></el-input>
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
import { roomAdd, roomEdit, roomInfo, villageFromArea,buildingFromVillage } from "@/api/requestData/opsBasicInfo"
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { phoneValidate } from "@/library/validate";
import { strNumData } from "@/utils/commonAny";

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
    const villageOptions = reactive({list:[]});
    const buildingOptions = reactive({list:[]});
    let handleForm = reactive({
      areaId:"",
      villageId:"",
      buildingId:"",
      name:"",
      owner:"",
      phone:"",
    })
    // 区域验证
    const areaIdConfirm = (rule, value, callback) => {
      if(!handleForm.areaId){
        return callback(new Error('请选择区域'))
      }else {
        callback()
      }
    }
    // 手机号验证
    const validatePhone = (rule,value,callback) =>{
      if(!phoneValidate(value)){
        return callback(new Error('请输入正确的手机号'))
      }else{
        callback()
      }
    }
    // 表格验证
    let handleRules = reactive({
      areaId: [{ required: true,validator: areaIdConfirm, trigger: "change" }],
      villageId:[{ required: true, message: "请选择小区/村居", trigger: "change" }],
      buildingId:[{ required: true, message: "请选择楼栋", trigger: "change" }],
      name:[{ required: true, message: "请输入房号", trigger: "blur" }],
      phone:[{ required: true, validator: validatePhone, trigger: "blur" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      areaIdVal.value = store.state.data.cacheData.areaId + '_'+ new Date().getTime() || "";
      handleForm.areaId = store.state.data.cacheData.areaId;
      if(!!store.state.data.cacheData.areaId){
        selectTreeVal(store.state.data.cacheData.areaId);
      }
      !!props.id && getOneIdData(props.id);
    })
    // 获取详情
    const getOneIdData = (id)=>{
      roomInfo(id).then(res=>{
        let data = res.data;
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          if(!!data.areaId){
            selectTreeVal(data.areaId);
          }
          if(!!data.villageId){
            changeVillage(data.villageId)
          }
          handleForm.name = data.name;
          handleForm.owner = data.owner;
          handleForm.phone = data.phone;
          setTimeout(()=>{
            handleForm.villageId = data.villageId;
            handleForm.buildingId = data.buildingId;
            areaIdVal.value = handleForm.areaId + '_'+ new Date().getTime() || "";
          },300)
        }
      })
    }
    
    // 选择区域
    const selectTreeVal = (val)=>{
      handleForm.villageId = "";
      villageOptions.list = [];
      handleForm.areaId = val;
      if(!!val){
        villageFromArea({areaId:val}).then(res=>{
          villageOptions.list = res.data;
        })
      }
    }
    // 选择小区
    const changeVillage = (val)=>{
      handleForm.buildingId = "";
      buildingOptions.list = [];
      if(!!val){
        buildingFromVillage({villageId:val}).then(res=>{
          buildingOptions.list = strNumData(res.data);
        })
      }
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
            villageId:handleForm.villageId,
            buildingId:handleForm.buildingId,
            name:handleForm.name,
            owner:handleForm.owner,
            phone:handleForm.phone,
          }
          if(!props.id){
            roomAdd(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }else{
            paramsData.id = props.id;
            roomEdit(paramsData).then(res=>{
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
      villageOptions,
      buildingOptions,
      TreeRefSelect,
      areaIdVal,
      selectTreeVal,
      changeVillage,
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