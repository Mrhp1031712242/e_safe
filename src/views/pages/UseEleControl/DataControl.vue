<template>
  <div class="data_control">
    <div class="le_ops_point">
      <LeftSelPoint @selOneMoni="selOneMoni"/>
    </div>
    <div class="ri_point_data">
      <!-- tab -->
      <div class="info_details_tab">
        <div class="top_tab_wrap">
          <ul class="tab_seled_part" :style="{width:getTabWrap(labelList.list)  + 'px'}">
            <template v-for="(labelItem,labelIndex) in labelList.list" :key="'tab_label_'+labelIndex">
              <li 
                :style="{width:labelItem.width + 'px',left:(labelIndex * labelItem.width - (40 / Math.tan(20))) + labelIndex * 3 + 'px'}"
                :class="[labelItem.id == activeName ? 'tab_active' : '']" 
                @click="handleClick(labelItem,labelIndex)">
                <span>{{labelItem.name}}</span>
              </li>
            </template>
          </ul>
          <ul class="rihgt_status_wrap">
            <li :class="[!!rightStatus.isOnline ? 'online_status' : 'unOnline_status']">
              <span>设备：</span>
              <span>{{rightStatus.isOnlineName}}</span>
            </li>
            <li :class="[!!rightStatus.isMeterId ? 'online_status' : 'unOnline_status']">
              <span>电表：</span>
              <span>{{rightStatus.isMeterIdName}}</span>
            </li>
          </ul>
        </div>
        <div class="tab_content_part">
          <MonitorData ref="MonitorData" v-if="activeName=='1' && !!rightStatus.isMeterId"/>
          <WarningInfo ref="WarningInfo" v-if="activeName=='2'"/>
          <FailyInfo ref="FailyInfo"  v-if="activeName=='3'"/>
          <UseEleInfo ref="UseEleInfo"  v-if="activeName=='4'"/>
          <EleUseRecords ref="EleUseRecords"  v-if="activeName=='5'"/>
          <WarningLimitConfig ref="WarningLimitConfig"  v-if="activeName=='6'"/>
          <BaseInfo ref="BaseInfo" v-if="activeName=='7'"/>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import LeftSelPoint from "./dataControlPart/LeftSelPoint"
import MonitorData from "./dataControlPart/MonitorData"
import WarningInfo from "./dataControlPart/WarningInfo"
import FailyInfo from "./dataControlPart/FailyInfo"
import WarningLimitConfig from "./dataControlPart/WarningLimitConfig"
import BaseInfo from "./dataControlPart/BaseInfo"
import UseEleInfo from "./dataControlPart/UseEleInfo"
import EleUseRecords from "./dataControlPart/EleUseRecords"

