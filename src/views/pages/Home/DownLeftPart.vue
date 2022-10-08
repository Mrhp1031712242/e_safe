<template>
  <ul class="down_left_part" v-if="chartData.length > 0">
    <li v-for="(item, index) in chartData" :key="index">
      <div class="lineName" :title="item.name">
        <div class="ellipsis" style="width:calc(100% - 80px);margin-left: 5px;">{{ item.name }}</div>
        <div style="width:45px;text-align:right;" class="fr">{{ item.num }}次</div>
      </div>
      <div class="row">
        <div class="index">{{ index + 1 }}</div>
        <div class="line">
          <div class="lineData" :style="{ width: (item.num / chartData[0].num) * 100 + '%' }"></div>
        </div>
        
      </div>
    </li>
  </ul>
  <ShowNomoreImg :imgTop="2" :imgWidth="250" v-else />
</template>

<script>
import { warningTop10List } from "@/api/requestData/home"
export default {
  data() {
    return {
      chartData: []
    };
  },
  methods: {
    getApiData(paramsData){
      warningTop10List(paramsData).then(res=>{
        this.chartData = res.data;
      })
    },
  },
};
</script>

<style lang="scss">
.down_left_part {
  display: flex;
  height: 300px;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 10px;
  li {
    margin: 10px 0;
    width: 50%;
    .lineName {
      margin-left: 30px;
      height: 15px;
      line-height: 15px;
      width: calc(100% - 50px);;
      font-size: 13px;
    }
    .row {
      width: 100%;
      div {
        display: inline-block;
      }
      .index {
        width: 20px;
        text-align: right;
        transform: translateY(-5px);
      }
    }
    .line {
      position: relative;
      width: calc(100% - 55px);
      height: 8px;
      margin: 0 15px;
      background: #2c406d63;
      border-radius: 4px;
      .lineData {
        position: absolute;
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(to left, #0e9db5ff, #0045a4ff);
      }
    }
  }
}
</style>