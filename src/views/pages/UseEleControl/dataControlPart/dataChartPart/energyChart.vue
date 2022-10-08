<template>
  <div :class="className" :style="{height:height,width:width}" ref="operationChart">
  </div>
</template>

<script>
import * as echarts from 'echarts'
import * as chartFunc from "@/utils/chart"
import { markRaw } from "vue"
export default {
  props:{
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%',
    },
    chartData: {
      type: Object,
      required: true
    },
  },
  data(){
    return {
      chart: null,
      colors:["rgba(0, 242, 252, 1)","rgba(57, 126, 250, 1)"],
    }
  },
  mounted(){
    this.initChart();
    this.$nextTick(()=>{
       setTimeout(()=>{
        this.chart?.resize();
      },500)
    })
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods:{
    __resizeHandler() { 
      if (this.chart) {
        setTimeout(()=>{
          this.chart?.resize();
        },200)
      }
    },
    resizeChange(e) {
      this.__resizeHandler()
    },
    setOptions({xValue,useEleData,elePrices}){
      let _this = this;
      this.chart = echarts.init(this.$refs.operationChart);
      let options = {
        xAxis: [{
          type: 'category',
          name:"时间",
          nameGap:25,
          data:xValue,
          splitLine: {
            show: false
          },
          nameTextStyle:{
            color:"#fff"
          },
          axisLine:{       // 轴
            show:true,
            color:"#A9C0FF",
            lineStyle:{
              color:'#A9C0FF',
            }
          },
          nameLocation: 'end',//坐标轴名称显示位置。
          axisLabel: {//坐标轴刻度标签的相关设置。
            formatter: function (params) {
              return chartFunc.justyAxisLabel(params)
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: '用电量(kw·h)',
          min:0,
          minInterval: 0.01,
          splitArea: {
            show: false,
          },
          nameTextStyle:{
            padding:[0,0,0,-25]    // 文字块  [上右下左]
          },
          axisTick:{       //y轴刻度线
            show:false
          },
          axisLine:{       // 轴
            show:false,
            lineStyle:{
              color:'#02F6FF',
            }
          },
          splitLine:{
            show:false
          }
        },{
          type: 'value',
          name: '电费(元)',
          min:0,
          minInterval: 0.01,
          nameTextStyle:{
            padding:[0,-40,0,0]    // 文字块  [上右下左]
          },
          splitArea: {
            show: false,
          },
          axisTick:{       //y轴刻度线
            show:false
          },
          axisLine:{       // 轴
            show:false,
            lineStyle:{
              color:'#02F6FF',
            }
          },
          splitLine:{
            show:false
          }
        }],
        // 图表位置
        grid: {
          show:false,
          top:'15%',
          left: '5%',
          right: '7%',
          bottom: '18%',
        },
        legend: {
          data: ["用电量","电费",],
          textStyle:{
            color:"#fff"
          },
          icon:'circle',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        series:[
          {
            name: '用电量',
            type: 'line',
            data: useEleData,
            symbol: "none",
            barWidth:20,
            itemStyle: {
              normal: {
                color:"rgba(57, 126, 250, 1)"
              }
            },
            animationDuration: 1000,
            animationEasing: 'quadraticOut',
            smooth:true,
          },
          {
            name: '电费',
            type: 'line',
            symbol: "none",//去掉上面的圆点
            data: elePrices,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: "rgba(0, 242, 252, 1)"
              }
            },
            animationDuration: 1000,
            animationEasing: 'quadraticOut',
            smooth:true,
          },
        ]
      }
      this.chart.setOption(options);
    },
    initChart() {
      this.chart = markRaw(echarts.init(this.$el, 'macarons'));
      this.setOptions(this.chartData)
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    "$store.state.app.riMenuFoldChange"(val){
      if (this.chart) {
        this.__resizeHandler()
      }
    }
  },
}
</script>

<style lang=''>

</style>
