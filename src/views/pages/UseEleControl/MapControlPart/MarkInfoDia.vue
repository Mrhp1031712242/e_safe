<template>
  <div class="mark_info_dia">
    <div class="m_title">
      <b>{{markerInfo.title}}</b>
      <i class="fa fa-times" @click="closeMarkerInfo"></i>
    </div>
    <div class="content_wrap">
      <ul class="list_info">
        <li class="t_status" v-for="(staItem,staIndex) in statuInfoData.list" :key="'stat_'+staIndex">
          <div class="t_top">
            <b>{{staItem.title}}</b>
            <span v-for="(status,titleIndex) in staItem.titleList" :key="'title_'+staIndex + '_' + titleIndex">
              <i class="t_icon" :style="{background:getStatusCls(status)}"></i>
              &nbsp;{{changeStatusStr(status)}}
            </span>
          </div>
          <div class="details_wrap" :class="[staItem.type == 'dev' ? '' :'dw_hv' ]">
            <span v-for="(statuDeItem,statuDeIndex) in staItem.statusDetaisList" :key="'details_'+ staIndex + '_' + statuDeIndex"
            :style="{background:getStatusCls(statuDeItem.moniStatus),borderColor:getBorderColor(statuDeItem.moniStatus), cursor:staItem.type == 'dev' ? 'default' : 'pointer'}" @click="selMoni(staItem,statuDeItem)">
              {{statuDeItem.name}} <i v-if="!!statuDeItem.port" style="font-style:normal;">({{statuDeItem.port}})</i>
            </span>
          </div>
        </li>
      </ul>
      <!-- 基本信息 -->
      <div class="base_info">
        <div style="margin-bottom:10px;"><b>基本信息</b></div>
        <span class="de_list">区域：{{moniBaseInfo.areaStr || '--'}}</span> <br>
        <span class="de_list">小区/村居名称：{{moniBaseInfo.villageName || '--'}}</span> <br>
        <span class="de_list">楼栋名称：{{moniBaseInfo.buildingName || '--'}}</span> <br>
        <span class="de_list">物业公司：{{moniBaseInfo.wyCompany || '--'}}</span> <br>
        <span class="de_list">楼栋负责人：{{moniBaseInfo.personName || '--'}}</span> <br>
        <span class="de_list">联系方式：{{moniBaseInfo.phone || '--'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { uniqueArray } from "@/utils/commonAny"
export default defineComponent({
  emits:["selPointHandle","selDevHandle","handleCloseMarker"],
  setup(props,ctx){
    const markerInfo = reactive({
      title:"--",
    })
    const statuInfoData = reactive({list:[
      {
        title:"监测点",
        type:"point",
        titleList:[],
        statusDetaisList:[]
      },
      {
        title:"监测设备",
        type:"dev",
        titleList:[],
        statusDetaisList:[]
      }
    ]});
    // 拷贝监测点数据
    const monitorRoomMark = reactive({list:[]});
    // 基本信息
    const moniBaseInfo = reactive({
      areaStr:"",
      villageName:"",
      buildingName:"",
      wyCompany:"",
      personName:"",
      phone:"",
    })

    const changeStatusStr = (val) =>{
      switch(val){
        case "20" : return "正常";
        case "11" : return "告警";
        case "12" : return "故障";
        case "30" : return "在线";
        case "32" : return "掉线";
      }
    }
    onMounted(()=>{})
    // startShowData
    const startShowData = (markInfoData)=>{
      statuInfoData.list[0].titleList =  [...new Set(markInfoData.monitorAndRoomList.map(item=>(item.status != 0 ? String(+(item.status) + 10) : '20')))];
      statuInfoData.list[0].statusDetaisList = uniqueArray(markInfoData.monitorAndRoomList.map(item=>{
        return {  
          id:item.roomId,
          moniStatus:item.status,
          name:item.roomName,
          deviceId:item.deviceId,
          monitorId:item.monitorId,
          port:item.port,
        }
      }),"port").sort((a,b)=>{
        return b.moniStatus - a.moniStatus
      }) 
      monitorRoomMark.list = JSON.parse(JSON.stringify(statuInfoData.list[0].statusDetaisList));
      statuInfoData.list[1].titleList = [...new Set(markInfoData.deviceInfo.map(item=>item.status = item.isOnline == true ? "30" : "32"))]
      statuInfoData.list[1].statusDetaisList = uniqueArray(markInfoData.deviceInfo.map(item=>{
        return {  
          id:item.gatewayId,
          moniStatus:item.isOnline == true ? "30" : "31",
          name:item.gatewayId,
        }
      }),"id").sort((a,b)=>{
        return b.moniStatus - a.moniStatus
      }) 
      markerInfo.title = markInfoData.buildingAddDto.areaStr + markInfoData.buildingAddDto.villageName + markInfoData.buildingAddDto.name;
      moniBaseInfo.areaStr = markInfoData.buildingAddDto.areaStr;
      moniBaseInfo.villageName = markInfoData.buildingAddDto.villageName;
      moniBaseInfo.buildingName = markInfoData.buildingAddDto.name;
      moniBaseInfo.wyCompany = markInfoData.buildingAddDto.pmc;
      moniBaseInfo.personName = markInfoData.buildingAddDto.linkMan;
      moniBaseInfo.phone = markInfoData.buildingAddDto.phone;
    }
    // 颜色变化
    const getStatusCls = (val)=>{
      switch(val){
        case "0": return "#434F5D"; // 正常
        case "20": return "#546374"; // title正常
        case "1": return "rgba(255, 67, 82, 0.4)"; // 监测点告警
        case "2": return "#4E4538"; // 监测点故障
        case "30": return "#434F5D"; // 监测设备在线
        case "31": return "#4E4538"; // 监测设备掉线
        case "32": return "#E59930"; // 监测设备 title掉线
        case "10": return "#1F91FF"; // 被点击正常状态
        case "11": return "#EB3341"; // 被点击告警状态
        case "12": return "#E59930"; // 被点击故障状态
      }
    }
    const getBorderColor = (val)=>{
      switch(val){
        case "0": return "#6F6F6F"; // 正常
        case "1": return "#FF4040"; // 监测点告警
        case "2": return "#E5992F"; // 监测点故障
        case "30": return "#707070"; // 监测设备在线
        case "31": return "#E5992F"; // 监测设备掉线
        case "10": return "#1F91FF"; // 被点击正常状态
        case "11": return "#EB3341"; // 被点击告警状态
        case "12": return "#E59930"; // 被点击故障状态
      }
    }
    // 点击监测点/监测设备
    const selMoni = (markerItem,innerItem)=>{
      if(markerItem.type == 'dev'){
        return;
      }
      monitorRoomMark.list.forEach(fItem=>{
        statuInfoData.list[0].statusDetaisList.forEach(cItem=>{
          if(cItem.monitorId == fItem.monitorId){
            cItem.moniStatus = fItem.moniStatus;
          }
        })
      })
      if(markerItem.type == 'point'){
        innerItem.moniStatus = String(+innerItem.moniStatus + 10);
        ctx.emit("selPointHandle",innerItem)
      }
    }
    // 关闭marker弹框
    const closeMarkerInfo = ()=>{
      ctx.emit("handleCloseMarker")
    }
    return {
      getStatusCls,
      getBorderColor,
      markerInfo,
      statuInfoData,
      moniBaseInfo,
      closeMarkerInfo,
      selMoni,
      startShowData,
      changeStatusStr
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