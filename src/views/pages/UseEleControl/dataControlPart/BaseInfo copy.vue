<template>
  <div class="baseInfo">
    <div class="infoLeft">
      <div class="basicInfo">
        <h2>基本信息</h2>
        <span>监测点名称：{{ monitorName || '--' }}</span>
        <span>地址：{{ monitorAddress || '--' }}</span>
        <span>电价：{{electroValency || '--'}}元</span>
        <span>最大透支电量：{{maxOverPower || '--'}}</span>
        <span>监测设备ID：{{ deviceId || '--' }}</span>
        <span>端口：{{ monitorPort || '--' }}</span>
        <span>电表ID：{{ meterId || '--' }}</span>
        <span>IMEI码：{{ IMEICode || '--' }}</span>
      </div>
      <div class="contacts">
        <h2 style="margin-top: 20px">联系人</h2>
        <span>物业公司：{{ managementCompany || '--' }}</span>
        <span
          >楼栋负责人/联系方式：{{ principal || '--' }} / {{ principalContact || '--' }}</span
        >
        <span>业主/联系方式：{{ owner || '--' }} / {{ ownerContact || '--' }}</span>
        <span
          >设备负责人/联系方式：{{ equipment || '--' }} / {{ equipmentContact || '--' }}</span
        >
      </div>
    </div>
    <div class="infoRight">
      <div class="location">
        <h2>地图定位</h2>
        <div class="map">
          <baiduMap ref="baiduMap" :lon="lon" :lat="lat" :mapTitle="monitorName" :mapAddress="monitorAddress"></baiduMap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import baiduMap from "@/views/pages/UseEleControl/dataControlPart/baiduMap.vue"
import { getDeviceMonitorDataById } from "@/api/requestData/useEleControl"

export default ({
  components:{
    baiduMap
  },
  setup() {
    onMounted(() => {});

    return {};
  },

  data() {
    return {
      monitorName: "",
      monitorAddress: "",
      electroValency:"",
      maxOverPower:"",
      deviceType: "",
      deviceId: "",
      monitorPort: "",
      meterId:"",
      IMEICode: "",

      managementCompany: "--",
      principal: "--",
      principalContact: "",
      owner: "--",
      ownerContact: "",
      equipment: "--",
      equipmentContact: "",

      lon:"",
      lat:"",
    };
  },
  created() {},
  methods: {
    // startReqData
    startReqData(moniItem){
      this.getBaseInfo(moniItem.id);
    },
    // 获取基本信息
    getBaseInfo(id){
      getDeviceMonitorDataById({id:id}).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          this.monitorName = res.data.monitorName;
          this.monitorAddress = res.data.areaStr.replace(/-/g,"") + (res.data.villageName || '') + (res.data.buildingName || '');
          this.electroValency = res.data.electrovalence;
          this.maxOverPower = res.data.maxBeyondQuantity;
          this.deviceType = res.data.deviceTypeName;
          this.deviceId = res.data.deviceId;
          this.monitorPort = res.data.port;
          this.meterId = res.data.meterId;

          this.managementCompany = res.data.pmc;
          this.principal = res.data.buildingLinkMan;
          this.principalContact = res.data.buildingPhone;
          this.owner = res.data.owner;
          this.ownerContact = res.data.roomPhone;
          this.equipment = res.data.deviceLinkMan;
          this.equipmentContact = res.data.devicePhone;

          this.lon = res.data.longitude || null;
          this.lat = res.data.latitude || null;
          if(this.lon != null && this.lat!=null){
            this.$refs.baiduMap && this.$refs.baiduMap.initMap(this.lon,this.lat,this.monitorName,this.monitorAddress);
          }
        }
      })
    }
  },
});
</script>
<style lang='scss' scoped>
.baseInfo {
  display: flex;
  .infoLeft {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .basicInfo {
      flex: 1;
    }
    .contacts {
      flex: 1;
    }
    h2 {
      margin-bottom: 20px;
      font-size: 18px;
    }
    span {
      display: block;
      margin: 10px 0;
      font-size: 14px;
    }
  }
  .infoRight {
    flex: 1.3;
    .map {
      margin: 20px 20px 0 0;
    }
  }
}
</style>