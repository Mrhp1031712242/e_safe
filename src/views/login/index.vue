<template>
  <div class="login">
    <div class="login_wrap"  :style="{height:isShowLogo ? '425px' : '375px'}">
      <div class="login_wrap_inner">
        <div class="img_logo" v-if="isShowLogo">
          <img src="@/assets/image/login_logo.png" alt="" style="width:110px">
        </div>
        <div class="login_title">
          {{systemName}}
        </div>
        <div class="login_form">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item label="" prop="username">
              <el-input size="large" v-model="loginForm.username" :prefix-icon="UserFilled" style="width:100%;" placeholder="请输入账号" @keyup.enter="loginSubmit()"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input size="large" v-model="loginForm.password" :prefix-icon="Lock" show-password style="width:100%;" placeholder="请输入密码" @keyup.enter="loginSubmit()"></el-input>
            </el-form-item>
          </el-form>
          <div class="login_btn">
            <div class="login_btn_img" @click="loginSubmit()">
              <span>登 录</span>
            </div>
          </div>
        </div>
      </div>
      <div class="acc_handle_wrap"  v-if="accShow">
        <a :href="accHref" style="color:#409EFF;">ACC认证登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { loginByUser ,viewPermission } from "@/api/requestData/login.js";
import { shallowRef } from 'vue'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import cookie from 'js-cookie'
import md5 from 'js-md5'
export default {
  data() {
    return {
      isShowLogo:window.baseConfig.isShowLogo,
      systemName:window.baseConfig.systemName,
      loginForm:{
        username:cookie.get("Esafe" + window.baseConfig.sysKey),
        password:"",
      },
      UserFilled:shallowRef(UserFilled),
      Lock:shallowRef(Lock),
      loginRules:{
        username:[{required: true,message: '请输入账号',trigger: 'blur',}],
        password:[{required: true,message: '请输入密码',trigger: 'blur',}]
      },
      accShow:window.baseConfig.accShow,
      accHref:window.baseConfig.accHref,
    }
  },
  methods: {
    // 登录
    loginSubmit(){
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let paramsData = {
            loginName : this.loginForm.username.trim(),
            password: md5(this.loginForm.password + this.loginForm.username.trim())
          }
          loginByUser(paramsData).then(res=>{
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              let userToken = res.data.token;
              let userId = res.data.userId;
              let time = new Date();
              time.setDate(time.getDate() + 7);
              document.cookie = `Esafe${window.baseConfig.sysKey}=` + JSON.stringify(paramsData.loginName) + ';path=/;expires=' + time.toGMTString();
              if(this.loginForm.password != "yskj.1024"){
                this.loginSuccess(res);
              }else{
                this.$store.state.data.token = userToken;
                this.$store.state.data.userId = userId;
                this.$router.push({
                  path: '/changeInitPsd',
                  query:{
                    username:paramsData.loginName
                  }
                })
              }
            }
          })
        }else{
          this.$message.warning("登录失败");
          return false;
        }
      })
    },
    loginSuccess(res){
      this.$message.success("登录成功");
      sessionStorage.setItem("username",res.data.userName);
      sessionStorage.setItem("manage" + window.baseConfig.sysKey,res.data.token);
      sessionStorage.setItem("userId",res.data.userId);
      sessionStorage.setItem("loginName",this.loginForm.username);
      viewPermission(res.data.userId).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          let newArr = [];
          res.data.forEach(item=>{
            newArr.push(+item)
          })
          sessionStorage.setItem('permissionArr',JSON.stringify(newArr));
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      })
    }
  },
}
</script>
<style lang='scss'>
.login{
  width: 100%;
  height: 100%;
  position: relative;
  background: url('../../assets/image/loginBg.png') no-repeat;
  background-size: 100% 100%;
  .login_wrap{
    min-width: 200px;
    min-height: 200px;
    width: 425px;
    background: url('../../assets/image/login_wrap.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 10%;
    top: 0;
    bottom: 0;
    margin: auto;
    .login_wrap_inner{
      padding: 45px 60px 40px 60px;
      .login_form{
        margin-top: 30px;
      }
      .login_title{
        margin: 10px 0 20px 0;
        font-size: 30px;
        color: #fff;
      }
      .login_btn{
        margin-top: 30px;
        text-align:center;
        .login_btn_img{
          width: 120px;
          height: 50px;
          line-height: 50px;
          margin: auto;
          background: url("../../assets/image/login_btn.png") no-repeat;
          background-size:100% 100%;
          text-align: center;
          cursor: pointer;
          span{
            font-size: 18px;
            color: #fff;
          }
          &:hover{
            opacity: 0.5;
          }
        }
      }
      .el-form-item{
        margin-bottom: 25px;
        .el-input__inner{
          color: #fff;
        }
      }
    }
    .acc_handle_wrap{
      position: absolute;
      bottom: 30px;
      right: 60px;
      a{
        color: #1A73AC;
      }
    }
  }
}
</style>