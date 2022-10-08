<template>
  <main-content class="pro_model_manage">
    <div class="top_search_wrap">
      <!-- <dict-select class="ipt_words" listUrl="/api/device/dev/getDeviceType" size="default" v-model="filter.deviceType" style="width:140px;" placeholder="请选择产品类型" @change="$refs.listTable.reload('search')"></dict-select> -->
      <el-input size="default" v-model="filter.keyword" placeholder="请输入关键字" clearable class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(140302)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="typeName" label="产品类型"  min-width="150"/>
        <table-column prop="model" label="型号"  min-width="150"/>
        <table-column prop="remark" label="说明" optional min-width="100">
          <template #default="scope">
            <span>{{scope.row.remark || '/'}}</span>
          </template>
        </table-column>
        <table-column prop="gmtCreated" label="创建时间"  min-width="150"/>
        <table-column optional  label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(140304)">修改</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(140303)">删除</el-button>
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
      @close="$refs.HandleProModel.quit(false)"
    >
      <HandleProModel
        ref="HandleProModel"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        @closeHandle="closeHandle" />
    </el-dialog>
  </main-content>
</template>

<script>
import { modelList,delModel } from "@/api/requestData/versionManage"
import HandleProModel from "./Handle/HandleProModel.vue"
export default {
  components:{
    HandleProModel
  },
  data() {
    return {
      filter:{
        type:"",
        keyword:"",
      },
      fetch:modelList,
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"600px",
        top:"15vh",
        handleId:"",
        handleCount:-1,
      }
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
      this.dialog(true,'新增产品型号','',1);
    },
    // 修改
    editHandle(p){
      this.dialog(true,'修改产品型号',p.row.id,1);
    },
    // 删除
    delHandle(p){
      this.$confirm("此操作将删除此产品型号，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        delModel(p.row.id).then(res => {
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            this.$message.success("删除成功!");
            this.$refs.listTable.reload('del');
          }
        })
        .catch(error => {
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