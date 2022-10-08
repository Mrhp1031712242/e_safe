<template>
  <div class="building_bd_map">
    <div class="_map_tip">如果位置有很大的偏差，可根据下面需填写的信息精确当前位置</div>
      <div class="map_dialog_wrap">
        <div style="margin:10px 0 20px 0;color:#fff;">
          <span style="margin-right:50px;">经度：{{lon}}</span>
          <span>纬度：{{lat}}</span>
        </div>
        <div style="margin-bottom:15px;" class="handle_list_wrap">
          <!-- <el-select class="ipt_words" size="default" v-model="mapHandleForm.province" filterable placeholder="省份" style="width:120px;margin-right:15px;margin-left:0;" @change="changeProVin">
            <el-option
              v-for="item in provinces"
              :key="'province_'+item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select class="ipt_words" size="default" v-model="mapHandleForm.city" filterable clearable placeholder="地市" style="width:120px;margin-right:15px">
            <el-option
              v-for="item in cityList.list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select> -->
          <el-input class="ipt_words" size="default" v-model="mapHandleForm.address" placeholder="所在地点具体名称" style="width:250px;margin-right:15px"></el-input>
          <el-button type="primary" size="default" @click="searchLocal">搜 索</el-button>
        </div>
        <div id="buildingAllmap" style="width:100%;height:350px;" v-loading="localLoading" element-loading-text="获取当前位置"></div>
        <div class="control_dialog">
          <el-button @click="quit">关闭</el-button>
          <el-button type="primary" class="control_dialog_btn" @click="confirm">提交</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import {defineComponent,ref ,onMounted, reactive } from 'vue'
import { ElMessage } from "element-plus";
import { provinces,citys } from "@/mock/areas.js"
export default defineComponent({
  props:{
    address:{
      type:String,
    }
  },
  emit:["getLng","closeMapDialog"],
  setup(props,ctx){
    let lon = ref(0);
    let lat = ref(0);
    let cityList = reactive({list:[]});
    let map = reactive({});
    let localLoading = ref(false)
    const mapHandleForm = reactive({
      province:"",
      city:"",
      address:props.address,
    })
    // 选择省
    const changeProVin = (val) =>{
      provinces.forEach((item,pIndex)=>{
        if(item == val){
          cityList.list = citys[pIndex];
          mapHandleForm.city = cityList.list[0];
        }
      })
    }
    // 搜索
    const searchLocal = ()=>{
      let allOverlay = map.getOverlays();
      for (var i = 0; i < allOverlay.length; i++){
        map.removeOverlay(allOverlay[i]);
      }
      if(!mapHandleForm.address){
        ElMessage.warning("请填写具体地点");
        return false;
      }
      // 创建地址解析器实例
      let myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
	    myGeo.getPoint(mapHandleForm.address, function(point){
        if (point) {
          map.centerAndZoom(point, 16);
          map.addOverlay(new BMap.Marker(point));
          lon.value = point.lng;
          lat.value = point.lat;
        }else{
          alert("您填写地址没有解析到结果!");
        }
      },mapHandleForm.province + mapHandleForm.city)
    }
    // 提交地图经纬度
    const confirm = ()=>{
      let lngObj = {
        longitude:lon,
        latitude:lat
      }
      ctx.emit("getLng",lngObj)
    }
    // 关闭弹窗
    const quit = ()=>{
      ctx.emit("closeMapDialog")
    }
    // 初始化地图数据
    const getMap = () =>{
      localLoading.value = true;
      map = new BMap.Map("buildingAllmap",{enableMapClick:false}); // 创建Map实例
      map.addControl(new BMap.NavigationControl());        
      let point = new BMap.Point(116.331398,39.897445);
      map.centerAndZoom(point,12);
      let geoc = new BMap.Geocoder();    
      let _this = this;
      let geolocation = new BMap.Geolocation();
      if(mapHandleForm.address){
        geoc.getPoint(mapHandleForm.address, function(addPoint){
          if (addPoint) {
            localLoading.value = false;
            map.centerAndZoom(addPoint, 16);
            map.addOverlay(new BMap.Marker(addPoint));
            lon.value = addPoint.lng;
            lat.value = addPoint.lat;
          }else{
            alert("您填写地址没有解析到结果!");
          }
        },mapHandleForm.province + mapHandleForm.city)
      }else{
        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            if(r.point.lng || r.point.lat){
              point = new BMap.Point(r.point.lng,r.point.lat);
              localLoading.value = false;
              map.centerAndZoom(point,16);
              map.addOverlay(new BMap.Marker(point));
              lon.value = r.point.lng;
              lat.value = r.point.lat;
            }
          }else{
            ElMessage.warning("获取失败，请确定是否网络连接正常")
          }
        },{enableHighAccuracy: true})
      }
      if(map){
        map.addEventListener("click", function(e){
          let allOverlay = map.getOverlays();
          geoc.getLocation(e.point,function(r){
            let point ={
              lat: r.point.lat,
              lng: r.point.lng,
              of: "inner"
            }
            for (var i = 0; i < allOverlay.length; i++){
              map.removeOverlay(allOverlay[i]);
            }
            map.addOverlay(new BMap.Marker(point));
            lon.value = r.point.lng;
            lat.value = r.point.lat;
          })
        }) 
      }
    }
    onMounted(()=>{
      setTimeout(()=>{
        getMap();
      })
    })

    return {
      lon,
      lat,
      provinces,
      changeProVin,
      cityList,
      localLoading,
      searchLocal,
      mapHandleForm,
      confirm,
      quit,
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
.building_bd_map{
  ._map_tip{
    padding: 8px 15px 0 15px;
    font-size: 13px;
    color:#fff;
  }
  .map_dialog_wrap{
    padding: 15px;
    color:#fff;
  }
}
</style>