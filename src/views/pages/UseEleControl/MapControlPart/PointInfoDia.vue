<template>
  <div class="mark_info_dia">
    <div class="m_title">
      <b>{{markerInfo.title || '--'}}</b>
      <i class="fa fa-times" @click="closePointInfo"></i>
    </div>
    <!-- 状态信息 -->
    <div class="content_wrap">
      <div class="base_info">
        <div style="margin-bottom:10px;">
          <b>状态信息</b>
          <span style="margin-left:10px;">{{markerInfo.currentTime}}</span>
        </div>
        <div class="de_list">在线状态：<span :style="{color:(markerInfo.isOnline == '0' || markerInfo.isOnline == null) ? '#CB1010' : '#25EB53'}">{{markerInfo.isOnlineName || '--'}}</span></div>
        <div class="de_list">
          <div class="fl">当前告警状态：<span :style="{color:markerInfo.warningStatus == '0' ? '#25EB53' : '#CB1010'}">{{markerInfo.warningStatusName || '--'}}</span></div>
          <div class="fr"><span style="color:#11A9F1;">累计告警：<a href="javascript:;" style="color:#11A9F1;" @click="showPointWarningCountDia">{{markerInfo.warningCount || 0}} 次</a></span></div>
        </div>
        <div class="de_list">
          <div class="fl">当前设备故障状态：<span :style="{color:markerInfo.failyStatus == '0' ? '#25EB53' : '#EFA014'}">{{markerInfo.failyStatusName || '--'}}</span></div>
          <div class="fr"><span style="color:#11A9F1;">累计故障：<a href="javascript:;" style="color:#11A9F1;" @click="showPointFailyCountDia">{{markerInfo.failyCount || 0}} 次</a></span></div>
        </div>
      </div>
      <!-- 监测数据 -->
      <div class="base_info" v-if="!!markerInfo.rs485">
        <div style="margin-bottom:10px;">
          <b>监测数据</b>
          <span>{{markerInfo.moniData.time}}</span>
        </div>
        <span class="de_list">电压(V)：{{markerInfo.moniData.vol}}</span> <br>
        <span class="de_list">电流(A)：{{markerInfo.moniData.ele}}</span> <br>
        <span class="de_list">功率(w)：{{markerInfo.moniData.power}}</span> <br>
        <!-- <span class="de_list">昨日能耗(kw·h)：{{markerInfo.moniData.yesEnergy || '--'}}</span> <br> -->
        <span class="de_list">累计能耗(kw·h)：{{markerInfo.moniData.totalEnergy}}</span> <br>
      </div>
      <!-- 联系人 -->
      <div class="base_info">
        <div style="margin-bottom:10px;"><b>联系人</b></div>
        <!-- <span class="de_list">物业公司：{{markerInfo.moniBaseInfo.wyCompany || '--'}}</span> <br>
        <span class="de_list">楼栋负责人/联系方式：{{markerInfo.moniBaseInfo.buildResponse || '--'}} / {{markerInfo.moniBaseInfo.buildResponsePhone || '--'}}</span> <br> -->
        <span class="de_list">业主/联系方式：{{markerInfo.moniBaseInfo.owner || '--'}} / {{markerInfo.moniBaseInfo.ownerPhone || '--'}}</span> <br>
        <span class="de_list">设备负责人/联系方式：{{markerInfo.moniBaseInfo.devResponsePerson || '--'}} / {{markerInfo.moniBaseInfo.concact || '--'}}</span> <br>
      </div>  
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { getDeviceMonitorMapById } from "@/api/requestData/useEleControl"
export default defineComponent({
  emits:["handleClosePoint","showWarningPointList","showFailyPointList"],
  setup(props,ctx){
    const markerInfo = reactive({
      id:'',
      monitorName:"",
      title:"",
      type:"point",
      currentTime:new Date().parse('yyyy-MM-dd hh:mm:ss'),
      isOnline:'',
      isOnlineName:'',
      warningStatus:'',
      warningStatusName:'',
      warningCount:0,
      failyStatus:'0',
      failyStatusName:'',
      failyCount:0,
      rs485:false,
      moniData:{
        vol:"",
        ele:"",
        power:"",
        yesEnergy:"",
        totalEnergy:"",
      },
      moniBaseInfo:{
        wyCompany:'',
        buildResponse:'',
        buildResponsePhone:'',
        owner:'',
        ownerPhone:'',
        devResponsePerson:'',
        concact:'',
      }
    })
    onMounted(()=>{})
    // startShowData
    const startShowData = (pointItem)=>{
      getDeviceMonitorMapById({id:pointItem.monitorId,deviceId:pointItem.deviceId,port:pointItem.port}).then(res=>{
        let data = res.data;
        markerInfo.id = data.id;
        markerInfo.monitorName = data.monitorName;
        markerInfo.title = data.monitorName;
        markerInfo.currentTime = data.time;
        markerInfo.isOnline = data.online;
        markerInfo.isOnlineName = data.onlineName;
        markerInfo.warningStatus = data.alarmStatus;
        markerInfo.warningStatusName = data.alarmStatusName;
        markerInfo.warningCount = data.alarmTotal;
        markerInfo.failyStatus = data.faultStatus;
        markerInfo.failyStatusName = data.faultStatusName;
        markerInfo.failyCount = data.faultTotal;
        markerInfo.rs485 = data.rs485;

        markerInfo.moniData.vol = data.u01 == null ? "--" : (+data.u01) == 0 ? 0 : (+data.u01).toFixed(2);
        markerInfo.moniData.ele = data.e01 == null ? "--" : (+data.e01) == 0 ? 0 : (+data.e01).toFixed(2);
        markerInfo.moniData.power = data.p01 == null ? "--" : (+data.p01) == 0 ? 0 : (+data.p01).toFixed(2);
        markerInfo.moniData.yesEnergy = data.yesterdayC01 == null ? "--" : (+data.yesterdayC01) == 0 ? 0 : (+data.yesterdayC01).toFixed(2);
        markerInfo.moniData.totalEnergy = data.totalC01 == null ? "--" : (+data.totalC01) == 0 ? 0 : (+data.totalC01).toFixed(2);

        markerInfo.moniBaseInfo.wyCompany = data.pmc;
        markerInfo.moniBaseInfo.buildResponse = data.buildingLinkMan;
        markerInfo.moniBaseInfo.buildResponsePhone = data.buildingPhone;
        markerInfo.moniBaseInfo.owner = data.owner;
        markerInfo.moniBaseInfo.ownerPhone = data.roomPhone;
        markerInfo.moniBaseInfo.devResponsePerson = data.deviceLinkMan;
        markerInfo.moniBaseInfo.concact = data.devicePhone;
      })
    }
    // 点击告警次数
    const showPointWarningCountDia = ()=>{
      ctx.emit("showWarningPointList",markerInfo)
    }
    // 点击故障次数
    const showPointFailyCountDia = ()=>{
      ctx.emit("showFailyPointList",markerInfo)
    }

    // 关闭监测点
    const closePointInfo = ()=>{
      ctx.emit("handleClosePoint")
    }

    return {
      markerInfo,
      closePointInfo,
      showPointWarningCountDia,
      showPointFailyCountDia,
      startShowData
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

</style>