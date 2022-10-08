<template>
  <div class="map_control">
    <!-- 地图 -->
    <div id="moniMap" @click="letSeledIndex = -1;letData.list.forEach(item=>item.seled = true);"></div>
    <!-- 头部搜索 -->
    <div class="top_search">
      <ul class="top_search_le">
        <li v-for="(timeItem,timeIndex) in timeTypes.list" :key="timeItem.id" 
        :style="{left:(timeIndex * 70 - 17) + 'px'}"
        :class="[timeItem.id == seledType ? 'active_type' : '']"
        @click="selTimeType(timeItem)">
          <span>{{timeItem.name}}</span>
        </li>
      </ul>
      <div class="top_search_mid">
        <span class="mid_label">楼栋图层</span>
        <el-checkbox-group v-model="buildingStatus" class="status_type" @change="changeBuildingStatus">
          <el-checkbox label="0">正常</el-checkbox>
          <el-checkbox label="1">告警</el-checkbox>
          <el-checkbox label="2">故障</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="top_search_ri">
        <el-input size="small" style="width:200px;" clearable v-model="keyWord" placeholder="请输入监测名称、监测设备ID"></el-input>
        <el-button size="small" style="margin-left:10px;" @click="mapSearch">搜索</el-button>
      </div>
    </div>
    <!-- 左上类别 -->
    <ul class="le_top_type">
      <!-- @/assets/image/moni_warning -->
      <li v-for="(letItem,letIndex) in letData.list" :key="'let_'+letIndex"
      :class="[letSeledIndex == letIndex ? 'let_actived' : '']"
      @click="chooseLetType(letItem,letIndex)">
        <div class="fl le_top_type_warn" :style="{background:letItem.bg,boxShadow:'0 0 2px 5px ' + letItem.bg}">
          <img :src="letItem.img" alt="">
        </div>
        <div class="fl le_top_type_faily">
          <b>{{letItem.count}}</b> <br>
          <span>{{letItem.name}}</span>
        </div>
      </li>
    </ul>
    <!-- 点击告警点弹窗 -->
    <div class="dialog_warning_wrap" :class="[letSeledIndex == 0 ? 'show_left_top_dia' : 'hide_left_top_dia']">
      <WarningPointDia ref="WarningPointDia" :initTableData="initWarningData.list" @pointRowSel="pointRowSel" />
    </div>
    <!-- 点击故障设备 -->
    <div class="dialog_warning_wrap" :class="[letSeledIndex == 1 ? 'show_left_top_dia' : 'hide_left_top_dia']">
      <FailyDevsDia  ref="FailyDevsDia" :initTableData="initFailyData.list" @pointRowSel="pointRowSel" />
    </div>
    <!-- 点击地图marker弹窗 -->
    <div class="dialog_marker_info_wrap marker_info_part" :class="[showMarkerInfo ? 'show_marker_info_part' : 'hide_marker_info_part']">
      <MarkInfoDia ref="MarkInfoDia" @handleCloseMarker="handleCloseMarker"
       @selPointHandle="selPointHandle" 
       @selDevHandle="selDevHandle" />
    </div>
    <!-- 点击监测点弹窗 -->
    <div class="dialog_marker_info_wrap marker_point_info_wrap"
    :class="[showPointInfo ? 'show_marker_point_info_wrap' : 'hide_marker_point_info_wrap']" 
    :style="{right:showMoinDevInfo && showPointInfo ? '715px' : '360px'}">
      <PointInfoDia ref="PointInfoDia" 
      @handleClosePoint="showPointInfo=false;" 
      @showWarningPointList="showWarningPointList"
      @showFailyPointList="showFailyPointList"/>
    </div>
    <!-- 点击监测设备弹窗 -->
    <div class="dialog_marker_info_wrap" v-if="showMoinDevInfo" style="right:360px">
      <DevInfoDia ref="DevInfoDia" 
      @handleCloseDev="showMoinDevInfo=false;" 
      @showWarningDevList="showWarningDevList"
      @showFailyDevList="showFailyDevList"/>
    </div>
    <!-- 点击累计告警次数弹窗 -->
    <div class="dialog_warning_wrap show_mid_table" v-if="showWarningCount">
      <WarningCountDia ref="WarningCountDia" @closeMidWarningCount="showWarningCount=false;"/>
    </div>
    <!-- 点击累计故障次数弹窗 -->
    <div class="dialog_warning_wrap show_mid_table" v-if="showFailyCount">
      <FailyCountDia ref="FailyCountDia" @closeMidFailyCount="showFailyCount=false;" />
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,reactive, onMounted } from 'vue'
import warningImg from "@/assets/image/moni_warning.png";
import failyImg from "@/assets/image/moni_faily.png";
import WarningPointDia from "./MapControlPart/WarningPointDia.vue"
import FailyDevsDia from "./MapControlPart/FailyDevsDia.vue"
import MarkInfoDia from "./MapControlPart/MarkInfoDia.vue"
import PointInfoDia from "./MapControlPart/PointInfoDia.vue"
import DevInfoDia from "./MapControlPart/DevInfoDia.vue"
import WarningCountDia from "./MapControlPart/WarningCountDia.vue"
import FailyCountDia from "./MapControlPart/FailyCountDia.vue"
import { changeTimeType } from "@/utils/commonAny.js"
import { selectMapList,selectAlarmGroupList,selectFaultGroupList ,selectMapByBuildingId} from "@/api/requestData/useEleControl"

