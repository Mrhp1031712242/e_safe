<template>
  <div class="handle_update_task show_all_ipt">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="产品类型" prop="deviceType">
        <dict-select size="default"  mode="devType" v-model="handleForm.deviceType" clearable placeholder="请选择产品类型" @change="changeDevType" style="width:100%;"></dict-select>
      </el-form-item>
      <el-form-item label="产品型号" prop="deviceModelId">
        <el-select size="default" filterable clearable v-model="handleForm.deviceModelId" placeholder="请选择产品型号" style="width:100%;">
          <el-option
            v-for="item in modelOptions"
            :key="item.id"
            :label="item.model"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="固件类型" prop="versionType">
        <el-select  size="default" v-model="handleForm.versionType" placeholder="请选择" style="width:100%;" @change="changeVt">
          <el-option
            v-for="item in verOptions"
            :key="'vt_'+item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小包模式" prop="littlePackage" v-if="handleForm.versionType=='MCU'">
        <el-tooltip :content="littlePackage == true ? '是' : '否'" placement="top">
          <el-switch
            :class="[littlePackage == false ? 'switchActive' : '' ]"
            v-model="littlePackage"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#C4C4C4"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="版本号" prop="versionId">
        <el-select  size="default" clearable v-model="handleForm.versionId" placeholder="请选择版本" style="width:100%;">
          <el-option
            v-for="(item,index) in versionNumberOptions"
            :key="'version_'+index"
            :label="item.versionNumber"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备ID" prop="baseIds">
        <el-input size="default" readonly clearable v-model="handleForm.baseIds" placeholder="请输入设备ID" :title="handleForm.baseIds">
          <template #append>
            <el-button @click="chooseMore">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="执行时间" prop="runTime">
        <el-date-picker
          size="default"
          style="width:100%"
          v-model="handleForm.runTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabledDate="pickerOptions"
          type="datetime"
          placeholder="执行时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary"  class="control_dialog_btn" @click="handleSubmit('handleForm')">提交</el-button>
    </div>
    <!-- 选择设备ID -->
    <el-dialog :title="chooseDevId.title" v-model="chooseDevId.dialogVisible" :width="chooseDevId.width" :top="chooseDevId.top" :append-to-body='true' @close="chooseCount=-1;">
      <CommonChooseDev @quitChoose="quitChoose" :chooseDevData="chooseDevData" @chooseData='chooseData' :selCount="2" :chooseCount="chooseCount" :deviceType="handleForm.deviceType"/>
    </el-dialog>
  </div>
</template>

<script>
import {listVersion,modelList, createVersionUpdateTask } from "@/api/requestData/versionManage"
import CommonChooseDev from "./CommonChooseDev"
export default {
  components:{
    CommonChooseDev
  },
  emits:["closeHandle"],
  data() {
    return {
      modelOptions:[],
      verOptionsR:[
        { name: '4G', id: "4G" },
        { name: 'MCU', id: "MCU" },
        { name: 'AirLink', id: "AirLink" },
      ],
      maskVerOptions:[
        { name: 'MCU', id: "MCU" },
        { name: 'AirLink', id: "AirLink" },
      ],
      pickerOptions:(time)=> {
        return time.getTime() < Date.now() - 3600 * 24 * 1000;
      },
      versionNumberOptions:[],
      handleForm:{
        deviceType:"",
        deviceModelId:"",
        versionType:"",
        versionId:"",
        baseIds:"",
        deviceNames:"",
        runTime:"",
      },
      littlePackage:false,
      handleRules:{
        versionId: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        baseIds: [{ required: true, message: "请输入设备ID", trigger: "blur" }],
        runTime: [{ required: true, message: "请输入执行时间", trigger: "blur" }],
      },
      chooseDevId:{
        title:"选择设备ID",
        dialogVisible:false,
        width:'800px',
        top:"15vh",
      },
      chooseCount:-1,
      chooseDevData:[]
    }
  },
  created() {
    this.getVersions();
    this.verOptions = this.verOptionsR;
    this.getModelList();
  },
  methods: {
    // 获取产品型号
    getModelList(val){
      let params = {
        page:1,
        limit:100,
        type:val || null
      }
      modelList(params).then(res=>{
        this.modelOptions = res.data;
      })
    },
    changeDevType(val){
      this.getModelList(val)
    },
    // 修改固件类型
    changeVt(val){
      if(val == 'MCU'){
        this.littlePackage = false;
      }else{
        this.littlePackage = null;
      }
    },
    // 获取版本号
    getVersions(){
      let params = {
        deviceType:this.handleForm.deviceType || null,
        verType:this.handleForm.versionType || null,
      }
      listVersion(params).then(res=>{
        this.versionNumberOptions = res.data;
      })
    },
    // 关闭
    quit(val){
      this.$emit("closeHandle",val);
      this.$refs['handleForm'].resetFields();
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.handleForm));
          if(params.versionType == 'MCU'){
            params.littlePackage = this.littlePackage;
          }else{
            params.littlePackage = null;
          }
          createVersionUpdateTask(params).then(res=>{
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              this.$message.success("增加成功");
              this.quit(true);
            }
          })
        }else{
          this.$message.warning("提交失败");
          return false;
        }
      })
    },
    // 点击选择
    chooseMore(){
      // if(!this.handleForm.deviceType){
      //   this.$message.warning("请选择产品类型"); 
      //   return false;
      // }
      this.handleForm.baseIds = "";
      this.chooseCount = 1;
      this.chooseDevId.dialogVisible = true;
      this.chooseDevData = this.handleForm.baseIds != "" ? this.handleForm.baseIds.split(",") : [];
    },
    // 获取数据
    chooseData(arr){
      this.chooseDevId.dialogVisible = false;
      arr.forEach(item=>{
      this.handleForm.baseIds += item.id + ',';
        this.handleForm.deviceNames += item.deviceTypeName + ',';
      })
      this.handleForm.baseIds = this.handleForm.baseIds.substring(0,this.handleForm.baseIds.length -1);
      this.handleForm.deviceNames = this.handleForm.deviceNames.substring(0,this.handleForm.deviceNames.length -1);
    },
    // 退出弹框
    quitChoose(){
      this.chooseCount = 0;
      this.chooseDevId.dialogVisible = false;
    }
  },
  watch:{
    'handleForm.deviceType'(val){
      if(val != 'ROUTER'){
        this.verOptions  = this.maskVerOptions;
      }else{
        this.verOptions  = this.verOptionsR;
      }
      this.handleForm.versionId = "";
      this.handleForm.baseIds = "";
      this.handleForm.deviceNames = "";
      this.versionNumberOptions = [];
      this.getVersions();
    },
    'handleForm.versionType'(val){
      this.handleForm.versionId = "";
      this.versionNumberOptions = [];
      this.getVersions();
    }
  }
}
</script>
<style lang='scss'>

</style>