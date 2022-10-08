<template>
  <main-content class="depart_manage">
    <div class="top_search_wrap">
      <el-input size="default" v-model="filter.keyword" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(160301)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <el-table
        class="table_height"
        :data="departListData"
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
        <el-table-column prop="name" label="单位/部门名称" />
        <table-column prop="abbr" label="简称" />
        <table-column prop="typeName" label="类别" />
        <table-column prop="areaName" label="管辖区域" />
        <table-column prop="remark" label="备注" />
        <table-column optional  label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(160303)">修改</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(160302)">删除</el-button>
          </template>
        </table-column>
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
      @close="$refs.HandleDepartManage.quit(false)"
    >
      <HandleDepartManage
        ref="HandleDepartManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        :departListData="departListData"
        @closeHandle="closeHandle"
        :areaStatus="handleDialog.areaStatus"
      />
    </el-dialog>
  </main-content>
</template>

<script>
import { departList ,delDepart } from "@/api/requestData/systemManage";
import HandleDepartManage from "./Handle/HandleDepartManage.vue"
import  $ from "jquery"
import { getTreeFilterData } from "@/utils/commonAny"
export default {
  components:{
    HandleDepartManage
  },
  data() {
    return {
      tableHeight:400,
      departListData:[],
      departListDataMark:[], // 拷贝区域
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
        self.tableHeight = ($(window).height() - $(".table_height")?.offset()?.top - 32) + "px";
        window.onresize = function() {
          if($(".table_height").length > 0 ){
            self.tableHeight = ($(window).height() -( $(".table_height")?.offset()?.top ? $(".table_height").offset().top : 250) - 32) + "px";
          }
        }
      },500)
    })
  },
  methods: {
    // 搜索
    searchHandle(){
      if(!this.filter.keyword){
        this.departListData = this.departListDataMark;
      }else{
        this.departListData = getTreeFilterData(this.departListDataMark,'name',this.filter.keyword);
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
      // if(this.departListData.length == 0){
      //   this.$message.warning("待获取部门数据");
      //   return;
      // }
      this.dialog(true,'新增单位/部门','',1);
    },
    // 修 改 
    editHandle(p){
      this.dialog(true,'修改单位/部门',p.row.id,1);
      this.handleDialog.areaStatus = p.row.status;
    },
    // 获取数据
    getTreeTableData(){
      departList().then(res=>{
        this.departListData = res.data;
        this.departListDataMark = JSON.parse(JSON.stringify(res.data))
      })
    },
    // 删除
    delHandle(p){
      this.$confirm(`确定删除单位/部门 ${p.row.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDepart(p.row.id).then(res => {
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              this.$message.success("删除成功!");
              this.getTreeTableData(); 
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
      !!val && this.getTreeTableData();
    }
  },
}
</script>
<style lang='scss'>

</style>