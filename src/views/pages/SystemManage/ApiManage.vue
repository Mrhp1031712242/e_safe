<template>
  <main-content class="handle_api_child">
    <div class="top_search_wrap">
      <el-input size="default" v-model="filter.keyWord" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" >新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="80"/>
        <table-column prop="permissionName" label="接口名称" />
        <table-column prop="menuName" label="菜单" />
        <table-column prop="url" label="URL" min-width="150"/>
        <table-column optional label="是否鉴权">
          <template #default="scope">
            <span>{{scope.row.isAuthorization == 1 ? '是' : '否'}}</span>
          </template>
        </table-column>
        <table-column prop="remark" label="备注" />
        <table-column optional  label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" >修改</el-button>
            <el-button class="normal_type2_btn" size="small" @click="childHandle(scope)" >子权限</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)">删除</el-button>
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
      @close="$refs.HandleApiManage.quit(false)"
    >
      <HandleApiManage
        ref="HandleApiManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        :apiId="handleDialog.apiId"
        @closeHandle="closeHandle"
      />
    </el-dialog>
    <!-- 子权限弹窗 -->
    <el-dialog
      :title="handleChildApiDialog.title"
      v-model="handleChildApiDialog.dialogVisible"
      :width="handleChildApiDialog.modalWidth"
      :top="handleChildApiDialog.top"
      append-to-body
      :close-on-click-modal="false" destroy-on-close
      @close="handleChildApiDialog.handleCount = 0"
    >
      <HandleApiChild
        :id="handleChildApiDialog.viewId"
        :viewCount="handleChildApiDialog.viewCount"
        @closeChild="closeChildApiHandle"
      />
    </el-dialog>
  </main-content>
</template>

<script>
import { apiList,delApi } from "@/api/requestData/systemManage"
import HandleApiManage from "./Handle/HandleApiManage"
import HandleApiChild from "./Handle/HandleApiChild"
export default {
  components:{
    HandleApiManage,
    HandleApiChild
  },
  data() {
    return {
      filter:{
        keyWord:"",
      },
      fetch:apiList,
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"800px",
        top:"8vh",
        handleId:"",
        handleCount:-1,
        apiId:"",
      },
      handleChildApiDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"800px",
        top:"8vh",
        viewId:"",
        viewCount:-1,
      }
    }
  },
  created() {},
  methods: {
    // 弹窗操作
    dialog(bool, title, handleId,count,apiId) {
      this.handleDialog.dialogVisible = bool;
      this.handleDialog.title = title;
      this.handleDialog.handleId = handleId;
      this.handleDialog.handleCount = count;
      this.handleDialog.apiId = apiId;
    },
    // 点击子权限
    childHandle(p){
      this.handleChildApiDialog.dialogVisible = true;
      this.handleChildApiDialog.title = p.row.menuName + " - " + p.row.permissionName + '子权限';
      this.handleChildApiDialog.viewId = p.row.id;
      this.handleChildApiDialog.viewCount = 1;
    },
    // 新 增
    addHandle(){
      this.dialog(true,'新增接口','',1);
    },
    // 修改
    editHandle(p){
      this.dialog(true,'修改接口',p.row.id,1,p.row.permissionApiId);
    },
    // 删除
    delHandle(p){
      this.$confirm(`确定删除接口名称 ${p.row.permissionName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id:p.row.id,
            apiId:p.row.permissionApiId
          }
          delApi(params).then(res => {
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
    },
    // 关闭子权限
    closeChildApiHandle(){
      this.handleChildApiDialog.viewCount = 0;
      this.handleChildApiDialog.dialogVisible = false;
    },
  },
}
</script>
<style lang='scss'>

</style>