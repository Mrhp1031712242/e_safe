<template>
  <div class="handle_comp">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="120px" class="handle_form_wrap">
      <div class="form_title">
        <b>基本信息</b>
      </div>
      <div style="overflow:hidden;">
        <el-form-item label="设备版本" prop="version" class="w_form_half">
          <el-select v-model="handleForm.version" placeholder="请选择设备版本" clearable filterable style="width:100%" @change="changeVersion">
            <el-option
              v-for="item in versionOptions.list"
              :key="item.hardwareV + '-' + item.softwareV"
              :label="item.hardwareV + '-' + item.softwareV"
              :value="item.hardwareV + '-' + item.softwareV"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实时上报" prop="realtime" class="w_form_half">
          <el-tooltip :content="handleForm.realtime == true ? '是' : '否'" placement="top">
            <el-switch
              :class="[handleForm.realtime == false ? 'switchActive' : '' ]"
              v-model="handleForm.realtime"
              :active-value="true"
              :inactive-value="false"
              active-color="#fff"
              inactive-color="#C4C4C4"
            ></el-switch>
          </el-tooltip>
          <el-tooltip content="不设置实时上报周期，系统也会20s上报一次数据" placement="top">
            <b class="show_tip">?</b>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="固件版本" class="w_form_half" v-if="!!this.id">
          <el-input  v-model="handleForm.versionType" disabled clearable placeholder="请输入固件版本"></el-input>
        </el-form-item>
        <el-form-item label="IMEI" class="w_form_half" v-if="!!this.id">
          <el-input  v-model="handleForm.IMEI" disabled clearable placeholder="请输入IMEI"></el-input>
        </el-form-item>
        <el-form-item label="产品型号" class="w_form_half" v-if="!!this.id">
          <el-input  v-model="handleForm.deviceModelName" disabled clearable placeholder="请输入产品型号"></el-input>
        </el-form-item>
        <el-form-item label="端口数量（个）" class="w_form_half" v-if="!!this.id">
          <el-input  v-model="handleForm.portNum" disabled clearable placeholder="请输入端口数量（个）"></el-input>
        </el-form-item>
        <el-form-item label="监测设备ID" prop="id" class="w_form_half">
          <el-input  v-model="handleForm.id" clearable placeholder="请输入监测设备ID"></el-input>
        </el-form-item>
        <el-form-item label="上报周期" class="w_form_half">
          <el-input type="number" v-model="handleForm.sensorPeriod" clearable>
            <template #append>秒</template> 
          </el-input>
        </el-form-item>
        <el-form-item label="备注" class="w_form_item_inner_all">
          <el-input type="textarea"  v-model="handleForm.remark" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </div>
      
      <div class="form_title">
        <b>设备负责人</b>
      </div>
      <div style="overflow:hidden;">
        <el-form-item label="设备负责人" class="w_form_half">
          <el-input v-model="handleForm.linkMan" clearable placeholder="请输入设备负责人"></el-input>
        </el-form-item>
        <el-form-item label="手机号" class="w_form_half" prop="phone">
          <el-input v-model="handleForm.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
      </div>
      
      <div class="form_title">
        <b>设备安装位置</b>
      </div>
      <div style="overflow:hidden;">
        <el-form-item label="选择区域" prop="areaId" class="w_form_half">
          <TreeSelect ref="TreeRefSelect"
          :treeOptionData="$store.state.data.handleAreaOptions"
          :propTreeSelId="'TreeSelect' +new Date().getTime()" 
          :nodeClickEffect="true" :modelValue="areaIdVal" 
          class="ipt_tree_sel" style="width:100%" 
          @selectTreeVal="selectTreeVal"/>
        </el-form-item>
        <el-form-item label="小区/村居" prop="villageId" class="w_form_half">
          <el-select v-model="handleForm.villageId" placeholder="请选择小区/村居" clearable filterable style="width:100%" @change="changeVillage">
            <el-option
              v-for="item in villageOptions.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋" prop="buildingId" class="w_form_half">
          <el-select v-model="handleForm.buildingId" placeholder="请选择楼栋" clearable filterable style="width:100%" @change="changeBuild">
            <el-option
              v-for="item in buildingOptions.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="房间" class="w_form_half">
          <el-select v-model="handleForm.roomId" placeholder="请选择房间" clearable filterable style="width:100%">
            <el-option
              v-for="item in roomOptions.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置" prop="address">
          <el-input type="textarea" size="default"  v-model="handleForm.address" clearable placeholder="请输入安装位置"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import {versionList, moniDevAdd, moniDevEdit, moniDevInfo, villageFromArea,buildingFromVillage,roomFromBuilding } from "@/api/requestData/opsBasicInfo"
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
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
    const versionOptions = reactive({list:[]})
    const villageOptions = reactive({list:[]});
    const buildingOptions = reactive({list:[]});
    const roomOptions = reactive({list:[]});

    let handleForm = reactive({
      deviceTypeId:"ROUTER",
      hardwareV:"",
      softwareV:"",
      protocolVersion:"",
      realtime:false,
      id:"",
      sensorPeriod:60,
      remark:"",
      linkMan:"",
      phone:"",
      areaId:"",
      villageId:"",
      buildingId:"",
      roomId:"",
      address:"",
      versionType:"",
      IMEI:"",
      deviceModelName:"",
      portNum:"",
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
      version: [{ required: true,message: "请选择设备版本",  trigger: "change" }],
      areaId: [{ required: true,validator: areaIdConfirm, trigger: "change" }],
      id:[{ required: true, message: "请输入监测设备ID", trigger: "blur" }],
      villageId:[{ required: true, message: "请选择小区/村居", trigger: "change" }],
      buildingId:[{ required: true, message: "请选择楼栋", trigger: "change" }],
      roomId:[{ required: true, message: "请选择房间", trigger: "change" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      getVersions();
      areaIdVal.value = store.state.data.cacheData.areaId + '_'+ new Date().getTime() || "";
      handleForm.areaId = store.state.data.cacheData.areaId;
      if(!!store.state.data.cacheData.areaId){
        selectTreeVal(store.state.data.cacheData.areaId);
      }
      !!props.id && getOneIdData(props.id);
    })

    // 获取软硬件版本号
    const getVersions = ()=>{
      versionList({deviceTypeId:"ROUTER"}).then(res=>{
        versionOptions.list = res.data;
      })
    }
    // 选择版本号
    const changeVersion = (val)=>{
      handleForm.hardwareV = val.split("-")[0];
      handleForm.softwareV = val.split("-")[1];
      handleForm.protocolVersion = versionOptions.list.filter(item=>handleForm.hardwareV == item.hardwareV)[0]?.protocolVersion;
    }
    // 获取详情
    const getOneIdData = (id)=>{
      moniDevInfo(id).then(res=>{
        let data = res.data;
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          if(!!data.areaId){
            selectTreeVal(data.areaId);
          }
          if(!!data.villageId){
            changeVillage(data.villageId)
          }
          if(!!data.buildingId){
            changeBuild(data.buildingId)
          }
          handleForm.id = data.id;
          handleForm.deviceTypeId = data.deviceTypeId;
          handleForm.realtime = data.realtime;
          handleForm.sensorPeriod = data.sensorPeriod;
          handleForm.remark = data.remark;
          handleForm.linkMan = data.linkMan;
          handleForm.phone = data.phone;
          handleForm.address = data.address;
          handleForm.protocolVersion = data.protocolVersion;
          setTimeout(()=>{
            handleForm.villageId = data.villageId;
            handleForm.buildingId = data.buildingId;
            handleForm.roomId = data.roomId;
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
    const changeVillage = (val) =>{
      handleForm.buildingId = "";
      buildingOptions.list = [];
      if(!!val){
        buildingFromVillage({villageId:val}).then(res=>{
          buildingOptions.list = strNumData(res.data);
        })
      }
    }
    // 选择楼栋
    const changeBuild = (val)=>{
      handleForm.roomId = "";
      roomOptions.list = [];
      if(!!val){
        roomFromBuilding({buildingId:val}).then(res=>{
          roomOptions.list = res.data;
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
            id:handleForm.id,
            deviceTypeId:handleForm.deviceTypeId,
            hardwareV:handleForm.hardwareV,
            softwareV:handleForm.softwareV,
            protocolVersion:handleForm.protocolVersion,
            realtime:handleForm.realtime,
            villageId:handleForm.villageId,
            sensorPeriod:handleForm.sensorPeriod,
            remark:handleForm.remark,
            linkMan:handleForm.linkMan,
            phone:handleForm.phone,
            areaId:handleForm.areaId,
            buildingId:handleForm.buildingId,
            roomId:handleForm.roomId,
            address:handleForm.address,
          }
          if(!props.id){
            moniDevAdd(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }else{
            moniDevEdit(paramsData).then(res=>{
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
      ctx.emit("handleAddClose",val)
    }

    return {
      TreeRefSelect,
      areaIdVal,
      villageOptions,
      buildingOptions,
      roomOptions,
      versionOptions,

      changeVersion,
      changeVillage,
      changeBuild,

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
.handle_comp{
  .form_title{
    overflow: hidden;
    padding: 5px 0 20px 0;
    b{
      font-size: 16px;
    }
  }
}
</style>