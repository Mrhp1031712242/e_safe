<template>
  <div class="handle_user_manage show_all_ipt">
     <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
       <el-form-item label="用户账号" prop="loginName">
        <el-input  size="default"  v-model="handleForm.loginName" clearable placeholder="请输入登录账号" :disabled="!!this.id"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input  size="default"  v-model="handleForm.userName" clearable placeholder="请输入用户名" :disabled="!!this.id"></el-input>
      </el-form-item>
      <el-form-item label="用户部门" prop="depId">
        <TreeSelect :treeOptionData="$store.state.data.departOptions" 
          :modelValue="departVal" 
          propTreeSelId="departdialog" 
          @selectTreeVal="(val)=>handleForm.depId = val" 
          ref="treeSelect" 
          placeholder="选择部门"
          class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="状态">
        <dict-select mode="useStatus" size="default"  v-model="handleForm.status" placeholder="请选择状态" style="width:100%;"></dict-select>
      </el-form-item>
      <el-form-item label="">
        <div style="color:#E6A23C;">
          初始密码为 <b style="color:#F56C6C;font-size:12px;">yskj.1024</b> ，该用户首次登录后必须修改密码
        </div>
      </el-form-item>
     </el-form>
     <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click.stop="handleSubmit('handleForm')">提 交</el-button>
     </div>
  </div>
</template>

<script>
import { addUser,viewUser, editUser } from "@/api/requestData/systemManage";
import md5 from "js-md5"  
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
      departVal:"",
      handleForm:{
        loginName:"",
        userName:"",
        password:"yskj.1024",
        depId:null,
        status:"1"
      },
      handleRules:{
        loginName: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        depId: [{ required: true, message: "请选择用户部门", trigger: "blur" }],
      }
    }
  },
  created(){
    this.id && this.getOneIdData(this.id);
  },
  methods:{
    // 获取详情
    getOneIdData(id) {
      viewUser(id).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            loginName:data.loginName,
            userName:data.userName,
            depId:data.depId,
            status:String(data.status),
          }
          this.departVal = this.handleForm.depId + "_" + new Date().getTime() || "";
        }
      });
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate((valid,obj) => {
        if (valid) {
          if (!this.id) {
            this.handleForm.password = md5("yskj.1024" + this.handleForm.loginName)
            addUser(this.handleForm)
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
            editUser(this.handleForm).then(res=>{
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
      this.handleForm.status = "1";
      this.$refs['handleForm'].resetFields();
      this.$emit("closeHandle",val);
    }
  },
  watch:{
    handleCount(val){
      if(val == 1){
        this.id && this.getOneIdData(this.id);
        this.$refs.selDict && this.$refs.selDict.reload();
      }
    },
  }
}
</script>

<style lang='scss'>
.handle_user_manage{
  width: 100%;
  .handle_form_wrap{
    width: 62%;
    margin: auto;
  }
  .vue-treeselect__placeholder{
    color: rgba(255,255,255,0.6)!important;
  }
}
</style>
