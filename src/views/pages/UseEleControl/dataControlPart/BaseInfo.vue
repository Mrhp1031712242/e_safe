<template>
  <div class="baseInfo">
    <div class="infoLeft">
      <div class="basicInfo">
        <h3>基本信息</h3>
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
        <h3>联系人</h3>
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
  padding-left: 20px;
  justify-content: space-between;
  .infoLeft {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    width: 40%;
    h3 {
      position: relative;
      background-color: #0c3f85ff;
      width: calc(100% - 45px);
      padding-left: 45px;
      height: 40px;
      line-height: 40px;
      &::before {
        content: "";
        position: absolute;
        left: 20px;
        top: 10px;
        width: 15px;
        height: 21px;
        background-image: url(@/assets/image/info_icon.png);
      }
      &::after {
        content: "";
        position: absolute;
        right: 17px;
        top: 14px;
        width: 192px;
        height: 11px;
        background-image: url(@/assets/image/info_line.png);
      }
    }
    .infoContent {
      padding: 20px 0 37px 12px;
    }
    .basicInfo,
    .contacts {
      width: 100%;
      background-color: #3296fa1a;
      margin-bottom: 20px;
    }
    .contacts {
      padding-bottom: 50px;
    }
    span {
      display: block;
      margin: 13px 0;
      font-size: 14px;
      padding: 0 15px;
    }
  }
  .infoRight {
    width: 57%;
    .map {
      width: 100%;
      height: 500px;
      margin-top: 23px;
    }
  }
}
</style>