<template>
  <div class="warning_set">
    <div class="load_init"><a href="javascript:;" @click="getSystemWarningData()">加载默认值</a> </div>
    <div class="wanring_form_wrap">
      <el-form ref="handleWarningForm" :model="handleForm"  label-width="130px" class="handle_form_wrap">
        <el-form-item label="过载告警门限(w)" prop="overload" class="w_form_half">
          <el-input type="number" v-model="handleForm.overload" clearable placeholder="请输入过载告警门限" style="width:85%;"></el-input>
          <el-tooltip content="当负载功率大于该值时，系统产生过载告警" placement="top">
            <b class="show_tip">?</b>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="过流告警门限(A)" prop="overcurrent" class="w_form_half">
          <el-input  type="number" v-model="handleForm.overcurrent" clearable placeholder="请输入过流告警门限" style="width:85%;"></el-input>
          <el-tooltip content="当负载电流大于该值时，系统产生过流告警" placement="top">
            <b class="show_tip">?</b>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="过压告警门限(v)" prop="overvoltage" class="w_form_half">
          <el-input  type="number" v-model="handleForm.overvoltage" clearable placeholder="请输入过压告警门限" style="width:85%;"></el-input>
          <el-tooltip content="当负载电压大于该值时，系统产生过压告警" placement="top">
            <b class="show_tip">?</b>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="欠压告警门限(v)" prop="undervoltage" class="w_form_half">
          <el-input  type="number" v-model="handleForm.undervoltage" clearable placeholder="请输入欠压告警门限" style="width:85%;"></el-input>
          <el-tooltip content="当负载电压小于该值时，系统产生欠压告警" placement="top">
            <b class="show_tip">?</b>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="功率因素告警门限" prop="powerFactor" class="w_form_half">
          <el-input  type="number" v-model="handleForm.powerFactor" clearable placeholder="请输入功率因素告警门限" style="width:85%;"></el-input>
          <el-tooltip :raw-content="true" :content="'功率因素小于该值时候，系统产生功率因素告警。'+'<br/>'+'功率因素是电压与电流相位差的余弦值。'+'<br/>'+'取值范围[0,1]，0表示电路为纯电感性或纯电容性负载；'+'<br/>'+'1表示电路为纯电阻性负载。'" placement="top">
            <b class="show_tip">?</b>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="负载名称" class="w_form_item_inner_all">
          <div class="sel_model" style="width:100%">
            <el-checkbox-group v-model="handleForm.loadIdList">
              <el-checkbox v-for="(loadItem,loadIndex) in loadList.list" :key="'load_'+loadIndex" :label="loadItem.loadId">
                {{loadItem.loadName}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="control_dialog">
      <div style="margin-bottom:30px;">*注：短路告警、掉电告警、谐波告警、缺相告警、三相不平衡告警、电弧故障告警，已由系统预设条件，不需手动设置阈值。</div>
      <el-button type="primary" @click="handleSubmit(handleWarningForm)">保存</el-button>
      <!-- <el-button type="success" style="margin-left:50px;" @click="getSystemWarningData()">恢复默认值</el-button> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref , reactive } from 'vue'
import { ElMessage } from "element-plus";
import { warningSetAdd,warningsByeMonitorId } from "@/api/requestData/systemManage"
import { getAlarmByGlobalNoAuth } from  "@/api/requestData/login"
import setData from 'lodash-es/_setData';

export default defineComponent({
  setup(){
    const handleForm = reactive({
      id:null,
      overload:"",
      overcurrent:"",
      overvoltage:"",
      undervoltage:"",
      powerFactor:"",
      loadIdList:[]
    })
    const handleWarningForm = ref(null);
    const loadList = reactive({list:[]});
    const monitorId = ref(null);

    // 开始请求
    const startReqData = (moniItem)=>{
      monitorId.value = moniItem.id;
      // getModelsData();
      setTimeout(()=>{
        getWarningSetData(moniItem.id);
      })
    }
    // 获取全局告警数据
    const getSystemWarningData = ()=>{
      getAlarmByGlobalNoAuth().then(res=>{
        let data = res.data;
        data.id = handleForm.id == null ? null : handleForm.id;
        setWarningData(data);
      })
    }
    // 获取告警设置数据
    const getWarningSetData = (monitorId)=>{
      warningsByeMonitorId({deviceMonitorId:monitorId}).then(res=>{
        let data = res.data;
        if(!data){
          getAlarmByGlobalNoAuth().then(res=>{
            data = res.data;
            data.id = null;
          })
        }
        setTimeout(()=>{
          setWarningData(data);
        },500)
      })
    }
    const setWarningData = (data)=>{
      handleForm.id = data.id;
      handleForm.overcurrent = data.overcurrent;
      handleForm.overload = data.overload;
      handleForm.overvoltage = data.overvoltage;
      handleForm.powerFactor = data.powerFactor;
      handleForm.undervoltage = data.undervoltage;
      loadList.list = data.loads;
      handleForm.loadIdList = loadList.list.filter(item=>item.rel == 1).map(it=>it.loadId);
    }
    // 提交
    const handleSubmit = async(handleWarningForm)=>{
      if(!handleWarningForm){
        return;
      }
      await handleWarningForm.validate((valid, fields) => {
        if (valid) {
          let paramsData = {
            baseId:monitorId.value,
            id:handleForm.id || null,
            overcurrent:handleForm.overcurrent || null,
            overload:handleForm.overload || null,
            overvoltage:handleForm.overvoltage || null,
            powerFactor:handleForm.powerFactor || null,
            undervoltage:handleForm.undervoltage || null,
            loadIds:handleForm.loadIdList || [],
          }
          warningSetAdd(paramsData).then(res=>{
            if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
              ElMessage.success("保存成功");
              getWarningSetData(monitorId.value)
            }
          })
        }else{
          ElMessage.warning("提交失败");
          return;
        }
      })
    }
    return {
      monitorId,
      startReqData,
      handleForm,
      handleWarningForm,
      getWarningSetData,
      loadList,
      handleSubmit,
      getSystemWarningData,
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
.warning_set{
  width: 80%;
  min-width: 700px;
  margin: auto;
  padding: 20px 0;
  .load_init{
    padding-left: 13px;
    a{
      color: #2DA9FA;
      &:hover{
        opacity: 0.8;
      }
    }
  }
  .wanring_form_wrap{
    margin-top: 30px;
    .w_form_item_inner_all{
      width: 100%;
    }
    .el-form-item__label{
      font-size: 14px;
      color: #fff;
    }
    .el-input__inner{
      border-color: #485361;
      background: transparent;
      color: #fff;
      font-size: 13px;
    }
    .el-form-item.w_form_half{
      width: 48%;
      max-height: 62px;
      &:nth-of-type(2n-1){
        float: left;
      }
      &:nth-of-type(2n){
        float: right;
      }
    }
    .el-checkbox{
      color: #fff;
    }
    .load_model_text{
      span{
        cursor: pointer;
        color: #2DA9FA;
        &:hover{
          opacity: 0.9;
        }
      }
    }
  }
  .control_dialog{
    margin-top: 50px;
    text-align: center;
    .el-button{
      padding: 7px 20px;
      min-height: 27px;
    }
  }
}
</style>