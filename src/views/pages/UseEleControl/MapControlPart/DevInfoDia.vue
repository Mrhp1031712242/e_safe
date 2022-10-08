<template>
  <div class="mark_info_dia">
    <div class="m_title">
      <b>设备信息 · {{markerInfo.title}}</b>
      <i class="fa fa-times" @click="closeDevInfo"></i>
    </div>
    <!-- 状态信息 -->
    <div class="content_wrap">
      <div class="base_info">
        <div style="margin-bottom:10px;">
          <b>状态信息</b>
          <span>{{markerInfo.currentTime}}</span>
        </div>
        <div class="de_list">在线状态：<span :style="{color:markerInfo.isOnline == '1' ? '#25EB53' : '#CB1010'}">{{markerInfo.isOnlineName}}</span></div>
        <div class="de_list">
          <div class="fl">当前告警状态：<span :style="{color:markerInfo.warningStatus == '1' ? '#25EB53' : '#CB1010'}">{{markerInfo.warningStatusName}}</span></div>
          <div class="fr"><span style="color:#11A9F1;">累计告警：<a href="javascript:;" style="color:#11A9F1;" @click="showDevWarningCountDia">{{markerInfo.warningCount || 0}} 次</a></span></div>
        </div>
        <div class="de_list">
          <div class="fl">当前设备故障状态：<span :style="{color:markerInfo.failyStatus == '1' ? '#25EB53' : '#EFA014'}">{{markerInfo.failyStatusName}}</span></div>
          <div class="fr"><span style="color:#11A9F1;">累计故障：<a href="javascript:;" style="color:#11A9F1;" @click="showDevFailyCountDia">{{markerInfo.failyCount || 0}} 次</a></span></div>
        </div>
      </div>
      <!-- 端口信息 -->
      <ul class="port_info">
        <div style="margin-bottom:10px;"><b>端口信息</b></div>
        <li class="port_list p_th">
          <span>端口</span>
          <span>监测点</span>
          <span>当前告警状态</span>
        </li>
        <li v-for="(portItem,portIndex) in markerInfo.portList" :key="'marker_port_'+portIndex" class="port_list">
          <span>{{portItem.portNum}}</span>
          <span class="ellipsis">{{portItem.pointName}}</span>
          <span :style="{color:portItem.status == '1' ? '#25EB53' : '#CB1010'}">{{portItem.statusName}}</span>
        </li>
      </ul>
      <!-- 基本信息 -->
      <div class="base_info">
        <div style="margin-bottom:10px;"><b>基本信息</b></div>
        <span class="de_list">监测设备ID：{{markerInfo.devBaseInfo.baseId}}</span> <br>
        <span class="de_list">产品型号：{{markerInfo.devBaseInfo.productType}}</span> <br>
        <span class="de_list">硬件版本：{{markerInfo.devBaseInfo.hardVersion}}</span> <br>
        <span class="de_list">固件版本：{{markerInfo.devBaseInfo.softVersion}}</span> <br>
        <span class="de_list">IMEI码：{{markerInfo.devBaseInfo.IMEI}}</span> <br>
        <span class="de_list">安装位置：{{markerInfo.devBaseInfo.address}}</span> <br>
        <span class="de_list">设备负责人：{{markerInfo.devBaseInfo.personName}}</span> <br>
        <span class="de_list">联系方式：{{markerInfo.devBaseInfo.phone}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
export default defineComponent({
  emits:["showWarningDevList","showFailyDevList","handleCloseDev"],
  setup(props,ctx){
    const markerInfo = reactive({
      title:"13456789456789",
      currentTime:new Date().parse('yyyy-MM-dd hh:mm:ss'),
      isOnline:'1',
      isOnlineName:'在线',
      warningStatus:'3',
      warningStatusName:'过载告警',
      warningCount:3,
      failyStatus:'1',
      failyStatusName:'正常',
      failyCount:4,
      portList:[
        { portNum:'01',pointName:'杨桃小区1栋304',status:'1',statusName:'正常' },
        { portNum:'02',pointName:'杨桃小区1栋305',status:'3',statusName:'告警中' },
      ],
      devBaseInfo:{
        devTypeName:'--',
        baseId:'--',
        productType:'--',
        hardVersion:'--',
        softVersion:'--',
        IMEI:'--',
        address:'--',
        personName:'--',
        phone:'--',
      }
    })
    onMounted(()=>{})

    const showDevWarningCountDia = ()=>{
      ctx.emit("showWarningDevList",markerInfo)
    }
    // 点击故障次数
    const showDevFailyCountDia = ()=>{
      ctx.emit("showFailyDevList",markerInfo)
    }
    // 关闭监测点
    const closeDevInfo = ()=>{
      ctx.emit("handleCloseDev")
    }
    return {
      markerInfo,
      closeDevInfo,
      showDevWarningCountDia,
      showDevFailyCountDia
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