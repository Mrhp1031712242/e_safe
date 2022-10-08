<template>
  <main-content class="user_manage">
    <div class="top_search_wrap">
      <el-input size="default" v-model="filter.loginName" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(160301)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="80"/>
        <table-column prop="loginName" label="用户账号" />
        <table-column prop="userName" label="用户名称" />
        <table-column prop="depName" label="用户部门" />
        <table-column prop="status" optional label="状态">
          <template #default="scope">
            <span><i class="fa fa-circle" :style="{color:scope.row.status=='1' ? '#23CF16' : '#999'}"></i>&nbsp;&nbsp;{{scope.row.status == 1 ? '启用' : '停用'}}</span>
          </template>
        </table-column>
        <table-column prop="lastLoginTime" label="上次登录时间" />
        <table-column optional  label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(160303)">修改</el-button>
            <el-button class="normal_type1_btn" size="small" @click="relaRoleHandle(scope)" v-if="permisionBtn(160303)">关联角色</el-button>
            <el-button class="normal_type2_btn" size="small" @click="recoveryHandle(scope)" v-if="permisionBtn(160305)">重置密码</el-button>
          </template>
        </table-column>
      </table-list>
    </div>
     <!-- 新增修改弹窗 -->
    <el-dialog
      :title="handleDialog.title"
      v-model="handleDialog.dialogVisible"
      :width="handleDialog.modalWidth"
      :top="handleDialog.top"
      append-to-body
      :close-on-click-modal="false" destroy-on-close
      @close="$refs.HandleUserManage.quit(false)"
    >
      <HandleUserManage
        ref="HandleUserManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        @closeHandle="closeHandle"
      />
    </el-dialog>
    <!-- 关联角色弹窗 -->
    <el-dialog :title="handleRoleRelaDialog.title + ' - 关联角色'" v-model="handleRoleRelaDialog.dialogVisible" width="750px" custom-class="role_rela_dia">
      <el-form ref="handleForm" :model="handleRoleRelaForm" label-width="80px">
        <el-form-item label="关联角色">
          <el-checkbox-group v-model="handleRoleRelaForm.roles">
            <el-checkbox v-for="roleItem in roleOptions" :label="roleItem.id" :key="roleItem.id">{{roleItem.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="control_dialog">
          <el-button @click="handleRoleRelaDialog.dialogVisible=false">取消</el-button>
          <el-button type="success" class="control_dialog_btn" @click="handleUserRelaSubmit('handleForm')">确定</el-button>
      </div>
    </el-dialog> 
  </main-content>
</template>

<script>
import { userList,delUser,recoveryPsd ,roleList,relaRoles} from "@/api/requestData/systemManage"
import HandleUserManage from "./Handle/HandleUserManage.vue"
import md5 from "js-md5"
export default {
  components:{
    HandleUserManage
  },
  data() {
    return {
      filter:{
        loginName:"",
      },
      fetch:userList,
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"700px",
        top:"8vh",
        handleId:"",
        handleCount:-1,
      },
      handleRoleRelaForm:{
        roles:[]
      },
      handleRoleRelaDialog:{
        title:"",
        dialogVisible:false,
      },
      roleId:"",
      roleOptions:[],
      userId:"",
    }
  },
  created() {},
  methods: {
    // 弹窗操作
    dialog(bool, title, handleId,count) {
      this.handleDialog.dialogVisible = bool;
      this.handleDialog.title = title;
      this.handleDialog.handleId = handleId;
      this.handleDialog.handleCount = count;
    },
    // 新 增
    addHandle(){
      this.dialog(true,'新增用户','',1);
    },
    // 修改
    editHandle(p){
      this.dialog(true,'修改用户',p.row.id,1);
    },
    // 关联角色
    relaRoleHandle(p){
      this.userId = p.row.id;
      this.handleRoleRelaDialog.title = p.row.userName;
      this.handleRoleRelaDialog.dialogVisible = true;
      this.getUserList(p.row.id);
    },
    // 获取用户角色
    getUserList(id){
      roleList(id).then(res=>{
        this.handleRoleRelaForm.roles = [];
        this.roleOptions = res.data;
        this.roleOptions.forEach(item=>{
          if(item.isRel == 1){
            this.handleRoleRelaForm.roles.push(item.id);
          }
        })
      })
    },
    // 提交用户关联角色
    handleUserRelaSubmit(){
      let ids = this.handleRoleRelaForm.roles.length > 0 ? this.handleRoleRelaForm.roles.join(',') : "";
      let params = {
        userId:this.userId,
        roleIds:ids,
      }
      relaRoles(params).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          this.$message.success("关联用户成功");
          this.$refs.listTable.reload();
          this.handleRoleRelaDialog.dialogVisible = false;
        }
      })
    },
    // 重置密码
    recoveryHandle(p){
      if(sessionStorage.getItem("accItemShow")){
        window.location.href = window.baseConfig.resetPsd;
        return;
      }
       this.$confirm(`确定要重置为初始密码（yskj.1024）吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let paramsData = {
          password:md5("yskj.1024" + p.row.loginName),
          id:p.row.id,
        }
        recoveryPsd(paramsData).then(res=>{
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            this.$message.success("密码已重置为yskj.1024");
          }
        })
      }).catch(error=>{
        return false;
      })
    },
    // 删除
    delHandle(p){
      this.$confirm(`确定删除用户 ${p.row.userName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delUser(p.row.id).then(res => {
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              this.$message.success("删除成功!");
              this.$refs.listTable.reload(); 
            }
          }).catch(error => {
            console.log(error);
          });
        })
        .catch((error) => {
          return false;
        });
    },
    // 关闭弹框
    closeHandle(val){
      this.handleDialog.handleCount = 0;
      this.handleDialog.dialogVisible = false;
      !!val && this.$refs.listTable.reload();
    }
  },
}
</script>
<style lang='scss'>

</style>