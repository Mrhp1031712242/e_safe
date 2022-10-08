<template>
  <div class="handle_version show_all_ipt">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="产品类型" prop="deviceType">
        <dict-select size="default" mode="devType" v-model="handleForm.deviceType" clearable placeholder="请选择产品类型" @change="changeDevType" style="width:100%;"></dict-select>
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
        <dict-select size="default" mode='verType' clearable v-model="handleForm.versionType" placeholder="请选择固件类型" style="width:100%;"></dict-select>
      </el-form-item>
      <el-form-item label="硬件版本号" prop="hardwareVersion" v-if="handleForm.versionType=='MCU'">
        <el-input size="default" v-model="handleForm.hardwareVersion" placeholder="请输入硬件版本号"></el-input>
      </el-form-item>
      <el-form-item label="软件版本号" prop="softwareVersion" v-if="handleForm.versionType=='MCU'">
        <el-input size="default" v-model="handleForm.softwareVersion" placeholder="请输入软件版本号"></el-input>
      </el-form-item>
      <el-form-item label="4G模块" prop="modelFG" v-if="handleForm.versionType=='4G'">
        <el-input size="default" v-model="handleForm.modelFG" placeholder="请输入4G模块"></el-input>
      </el-form-item>
      <el-form-item label="底层固件" prop="baseFirmwareVersion" v-if="handleForm.versionType=='4G'">
        <el-input size="default" v-model="handleForm.baseFirmwareVersion" placeholder="请输入底层固件版本"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="versionNumber">
        <el-input size="default" v-model="handleForm.versionNumber" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="基准版本" prop="baseVersionNumbers">
        <el-input size="default" v-model="handleForm.baseVersionNumbers" placeholder="请输入基准版本"></el-input>
      </el-form-item>
      <el-form-item label="版本说明" prop="description">
        <el-input size="default" v-model="handleForm.description" placeholder="请输入版本说明"></el-input>
      </el-form-item>
      <el-form-item label="升级包" prop="fileList">
        <el-upload
          ref="upload"
          :headers="uplaodHeaders"
          :action="uploadUrl"
          :on-success="handleSuccess"
          :data="handleForm"
          :on-change="changeUpload"
          :on-remove="removeUpload"
          :file-list="fileList"
          :limit="1"
          :auto-upload="false">
          <el-button size="small" type="primary" class="primary_up_btn">选取文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary"   class="control_dialog_btn" @click="handleSubmit('handleForm')">提交</el-button>
    </div>
  </div>
</template>

<script>
import { modelList } from "@/api/requestData/versionManage"
export default {
  emits:["closeHandle"],
  data() {
    let updataModel = (rule,value,callback) =>{
      if(this.fileList.length == 0){
        callback(new Error("请选择升级包"))
      }else{
        callback()
      }
    }
    return {
      modelOptions:[],
      handleForm:{
        versionNumber:"",
        baseVersionNumbers:"",
        deviceType:"",
        deviceModelId:"",
        modelFG:null,
        baseFirmwareVersion:null,
        hardwareVersion:null,
        softwareVersion:null,
        versionType:"",
        description:"",
      },
      handleFormData:{},
      fileList:[],
      uploadUrl:window.baseURL + "/api/firmware/createVersion",
      uplaodHeaders:{
        Authorization:sessionStorage.getItem("manage" + window.baseConfig.sysKey) || "",
      },
      uploadFile:"",
      handleRules:{
        versionNumber: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        deviceModelId: [{ required: true, message: "请选择产品型号", trigger: "blur" }],
        hardwareVersion: [{ required: true, message: "请选择硬件版本号", trigger: "blur" }],
        softwareVersion: [{ required: true, message: "请选择软件版本号", trigger: "blur" }],
        baseVersionNumbers: [{ required: true, message: "请输入基准版本", trigger: "blur" }],
        deviceType: [{ required: true, message: "请选择产品类型", trigger: "blur" }],
        versionType: [{ required: true, message: "请输入固件类型", trigger: "blur" }],
        fileList: [{ required: true,validator: updataModel,}],
        modelFG: [{ required: true, message: "请输入4G模块", trigger: "blur" }],
        baseFirmwareVersion: [{ required: true, message: "请输入底层固件", trigger: "blur" }],
      },
    }
  },
  created() {
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
    // 关闭
    quit(val){
      this.$emit("closeHandle",val);
      this.$refs["handleForm"].resetFields();
      setTimeout(()=>{
        this.$refs.upload.clearFiles('ready');
      })
    },
    // 上传之前
    changeUpload(file,fileList){
      this.fileList = fileList;
    },
    // 删除上传时
    removeUpload(){
      this.fileList = [];
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate((valid,object) => {
        console.log(object)
        if (valid) {
          this.$refs.upload.submit();
        }else{
          this.$message.warning("提交失败");
          return false;
        }
      })
    },
    handleSuccess(res,file){
      if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
        this.$message.success("上传升级包成功");
        this.$refs.upload.clearFiles('ready');
        this.quit(true);
      }else{
        this.$message.error(res.msg);
        return;
      }
    }
  },
  watch:{
    fileList(val){
      if(val.length > 0){
        this.$refs['handleForm'].clearValidate(['fileList'])
      } 
    }
  }
}
</script>
<style lang='scss'>
.el-upload-list__item-name{
  color: #fff;
  .el-icon-document{
    color: #fff;
  }
  &:hover{
    color: #fff;
  }
}
.el-upload-list__item{
  cursor: pointer;
  &:hover{
    background-color: #0a3161!important;
  }
  .el-icon--document{
    color: #1EC695;
  }
  .el-icon--close{
    color: #fff;
  }
}
</style>