export default defineComponent({
  components:{
    LeftSelPoint,
    MonitorData,
    WarningInfo,
    FailyInfo,
    WarningLimitConfig,
    BaseInfo,
    UseEleInfo,
    EleUseRecords,
  },  
  setup(){
    let baseId = ref("");
    let alarmStatus = ref("1");
    let alarmStatusName = ref("");
    let moniItem = reactive({obj:{}});

    let tabWidth = ref(105);
    const labelList = reactive({list:[
      { id:"1", name:"监测数据", width:tabWidth.value,},
      { id:"2", name:"告警信息", width:tabWidth.value, },
      { id:"3", name:"故障信息", width:tabWidth.value, },
      { id:"4", name:"用电统计", width:tabWidth.value, },
      { id:"5", name:"电器使用记录", width:tabWidth.value, },
      { id:"6", name:"告警门限配置", width:tabWidth.value, },
      { id:"7", name:"基本信息", width:tabWidth.value, },
    ]})
    let labelListMark = reactive({list:[]})
    labelListMark.list = JSON.parse(JSON.stringify(labelList.list))

    let activeName = ref("1");

    let MonitorData = ref(null);
    let WarningInfo = ref(null);
    let FailyInfo = ref(null);
    let UseEleInfo = ref(null);
    let EleUseRecords = ref(null);
    let WarningLimitConfig = ref(null);
    let BaseInfo = ref(null);

    // 是否在线、电表接入
    const rightStatus = reactive({
      isOnline:false,
      isOnlineName:"掉线",
      isMeterId:false,
      isMeterIdName:'未接入'
    })

    onMounted(()=>{

    })
    // 获取tab宽度
    const getTabWrap = (data)=>{
      let wNum = 0;
      let wLength = data.length;
      if(wLength >= 2){
        wNum = wLength * tabWidth.value - 40 / Math.tan(20) + wLength * 3;
      }else{
        wNum = tabWidth.value + (40 / Math.tan(20));
      }
      return wNum;
    }
    // 获取到左侧监测点某一个数据后
    const selOneMoni = (item)=>{
      baseId.value = item.deviceId;
      alarmStatus.value = item.alarmStatus;
      alarmStatusName.value = item.alarmStatusName;
      moniItem.obj = item;

      rightStatus.isOnline = item.online == '0' ? true : false;
      rightStatus.isOnlineName = item.online == '0' ? '在线' : '掉线';
      rightStatus.isMeterId = !!item.rs485 ? !!item.portOnline ? true : false : false;
      rightStatus.isMeterIdName = !!item.rs485 ? !!item.portOnline ? '在线' : '掉线' : '未接入';
      if(!item.rs485){
        activeName.value = "2";
        labelList.list = labelList.list.filter(item=>item.id != '1');
      }else{
        labelList.list = labelListMark.list;
      }
      
      setTimeout(()=>{
        MonitorData.value && MonitorData.value.startReqData(item);
        WarningInfo.value && WarningInfo.value.startReqData(item);
        FailyInfo.value && FailyInfo.value.startReqData(item);
        UseEleInfo.value && UseEleInfo.value.startReqData(item);
        EleUseRecords.value && EleUseRecords.value.startReqData(item);
        WarningLimitConfig.value && WarningLimitConfig.value.startReqData(item);
        BaseInfo.value && BaseInfo.value.startReqData(item);
      })
    }
    // 选择tab
    const handleClick = (avtiveItem)=>{
      activeName.value = avtiveItem.id;
      switch(activeName.value){
        case '1': 
        setTimeout(()=>{
          MonitorData.value && MonitorData.value.startReqData(moniItem.obj); 
        })
        break;
        case '2': 
        setTimeout(()=>{
          WarningInfo.value && WarningInfo.value.startReqData(moniItem.obj); 
        })
        break;
        case '3': 
        setTimeout(()=>{
          FailyInfo.value && FailyInfo.value.startReqData(moniItem.obj);
        })
        break;
        case '4': 
        setTimeout(()=>{
          UseEleInfo.value && UseEleInfo.value.startReqData(moniItem.obj);
        })
        break;
        case '5': 
        setTimeout(()=>{
          EleUseRecords.value && EleUseRecords.value.startReqData(moniItem.obj);
        })
        case '6': 
        setTimeout(()=>{
          WarningLimitConfig.value && WarningLimitConfig.value.startReqData(moniItem.obj);
        })
        break;
        case '7': 
        setTimeout(()=>{
          BaseInfo.value && BaseInfo.value.startReqData(moniItem.obj); 
        })
        break;
      }
    }

    return {
      labelList,
      getTabWrap,
      rightStatus,
      labelListMark,
      // ref
      MonitorData,
      WarningInfo,
      FailyInfo,
      UseEleInfo,
      EleUseRecords,
      WarningLimitConfig,
      BaseInfo,
      moniItem,

      baseId,
      alarmStatus,
      alarmStatusName,
      handleClick,
      selOneMoni,
      activeName
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
.data_control{
  width: 100%;
  height: 100%;
  position: relative;
  .le_ops_point{
    position: absolute;
    width: 240px;
    left: -15px;
    top: -15px;
    bottom: -15px;
    padding: 15px 0 15px 15px;
    background: rgba(50,150,250,.1);
  }
  .ri_point_data{
    position: absolute;
    width: calc(100% - 225px);
    left: 240px;
    right: 0;
    top: -15px;
    bottom: -15px;
    .info_details_tab{
      height: 100%;
      .top_tab_wrap{
        height: 40px;
        // border-bottom: 1px solid #909399;
        .tab_seled_part{
          height: 40px;
          position: relative;
          overflow: hidden;
          li{
            color: rgba(255,255,255,0.5);
            height: 40px;
            line-height: 40px;
            text-align: center;
            position: absolute;
            cursor: pointer;
            transform: skewX(-20deg) translateX(10px);
            border-right: 3px solid #010924;
            background: rgba(58, 123, 226, 0.4000);
            span{
              display: inline-block;
              transform: skewX(20deg);
            }
            &:hover{
              color: #fff;
              background: linear-gradient(to bottom,rgba(18, 38, 77,0),#2B4F88);
            }
            &.tab_active{
              color: #fff;
              background: rgba(24, 111, 194, 1);
            }
          }
        }
        .rihgt_status_wrap{
          position: absolute;
          right: 20px;
          top: 0;
          height: 40px;
          overflow: hidden;
          li{
            width: 100px;
            text-align: center;
            height: 40px;
            line-height: 38px;
            font-size: 13px;
            float: left;
            margin-left: 10px;
            box-sizing: border-box;
            &.online_status{
              background: rgba(30, 198, 149, 0.3000);
              border:1px solid rgba(30, 198, 149, 1);
            }
            &.unOnline_status{
              background: rgba(229, 153, 48, 0.3000);
              border:1px solid rgba(229, 153, 48, 1);
            }
          }
        }
      }
      
      .tab_content_part {
        height: calc(100vh - 160px);
        overflow-y: auto;
        padding: 15px 10px;
      }
    }
  }
}
</style>