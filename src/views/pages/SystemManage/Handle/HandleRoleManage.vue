<template>
  <div class="handle_role_manage">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="角色名称" prop="roleName">
        <el-input size="default" v-model="handleForm.roleName" placeholder="请输入角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="handleForm.remark" placeholder="请输入备注" clearable></el-input>
      </el-form-item>
     </el-form>
     <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">提 交</el-button>
     </div>
  </div>
</template>

<script>
import { addRole,getRoleInfo, editRole } from "@/api/requestData/systemManage";
export default {
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    }
  },
  emits:["closeHandle"],
  name:'',
  data(){
    return {
      handleForm:{
        roleName:"",
        remark:"",
      },
      handleRules:{
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      }
    }
  },
  created(){
    this.id && this.getOneIdData(this.id);
  },
  methods:{
    // 获取详情
    getOneIdData(id) {
      getRoleInfo(id).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            roleName:data.roleName,
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
            addRole(this.handleForm)
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
            editRole(this.handleForm).then(res=>{
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
        this.id && this.getOneIdData(this.id);
      }
    },
  }
}
</script>

<style lang='scss'>
.handle_role_manage{
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
