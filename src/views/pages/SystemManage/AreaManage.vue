<template>
  <main-content class="area_manage">
    <div class="top_search_wrap">
      <el-input size="default" v-model="filter.keyword" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <el-table
        class="table_height"
        :data="areaListData"
        :height="tableHeight"
        row-key="id"
        borderdefault-expand-all
        :default-expand-all="false"
        :expand-row-keys="['000000']"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="id" label="编码" />
        <el-table-column prop="status" label="状态" >
          <template #default="scope">
            <span :style="{color:scope.row.status ? '#16CDF0' : '#ff2f2f'}">{{scope.row.status ?  '启用' : '停用'}}</span>
          </template>
        </el-table-column>
        <table-column prop="fullName" label="区域全称" />
        <el-table-column label="启用/停用" width="180">
          <template #default="scope">
            <el-switch
              :class="[!scope.row.status ? 'switchActive' : '' ]"
              v-model="scope.row.status"
              active-color="#fff"
              inactive-color="#C4C4C4"
              :active-value="true"
              :inactive-value="false"
              @change="changePortchecked(scope)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增修改弹窗 -->
    <el-dialog
      :title="handleDialog.title"
      v-model="handleDialog.dialogVisible"
      :width="handleDialog.modalWidth"
      :top="handleDialog.top"
      append-to-body
      :close-on-click-modal="false" destroy-on-close
      @close="$refs.HandleAreaManage.quit(false)"
    >
      <HandleAreaManage
        ref="HandleAreaManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        :areaListData="areaListData"
        @closeHandle="closeHandle"
        :areaStatus="handleDialog.areaStatus"
      />
    </el-dialog>
  </main-content>
</template>

<script>
import { areaList ,changeAreaStatus } from "@/api/requestData/systemManage";
import HandleAreaManage from "./Handle/HandleAreaManage.vue"
import  $ from "jquery"
import { getTreeFilterData } from "@/utils/commonAny"
export default {
  components:{
    HandleAreaManage
  },
  data() {
    return {
      tableHeight:400,
      areaListData:[],
      areaListDataMark:[], // 拷贝区域
      filter:{
        keyword:"", 
      },
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"800px",
        top:"15vh",
        handleId:"",
        handleCount:-1,
        areaStatus:false,
      }
    }
  },
  created() {},
  activated(){
    this.getTreeTableData();
  },
  mounted(){
    this.$nextTick(()=>{
      let self = this;
      setTimeout(()=>{
        self.tableHeight = ($(window).height() - $(".table_height")?.offset()?.top - 40) + "px";
        window.onresize = function() {
          if($(".table_height").length > 0 ){
            self.tableHeight = ($(window).height() -( $(".table_height")?.offset()?.top ? $(".table_height").offset().top : 250) - 40) + "px";
          }
        }
      },500)
    })
  },
  methods: {
    // 搜索
    searchHandle(){
      // if(this.areaListData.length == 0){
      //   this.$message.warning("待获取区域数据");
      //   return;
      // }
      if(!this.filter.keyword){
        this.areaListData = this.areaListDataMark;
      }else{
        this.areaListData = getTreeFilterData(this.areaListDataMark,'name',this.filter.keyword);
      }
    },
    // 弹窗操作
    dialog(bool, title, handleId,count) {
      this.handleDialog.dialogVisible = bool;
      this.handleDialog.title = title;
      this.handleDialog.handleId = handleId;
      this.handleDialog.handleCount = count;
    },
    // 新 增
    addHandle(){
      if(this.areaListData.length == 0){
        this.$message.warning("待获取区域数据");
        return;
      }
      this.dialog(true,'新增区域','',1);
    },
    // 修 改 
    editHandle(p){
      this.dialog(true,'修改区域',p.row.id,1);
      this.handleDialog.areaStatus = p.row.status;
    },
    // 获取数据
    getTreeTableData(){
      areaList().then(res=>{
        this.areaListData = res.data;
        this.areaListDataMark = JSON.parse(JSON.stringify(res.data))
      })
    },
    // 停用启用
    changePortchecked(p){
      let msg = p.row.status == true ? '启用' + p.row.name : '停用' + p.row.name;
      this.$confirm(`确定${msg}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        let params = {
          id:p.row.id,
          status:p.row.status
        }
        changeAreaStatus(params).then(res=>{
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            this.$message.success(msg + '成功');
            this.$store.dispatch("getHandleAreas");
          }else{
            p.row.status = !p.row.status;
            return;
          }
        })
      }).catch(()=>{
        p.row.status = !p.row.status;
        return;
      })    
    },
    // 关闭弹框
    closeHandle(val){
      this.handleDialog.handleCount = 0;
      this.handleDialog.dialogVisible = false;
      !!val && this.getTreeTableData();
    }
  },
}
</script>
<style lang='scss'>

</style>