<template>
  <main-content class="change_psd">
    <ShowTopTitle :title="'修改密码'" />
    <div class="change_wrap" :style="{height:pageHeight + 'px'}">
      <el-form :model="changeForm" ref="changeForm" label-width="80px" :rules="handleRules" class="change_form">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input size="default" class="ipt_words" v-model="changeForm.oldPassword" type="password" placeholder="请输入原密码" clearable @keyup.enter="changeSubmit()"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input size="default" class="ipt_words" v-model="changeForm.password" type="password" placeholder="请输入新密码" clearable @keyup.enter="changeSubmit()"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input size="default" class="ipt_words" v-model="changeForm.passwordConfirm" type="password" placeholder="请输入确认密码" clearable @keyup.enter="changeSubmit()"></el-input>
        </el-form-item>
        <div style="text-align:center;margin-top:40px;">
          <el-button type="default" size="small" @click="$router.back(-1)">返回</el-button>
          <el-button type="primary"  size="small" style="margin-left: 50px;" @click="changeSubmit('changeForm')">提交</el-button>
        </div>
      </el-form>
    </div>
  </main-content>
</template>

<script>
import { passwordValidate } from "@/library/validate";
import { changePassword } from "@/api/requestData/login"
import { changeInnerHeight } from "@/library/changeStyle"
import md5 from "js-md5";
export default {
  data() {
    const validatePsdConfirm = (rule, value, callback) => {
      if (this.changeForm.passwordConfirm != this.changeForm.password) {
        return callback(new Error('新密码和确认密码不一致'))
      }else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if(value.length < 8){
        return callback(new Error('至少8位数'))
      }else if (!passwordValidate(value)) {
        return callback(new Error('至少包含大写字母、小写字母、数字、特殊符号3种'))
      }else {
        callback()
      }
    }
    return {
      changeForm:{
        oldPassword:"",
        password:""
      },
      pageHeight:100,
      handleRules:{
        oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePassword, trigger: "blur" },
        ],
        passwordConfirm:[
          { required: true, message: "请输入确认密码", trigger: "blur" },
          { validator: validatePsdConfirm, trigger: "blur"}
        ],
      },
    }
  },
  mounted() {
    setTimeout(()=>{
      this.pageHeight = changeInnerHeight('change_wrap',195)
    })
  },
  activated(){
    this.$refs["changeForm"] && this.$refs["changeForm"].resetFields();
  },
  methods: {
    changeSubmit(name){
      this.$refs.changeForm.validate(valid => {
        let username = sessionStorage.getItem("loginName");
        if (valid) {
          let paramsData = {
            id:sessionStorage.getItem("userId"),
            oldPassword : md5(this.changeForm.oldPassword.trim() + username),
            password: md5(this.changeForm.password.trim() + username)
          };
          changePassword(paramsData).then(res=>{
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              this.$message.success("修改成功");
              sessionStorage.clear();
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          }).catch(error=>{
            console.log(error)
          })
        }else{
          this.$message.warning("修改密码失败");
          return false;
        }
      })
    }
  },
}
</script>
<style lang='scss'>
.change_psd{
  .change_wrap{
    width: 500px;
    margin: auto;
    margin-top: 70px;
    .el-form-item__label{
      color: #fff;
    }
  }
} 
</style>