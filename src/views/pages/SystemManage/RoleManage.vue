<template>
  <main-content class="role_manage">
    <div class="top_search_wrap">
      <el-input size="default" v-model="filter.roleName" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(160401)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="65px"/>
        <table-column prop="roleName" label="角色名称"/>
        <table-column prop="createBy" label="创建者"/>
        <table-column prop="gmtCreated" label="创建时间"/>
        <table-column prop="remark" label="备注"/>
        <table-column optional  label="操作" width="270" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(160403)">修改</el-button>
            <el-button class="normal_type1_btn" size="small" @click="relaUserHandle(scope)" v-if="permisionBtn(160403)">关联用户</el-button>
            <el-button class="normal_type2_btn" size="small" @click="relaPerHandle(scope)" v-if="permisionBtn(160403)">关联权限</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(160402)">删除</el-button>
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
      @close="$refs.HandleRoleManage.quit(false)"
    >
      <HandleRoleManage
        ref="HandleRoleManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        @closeHandle="closeHandle"
      />
    </el-dialog>

    <!-- 关联用户弹窗 -->
    <el-dialog :title="handleUserRelaDialog.title + ' - 关联用户'" v-model="handleUserRelaDialog.dialogVisible" width="750px" custom-class="role_rela_dia">
      <el-form ref="handleForm" :model="handleUserRelaForm" label-width="80px">
        <el-form-item label="关联用户">
          <el-checkbox-group v-model="handleUserRelaForm.users">
            <el-checkbox v-for="userItem in roleOptions" :label="userItem.id" :key="userItem.id">{{userItem.userName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="control_dialog">
        <el-button size="small" @click="handleUserRelaDialog.dialogVisible=false">取消</el-button>
        <el-button type="success" size="small" @click="handleUserRelaSubmit('handleForm')">确定</el-button>
      </div>
    </el-dialog>  

    <!-- 关联权限弹窗 -->
    <el-dialog :title="handlePerRelaDialog.title + ' - 关联权限'" v-model="handlePerRelaDialog.dialogVisible" width="950px" top="3vh" custom-class="role_dia">
      <ul class="tree_ul">
        <li v-for="(itemI,itemIIndex) in treeData" :key="itemI" class="tree_li">
          <div class="one_wrap">{{itemI.menuName}}</div>
          <div class="fl">
            <div class="two_wrap" v-for="(twoItem,twoIndex) in itemI.children" :key="'twoItem_' + itemIIndex + '_'+twoIndex">
              <div class="two_wrap_inner">
                <el-checkbox :label="twoItem.menuName" :indeterminate="twoItem.isIndeterminate" v-model="twoItem.checkAllPer" @change="handleCheckAllPerChange(twoItem.checkAllPer,twoItem)">{{twoItem.menuName}}</el-checkbox>
              </div>
              <el-checkbox-group v-model="twoItem.perIds"  @change="handleCheckedPerChange(twoItem,twoItem.perIds)">
                <el-checkbox v-for="threeItem in twoItem.children" :key="threeItem.id" :label="threeItem.id">{{threeItem.menuName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </li>
      </ul>
      <div class="control_dialog">
        <el-button @click="handlePerRelaDialog.dialogVisible=false">取消</el-button>
        <el-button type="success" class="control_dialog_btn" @click="handlePerRelaSubmit('handleForm')">确定</el-button>
      </div>
    </el-dialog>
  </main-content>
</template>

<script>
import { roleAllList,delRole,getRelaUserList, userList,relaUser,relaPer,relMenuList } from "@/api/requestData/systemManage"
import HandleRoleManage from "./Handle/HandleRoleManage.vue"
export default {
  components:{
    HandleRoleManage
  },
  data() {
    return {
      filter:{
        roleName:"",
      },
      fetch:roleAllList,
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"600px",
        top:"8vh",
        handleId:"",
        handleCount:-1,
      },
      // 关联用户
       handleUserRelaDialog:{
        title:"",
        dialogVisible:false,
      },
      handleUserRelaForm:{
        users:[]
      },
      roleId:"",
      roleOptions:[],
      // 关联权限
      handlePerRelaDialog:{
        title:"",
        dialogVisible:false,
      },
      treeData:[],
      handlePerRelaForm:{
        perIds:[],
      },
      perId:"",
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
      this.dialog(true,'新增角色','',1);
    },
    // 修改
    editHandle(p){
      this.dialog(true,'修改角色',p.row.id,1);
    },
    // 关联用户
    relaUserHandle(p){
      this.roleId = p.row.id;
      this.handleUserRelaDialog.title = p.row.roleName;
      this.handleUserRelaDialog.dialogVisible = true;
      this.getUserList(p.row.id);
    },
    // 获取用户角色
    getUserList(id){
      getRelaUserList(id).then(res=>{
        this.handleUserRelaForm.users = [];
        this.roleOptions = res.data;
        this.roleOptions.forEach(item=>{
          if(item.isRel == 1){
            this.handleUserRelaForm.users.push(item.id);
          }
        })
      })
    },
    // 提交用户管理
    handleUserRelaSubmit(){
      let ids = this.handleUserRelaForm.users.length > 0 ? this.handleUserRelaForm.users.join(',') : "";
      let params = {
        roleId:this.roleId,
        userIds:ids,
      }
      relaUser(params).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          this.$message.success("关联用户成功");
          this.$refs.listTable.reload();
          this.handleUserRelaDialog.dialogVisible = false;
        }
      })
    },
    // 关联权限
    relaPerHandle(p){
      this.perId = p.row.id;
      this.handlePerRelaDialog.title = p.row.roleName;
      this.handlePerRelaDialog.dialogVisible = true;
      this.getMenuPerList(p.row.id);
    },
    getMenuPerList(id){
      relMenuList(id).then(res=>{
        this.treeData = [];
        this.handlePerRelaForm.perIds = [];
        this.handleDataTrees(res.data);
        this.treeData = res.data;
      })
    },
    // 修改checkbox选择
    handleCheckedPerChange(twoItem,perIds){
      if(perIds.length > 0 && perIds.length < twoItem.children.length){
        twoItem.isIndeterminate = true;
      }else{
        twoItem.isIndeterminate = false;
      }
      if(perIds.length > 0 && perIds.length == twoItem.children.length){
        twoItem.checkAllPer = true;
        twoItem.isIndeterminate = false;
      }else{
        twoItem.checkAllPer = false;
      }
    },
    // 修改权限checkbox all 
    handleCheckAllPerChange(val,twoItem){
      twoItem.isIndeterminate = false;
      twoItem.checkAllArr = [];
      twoItem.children.forEach(twoItemChild=>{
        twoItem.checkAllArr.push(twoItemChild.id);
      })
      twoItem.perIds =  val ? twoItem.checkAllArr : [];
    },
    // 处理数据
    handleDataTrees(arr){
      if(arr.length > 0){
        arr.map(oneItem=>{
          oneItem.children.map(twoItem=>{
            twoItem.perIds = [];
            twoItem.isIndeterminate = false;
            twoItem.children.map(twoItemChild=>{
              if(twoItemChild.isRel == 1){
                twoItem.perIds.push(twoItemChild.id)
              }
            })
            if(twoItem.perIds.length > 0 && twoItem.perIds.length < twoItem.children.length){
              twoItem.isIndeterminate = true;
            }else{
              twoItem.isIndeterminate = false;
            }
            if(twoItem.perIds.length > 0 && twoItem.perIds.length == twoItem.children.length){
              twoItem.checkAllPer = true;
              twoItem.isIndeterminate = false;
            }else{
              twoItem.checkAllPer = false;
            }
          })
        })
      }
    },
    // 提交关联权限
    handlePerRelaSubmit(){
      let newArr = [];
      this.treeData.map(oneItem=>{
        oneItem.children.map(twoItem=>{
          twoItem.perIds.map(item=>{
            newArr.push(item)
          })
        })
      })
      let params = {
        roleId:this.perId,
        menuIds:newArr,
      }
      relaPer(params).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          this.$message.success("关联权限成功");
          this.$refs.listTable.reload();
          this.handlePerRelaDialog.dialogVisible = false;
        }
      })
    },
    // 删除
    delHandle(p){
      this.$confirm(`确定删除角色 ${p.row.roleName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRole(p.row.id).then(res => {
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
.role_dia{
  .el-form{
    .handle_top_wrap{
      min-height: 250px;
      max-height: 450px;
      overflow: auto;
      .el-tree-node__content{
        .el-tree-node__label{
          color: #fff;
        }
        &:hover{
          background: #409EFF!important;
          color: #fff;
        }
      }
    }
    
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
      background-color: #409EFF!important;
    }
    .el-tree-node:focus>.el-tree-node__content{
      background-color: #409EFF!important;
    }
  }
  .tree_ul{
    height: 450px;
    overflow: auto;
    margin-bottom: 30px;
    .tree_li{
      width: 865px;
      overflow: hidden;
      // line-height:35px;
      border-top: 1px solid #666;
      border-left: 1px solid #666;
      .el-checkbox{
        color: rgba(255,2552,255,0.8);
      }
      &:nth-last-child(1){
        border-bottom: 1px solid #666;
      }
      .one_wrap{
        width: 100px;
        float: left;
        padding: 5px 0 0 15px;
      }
      .two_wrap{
        overflow: hidden;
        width: 748px;
        border: 1px solid #666;
        border-top: none;
        .two_wrap_inner{
          width: 150px;
          float: left;
          padding-left: 10px;
        }
        .el-checkbox-group{
          width: calc(100% - 200px);
          float: left;
          border-left: 1px solid #666;
          padding: 0 15px;
        }
      }
      .three_wrap_inner{
        float: left;
        margin-right:20px;
      }
    }
  }
}

</style>