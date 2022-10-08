<template>
  <div class="leftSelPoint">
    <!-- 侧边栏顶部-搜索部分 -->
    <div class="sideTop">
      <p style="margin-bottom: 10px">监测点</p>
      <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions"
      :propTreeSelId="'treeId'+new Date().getTime()" 
      :modelValue="areaIdVal" class="ipt_tree_sel"
      @selectTreeVal="selectTreeVal" 
      style="width:100%;margin-bottom: 15px;"/>
      <el-input
        placeholder="监测点名称"
        clearable
        v-model="leftFilter.keyword"
        class="input-with-select"
        style="width: 177px;"
      >
      </el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <!-- 监测点列表 -->
    <el-scrollbar style="height: calc(100vh - 225px);" view-class="sideContent_wrap" @scroll="scrollListBar">
      <ul class="sideContent" v-if="monitorSiteList.list.length > 0">
        <li
          v-for="(item, index) in monitorSiteList.list"
          :key="'monitor-' + index"
          :style="{background:index==selIndex ? '#155ee3':''}"
          @click="gotoMonitor(item,index)"
          :title="item.monitorName"
        >
          <span class="ellipsis" style="width:95%;">{{ item.monitorName }}</span>
        </li>
      </ul>
      <ShowNomoreImg :imgTop="13" :imgLeft="-10" v-else />
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getDeviceMonitorDataList } from "@/api/requestData/useEleControl"
export default defineComponent({
  components: {
    Search,
  },
  emits:["selOneMoni"],
  setup(props,ctx) {
    // 定义变量
    let areaIdVal = ref("");
    const leftFilter = reactive({
      areaId:null,
      keyword:null,
    })
    const monitorSiteList = reactive({list:[]});
    const selIndex = ref(0)
    monitorSiteList.list = []

    onMounted(() => {
      getMoniListData();
    });

    /**
     *   事件
    */ 
  //  搜索
    const searchHandle = ()=>{
      getMoniListData();
    }
    // 选择区域
    const selectTreeVal = (val)=>{
      leftFilter.areaId = val;
      getMoniListData();
    }
    // json 字符串排序
    const sortStr = (a,b)=>{
      return a.monitorName.localeCompare(b.monitorName)
    }
    // 获取监测点数据
    const getMoniListData = ()=>{
      getDeviceMonitorDataList(leftFilter).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          monitorSiteList.list = res.data.sort(sortStr) || [];
          selIndex.value = 0;
          ctx.emit("selOneMoni",monitorSiteList.list[0] || null)
        }else{
          ctx.emit("selOneMoni",{})
        }
      })
    }

    // 选择监测点
    const gotoMonitor = (item,index)=>{
      selIndex.value = index;
      ctx.emit("selOneMoni",item)
    }

    // 滚动列表
    const scrollListBar = (e)=>{

    }
    return {
      areaIdVal,
      leftFilter,
      monitorSiteList,
      searchHandle,
      selIndex,
      gotoMonitor,
      selectTreeVal,
      scrollListBar
    }
    
  },

  data() {
    return {
    };
  },
  created() {},
  methods: {
  },
})
</script>
<style lang='scss'>
.leftSelPoint {
  .sideTop{
    padding: 0 15px 0 0;
    .input-with-select{
      .el-input__inner{
        color: #fff;
      }
    }
  }
  .sideContent_wrap{
    .sideContent {
      margin-top: 20px;
      width: 235px;
      height: 100%;
      li {
        height: 40px;
        line-height: 40px;
        padding:0 15px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: #2F51A5;
        }
      }
    }
  }
}
</style>