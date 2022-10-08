<template>
  <div class="warning_model_manage">
    <div class="fl le_model">
      <div class="model_title">
        <b>已有模板</b>
      </div>
      <ul class="model_has_list">
        <li v-for="(modelItem,modelIndex) in modelList.list" 
        :key="'model_'+modelIndex" class="model_item"
        :style="{background:modelIndex==selIndex ? '#155ee3':''}"
        @click="chooseModel(modelItem,modelIndex)" :title="modelItem.name">
          <span class="ellipsis" style="width:90%;">{{modelItem.name}}</span>
          <el-icon class="fr del_icon" @click.stop="delOneModel(modelItem,modelIndex)"><Delete /></el-icon>
        </li>
        <li v-if="modelList.list.length == 0" class="no_more">
          暂无数据
        </li>
      </ul>
    </div>
    <div class="fl ri_info_wrap">
      <div class="top_btn top_search_wrap">
        <el-button class="normal_type1_btn" @click="addHandle" v-if="permisionBtn(161003)">新增模板</el-button>
        <el-dropdown :max-height="250" v-if="!handleForm.id">
          <el-button class="normal_type2_btn">复制其他模板数据<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(modelItem,modelIndex) in modelList.list"
              :key="'model_drop_'+modelIndex" @click="copyModel(modelItem)">{{modelItem.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="form_model_info">
        <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="200px" class="handle_form_wrap">
          <el-form-item label="模板名称" prop="name">
            <el-input  v-model="handleForm.name" clearable placeholder="模板名称"></el-input>
          </el-form-item>
          <el-form-item label="匹配结果有效值(%)" prop="active_rate" class="w_form_half" >
            <el-input  v-model="handleForm.active_rate" type="number" clearable placeholder="匹配结果有效值" style="width:75%;"></el-input>
            <el-tooltip content="匹配结果有效值百分比，大于此值则本次检测结果有效" placement="top">
              <b class="show_tip">?</b>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="负载检测门限" prop="pass_threshold" class="w_form_half" >
            <el-input  v-model="handleForm.pass_threshold" type="number" clearable placeholder="负载检测门限" style="width:75%;"></el-input>
            <el-tooltip content="负载检测门限，检测结果大于该门限则认为本模板匹配成功" placement="top">
              <b class="show_tip">?</b>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="最小电流(A)" prop="current_min" class="w_form_half" >
            <el-input  v-model="handleForm.current_min" type="number" clearable placeholder="最小电流" style="width:75%;"></el-input>
            <el-tooltip content="本模板最小电流，低于此值将不执行匹配" placement="top">
              <b class="show_tip">?</b>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="最大电流(A)" prop="current_max" class="w_form_half">
            <el-input  v-model="handleForm.current_max" type="number" clearable placeholder="最大电流" style="width:75%;"></el-input>
            <el-tooltip content="本模板最大电流，超出此值将不执行匹配" placement="top">
              <b class="show_tip">?</b>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="波形匹配时最大偏移角度(度)" prop="angle_max" class="w_form_half" >
            <el-input  v-model="handleForm.angle_max" type="number" clearable placeholder="波形匹配时最大偏移角度"></el-input>
          </el-form-item>
          <el-form-item label="波形匹配时最大偏移样本点数" prop="count_max" class="w_form_half" >
            <el-input  v-model="handleForm.count_max" type="number" clearable placeholder="波形匹配时最大偏移样本点数"></el-input>
          </el-form-item>
          <el-form-item label="波形匹配时起始角度(度)" prop="match_start_angle" class="w_form_half">
            <el-input  v-model="handleForm.match_start_angle" type="number" clearable placeholder="波形匹配时起始角度"></el-input>
          </el-form-item>
          <el-form-item label="波形匹配时结束角度(度)" prop="match_end_angle" class="w_form_half">
            <el-input  v-model="handleForm.match_end_angle" type="number" clearable placeholder="波形匹配时结束角度"></el-input>
          </el-form-item>
          <el-form-item label="滤波算法类型" prop="fir_type" class="w_form_half">
            <dict-select mode="firType" disabled v-model="handleForm.fir_type" placeholder="滤波算法类型"></dict-select>
          </el-form-item>
          <el-form-item label="滤波算法带通频率下限(Hz)" prop="fir_low" class="w_form_half">
            <el-input  v-model="handleForm.fir_low" type="number" clearable placeholder="滤波算法带通频率下限"></el-input>
          </el-form-item>
          <el-form-item label="滤波算法带通频率上限(Hz)" prop="fir_hight" class="w_form_half">
            <el-input  v-model="handleForm.fir_hight" type="number" clearable placeholder="滤波算法带通频率上限"></el-input>
          </el-form-item>
          <el-form-item label="滤波类型" prop="filter_type" class="w_form_half">
            <dict-select mode="filterType" disabled v-model="handleForm.filter_type" placeholder="滤波类型"></dict-select>
          </el-form-item>
          <el-form-item label="滤波分段数量" prop="orders" class="w_form_half">
            <el-input  v-model="handleForm.orders" disabled type="number" clearable placeholder="滤波分段数量"></el-input>
          </el-form-item>
          <el-form-item label="是否告警" prop="type" class="w_form_half">
            <el-radio-group v-model="handleForm.type">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit(ruleFormRef)" v-if="permisionBtn(161003)">{{!handleForm.id ? '新增保存' :'修改保存'}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue';
import { warningModelAdd, warningModelDel, warningModelList } from "@/api/requestData/systemManage";
import { ArrowDown ,Delete} from '@element-plus/icons-vue';
import { ElMessageBox ,ElMessage} from 'element-plus'
export default defineComponent({
  components:{
    ArrowDown,
    Delete
  }, 
  emits:["closeHandle"], 
  setup(props,ctx){
    const modelList = reactive({list:[]})
    const selIndex = ref(-1);
    const ruleFormRef = ref(null);
    let handleForm = reactive({
      id:null,
      devtype:"1",
      name:"",
      active_rate:"",
      pass_threshold:"",
      angle_max:"",
      count_max:"",
      current_min:"",
      current_max:"",
      match_start_angle:"",
      match_end_angle:"",
      fir_type:"2",
      fir_hight:"",
      fir_low:"",
      filter_type:"1",
      orders:"2",
      type:"0"
    })
    let handleRules = reactive({
      name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
      active_rate: [{ required: true, message: "请输入匹配结果有效值", trigger: "blur" }],
      pass_threshold: [{ required: true, message: "请输入负载检测门限", trigger: "blur" }],
      count_max: [{ required: true, message: "请输入波形匹配时最大偏移样本点数", trigger: "blur" }],
      angle_max: [{ required: true, message: "请输入波形匹配时最大偏移角度", trigger: "blur" }],
      current_min: [{ required: true, message: "请输入最小电流", trigger: "blur" }],
      current_max: [{ required: true, message: "请输入最大电流", trigger: "blur" }],
      match_start_angle: [{ required: true, message: "请输入波形匹配时起始角度", trigger: "blur" }],
      match_end_angle: [{ required: true, message: "请输入波形匹配时结束角度", trigger: "blur" }],
      fir_low: [{ required: true, message: "请输入滤波算法带通频率下限", trigger: "blur" }],
      fir_hight: [{ required: true, message: "请输入滤波算法带通频率上限", trigger: "blur" }],
    })

    onMounted(()=>{
      initAlarmData();
      viewAllModel();
    })

    // 选择左侧模板
    const chooseModel = (item,index)=>{
      ruleFormRef.value.resetFields();
      selIndex.value = index;
      getOneModelData(item);
    }
    // 获取某一个模板数据
    const getOneModelData = (item)=>{
      for(let i in handleForm){
        handleForm[i] = item.electricTemplate[i];
        handleForm.id = item.id;
      }
    }
    // 删除某一个模板数据
    const delOneModel = (item,index)=>{
      selIndex.value = index;
      ElMessageBox.confirm(`确定删除模板 ${item.name}, 是否继续?`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        warningModelDel(item.id).then(res=>{
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            ElMessage.success("删除成功");
            modelList.list.splice(index,1);
            initAlarmData();
            quit(true);
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch((error) => {
        return false;
      });
    }

    // 点击新增
    const addHandle = ()=>{
      initAlarmData();
    }
    // 选择复制按钮下的模板
    const copyModel = (item)=>{
      ruleFormRef.value.resetFields();
      for(let i in handleForm){
        if(i != 'id'){
          handleForm[i] = item.electricTemplate[i];
        }
      }
      handleForm.id = null;
    }
    // 初始化数据
    const initAlarmData = ()=>{
      for(let i in handleForm){
        handleForm[i] = "";
      }
      handleForm.id = null;
      handleForm.fir_type = "2";
      handleForm.filter_type = "1";
      handleForm.orders = "2";
      handleForm.type = "0";
      selIndex.value = -1;
    }
    // 获取所有告警模板
    const viewAllModel = () =>{
      warningModelList().then(res=>{
        modelList.list = res.data || [];
      })
    }
    // 保存
    const handleSubmit = async(ruleFormRef) =>{
      if(!ruleFormRef){
        return;
      }
      await ruleFormRef.validate((valid, fields) => {
        if (valid) {
          warningModelAdd(handleForm).then(res=>{
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              ElMessage.success(!handleForm.id ? "新增成功" : "修改成功");
              viewAllModel()
              setTimeout(()=>{
                !handleForm.id && initAlarmData();
                quit(true);
              })
            }
          })
        } else {
          ElMessage.warning("提交失败");
          return;
        }
      })
    }
    // 关闭
    const quit = (val)=>{
      ctx.emit("closeHandle",val)
    }

    return {
      modelList,
      selIndex,
      chooseModel,
      copyModel,

      ruleFormRef,
      handleForm,
      handleRules,
      handleSubmit,
      delOneModel,
      quit,
      addHandle,
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
.warning_model_manage{
  overflow: hidden;
  width: 100%;
  height: 450px;
  .le_model{
    width: 200px;
    height: 100%;
    background: rgba(3, 65, 139,0.2);
    border-radius: 4px;
    .model_title{
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border-bottom: 1px solid #155ee3;
      font-size: 16px;
    }
    .model_has_list{
      overflow: auto;
      margin-top:10px;
      height: calc(100% - 50px);
      .model_item{
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        cursor: pointer;
        .del_icon{
          display: none;
          width: 10%;
          height: 100%;
          line-height: 40px;
          color: #F56C6C;
          transform: translateY(2px);
        }
        &:hover{
          background: #2F51A5;
          .del_icon{
            display: inline-block;
          }
        }
      }
      .no_more{
        padding: 30px 0;
        text-align: center;
        margin-top: 30%;
        color: rgba(255,255,255,0.6);
        font-size: 13px;
      }
    }
    
  }
  .ri_info_wrap{
    width: calc(100% - 200px);
    height: 100%;
    position: relative;
    .top_btn{
      padding: 0 10px;
      .el-dropdown{
        vertical-align: middle;
        margin-left: 20px;
      }
    }
    .form_model_info{
      margin-top: 15px;
      height: calc(100% - 115px);
      overflow: auto;
      overflow-x: hidden;
      padding: 0 10px;
      margin-bottom: 90px;
    }
    .control_dialog{
      padding: 20px 0 0 0;
      text-align: center;
      background: #15103B;
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 10;
      margin-top: 0;
    }
  }
}
</style>