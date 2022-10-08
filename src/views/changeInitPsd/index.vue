<template>
  <main-content class="change_init_psd">
    <div class="change_wrap">
      <ShowTopTitle :title="'修改密码'"  :titleWidth='80' class="change_psd_tt"/>
      <el-form :model="changeForm" ref="changeForm" label-width="80px" :rules="handleRules" class="change_form">
        <el-form-item label="新密码" prop="password">
          <el-input size="default" class="ipt_words" v-model="changeForm.password" type="password" placeholder="请输入新密码" clearable @keyup.enter="changeSubmit()"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input size="default" class="ipt_words" v-model="changeForm.passwordConfirm" type="password" placeholder="请输入确认密码" clearable @keyup.enter="changeSubmit()"></el-input>
        </el-form-item>
        <div style="text-align:center;margin-top:40px;">
          <el-button @click="$router.back(-1)" size="small">返回</el-button>
          <el-button type="primary"  size="small"  style="margin-left: 50px;" @click="changeSubmit('changeForm')">提交</el-button>
        </div>
      </el-form>
    </div>
  </main-content>
</template>

<script>
import { passwordValidate } from "@/library/validate";
import md5 from "js-md5";
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if(value.length < 8){
        return callback(new Error('至少8位数'))
      }else if (!passwordValidate(value)) {
        return callback(new Error('至少包含大写字母、小写字母、数字、特殊符号3种'))
      }else {
        callback()
      }
    }
    const validatePsdConfirm = (rule, value, callback) => {
      if (this.changeForm.passwordConfirm != this.changeForm.password) {
        return callback(new Error('新密码和确认密码不一致'))
      }else {
        callback()
      }
    }
    return {
      changeForm:{
        password:""
      },
      handleRules:{
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
  created() {},
  methods: {
    changeSubmit(name){
      this.$refs.changeForm.validate(valid => {
        console.log("yskj.1024" + this.$route.query.username);
        console.log(this.changeForm.password.trim() + this.$route.query.username);
        if (valid) {
          let paramsData = {
            id:this.$store.state.data.userId,
            oldPassword : md5("yskj.1024" + this.$route.query.username),
            password: md5(this.changeForm.password.trim() + this.$route.query.username)
          }
          this.$http({
            url:"/api/rbac/user/updatePassword",
            method:"post",
            data:paramsData,
            headers:{
              authorization:this.$store.state.data.token
            }
          }).then(res=>{
            if(res.data.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              this.$message.success("修改成功");
              setTimeout(()=>{
                this.$router.back(-1)
              })
            }
          }).catch(error=>{
            console.log(error)
          })
        }else{
          this.$message.warning("修改密码失败");
          return false;
        }
      });
    }
  },
}
</script>
<style lang='scss'>
.change_init_psd{
  .change_wrap{
    .change_psd_tt{
      color: #fff;
      margin:20px auto 30px auto;
    }
    width: 500px;
    margin: auto;
    margin-top: 70px;
    .el-form-item__label{
      color: #fff;
    }
  }
}
</style>