export default defineComponent({
  components:{
    WarningPointDia,
    FailyDevsDia,
    MarkInfoDia,
    PointInfoDia,
    DevInfoDia,
    WarningCountDia,
    FailyCountDia,
  },  
  setup(){
    let map = reactive({});
    // 时间类型
    const timeTypes = reactive({list:[
      // {id:"CURRENT",name:"当前"},
      {id:"DAY",name:"今天"},
      {id:"YESTERDAY",name:"昨天"},
      {id:"SEVENDAY",name:"最近7天"},
    ]});
    const seledType = ref("DAY");
    const initWarningData = reactive({list:[]});
    const initFailyData = reactive({list:[]});
    const WarningPointDia = ref(null);
    const FailyDevsDia = ref(null);
    // 楼栋图层
    const buildingStatus = ref(["0","1","2"])
    // 搜索
    const keyWord = ref("");

    // 左上角 告警点/故障设备
    const letData = reactive({list:[
      { img:warningImg,count:0,name:"告警点",bg:"rgba(239, 31, 31, 0.9)",seled:true,},
      { img:failyImg,count:0,name:"故障设备",bg:"rgba(203, 135, 16, 0.9)",seled:true,},
    ]})
    const letSeledIndex = ref(-1);
    // 点击marker
    const showMarkerInfo = ref(false);
    const showPointInfo = ref(false);
    const showMoinDevInfo = ref(false);
    const MarkInfoDia = ref(null);
    const PointInfoDia = ref(null);
    // marker内 次数弹框
    const showWarningCount = ref(false); 
    const showFailyCount = ref(false);
    const WarningCountDia = ref(null); 
    const FailyCountDia = ref(null); 


    onMounted(()=>{
      getWarningData(seledType.value); // 获取告警数据
      getFailyData(seledType.value); // 获取告警数据
      getMap();  // 获取地图 
    })
    /**
     * 左上角告警/故障
     */
    // 获取告警数据
    const getWarningData = (timeType)=>{
      let timeObj = changeTimeType(timeType);
      selectAlarmGroupList({page:1,limit:20,startTime:timeObj.startTime,endTime:timeObj.endTime}).then(res=>{
        res.data.forEach((item,index)=>item.$index = index + 1);
        initWarningData.list = res.data;
        letData.list[0].count = res.count;
      })
    }
    // 获取故障数据
    const getFailyData = (timeType)=>{
      let timeObj = changeTimeType(timeType);
      selectFaultGroupList({page:1,limit:20,startTime:timeObj.startTime,endTime:timeObj.endTime}).then(res=>{
        res.data.forEach((item,index)=>item.$index = index + 1);
        initFailyData.list = res.data;
        letData.list[1].count = res.count;
      })
    }
    // 点击时间类型
    const selTimeType = (item)=>{
      letSeledIndex.value = -1;
      seledType.value = item.id;
      getWarningData(seledType.value); 
      getFailyData(seledType.value); 
      letData.list.forEach(item=>item.seled = true);
    }
    // 选择告警点/故障设备
    const chooseLetType = (item,index)=>{
      handleCloseMarker();
      letData.list.filter((item,fIndex)=>fIndex != index).forEach(it => it.seled = true);
      if(item.seled){
        letSeledIndex.value = index;
      }else{
        letSeledIndex.value = -1;
      }
      item.seled = !item.seled;
      setTimeout(()=>{
        WarningPointDia.value && WarningPointDia.value.startInitHandle(seledType.value);
        FailyDevsDia.value && FailyDevsDia.value.startInitHandle(seledType.value);
      })
    }
    /**
     * 地图
     */
    
    // 获取地图
    const getMap = ()=>{
      map = new BMapGL.Map("moniMap",{enableMapClick:false}); // 创建Map实例
      map.addControl(new BMapGL.ScaleControl()); // 添加比例尺控件 
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      map.addControl(new BMapGL.ZoomControl()); // 添加缩放控件
      getAllBuildShow(map);
    }
    // 修改楼栋图层
    const changeBuildingStatus = (val)=>{
      buildingStatus.value = val;
      getAllBuildShow(map);
    }
    // 获取地图楼栋监控所有位置
    const getAllBuildShow = (map)=>{
      map.clearOverlays();
      let iconShow = {
        "0":new BMapGL.Icon('/esafe/pic/normal.png',new BMapGL.Size(40,40)),
        "1":new BMapGL.Icon('/esafe/pic/warning.png',new BMapGL.Size(40,40)),
        "2":new BMapGL.Icon('/esafe/pic/faily.png',new BMapGL.Size(40,40)),
      }
      let viewBuildingParams = {
        searchStatus:buildingStatus.value.join(","),
        keyWord:keyWord.value || null
      }
      selectMapList(viewBuildingParams).then(res=>{
        if(res.data.length > 0){
          let initPoint = new BMapGL.Point(res.data[0].longitude,res.data[0].latitude); 
          map.centerAndZoom(initPoint,12); // 初始化地图,设置中心点坐标和地图级别
          res.data.forEach(item=>{
            let point = new BMapGL.Point(item.longitude,item.latitude);  
            let opts = {
              position:point,
              offset:new BMapGL.Size(-30, -40)    // 设置文本偏移量
            }
            let label = new BMapGL.Label(item.name,opts)
            label.setStyle({
              color: '#04285A',
              borderRadius: '3px',
              borderColor: '#ccc',
              padding: '3px',
              fontSize: '13px',
              height: '20px',
              lineHeight: '20px',
              fontFamily: '微软雅黑'
            })
            map.addOverlay(label);
            let marker = new BMapGL.Marker(point,{icon:iconShow[item.alarmAndFaultState],data:item}); // 创建标记点
            map.addOverlay(marker);
            marker.addEventListener('click', function (e) {
              getInfoFromBuilding(e.currentTarget._config.data)
            })
          })
        }else{
          let initPoint = new BMapGL.Point(113.27324,23.15792); 
          map.centerAndZoom(initPoint,12);
        }
      })
    }
    // 点击地图marker点获取楼栋信息
    const getInfoFromBuilding = (buildingItem)=>{
      selectMapByBuildingId({id:buildingItem.id}).then(res=>{
        showFailyCount.value = false;
        showWarningCount.value = false;
        showPointInfo.value = false;
        showMarkerInfo.value = true;
        setTimeout(()=>{
          MarkInfoDia.value && MarkInfoDia.value.startShowData(res.data);
        })
      })
    }
    // 选择告警点、故障点列表某一行
    const pointRowSel =  (row)=>{
      if(map){
        let initPoint = new BMapGL.Point(row.longitude,row.latitude); 
        map.centerAndZoom(initPoint,12); // 初始化地图,设置中心点坐标和地图级别
      }
    }
    // 搜索
    const mapSearch = ()=>{
      getAllBuildShow(map);
    }
    // 选择监测点
    const selPointHandle = (pointItem)=>{
      showPointInfo.value = false;
      setTimeout(()=>{
        PointInfoDia.value && PointInfoDia.value.startShowData(pointItem)
        showPointInfo.value = true;
      },100)
    }
    // 选择监测设备
    const selDevHandle = (devItem)=>{
      showMoinDevInfo.value = true;
    }
    // 点击监测点告警次数弹框
    const showWarningPointList = (pointWarningCountInfo)=>{
      showWarningCount.value = true;
      setTimeout(()=>{
        WarningCountDia.value && WarningCountDia.value.startShowData(pointWarningCountInfo);
      })
    }
    // 点击监测点故障次数弹框
    const showFailyPointList = (pointFailyCountInfo)=>{
      showFailyCount.value = true;
      setTimeout(()=>{
        FailyCountDia.value && FailyCountDia.value.startShowData(pointFailyCountInfo);
      })
    }

    // 点击监测设备告警次数弹框
    const showWarningDevList = (devWarningCountInfo)=>{
      showWarningCount.value = true;
    }
    // 点击监测设备故障次数弹框
    const showFailyDevList = (devFailyCountInfo)=>{
      showFailyCount.value = true;
    }
    // 关闭marker
    const handleCloseMarker = ()=>{
      showMarkerInfo.value = false;
      showPointInfo.value = false;
      showMoinDevInfo.value = false;
    }
    return {
      initWarningData,
      initFailyData,
      WarningPointDia,
      FailyDevsDia,

      map,
      timeTypes,
      seledType,
      mapSearch,
      buildingStatus,
      changeBuildingStatus,
      selTimeType,
      keyWord,
      letData,
      letSeledIndex,
      chooseLetType,
      pointRowSel,

      showMarkerInfo,
      MarkInfoDia,
      PointInfoDia,

      showPointInfo,
      showMoinDevInfo,
      handleCloseMarker,
      selPointHandle,
      selDevHandle,
      showWarningCount,
      showFailyCount,
      showWarningPointList,
      showFailyPointList,
      showWarningDevList,
      showFailyDevList,
      
      WarningCountDia,
      FailyCountDia,
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
.map_control{
  width: 100%;
  height: 100%;
  position: relative;
  #moniMap{
    width: 100%;
    height: 100%;
  }
  .top_search{
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: rgba(0,21,41,0.8);
    position: absolute;
    top: 0;
    color: rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    z-index: 100;
    &_le{
      height: 28px;
      line-height: 28px;
      overflow: hidden;
      margin-left: 15px;
      position: relative;
      width: 200px;
      li{
        position: absolute;
        text-align: center;
        width: 70px;
        height: 100%;
        background: #001529;
        font-size: 14px;
        transform: skewX(-20deg) translateX(10px);
        border-right: 1px solid rgba(255,255,255,0.8);
        cursor: pointer;
        &:hover{
          background: #062C50;
        }
        span{
          display: inline-block;
          transform: skewX(20deg);
        }
        &:nth-last-child(1){
          border-right:10px solid #001529;
        }
        &.active_type{
          background: #186FC2;
          color: #fff;
          &:nth-last-child(1){
            border-right:10px solid #186FC2;
          }
        }
      }
    }
    &_mid{
      margin-left: 100px;
      height: 28px;
      line-height: 28px;
      background: #001529;
      padding: 0 20px;
      overflow: hidden;
      .mid_label{
        float: left;
        margin-right:20px;
      }
      .status_type{
        float: left;
        vertical-align: middle;
        .el-checkbox{
          height: 28px;
          color: rgba(255,255,255,0.8);
        }
      }
    }
    &_ri{
      margin-left: 10px;
      height: 28px;
      line-height: 28px;
      display: flex;
      .el-input__inner{
        background: #fff!important;
        height: 100%;
      }
      .el-button{
        height: 100%;
        background: #001529;
        border: none;
        padding: 5px 15px;
        span{
          color: #fff;
        }
        &:hover{
          opacity: 0.8!important;
        }
      }
    }
  }
  .le_top_type{
    position: absolute;
    left: 10px;
    top: 50px;
    display: flex;
    color: #fff;
    z-index: 10000;
    li{
      padding: 15px 15px 10px 15px;
      margin-right: 10px;
      overflow: hidden;
      background: rgba(0, 21, 41, 0.7);
      border-radius: 3px;
      cursor: pointer;
      .le_top_type_warn{
        padding: 5px;
        border-radius: 4px;
        background: rgba(239, 31, 31, 0.9);
        box-shadow: 0 0 2px 5px rgba(239, 31, 31, 0.9);
      }
      .le_top_type_faily{
        line-height: 25px;
        text-align: center;
        margin-left: 15px;
        b{
          font-size: 28px;
        }
        span{
          color: rgba(255,255,255,0.8);
        }
      }
      &:hover{
        opacity: 0.8;
      }
      &.let_actived{
        background: linear-gradient(to bottom,#071226,#2C85DB);
      }
    }
  }
  // 告警弹窗
  .dialog_warning_wrap{
    position: absolute;
    top: 140px;
    left: 10px;
    background: rgba(0,21,41,0.9);
    z-index: 1000;
    transition:0.2s;
    overflow: hidden;
    // height: calc(100vh - 295px);
    &.show_left_top_dia{
      height: calc(100vh - 265px);
      transition: 0.3s;
      transition-delay: 0.1s;
    }
    &.hide_left_top_dia{
      height: 0;
      transition: 0s;
    }
    &.show_mid_table{
      left: 10%;
      right: 10%;
      margin: auto;
      height: calc(100vh - 265px);
    }
    .el-table__inner-wrapper{
      height: 100%;
      .el-table__body-wrapper{
        height: calc(100% - 45px);
        .el-scrollbar__view{
          height: 95%;
          display: inline-block !important;
        }
      }
    }
  }
  .dialog_marker_info_wrap{
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 350px;
    // height: 450px;
    background: rgba(0, 21, 41, 0.8);
    z-index: 1000;
    overflow: hidden;
    // 右下角弹框
    &.marker_info_part{
      height: 0;
    }
    &.show_marker_info_part{
      height: 450px;
      transition: 0.2s;
    }
    &.hide_marker_info_part{
      height: 0;
      transition: 0;
    }

    // 点击监测点弹框
    &.marker_point_info_wrap{
      width: 0;
      height: 450px;
    }
    &.show_marker_point_info_wrap{
      width: 350px;
      transition: 0.2s;
      transition-delay: 0.1s;
    }
    &.hide_marker_point_info_wrap{
      width: 0;
      transition: 0;
    }

  }
}
</style>