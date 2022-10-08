<template>
  <div id="map" style="width: 100%; height: 556px">
    <div class="cordinate">
      <span>经度：{{ lon }}</span>
      &nbsp;
      <span>纬度：{{ lat }}</span>
      &nbsp;
      <span class="reBack" @click="reBack()">
        <el-icon style="position: absolute; font-size: 20px">
          <Refresh></Refresh>
        </el-icon>
      </span>
    </div>
    <div id="allmap" ref="allmap"></div>
  </div>
</template>
<script>
import { Refresh } from "@element-plus/icons-vue";
export default {
  name: "BaiduMap",
  components: {
    Refresh,
  },
  props: {
  },

  methods: {
    initMap(lon,lat,monitorName,address) {
      this.lon = lon;
      this.lat = lat;
      this.monitorName = monitorName;
      this.address = address;
      let map = new BMapGL.Map(this.$refs.allmap); // 创建Map实例
      let point = new BMapGL.Point(lon, lat);
      map.centerAndZoom(point, 11); // 初始化地图,设置中心点坐标和地图级别
      map.setCenter(point);
      map.enableScrollWheelZoom(true); //开启缩放
      let marker = new BMapGL.Marker(point);
      map.addOverlay(marker);
      let opts = {
        width: 200, // 信息窗口宽度
        height: 30, // 信息窗口高度
        title:monitorName,
      };
      let infoWindow = new BMapGL.InfoWindow("地址: "+ address,opts); // 创建信息窗口对象
      marker.addEventListener("click", function () {
        map.openInfoWindow(infoWindow, point); //开启信息窗口
      });
    },
    reBack() {
      this.initMap(this.lon,this.lat,this.monitorName,this.address);
    },
  },
  data() {
    return {
      lon:"",
      lat:"",
      monitorName:"",
      address:"",
    };
  },
  created(){
  },
  mounted() {
    // setTimeout(()=>{
    //   this.initMap();
    // })
  },
};
</script>
<style lang="scss">
#allmap {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.cordinate {
  position: absolute;
  z-index: 11;
  top: 79px;
  width: 280px;
  font-size: 15px;
  padding: 5px 15px;
  background-color: #0000006b;
  .reBack {
    cursor: pointer;
    &:hover {
      color: #474747;
    }
  }
}
</style>

