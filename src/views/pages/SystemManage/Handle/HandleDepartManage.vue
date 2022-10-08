<template>
  <div class="handle_area_manage">
     <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="120px" class="handle_form_wrap">
      <el-form-item label="上级部门">      
        <TreeSelect :treeOptionData="departListData" 
        :modelValue="departVal" 
        propTreeSelId="departdialog" 
        @selectTreeVal="selectTreeVal" 
        ref="treeSelect" 
        placeholder="选择上级部门，如果不选择此项，则创建单位"
        class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="单位/部门名称" prop="name">
        <el-input size="default" v-model="handleForm.name" clearable placeholder="请输入单位/部门名称"></el-input>
      </el-form-item>
      <el-form-item label="简称" prop="abbr">
        <el-input size="default" v-model="handleForm.abbr" clearable placeholder="请输入简称"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="type">
        <el-radio-group v-model="handleForm.type">
          <el-radio :label="0">单位</el-radio>
          <el-radio :label="1" :disabled="!handleForm.parentId">部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="区域所属" props="areaId">      
        <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions" 
        :modelValue="areaVal" 
        propTreeSelId="departareadialog" 
        @selectTreeVal="(val)=>handleForm.areaId=val" 
        ref="treeSelect" 
        placeholder="请选择管辖区域"
        class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="handleForm.remark" clearable placeholder="请输入备注"></el-input>
      </el-form-item>
     </el-form>
     <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">提 交</el-button>
     </div>
  </div>
</template>

<script>
import {addDepart, editDepart,viewDepart } from "@/api/requestData/systemManage"
export default {
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    },
    departListData:{
      type:Array
    },
    areaStatus:{
      type:Boolean
    }
  },
  emits:["closeHandle"],
  name:'',
  data(){
    // 区域验证
    const areaIdConfirm = (rule, value, callback) => {
      if(!handleForm.areaId){
        return callback(new Error('请选择管辖区域'))
      }else {
        callback()
      }
    }
    return {
      departVal:"",
      areaVal:"",
      handleForm:{
        id:null,
        parentId:null,
        name:"",
        abbr:"",
        type:0,
        areaId:"",
        remark:"",
      },
      handleRules:{
        name: [{ required: true, message: "请输入单位/部门名称", trigger: "blur" }],
        areaId: [{ required: true,validator: areaIdConfirm, trigger: "change" }],
      }
    }
  },
  created(){
    this.id && this.getOneIdData(this.id);
  },
  methods:{
    // 选择上级部门
    selectTreeVal(val){
      this.handleForm.parentId = val || null;
      if(!this.handleForm.parentId){
        this.handleForm.type = 0;
      }
    },
    // 获取详情
    getOneIdData(id) {
      viewDepart(id).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            id:data.id || null,
            parentId:data.parentId || null,
            name:data.name,
            abbr:data.abbr,
            type:data.type,
            areaId:data.areaId,
            remark:data.remark,
          }
          this.departVal = this.handleForm.parentId + "_" + new Date().getTime() || "";
          this.areaVal = this.handleForm.areaId + "_" + new Date().getTime() || "";
        }
      });
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.id) {
            this.handleForm.parentId = this.handleForm.parentId || null;
            addDepart(this.handleForm)
              .then(res => {
                if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("增加成功");
                  this.$store.dispatch("getHandleDeparts");
                  this.quit(true)
                }
              })
              .catch(error => {
                console.log(error);
              });
          }else{
            this.handleForm.id = this.id;
            editDepart(this.handleForm).then(res=>{
               if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("修改成功");
                  this.$store.dispatch("getHandleDeparts");
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
