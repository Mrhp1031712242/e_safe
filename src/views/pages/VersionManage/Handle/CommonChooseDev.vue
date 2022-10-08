<template>
  <div class="common_choose_dev">
    <div class="top_search_wrap">
      <TreeSelect ref="treeSelect" :treeOptionData="$store.state.data.handleAreaOptions" propTreeSelId="common_choose_Search" :modelValue="areaId" @selectTreeVal="(val)=>this.areaId=val" size="default" class="ipt_tree_sel" style="width:150px;"/>
      <el-input v-model="keyWord" size="default" placeholder="请输入关键字" clearable class="ipt_words" style="width:180px;margin-left:10px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="getSitesData()">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <div class="table_list_part">
      <el-table
        ref="listDevsTable"
        :data="sites"
        :height="400"
        class="table_height"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <el-table-column type="selection" width="55" v-if="selCount>1"/>
        <table-column prop="baseId" label="设备ID" optional min-width="130px">
          <template #default="scope">
            <span style="color:#2BFFCB;cursor:pointer;" v-if="selCount == 1" @click="chooseOneDev(scope)">{{scope.row.baseId}}</span>
            <span v-else>{{scope.row.id}}</span>
          </template>
        </table-column> 
        <table-column prop="hardwareV" label="硬件版本号" min-width="100" />
        <table-column prop="softwareV" label="软件版本号" min-width="100" />
        <table-column prop="areaStr" label="区域" />       
        <table-column prop="address" label="安装位置" min-width="100" cancopy/>
      </el-table>
      <el-pagination
        class="choose_page"
        @size-change="handleDevsSizeChange"
        @current-change="handleDevsCurrentChange"
        :current-page="devPage"
        :page-sizes="[20, 30, 40,50]"
        :page-size="devPageSize"
        background
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="devTotal"
      ></el-pagination>
      <div class="control_dialog" style="margin-top:55px;"  v-if="selCount>1">
        <el-button @click="quitDevChoose">关闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleDevSubmit">确定</el-button>
     </div>
    </div>
  </div>
</template>

<script>
import { moniDevsList } from "@/api/requestData/opsBasicInfo"
export default {
  props:{
    deviceType:{
      type:String
    },
    chooseCount:{
      type:Number,
    },
    withSite:{
      type:String,
      default:""
    },
    chooseDevData:{
      type:Array
    },
    selCount:{
      type:Number,
    }
  },
  emits:["chooseData","selOneDev","quitChoose"],
  data() {
    return {
      areaId:"",
      keyWord:"",
      sites:[],
      selection:[],
      keyword:"",
      devPage:1,
      devPageSize:20,
      devTotal:0,
    }
  },
  created() {},
  mounted(){
    this.getSitesData();
  },
  methods: {
    // 获取数据
    getSitesData(){
      let params = {
        page:this.devPage,
        limit:this.devPageSize,
        areaId:this.areaId,
        withSite:this.withSite || null,
        deviceType:this.deviceType || null,
        keyWord:this.keyWord,
      }
      moniDevsList(params).then(res=>{
        this.sites = res.data;
        this.devTotal = res.count;
      })
      // let _this = this;
      // if(this.selCount > 1){
      //   this.$nextTick(()=>{
      //     setTimeout(()=>{
      //       if(this.sites.length > 0){
      //         this.sites.forEach(sItem=>{
      //           _this.chooseDevData.forEach(item=>{
      //             if(sItem.id == item){
      //               setTimeout(()=>{
      //                 _this.$refs.listDevsTable.toggleRowSelection(sItem,true);
      //               })
      //             }
      //           })
      //         })
      //       }
      //     },500)
      //   })
      // }
    },
    // 搜索
    searchHandle(){
      this.getSitesData();
    },
    // 修改limit
    handleDevsSizeChange(val){
      this.devPageSize = val;
      this.getSitesData();
    },
    // 修改当前页
    handleDevsCurrentChange(val){
      this.devPage = val;
      this.getSitesData();
    },
    // 选择
    handleSelectionChange(val){
      this.selection = val;
    },
    // 提交
    handleDevSubmit(){
      if(this.selection.length == 0){
        this.$message.warning("请选择设备ID");
        return false;
      }
      this.$emit('chooseData',this.selection)
      this.quitDevChoose();
    },
    // 单选
    chooseOneDev(p){
      this.$emit('selOneDev',p);
      this.$emit('quitChoose')
    },
    // 关闭
    quitDevChoose(){
      this.devPage = 1;
      this.devPageSize = 20;
      this.$emit('quitChoose')
    } 
  },
  watch:{
    chooseCount(val){
      if(val == 1){
        this.getSitesData();
      }
    }
  }
}
</script>
<style lang='scss'>
.common_choose_dev{
  .choose_page{
    margin-top: 10px;
    text-align: right;
    span{
      color: #fff;
    }
    .el-input__inner{
      background: transparent!important;
      color: #fff;
    }
  }
}
</style>