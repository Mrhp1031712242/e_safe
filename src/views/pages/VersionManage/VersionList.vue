<template>
  <main-content class="version_manage">
    <div class="top_search_wrap">
      <dict-select class="ipt_words" mode="devType" size="default" v-model="filter.deviceType" style="width:140px;" placeholder="请选择产品类型" @change="$refs.listTable.reload('search')"></dict-select>
      <dict-select mode="verType" size="default" placeholder="请选择固件类型" v-model="filter.verType"  class="ipt_words"  style="margin-left:10px;" @change="$refs.listTable.reload('search')"></dict-select>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="handleDialog.dialogVisible=true;" v-if="permisionBtn(140101)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="pkg" label="产品型号"  min-width="120" cancopy />
        <table-column prop="deviceModelId" label="产品型号"  min-width="120"/>
        <table-column prop="versionType" label="固件类型"  min-width="100"/>
        <table-column prop="modelFG" label="4G模块"  min-width="100"/>
        <table-column prop="baseFirmwareVersion" label="底层固件"  min-width="90"/>
        <table-column prop="hardwareVersion" label="硬件版本号"  min-width="100"/>
        <table-column prop="softwareVersion" label="软件版本号"  min-width="100"/>
        <table-column prop="versionNumber" label="版本号"  min-width="120"/>
        <table-column label="版本说明" optional min-width="100">
          <template #default="scope">
            <span>{{scope.row.description || '/'}}</span>
          </template>
        </table-column>
        <table-column label="基准版本" optional min-width="90">
          <template #default="scope">
            <span>{{scope.row.baseVersionNumbers ? scope.row.baseVersionNumbers :'/'}}</span>
          </template>
        </table-column>
        <table-column prop="showName" label="文件名"  min-width="100" />
        <table-column prop="createTime" label="创建时间"  min-width="140"/>
        <table-column optional label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(140102)">删除</el-button>
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
      :close-on-click-modal="false" destroy-on-close
      @close="$refs.HandleVersion.quit(false)"
    >
      <HandleVersion ref="HandleVersion" @closeHandle="closeHandle" />
    </el-dialog>
  </main-content>
</template>

<script>
import { listVersion,delVer } from "@/api/requestData/versionManage"
import HandleVersion from "./Handle/HandleVersion.vue";
export default {
  components:{
    HandleVersion
  },
  data() {
    return {
      filter:{
        deviceType:"",
        verType:"",
      },
      fetch:listVersion,
      handleDialog:{
        title:"新增版本",
        dialogVisible:false,
        modalWidth:"600px",
        top:"8vh",
      }
    }
  },
  created() {},
  methods: {
    // 删除
    delHandle(p){
      this.$confirm("此操作将删除此版本，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        delVer(p.row.id).then(res => {
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            this.$message.success("删除成功!");
            this.$refs.listTable.reload();
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
      this.handleDialog.dialogVisible = false;
      !!val && this.$refs.listTable.reload();
    }
  },
}
</script>
<style lang='scss'>

</style>