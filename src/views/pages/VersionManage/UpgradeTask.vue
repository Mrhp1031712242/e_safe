<template>
  <main-content class="upgrade_manage">
    <div class="top_search_wrap">
      <dict-select class="ipt_words" mode="devType" size="default" v-model="filter.deviceType" style="width:140px;" placeholder="请选择产品类型" @change="$refs.listTable.reload('search')"></dict-select>
      <dict-select mode="verType" size="default" placeholder="请选择固件类型" v-model="filter.verType"  class="ipt_words"  style="width:140px;margin-left:10px;" @change="$refs.listTable.reload('search')"></dict-select>
      <el-input size="default" v-model="filter.versionNumber" placeholder="请输入版本号" clearable class="ipt_words" style="width:200px;margin-left:10px;"></el-input>
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:10px;"
        size="default"
        v-model="filter.startTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="false"
        placeholder="开始时间">
      </el-date-picker>
      <span class="mid_words"> — </span>
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:0;"
        size="default"
        v-model="filter.endTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="false"
        placeholder="结束时间">
      </el-date-picker>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="handleDialog.dialogVisible = true" v-if="permisionBtn(140201)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
      <table-column prop="deviceType" label="产品类型" optional>
        <template #default="scope">
          <span>{{scope.row.deviceTypeName}}</span>
        </template>
      </table-column>
      <table-column prop="model" label="产品型号"  min-width="150"/>
      <table-column prop="versionType" label="固件类型"/>
      <table-column prop="versionNumber" label="版本号"/>
      <table-column label="小包模式" optional>
        <template #default="scope">
          <span v-if="scope.row.little_package=='/'">/</span>
          <span v-else>{{scope.row.little_package == false ? '否' : '是'}}</span>
        </template>
      </table-column>
      <table-column prop="runTime" label="执行时间"  min-width="120"/>
      <table-column prop="description" label="升级说明" min-width="150"/>
      <table-column prop="taskStatus" label="状态" min-width="100" />
      <table-column optional  label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button class="normal_type1_btn" size="small" @click="viewHandle(scope)" v-if="permisionBtn(140203)">关联升级设备</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(140202)">删除</el-button>
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
      @close="$refs.HandleUpgradeTask.quit(false)">
      <HandleUpgradeTask
        ref="HandleUpgradeTask"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        @closeHandle="closeHandle"
      />
    </el-dialog>
    <!-- 查看 -->
    <el-dialog 
      :title="viewDialog.title" 
      :top="viewDialog.top"
      :close-on-click-modal="false" destroy-on-close
      v-model="viewDialog.dialogVisible" 
      :width="viewDialog.modalWidth">
      <ViewUpgradeTask :id="viewDialog.id" @close="viewDialog.dialogVisible = false" />
    </el-dialog>
  </main-content>
</template>

<script>
import { listVersionUpdateTask ,deleteVersionUpdateTask} from "@/api/requestData/versionManage"
import HandleUpgradeTask from "./Handle/HandleUpgradeTask"
import ViewUpgradeTask from "./Handle/ViewUpgradeTask"
export default {
  components:{
    HandleUpgradeTask,
    ViewUpgradeTask,
  },
  data() {
    return {
      filter:{
        deviceType:"",
        verType:"",
        versionNumber:"",
        startTime:"",
        endTime:"",
      },
      fetch:listVersionUpdateTask,
      handleDialog:{
        title:"新增升级任务",
        dialogVisible:false,
        modalWidth:"600px",
        top:"8vh",
      },
      viewDialog:{
        title:"关联升级设备",
        dialogVisible:false,
        top:"8vh",
        modalWidth:"1000px",
        id:"",
      }
    }
  },
  created() {},
  methods: {
    // 查看
    viewHandle(p){
      this.viewDialog.dialogVisible = true;
      this.viewDialog.id = p.row.id;
    },
    // 删除
    delHandle(p){
      this.$confirm("此操作将删除此升级任务，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        deleteVersionUpdateTask(p.row.id)
          .then(res => {
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