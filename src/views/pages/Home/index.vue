<template>
  <div class="home">
    <!-- top -->
    <el-scrollbar style="height:100%;">
      <div class="home_block_bg top_part">
        <div class="top_title"></div>
        <ul class="top_details_wrap">
          <li v-for="(item,index) in topList.list" :key="'top_'+index">
            <VueCount
              class="top_num"
              :startVal="0"
              :endVal="Number(item.value == null ? item.valueToday : item.value)"
              :duration="800"
            />
            <span v-if="item.key == 'todayMonthAlarm' || item.key == 'todayMonthFault'">
              <span class="top_num"> / </span> 
              <VueCount class="top_num" :startVal="0" :endVal="Number(item.valueMonth)" :duration="800"/>
            </span>
            <br />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      
      <div class="down_warp_part mid_part">
        <!-- midLeft -->
        <div class="home_block_bg common_block left_wrap fl">
          <div class="handle_block_wrap">
            <div class="fl">
              <dict-select class="ipt_words" mode="homeUseStatusType" size="default" v-model="midLeftType" style="width:120px;" :clearable="false" @change="changeMidLeftType"></dict-select>
            </div>
            <div class="handle_mid_part title_bg" style="width:120px;">
              <span class="title">{{midLeftType == 'error' ? '异常趋势' : '用电趋势'}}</span>
            </div>
            <div class="fr">
              <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions" 
              :propTreeSelId="'treeId_home_mid_left'+new Date().getTime()" 
              :modelValue="areaIdMidLeftVal"  size="default" 
              @selectTreeVal="selectMidLeftTreeVal"
              class="ipt_tree_sel" 
              style="width:130px;"/>
              <dict-select class="ipt_words" mode="homeUseStatusTimeType" size="default" v-model="midLeft.timeType" style="width:120px;margin-left:10px;" :clearable="false" @change="changeMidLeftTimeType"></dict-select>
            </div>
          </div>
          <div class="content_part">
            <MidLeftChart ref="MidLeftChart" :chartData="midLeftChartData"  v-if="midLeftChartData.xValue.length > 0" />
            <ShowNomoreImg :imgTop="2" :imgWidth="250" v-else />
          </div>
        </div>
        <!-- midRight -->
        <div class="home_block_bg common_block right_wrap fr">
          <div class="handle_block_wrap">
            <div class="fl">
              <dict-select class="ipt_words" mode="distriType" size="default" v-model="midRightType" style="width:120px;" :clearable="false" @change="changeMidRightType"></dict-select>
            </div>
            <div class="handle_mid_part title_bg" style="width:130px;">
              <span class="title">{{midRightType == 'dianqi' ? '电器使用分布' : '告警分布'}}</span>
            </div>
            <div class="fr">
              <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions" 
              :propTreeSelId="'treeId_home_mid_right'+new Date().getTime()" 
              :modelValue="areaIdMidRightVal"  size="default" 
              @selectTreeVal="selectMidRightTreeVal"
              class="ipt_tree_sel" 
              style="width:130px;"/>
              <dict-select class="ipt_words" mode="homeTimeType" size="default" v-model="midRightTimeType" style="width:120px;margin-left:10px;" :clearable="false" @change="changeMidRightTimeType"></dict-select>
            </div>
          </div>
          <div class="content_part">
            <MidRightChart ref="MidRightChart" :chartData="midRightChartData.list" v-if="midRightChartData.list.length > 0" />
            <ShowNomoreImg :imgTop="2" :imgWidth="250" v-else />
          </div>
        </div>
      </div>
      <div class="down_warp_part down_part">
        <!-- downLeft -->
        <div class="home_block_bg common_block left_wrap fl">
          <div class="handle_block_wrap">
            <div class="fl">
              <dict-select class="ipt_words" mode="pointType" size="default" v-model="downLeftType" style="width:120px;" :clearable="false" @change="changeDownLeftType"></dict-select>
            </div>
            <div class="handle_mid_part title_bg" style="width:120px;">
              <span class="title">告警TOP10</span>
            </div>
            <div class="fr">
              <TreeSelect :treeOptionData="$store.state.data.handleAreaOptions" 
              :propTreeSelId="'treeId_home_down_left'+new Date().getTime()" 
              :modelValue="areaIdDownLeftVal"  size="default" 
              @selectTreeVal="selectDownLeftTreeVal"
              class="ipt_tree_sel" 
              style="width:130px;"/>
              <dict-select class="ipt_words" mode="homeTimeType" size="default" v-model="downLeftTimeType" style="width:120px;margin-left:10px;" :clearable="false" @change="changeDownLeftTimeType"></dict-select>
            </div>
          </div>
          <div class="content_part">
            <DownLeftPart ref="DownLeftPart"/>
          </div>
        </div>
        <!-- downRight -->
        <div class="home_block_bg common_block right_wrap fr">
          <div class="handle_block_wrap">
            <div class="handle_mid_part wanning_part" :style="{ width:alarmList.list.length * 75 + 'px'}">
              <span v-for="(alarmItem,alarmIndex) in alarmList.list" :key="'alarmItem_'+ alarmIndex" 
                class="alarm_tab" :class="[alarmIndex == showAlarmInitIndex ? 'alarm_active' : '']" @click="seledAlarm(alarmItem,alarmIndex)">
                {{alarmItem.name}}
              </span>
            </div>
            <div class="fr">
              <a href="javascript:;" class="sel_more" @click="viewMore(showAlarmInitIndex)">更多</a>
            </div>
          </div>
          <div class="content_part">
            <HomeWarningList v-if="showAlarmInitIndex == 0"/>
            <HomeFaultList v-if="showAlarmInitIndex == 1"/>
          </div>
        </div>
      </div>
    </el-scrollbar>
    
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive ,nextTick} from 'vue'
import MidLeftChart from "./MidLeftChart.vue";
import MidRightChart from "./MidRightChart.vue";
import DownLeftPart from "./DownLeftPart.vue";
import HomeWarningList from "./HomeWarningList.vue";
import HomeFaultList from "./HomeFaultList.vue";
import { topCurrentList, errorInfoList, useEleInfoList,
  eleEquipDistriList, warningDistriList} from  "@/api/requestData/home";
