<template>
  <div class="monitorData">
    <!-- 顶部 -->
    <div class="top">
      <div class="realTimeData">
        <div style="text-align: center">
          <h2 style="display: inline-block">实时数据</h2>
          <p class="titleNotes" :style="{color:changeTimeColor(currentTime)}">
            {{ currentTime }}
          </p>
        </div>
        <ul>
          <li
            v-for="(item, index) in realList"
            :key="'real-' + index"
            :style="{ width: 100 / realList.length + '%' }"
          >
            <div class="realNum">
              <VueCount
                v-if="item.num != null"
                :startVal="0"
                :endVal="Number(item.num)"
                :duration="800"
                :decimals="item.num == 0 ? 0 : 1"
              />
              <span v-else>--</span>
            </div>
            <p class="realName">
              {{ item.name }}
            </p>
          </li>
        </ul>
      </div>
      <div class="energyConsum">
        <div style="text-align: center">
          <h2 style="display: inline-block">用电统计</h2>
          <p class="titleNotes">(kw·h)</p>
        </div>
        <ul>
          <li
            v-for="(item, index) in energyList"
            :key="'energy-' + index"
            :style="{ width: 100 / energyList.length + '%' }"
          >
            <div class="realNum">
              <VueCount
                v-if="item.num != null"
                :startVal="0"
                :endVal="Number(item.num)"
                :duration="800"
                :decimals="item.num == 0 ? 0 : 1"
              />
              <span v-else>--</span>
            </div>
            <p class="realName">
              {{ item.name }}
            </p>
          </li>
        </ul>
      </div>

      <div class="eleStatistics">
        <div style="text-align: center">
          <h2 style="display: inline-block">电费统计</h2>
          <p class="titleNotes">(元)</p>
        </div>
        <ul>
          <li
            v-for="(item, index) in eletricityList"
            :key="'energy-' + index"
            :style="{ width: 100 / eletricityList.length + '%' }"
          >
            <div class="realNum">
              <VueCount
                v-if="item.num != null"
                :startVal="0"
                :endVal="Number(item.num)"
                :duration="800"
                :decimals="1"
              />
              <span v-else>--</span>
            </div>
            <p class="realName">
              {{ item.name }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 中间 -->
    <div class="middle">
      <div class="monitorHead">
        <!-- <div class="headLeft">
          <h2>功率曲线</h2>
        </div> -->
        <div class="headRight">
          <el-select
            v-model="topChartSearch.powerValue"
            class="ipt_words"
            style="width:180px;"
            multiple
            :multiple-limit="2"
            collapse-tags
            filterable
            placeholder="请选择"
            @change="changePowerType"
          >
            <el-option
              v-for="item in powerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="(topChartSearch.powerValue.length ==1 && topChartSearch.powerValue[0] == item.id) ? true : false"
            >
            </el-option>
          </el-select>
          <el-date-picker
            class="ipt_words"
            style="width: 185px; margin-left: 10px"
            size="default"
            v-model="topChartSearch.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="true"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span class="mid_words"> — </span>
          <el-date-picker
            class="ipt_words"
            style="width: 185px; margin-left: 0"
            size="default"
            v-model="topChartSearch.endTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="true"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-button color="#1A73AC" class="search_btn" @click="searchPowerChart">
            <i class="iconfont icon-sousuo"></i>
          </el-button>
        </div>
      </div>
      <!-- 功率曲线 -->
      <div class="monitorCharts">
        <PowerChart ref="powerChart" :chartData="topChartData" v-if="topChartData.leftData.list.length > 0"/>
        <ShowNomoreImg :imgTop="5" :imgWidth="250" v-else />
      </div>
    </div>
    <!-- 底部 -->
    <div class="bottom">
      <div class="monitorHead">
        <!-- <div class="headLeft">
          <h2>用电趋势</h2>
        </div> -->
        <div class="headRight">
          <dict-select class="ipt_words" mode="timeTypes" size="default" v-model="downChartSearch.type" style="width:110px;" placeholder="在线状态" @change="changeUseTimeType"></dict-select>
          <el-date-picker
            class="ipt_words"
            style="width: 185px; margin-left: 10px"
            v-model="downChartSearch.startTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="true"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span class="mid_words"> — </span>
          <el-date-picker
            class="ipt_words"
            style="width: 185px; margin-left: 0"
            v-model="downChartSearch.endTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="true"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-button color="#1A73AC" class="search_btn" @click="searchUseEleChart">
            <i class="iconfont icon-sousuo"></i>
          </el-button>
        </div>
      </div>
      <!-- 用电趋势 -->
      <div class="monitorCharts">
        <EnergyChart ref="energyChart" :chartData="downChartData" v-if="downChartData.xValue.length > 0"/>
        <ShowNomoreImg :imgTop="5" :imgWidth="250" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import EnergyChart from "./dataChartPart/energyChart.vue";
import PowerChart from "./dataChartPart/powerChart.vue";
import { useElePriceList, currentMoniEleData, totalPriceData,powerListData} from  "@/api/requestData/useEleControl"
import { getNumDot } from "@/utils/commonAny"
export default defineComponent({
  components: { EnergyChart, PowerChart },
  setup() {
    onMounted(() => {
    });

    return {
    };
  },

  data() {
    return {
      monitorId:"",
      deviceId:"",
      electrovalence:"",
      currentTime: new Date().parse("yyyy-MM-dd hh:mm:ss"),
      realList: [
        { num: 0, name: "电压(V)" },
        { num: 0, name: "电流(A)" },
        { num: 0, name: "功率(W)" },
        { num: 0, name: "电表读数(kw·h)" },
      ],
      energyList: [
        { num: 0, name: "昨日" },
        { num: 0, name: "本月" },
        { num: 0, name: "累计" },
      ],
      eletricityList: [
        { num: 0, name: "昨日" },
        { num: 0, name: "本月" },
        { num: 0, name: "累计" },
      ],
      // 图表部分
      // 上部
      powerOptions: [],
      topChartSearch:{
        powerValue:[],
        startTime: new Date().parse("yyyy-MM-dd 00:00:00"),
        endTime: new Date().parse("yyyy-MM-dd 23:59:59"),
      },
      topChartData:{
        xValue:[],
        leftData:{
          name:"",
          unitName:"",
          list:[]
        },
        rightData:{
          name:"",
          unitName:"",
          list:[]
        }
      },
      topChartDataMark:[],
      // 下部
      electronicOptions: [],
      energyOptions: [],
      downChartSearch:{
        type:"HOUR",
        startTime:new Date().parse("yyyy-MM-dd 00:00:00"),
        endTime:new Date().parse("yyyy-MM-dd 23:59:59"),
      },
      downChartData:{
        xValue:[],
        useEleData:[],
        elePrices:[],
      },
    };
  },

  activated(){
    this.$nextTick(()=>{
      setTimeout(()=>{
        this.$refs.powerChart && this.$refs.powerChart.resizeChange();
        this.$refs.energyChart && this.$refs.energyChart.resizeChange();
      })
    })
  },  
  methods: {
    // startReqData
    startReqData(moniItem){
      this.monitorId = moniItem.id;
      this.deviceId = moniItem.deviceId;
      this.electrovalence = moniItem.electrovalence;
      this.getTopCurrentData(moniItem.id,moniItem.deviceId); // 获取实时数据
      this.getTopTotalEleUseData(moniItem.id,moniItem.deviceId,moniItem.electrovalence); // 获取用电/电费统计
      this.getPowerData(moniItem.id,moniItem.deviceId); // 获取功率曲线
      this.getEleUseData(moniItem.id,moniItem.deviceId,moniItem.electrovalence); // 获取用电趋势
    }, 
    // 数据验证
    validTimeLimit(startTime,endTime,type){
      let st = new Date(startTime).getTime()/1000;
      let et = new Date(endTime).getTime()/1000;
      if(type == "HOUR"){
        return (et - st) > 3 * 24 * 3600;
      }
      if(type == "DAY"){
        return (et - st) > 31 * 24 * 3600
      }
    },
    // 初始化数据
    ininTopData(data,str){
      switch(str){
        case "realList": 
        if(!data){
          this.realList.forEach(item=>item.num = null);
        }
        break;
        case "energyList": 
        if(!data){
          this.energyList.forEach(item=>item.num = null);
          this.eletricityList.forEach(item=>item.num = null);
        }
        break;
      }
    },
    /**
     * 统计数据
     */
    // 获取实时数据
    getTopCurrentData(monitorId,deviceId){
      currentMoniEleData({monitorId:monitorId,deviceId:deviceId}).then(res=>{
        if(!!res.data){
          this.realList[0].num = res.data.U01;
          this.realList[1].num = res.data.E01;
          this.realList[2].num = res.data.P01;
          this.realList[3].num = res.data.C01;
          this.currentTime = res.data.time;
        }else{
          this.currentTime = null;
          this.ininTopData(res.data,'realList');
        }
      })
    },  
    // 当前时间修改
    changeTimeColor(time){
      let timeLong = (new Date().getTime() - new Date(time).getTime())/(1000*60);
      return timeLong > 5 ? '#F56C6C' : '#fff';
    },
    // 获取用电/电费统计
    getTopTotalEleUseData(monitorId,deviceId,electrovalence){
      totalPriceData({monitorId:monitorId,deviceId:deviceId,electrovalence:electrovalence}).then(res=>{
        if(!!res.data){
          this.energyList[0].num = res.data.yesterdayC01;
          this.energyList[1].num = res.data.monthC01;
          this.energyList[2].num = res.data.totalC01;
          this.eletricityList[0].num = res.data.yesterdayC01Price;
          this.eletricityList[1].num = res.data.monthC01Price;
          this.eletricityList[2].num = res.data.totalC01Price;
        }else{
          this.ininTopData(res.data,'energyList');
        }
      })
    }, 

    /**
     * 功率曲线
     */
    // 根据数据类别获取图表Y轴名称和单位
    getYaxisUnitName(val){
      switch(val){
        case "P": return "功率(w)";
        case "C": return "电量(kw·h)";
        case "F": return "功率因素";
        case "U": return "电压(v)";
        case "E": return "电流(A)";
        default:return val;
      }
    },
    getChartName(val){
      switch(val){
        case "P": return "功率";
        case "C": return "电量";
        case "F": return "功率因素";
        case "U": return "电压";
        case "E": return "电流";
        default:return val;
      }
    },
    // 查询功率图表
    searchPowerChart(){
      this.getPowerData(this.monitorId);
    },
    // 获取功率数据
    getPowerData(monitorId,deviceId){
      if(this.validTimeLimit(this.topChartSearch.startTime,this.topChartSearch.endTime,"HOUR")){
        this.$message.warning("时间不得超过72小时");
        return;
      }
      this.initPowerData();
      let params = {
        monitorId:monitorId,
        deviceId:deviceId,
        startTime:this.topChartSearch.startTime,
        endTime:this.topChartSearch.endTime,
      }
      powerListData(params).then(res=>{
        if(!!res.data && res.data.length > 0 && res.data[0].sensorData && res.data[0].sensorData.length > 0){
          this.topChartDataMark = JSON.parse(JSON.stringify(res.data[0].sensorData));
          this.getPowerDataTypes(res.data[0].sensorNames,res.data[0].sensorData);
        }
      })
    },  
    // 获取类别
    getPowerDataTypes(types,sensorData){
      this.powerOptions = [];
      types.forEach(item=>{
        for(let i in item){
          this.powerOptions.push({
            id:i,
            name:item[i]
          })
        }
      })
      this.topChartSearch.powerValue = [this.powerOptions[0].id];
      if(!!this.powerOptions[0].id){
        this.getPowerDataList(sensorData)
      }
    },
    // 获取功率图表信息
    getPowerDataList(sensorData){
      let newObj = {
        xValue:[],
        leftData:{
          name:"",
          unitName:"",
          list:[]
        },
        rightData:{
          name:"",
          unitName:"",
          list:[]
        }
      };
      
      newObj.xValue = sensorData.map(item=>item.time);
      sensorData.forEach(sItem=>{
        for(let j in sItem){
          if(this.topChartSearch.powerValue.length == 2){
            if(j.substring(0,1) == this.topChartSearch.powerValue[0]){
              newObj.leftData.list = sensorData.map(innerItem=>getNumDot(innerItem[j],2));
              newObj.leftData.unitName = this.getYaxisUnitName(this.topChartSearch.powerValue[0]);
              newObj.leftData.name = this.getChartName(this.topChartSearch.powerValue[0]);
            }
            if(j.substring(0,1) == this.topChartSearch.powerValue[1]){
              newObj.rightData.list = sensorData.map(innerItem=>getNumDot(innerItem[j],2));
              newObj.rightData.unitName = this.getYaxisUnitName(this.topChartSearch.powerValue[1]);
              newObj.rightData.name = this.getChartName(this.topChartSearch.powerValue[1]);
            }
          }else{
            if(j.substring(0,1) == this.topChartSearch.powerValue[0]){
              newObj.leftData.list = sensorData.map(innerItem=>getNumDot(innerItem[j],2));
              newObj.leftData.unitName = this.getYaxisUnitName(this.topChartSearch.powerValue[0]);
              newObj.leftData.name = this.getChartName(this.topChartSearch.powerValue[0]);
              newObj.rightData = {};
            }
          }
        }
      })
      setTimeout(()=>{
        this.topChartData = newObj;
      })
    }, 
    // 改变功率类别
    changePowerType(val){
      if(this.validTimeLimit(this.topChartSearch.startTime,this.topChartSearch.endTime,"HOUR")){
        this.$message.warning("时间不得超过72小时");
        return;
      }
      this.topChartSearch.powerValue = val;
      this.getPowerDataList(this.topChartDataMark);
    },  
    // 初始化功率曲线数据
    initPowerData(){
      this.topChartData.xValue = [];
      this.topChartData.leftData.name = this.topChartData.rightData.name = "";
      this.topChartData.leftData.unitName = this.topChartData.rightData.unitName = "";
      this.topChartData.leftData.list = this.topChartData.rightData.list = [];
    },  
    /**
     * 用电趋势
     */ 
    // 查询用电趋势数据
    searchUseEleChart(){
      this.getEleUseData(this.monitorId,this.deviceId,this.electrovalence);
    },
    // 获取用电趋势
    getEleUseData(monitorId,deviceId,electrovalence){
      if(this.validTimeLimit(this.downChartSearch.startTime,this.downChartSearch.endTime,this.downChartSearch.type)){
        this.downChartSearch.type == "HOUR" && this.$message.warning("时间不得超过72小时");
        this.downChartSearch.type == "DAY" && this.$message.warning("时间不得超过31天");
        return;
      }
      this.initUseChartData();
      let params = {
        monitorId:monitorId,
        deviceId:deviceId,
        electrovalence:electrovalence,
        dateType:this.downChartSearch.type,
        startTime:this.downChartSearch.startTime,
        endTime:this.downChartSearch.endTime,
      }
      useElePriceList(params).then(res=>{
        if(res.data && res.data.length > 0){
          this.downChartData.xValue = res.data.map(item=>item.time);
          this.downChartData.useEleData = res.data.map(item=>getNumDot(item.electricity,2));
          this.downChartData.elePrices = res.data.map(item=>getNumDot(item.energyCharge,2));
        }
      })
    },  
    // 修改时间类型
    changeUseTimeType(val){
      this.downChartSearch.type = val;
      this.getEleUseData(this.monitorId,this.deviceId,this.electrovalence);
    },
    // 初始化用电趋势数据
    initUseChartData(){
      this.downChartData.xValue = [];
      this.downChartData.elePrices = [];
      this.downChartData.useEleData = [];
    }
  },
})
</script>
<style lang='scss'>
.monitorData {
  h2 {
    text-align: center;
    letter-spacing: 1.5px;
    color: #409eff;
    margin: 10px 0 20px 0;
    font-size: 18px;
  }
  .top {
    display: flex;
    .realTimeData {
      flex: 1.5;
      padding: 10px 10px 20px 10px;
      background-color: rgba(50,150,250,.1);
      border-radius: 4px;
      .titleNotes {
        text-align: center;
        font-size: 10px;
        letter-spacing: 0.5px;
        display: inline-block;
        margin-left: 10px;
      }
      .realNum {
        font-size: 1.5rem;
        padding: 6px 0;
        font-weight: bold;
      }
      .realName {
        font-size: 13px;
        color: #fff;
      }
      ul {
        overflow: hidden;
        li {
          float: left;
          text-align: center;
        }
      }
    }
    .energyConsum,
    .eleStatistics {
      @extend .realTimeData;
      flex:1;
      margin-left: 15px;
    }
    .line {
      width: 2px;
      height: 100px;
      position: absolute;
      background: radial-gradient(
        #0092ff 40%,
        rgba(0, 122, 255, 0.3),
        rgba(0, 178, 255, 0.1)
      );
      top: 30px;
      left: 50%;
    }
  }
  .middle ,.bottom{
    padding: 15px 0px 0px 15px;
    background: rgba(50,150,250,.1);
    border-radius: 4px;
    margin-top: 20px;
  }
  .monitorHead {
    height: 40px;
    .headRight {
      // position: absolute;
      left: 50px;
      .el-select{
        vertical-align: middle;
      }
    }
  }
  .monitorCharts{
    width: 100%;
    height: 300px;
    margin-top: 15px;
    position: relative;
  }
}
</style>