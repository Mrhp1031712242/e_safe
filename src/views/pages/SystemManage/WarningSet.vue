<template>
  <div class="warning_set">
    <div class="top_title">
      <b>全局告警参数</b> <el-icon class="reload_btn" title="刷新" @click="getWarningSetData"><Refresh /></el-icon><br>
      <span>该参数为全局参数，保存后将应用到所有监测点（注意：已设置个性化参数的监测点也将被全局参数覆盖）</span>
    </div>
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
          <el-tooltip :raw-content="true" :content="'功率因素大于该值时候，系统产生功率因素告警。'+'<br/>'+'功率因素是电压与电流相位差的余弦值。'+'<br/>'+'取值范围[0,1]，0表示电路为纯电感性或纯电容性负载；'+'<br/>'+'1表示电路为纯电阻性负载。'" placement="top">
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
          <!-- <div class="load_model_text">
            <span @click="handleModelDialog.dialogVisible=true;">管理电器模板</span>
            <el-tooltip :raw-content="true" content="当所勾选的负载接入电路时，系统将判定该电器为恶性负载，并产生告警" placement="top">
              <b class="show_tip">?</b>
            </el-tooltip>
          </div> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="control_dialog">
      <div style="margin-bottom:30px;">*注：短路告警、掉电告警、谐波告警、缺相告警、三相不平衡告警、电弧故障告警，已由系统预设条件，不需手动设置阈值。</div>
      <el-button type="primary" @click="handleSubmit(handleWarningForm)" v-if="permisionBtn(161001)">保存</el-button>
    </div>

    <!-- 管理电器模板 -->
    <el-dialog
      title="电器模板"
      v-model="handleModelDialog.dialogVisible"
      width="1000px"
      append-to-body
      :close-on-click-modal="false" destroy-on-close
    >
      <WarningModelManage ref="WarningModelManage" @closeHandle="closeHandle" />
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref ,onMounted, reactive } from 'vue'
import WarningModelManage from "./Handle/WarningModelManage.vue"
import { ElMessage } from "element-plus";
import { warningSetAdd,warningModelList, getAlarmByGlobal } from "@/api/requestData/systemManage"
import { getArrDataReply } from "@/utils/commonAny.js"
import { Refresh} from '@element-plus/icons-vue';

export default defineComponent({
  components:{
    WarningModelManage,
    Refresh,
  },
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
    const handleModelDialog = reactive({
      dialogVisible:false
    })
    const loadList = reactive({list:[]})

    onMounted(()=>{
      // getModelsData();
      setTimeout(()=>{
        getWarningSetData();
      })
    })
    // 获取告警设置数据
    const getWarningSetData = ()=>{
      getAlarmByGlobal().then(res=>{
        handleForm.id = res.data.id;
        handleForm.overcurrent = res.data.overcurrent;
        handleForm.overload = res.data.overload;
        handleForm.overvoltage = res.data.overvoltage;
        handleForm.powerFactor = res.data.powerFactor;
        handleForm.undervoltage = res.data.undervoltage;
        loadList.list = res.data.loads;
        handleForm.loadIdList = loadList.list.filter(item=>item.rel == 1).map(it=>it.loadId);
      })
    }

    // 获取模板数据
    // const getModelsData = ()=>{
    //   warningModelList().then(res=>{
    //     loadList.list = res.data || [];
    //   })
    // }
    // 提交
    const handleSubmit = async(handleWarningForm)=>{
      if(!handleWarningForm){
        return;
      }
      await handleWarningForm.validate((valid, fields) => {
        if (valid) {
          // let newloadListArr = loadList.list.map(item=>item.id);
          // let newLoadIdArr = JSON.parse(JSON.stringify(handleForm.loadIdList))
          // let arr = getArrDataReply(newloadListArr,newLoadIdArr)
          let paramsData = {
            id:handleForm.id || null,
            overcurrent:handleForm.overcurrent || null,
            overload:handleForm.overload || null,
            overvoltage:handleForm.overvoltage || null,
            powerFactor:handleForm.powerFactor || null,
            undervoltage:handleForm.undervoltage || null,
            loadIds:handleForm.loadIdList || [],
            // emptyLoadIds:arr.join(",") || null
          }
          warningSetAdd(paramsData).then(res=>{
            if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
              ElMessage.success("保存成功");
            }
          })
        }else{
          ElMessage.warning("提交失败");
          return;
        }
      })
    }
    // 关闭新增/修改弹窗
    function closeHandle(val){
      !!val && getModelsData();
      if(!val){
        handleModelDialog.dialogVisible = false;
      }
    }
    return {
      handleForm,
      handleWarningForm,
      getWarningSetData,
      loadList,
      handleModelDialog,
      handleSubmit,
      closeHandle
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
  width: 60%;
  min-width: 900px;
  margin: auto;
  .top_title{
    line-height: 1.8;
    b{
      font-size: 18px;
    }
    .reload_btn{
      font-size: 18px;
      color: #2DA9FA;
      margin-left: 20px;
      cursor: pointer;
      display: inline-block;
      transform: translateY(2px);
      transition: 0.3s;
      &:hover{
        opacity: 0.9;
        transform: translateY(2px) rotate(180deg);
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