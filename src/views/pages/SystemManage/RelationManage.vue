<template>
  <main-content class="rela_manage">
    <div class="top_search_wrap">
      <TreeSelect  propTreeSelId="relaSearchStat" :modelValue="departVal"  size="default" class="ipt_tree_sel" placeholder="请选择部门" style="width:150px;"/>
      <el-input size="default" v-model="filter.loginName" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(160301)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :list="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="80"/>
        <table-column prop="loginName" label="姓名" />
        <table-column prop="userName" label="部门" />
        <table-column prop="userName" label="职务" />
        <table-column prop="orgName" label="手机号" />
        <table-column prop="orgName" label="电子邮箱" />
        <table-column optional  label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(160303)">修改</el-button>
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
      @close="$refs.HandleRelaManage.quit(false)"
    >
      <HandleRelaManage
        ref="HandleRelaManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        @closeHandle="closeHandle"
      />
    </el-dialog>
  </main-content>
</template>

<script>
// import { userList,delUser,recoveryPsd ,roleList,relaRoles} from "@/api/requestData/systemManage"
import HandleRelaManage from "./Handle/HandleRelaManage.vue"
export default {
  components:{
    HandleRelaManage
  },
  data() {
    return {
      departVal:"",
      filter:{
        loginName:"",
      },
      fetch:[],
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"700px",
        top:"8vh",
        handleId:"",
        handleCount:-1,
      },
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
    // 删除
    delHandle(p){
      this.$confirm(`确定删除${p.row.userName}?`, "提示", {
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