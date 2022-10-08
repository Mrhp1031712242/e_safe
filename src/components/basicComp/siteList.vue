<template>
  <div class="dev_choose_list">
    <div class="top_search_wrap">
      <el-input v-model="keyWord" class="ipt_words" placeholder="关键字搜索" clearable style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchBtn">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <div class="table_list_part">
      <el-table ref="listMoreTable" :data="fetch" :height="400" @selection-change="handleSelectionChange">
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <el-table-column type="selection" width="55" />
        <table-column prop="$index" label="序号" width="60" />
        <table-column prop="area_name" label="区域" width="80"/>
        <table-column prop="site_name" label="站点名"  width="160"/>
        <table-column prop="address" label="地址" />
        <table-column prop="operator" label="运营商" />
        <table-column prop="manufacturer" label="厂商" />
      </el-table>
      <!-- 分页 -->
      <div style="overflow:hidden;">
         <el-pagination
          class="choose_page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="pageSizes"
          :page-size="limit"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          small
        ></el-pagination>
      </div>
      <div class="control_dialog">
        <el-button type="default" @click="quit">取消</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { nodebList } from "@/api/requestData/deviceManage";
export default {
  props:{
    areaId:{
      type:String
    },
    degValue:{
      type:Number
    }
  },
  data () {
    return {
      keyWord:"",
      page:1,
      limit:20,
      pageSizes:[20,30,40,50,100],
      total:0,
      fetch:[],
      selectMasks:[],
      selectObj:{},
    };
  },
  created(){
    this.getList();
  },
  methods:{
    //  搜索
    searchBtn(){
      this.page = 1;
      this.getList();
    },
    getList(){
      let params = {
        page:this.page,
        limit:this.limit,
        areaId:+this.areaId,
        keyWord:this.keyWord || null,
      }
      this.fetch = [];
      // nodebList(params).then(res=>{
      //   res.data.forEach((item,index)=>{
      //     item.$index = (index + 1) + ((this.page - 1) * this.limit);
      //   })
      //   this.fetch = res.data;
      //   this.total = res.count;
      //   this.$nextTick(()=>{
      //     setTimeout(()=>{
      //       if(this.selectMasks.length > 0){
      //         this.selectMasks.forEach(sItem=>{
      //           this.fetch.forEach(fItem=>{
      //             if(fItem.id == sItem.id){
      //               this.$refs.listMoreTable.toggleRowSelection(fItem,true);
      //             }
      //           })
      //         })
      //       }
      //     })
      //   })
      // })
    },
    // 调整当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getList();
    },
    // 调整显示数据数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getList();
    },
    // 选择
    handleSelectionChange(val){
      if(val.length < 1) return;
      let newArr = [];
      this.selectObj['sel'+this.page] = val;
      for(let i in this.selectObj){
        newArr.push(...this.selectObj[i]);
      }
      this.selectMasks = newArr;
    },
    // 确定
    handleSubmit(){
      this.$emit('getData',this.selectMasks);
      this.$refs.listMoreTable.clearSelection();
      this.selectMasks = [];
      this.selectObj = {};
    },
    // 关闭弹框
    quit(){
      this.$emit('closeCommonSite');
      this.$refs.listMoreTable.clearSelection();
      this.selectMasks = [];
      this.selectObj = {};
    }
  },
  watch:{
    degValue(val){
      if(val == 1){
        this.page = 1;
        this.getList();
      }
    }
  },
}

</script>

<style lang='scss'>
.dev_choose_list{
  .el-table td, .el-table th{
    padding: 5px 0;
    font-size: 12px;
  }
}

</style>