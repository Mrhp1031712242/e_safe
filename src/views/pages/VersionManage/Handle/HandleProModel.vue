<template>
  <div class="handle_pro_mdel show_all_ipt">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="产品类型" prop="type">
        <dict-select size="default" mode="devType"  v-model="handleForm.type" placeholder="请选择产品类型" style="width:100%;"></dict-select>
      </el-form-item>
      <el-form-item label="产品型号" prop="model">
        <el-input  size="default"  v-model="handleForm.model" clearable placeholder="请输入产品型号"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input  size="default"  v-model="handleForm.remark" clearable placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary"  class="control_dialog_btn" @click="handleSubmit('handleForm')">提交</el-button>
    </div>
  </div>
</template>

<script>
import { addModel,viewModel, editModel } from "@/api/requestData/versionManage";
export default {
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    },
  },
  emits:["closeHandle"],
  data() {
    return {
      menuData:[],
      handleForm:{
        type:"",
        model:"",
        remark:"",
      },
      handleRules:{
        type: [{ required: true, message: "请输入产品类型", trigger: "blur" }],
      }
    }
  },
  created() {
    this.id && this.getOneIdData(this.id,this.apiId);
  },
  methods: {
    // 获取详情
    getOneIdData(id) {
      viewModel(id).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            type:data.type,
            model:data.model,
            remark:data.remark,
          };
        }
      });
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.id) {
            addModel(this.handleForm)
              .then(res => {
                if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("增加成功");
                  this.quit(true);
                }
              })
              .catch(error => {
                console.log(error);
              });
          }else{
            this.handleForm.id = this.id;
            editModel(this.handleForm).then(res=>{
               if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("修改成功");
                  this.quit(true);
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
      this.$refs['handleForm'].resetFields();
      this.$emit("closeHandle",val);
    }
  },
  watch:{
    handleCount(val){
      if(val == 1){
        this.id && this.getOneIdData(this.id,this.apiId);
      }
    },
  }
}
</script>
<style lang='scss'>

</style>