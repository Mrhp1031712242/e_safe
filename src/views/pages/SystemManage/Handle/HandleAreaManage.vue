<template>
  <div class="handle_area_manage">
     <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="区域所属">      
        <TreeSelect :treeOptionData="areaListData" 
        :modelValue="menuVal" 
        propTreeSelId="areadialog" 
        @selectTreeVal="(val)=>handleForm.parentId=val" 
        size="default"  
        ref="treeSelect" 
        placeholder="区域所属上级，不填区域 区域名称填写为省级"
        @selDataFullNameStr="selDataFullNameStr"
        class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="区域名称" prop="name">
        <el-input size="default" v-model="handleForm.name" clearable placeholder="区域名称" @blur="setAreaFullName"></el-input>
      </el-form-item>
      <el-form-item label="区域全称" prop="fullName">
        <el-input size="default" v-model="handleForm.fullName" disabled clearable placeholder="区域全称"></el-input>
      </el-form-item>
     </el-form>
     <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">提 交</el-button>
     </div>
  </div>
</template>

<script>
import {areaList, addArea, editArea,viewArea } from "@/api/requestData/systemManage"
export default {
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    },
    areaListData:{
      type:Array
    },
    areaStatus:{
      type:Boolean
    }
  },
  emits:["closeHandle"],
  name:'',
  data(){
    return {
      menuVal:"",
      areaFullName:"",
      areaOptions:[],
      handleForm:{
        parentId:null,
        name:"",
        fullName:"",
      },
      handleRules:{
        name: [{ required: true, message: "请输入区域名称", trigger: "blur" }],
        fullName: [{ required: true, message: "请输入全称", trigger: "blur" }],
      }
    }
  },
  created(){
    this.id && this.getOneIdData(this.id);
  },
  methods:{
    // 获取点击区域全称
    selDataFullNameStr(data){
      this.areaFullName = !!data ? data : "中国";
      this.handleForm.fullName = this.areaFullName + '-' + this.handleForm.name;
    },  
    // 获取详情
    getOneIdData(id) {
      viewArea(id).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            parentId:data.parentId || null,
            name:data.name,
            fullName:data.fullName,
          };
          this.areaFullName = data.fullName.substring(0,data.fullName.lastIndexOf("-"));
          this.menuVal = this.handleForm.parentId + "_" + new Date().getTime() || "";
        }
      });
    },
    // 设置fullName
    setAreaFullName(){
      if(!!this.handleForm.name){
        this.handleForm.fullName = this.areaFullName + '-' + this.handleForm.name;
      }else{
        this.handleForm.fullName = this.areaFullName;
      }
    },  
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.id) {
            this.handleForm.parentId = this.handleForm.parentId || null;
            addArea(this.handleForm)
              .then(res => {
                if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("增加成功");
                  this.$store.dispatch("getHandleAreas");
                  this.quit(true)
                }
              })
              .catch(error => {
                console.log(error);
              });
          }else{
            this.handleForm.id = this.id;
            this.handleForm.status = this.areaStatus;
            editArea(this.handleForm).then(res=>{
               if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("修改成功");
                  this.$store.dispatch("getHandleAreas");
                  this.quit(true)
                }
            })
          }
        } else {
          this.$message.warning("提交失败");
          return false;
        }
      });
    },
    // 关闭弹框
    quit(val){
      this.$refs.treeSelect.initValue();
      this.$refs['handleForm'].resetFields();
      this.$emit("closeHandle",val);
    }
  },
  watch:{
    handleCount(val){
      if(val == 1){
        this.id && this.getOneIdData(this.id);
      }
    },
  }
}
</script>

<style lang='scss'>
.handle_area_manage{
  width: 100%;
  .handle_form_wrap{
    width: 60%;
    margin: auto;
  }
  .vue-treeselect__placeholder{
    color: rgba(255,255,255,0.6)!important;
  }
}
</style>