import { useRouter } from 'vue-router';
export default defineComponent({
  components:{
    MidLeftChart,
    MidRightChart,
    DownLeftPart,
    HomeWarningList,
    HomeFaultList,
  },
  setup(){
    const router = useRouter()
    // 顶部
    const topList = reactive({list:[
      {key:"villageSum", name:"小区/村居11（个）",value:0 },
      {key:"bulidingSum", name:"监测楼栋（栋）",value:0 },
      {key:"monitorSum", name:"监测点位（个）",value:0 },
      {key:"deviceSum", name:"设备总数（台）",value:0 },
      {key:"onlineSum", name:"正常设备（台）",value:0 },
      {key:"downlineSum", name:"故障设备（台）",value:0 },
      {key:"todayMonthAlarm", name:"今日/本月告警",valueToday:0,valueMonth:0 },
      {key:"todayMonthFault", name:"今日/本月故障",valueToday:0,valueMonth:0 },
      {key:"taskSum", name:"未处理任务",value:0 },
    ]});
    const gettopData = ()=>{
      topCurrentList().then(res=>{
        topList.list.forEach(item=>{
          res.data.forEach(resItem=>{
            if(resItem.key == item.key){
              item.value = resItem.value || 0;
            }
            if(item.key == "todayMonthAlarm" && resItem.key == "todayAlarm"){
              item.valueToday = resItem.value || 0;
            }
            if(item.key == "todayMonthAlarm" && resItem.key == "monthAlarm"){
              item.valueMonth = resItem.value || 0;
            }
            if(item.key == "todayMonthFault" && resItem.key == "todayFault"){
              item.valueToday = resItem.value || 0;
            }
            if(item.key == "todayMonthFault" && resItem.key == "monthFault"){
              item.valueMonth = resItem.value || 0;
            }
          })
        })
      })
    }

    // 中左
    const MidLeftChart = ref(null);
    const midLeftChartData = reactive({
      xValue:[],
      leftData:{
        name:"告警次数",
        unitName:"次",
        list:[],
      },
      rightData:{
        name:"故障次数",
        unitName:"次",
        list:[],
      },
    });
    const areaIdMidLeftVal = ref("");
    const midLeftType = ref("error")
    const midLeft = reactive({
      areaId:null,
      timeType:"DAY",
      startTime:new Date(new Date().getTime() - (30 * 24 * 3600 * 1000)).parse('yyyy-MM-dd 00:00:00'),
      endTime:new Date().parse('yyyy-MM-dd HH:mm:ss'),
    })
    // 选择趋势类别
    const changeMidLeftType = (val)=>{
      val == "error" && getMidLeftErrorData(midLeft);
      val == "useEle" && getMidLeftUseELEData(midLeft);
    }
    // 选择区域
    const selectMidLeftTreeVal = (val)=>{
      midLeft.areaId = val || null;
      midLeftType.value == "error" && getMidLeftErrorData(midLeft);
      midLeftType.value == "useEle" && getMidLeftUseELEData(midLeft);
    }
    // 选择时间类型
    const changeMidLeftTimeType = (val)=>{
      midLeft.timeType = val;
      midLeft.startTime = changeGetTimeSection(midLeft.timeType);
      midLeftType.value == "error" && getMidLeftErrorData(midLeft);
      midLeftType.value == "useEle" && getMidLeftUseELEData(midLeft);
    }
    // 异常趋势数据
    const getMidLeftErrorData = (midLeft)=>{
      errorInfoList(midLeft).then(res=>{
        res.data.forEach(item=>{
          if(Array.isArray(item.alarmCount)){
            item.alarmCount = item.alarmCount.length;
          }
          if(Array.isArray(item.faultCount)){
            item.faultCount = item.faultCount.length;
          }
        })
        midLeftChartData.xValue = res.data.map(item=>item.time);
        midLeftChartData.leftData.name = "告警次数"
        midLeftChartData.rightData.name = "故障次数";
        midLeftChartData.leftData.unitName = "告警(次)"
        midLeftChartData.rightData.unitName = "故障(次)";
        midLeftChartData.leftData.list = res.data.map(item=>item.alarmCount);
        midLeftChartData.rightData.list = res.data.map(item=>item.faultCount);
      })
    }
    // 用电趋势数据
    const getMidLeftUseELEData = (midLeft)=>{
      initUseEleData();
      useEleInfoList(midLeft).then(res=>{
        midLeftChartData.xValue = res.data.map(item=>item.time);
        midLeftChartData.leftData.name = "用电量"
        midLeftChartData.leftData.unitName = "kw·h"
        midLeftChartData.leftData.list = res.data.map(item=>item.value);
        midLeftChartData.rightData = {};
      })
    }
    // 初始化用电趋势数据
    const initUseEleData =  ()=>{
      midLeftChartData.xValue = [];
      midLeftChartData.leftData.name = "用电量"
      midLeftChartData.leftData.unitName = "kw·h"
      midLeftChartData.leftData.list = [];
      midLeftChartData.rightData = {};
    }

    const changeGetTimeSection = (val)=>{
      switch(val){
        case 'DAY' : return new Date(new Date().getTime() - (30 * 24 * 3600 * 1000)).parse('yyyy-MM-dd 00:00:00');
        case 'MONTH' : return new Date(new Date().getTime() - ((12 * 30 * 24 * 3600 * 1000) + 6 * 24 * 3600 * 1000)).parse('yyyy-MM-dd 00:00:00');
        case 'YEAR' : return new Date(new Date().getTime() - ((12 * 30 * 24 * 3600 * 1000) + 6 * 24 * 3600 * 1000) * 5).parse('yyyy-MM-dd HH:00:00');
        case 'THEMONTH' : return new Date().parse('yyyy-MM-01 00:00:00');
        case 'LASTMONTH' : return new Date(new Date().getTime() - (30 * 24 * 3600 * 1000)).parse('yyyy-MM-01 00:00:00');
        case 'THEYEAR' : return new Date().parse('yyyy-01-01 00:00:00');
      }
    }

    // 中右
    const midRightType = ref("dianqi");
    const midRightTimeType = ref("THEMONTH");
    const MidRightChart = ref(null);
    const midRightChartData = reactive({list:[]});
    const areaIdMidRightVal = ref("");
    const midRight = reactive({
      areaId:null,
      startTime:changeGetTimeSection("THEMONTH"),
      endTime:new Date().parse('yyyy-MM-dd HH:mm:ss')
    })
    
    // 选择告警、电器分布
    const changeMidRightType =  (val)=>{
      val == "dianqi" && getEleDistriData(midRight);
      val == "gaojing" && warningDistriData(midRight);
    }
    // 选择时间类型
    const changeMidRightTimeType =  (val)=>{
      midRight.startTime = changeGetTimeSection(val);
      if(val == "LASTMONTH"){
        midRight.endTime = changeGetTimeSection("THEMONTH");
      }else{
        midRight.endTime = new Date().parse('yyyy-MM-dd HH:mm:ss');
      }
      midRightType.value == "dianqi" && getEleDistriData(midRight);
      midRightType.value == "gaojing" && warningDistriData(midmidRightLeft);
    }
    // 选择区域
    const selectMidRightTreeVal = (val)=>{
      midRight.areaId = val || null;
      midRightType.value == "dianqi" && getEleDistriData(midRight);
      midRightType.value == "gaojing" && warningDistriData(midRight);
    }

    // 获取电器分布数据
    const getEleDistriData = (midRight)=>{
      eleEquipDistriList(midRight).then(res=>{
        res.data.forEach(item=>{
          item.value = item.num;
        })
        midRightChartData.list = res.data;
      })
    }

    // 获取告警分布数据
    const warningDistriData = (midRight)=>{
      warningDistriList(midRight).then(res=>{
        res.data.forEach(item=>{
          item.value = item.num;
        })
        midRightChartData.list = res.data;
      })
    }


    // 下左
    const downLeftType = ref("monitor")
    const DownLeftPart = ref(null);
    const areaIdDownLeftVal = ref("");
    const downLeftTimeType = ref("THEMONTH")
    const downLeft = reactive({
      select:"monitor",
      areaId:null,
      startTime:changeGetTimeSection("THEMONTH"),
      endTime:new Date().parse('yyyy-MM-dd HH:mm:ss')
    })
    // 选择告警TOP10类别
    const changeDownLeftType = (val)=>{
      downLeft.select = val;
      DownLeftPart.value.getApiData(downLeft);
    }

    // 选择时间类别
    const changeDownLeftTimeType = (val)=>{
      downLeft.startTime = changeGetTimeSection(val);
      if(val == "LASTMONTH"){
        downLeft.endTime = changeGetTimeSection("THEMONTH");
      }else{
        downLeft.endTime = new Date().parse('yyyy-MM-dd HH:mm:ss');
      }
      DownLeftPart.value.getApiData(downLeft);
    }

    // 选择区域
    const selectDownLeftTreeVal = (val)=>{
      downLeft.areaId = val || null;
      DownLeftPart.value.getApiData(downLeft);
    }

    // 获取告警Top10数据
    const getDownLeftData = (downLeft)=>{
      DownLeftPart.value.getApiData(downLeft);
    }


    // 下右
    const alarmList = reactive({list:[{id:"warning",name:"告警信息"},{id:"fault",name:"故障信息"},]})
    const showAlarmInitIndex = ref(0);
    const seledAlarm = (item,index)=>{
      showAlarmInitIndex.value = index;
    }
    const viewMore = (index)=>{
      index == 0 && router.push("/useEleControl/warningList");
      index == 1 && router.push("/useEleControl/failyList");
    }


    onMounted(()=>{
      gettopData(); // 顶部

      getMidLeftErrorData(midLeft); // 中左

      getEleDistriData(midRight); // 中右

      getDownLeftData(downLeft); // 下左

      
      nextTick(()=>{
        setTimeout(()=>{
          MidLeftChart.value && MidLeftChart.value.resizeChange();
          MidRightChart.value && MidRightChart.value.resizeChange();
        })
      })
    })

    return {
      topList,

      midLeftType,
      areaIdMidLeftVal,
      midLeftChartData,
      midLeft,
      changeMidLeftType,
      selectMidLeftTreeVal,
      changeMidLeftTimeType,

      midRightType,
      changeMidRightType,
      changeMidRightTimeType,
      selectMidRightTreeVal,
      midRightTimeType,
      areaIdMidRightVal,
      midRightChartData,
      midRight,

      downLeftType,
      downLeftTimeType,
      areaIdDownLeftVal,
      DownLeftPart,
      downLeft,
      getDownLeftData,
      changeDownLeftType,
      changeDownLeftTimeType,
      selectDownLeftTreeVal,

      alarmList,
      showAlarmInitIndex,
      seledAlarm,
      viewMore,
    }
  },

  data() {
    return {

    }
  },
  created() {},
  methods: {},
})
</script>
<style lang='scss'>
@import './index.scss';
</style>