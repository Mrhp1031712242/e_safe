<template>
  <div class="table_list">
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      :height="tableHeight" 
      @row-click="clickCell"
      :highlight-current-row="highlightCurrentRow"
      ref="table"
      @selection-change="handleSelectionChange"
      >
      <template #empty>
        <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
      </template>
      <slot />
    </el-table>
    <el-pagination
      background 
      v-model:currentPage="page"
      :page-sizes="pageSizes"
      v-model:page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-if="showPageNum"
      :small="true"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  props:{
    list:{
      type:Array,
      default:[]
    },
    fetch:{
      type:Function,
      default:null
    },
    isLoadData:{
      type:Boolean,
      default:true
    },
    filter:{
      type:Object,
      default:{}
    },
    highlightCurrentRow:{
      type:Boolean,
      default:false
    },
    showPageNum:{
      type:Boolean,
      default:true
    },
    defaultHeight:{
      type:Number,
      default:200
    },
    isSetHeight:{
      type:Boolean,
      default:true
    },
  },
  emits:["showTableData","clickCellData","selectTableRows"],
  data() {
    return {
      page:+this.$route.query.page || 1,
      limit:+this.$route.query.limit || 20,
      pageSizes:reactive([20,30,40,50,60,70,80,90,100]),
      total:0,
      tableData:[],
      tableHeight:200,
    }
  },
  created() {
    this.getFetchData();
  },
  mounted(){
    let _this = this;
    let h = this.showPageNum ? 180 : 150;
    _this.$nextTick(()=>{
      if(this.isSetHeight){
        _this.tableHeight = (window.innerHeight - (document.getElementsByClassName("table_list")[0].offsetTop + h));
        setTimeout(()=>{
          window.onresize = ()=>{
            if(document.getElementsByClassName("table_list")[0]){
              _this.tableHeight = (window.innerHeight - (document.getElementsByClassName("table_list")[0].offsetTop + h));
            }
          }
        })
      }else{
        this.tableHeight = this.defaultHeight;
      }
    })
  },
  activated(){
    this.$refs.table && this.$refs.table.doLayout();
  },
  methods: {
    // 刷新
    reload(key){
      this.getFetchData(key);
    },
    // 规范路由路径
    setRoutePath(page,limit){
      if(Object.keys(this.filter).length > 0){
        for(let i in this.filter){
          if(!this.filter[i]){
            delete this.filter[i]
          }
        }
      }
      this.$router.push({
        path: this.$route.path,
        query:{
          page:page || this.page,
          limit:limit || this.limit,
          ...this.filter,
        }
      })
    },
    // 设置刷新page = 1;
    setRouteParams(key){
      if(key && key === 'search'){
         this.page = 1;
         this.setRoutePath(this.page,this.limit)
      }
      this.setRoutePath(this.page,this.limit)
    },
    // 获取数据
    getFetchData(key){
      this.setRouteParams(key);
      if(!this.isLoadData){
        return;
      }
      if(this.fetch != null){
        let params = Object.assign({page:this.page},{limit:this.limit},this.filter);
        this.fetch(params).then(res=>{
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            this.tableData = this.getIndex(res.data,this.page,this.limit);
            this.total = res.count;
          }else{
            this.tableData = [];
            this.total = 0;
          }
          this.$emit("showTableData",this.tableData)
        })
      }else{
        this.tableData = this.list;
      }
    },
    // 获取下标
    getIndex(array, page, size){
      let index = (page - 1) * size
      return array.reduce((list, item) => {
        const temp = item
        temp.$index = ++index
        list.push(temp)
        return list
      }, [])
    },
    // 修改limit
    handleSizeChange(limit){
      this.limit = limit;
      this.setRoutePath(this.page,limit)
      this.getFetchData();
    },
    // 修改page
    handleCurrentChange(page){
      this.page = page;
      this.setRoutePath(page,this.limit)
      this.getFetchData();
    },
    // 点击某一行
    clickCell(p){
      this.$emit('clickCellData',p)
    },
    setCurrentRow(row){
      this.$refs.table.setCurrentRow(row);
    },
    // 选择rows
    handleSelectionChange(val){
      this.$emit("selectTableRows",val)
    }
  },
}
</script>
<style lang='scss'>
.table_list{
  overflow: hidden;
  .el-pagination{
    margin-top: 20px;
    float: right;
    span{
      color: #fff;
    }
    .el-input__inner{
      background: transparent;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>