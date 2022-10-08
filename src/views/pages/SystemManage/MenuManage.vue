<template>
  <main-content class="menu_manage">
    <div class="top_search_wrap">
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(160501)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <el-table
        class="table_height"
        :height="tableHeight"
        :data="menuData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        borderdefault-expand-all
        :default-expand-all="true"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <el-table-column prop="name" label="菜单名称" min-width="80" />
        <table-column prop="url" label="路径url" min-width="120" />
        <table-column prop="parentName" label=" 父级菜单" min-width="80" />
        <table-column prop="icon" label="图标" min-width="80" />
        <el-table-column prop="hidden" label="是否隐藏菜单">
          <template #default="scope">
            <span>{{scope.row.hidden ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(160503)">修改</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(160502)">删除</el-button>
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
      @close="$refs.HandleMenuManage.quit(false)"
    >
      <HandleMenuManage
        ref="HandleMenuManage"
        :id="handleDialog.handleId"
        :handleCount="handleDialog.handleCount"
        :menuListData="menuData"
        @closeHandle="closeHandle"
      />
    </el-dialog>
  </main-content>
</template>

<script>
import { menuList,delMenu } from "@/api/requestData/systemManage"
import HandleMenuManage from "./Handle/HandleMenuManage.vue"
import  $ from "jquery"
export default {
  components:{
    HandleMenuManage
  },
  data() {
    return {
      tableHeight:400,
      menuData:[],
      handleDialog:{
        title:"",
        dialogVisible:false,
        modalWidth:"800px",
        top:"8vh",
        handleId:"",
        handleCount:-1,
      }
    }
  },
  created() {},
  activated(){
    this.getMenuList();
  },
  mounted(){
    this.$nextTick(()=>{
      let self = this;
      setTimeout(()=>{
        this.tableHeight = ($(window).height() - $(".table_height").offset().top - 53) + "px";
        window.onresize = function() {
          if($(".table_height").length > 0 ){
            self.tableHeight = ($(window).height() -( $(".table_height").offset().top ? $(".table_height").offset().top : 250) - 53) + "px";
          }
        }
      },500)
    })
  },
  methods: {
    // 获取菜单数据
    getMenuList(){
      menuList().then(res=>{
        this.menuData = res.data;
      })
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
      this.dialog(true,'新增菜单','',1);
    },
    // 修改
    editHandle(p){
      this.dialog(true,'修改菜单',p.row.id,1);
    },
    // 删除
    delHandle(p){
      this.$confirm(`确定删除菜单 ${p.row.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delMenu(p.row.id).then(res => {
            if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
              this.$message.success("删除成功!");
              this.getMenuList(); 
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
    closeHandle(){
      this.handleDialog.handleCount = 0;
      this.handleDialog.dialogVisible = false;
      this.getMenuList();
    }
  },
}
</script>
<style lang='scss'>

</style>