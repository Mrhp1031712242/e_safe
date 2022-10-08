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
      },300)
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
    resizeChange() { 
      if (this.chart) {
        setTimeout(()=>{
          this.chart?.resize();
        },200)
      }
    },
    setOptions({xValue,leftData = {},rightData = {}}){
      // this.chart = echarts.init(this.$refs.operationChart);
      this.chart = markRaw(echarts.init(this.$el, 'macarons'));
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
            color:"#fff",
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
          name: leftData.unitName,
          min:0,
          position:"left",
          nameTextStyle:{
            padding:[0,0,0,-35]    // 文字块  [上右下左]
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
          top:'20%',
          left: '7%',
          right: '8%',
          bottom: '10%',
        },
        legend: {
          data: [leftData.name],
          textStyle:{
            color:"#fff"
          },
          icon:'rect',
          itemHeight:4,
          itemWidth:30,
          itemGap:20,
          right:30,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        series:[
          {
            name: leftData.name,
            type: 'line',
            data: leftData.list,
            symbol: "none",//去掉上面的圆点
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "rgba(48, 117, 229, 1)"
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient( 0, 0, 0, 1,
                [
                    {offset: 1, color: 'rgba(6, 27, 75, 1)'},   
                    {offset: 0, color: 'rgba(48, 117, 229, 1)'}
                ])
              }
            },
            animationDuration: 1000,
            animationEasing: 'quadraticOut',
          },
        ]
      }
      if(Object.keys(rightData).length > 0){
        options.yAxis.push({
          type: 'value',
          name: rightData.unitName,
          min:0,
          position:"right",
          splitArea: {
            show: false,
          },
          nameTextStyle:{
            padding:[0,-35,0,0]    // 文字块  [上右下左]
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
        })
        options.legend.data.push(rightData.name);
        options.series.push({
          name: rightData.name,
          type: 'line',
          data: rightData.list,
          symbol: "none",//去掉上面的圆点
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: "rgba(14, 157, 181, 1)"
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient( 0, 0, 0, 1,
              [
                  {offset: 1, color: 'rgba(6, 27, 75, 1)'},   
                  {offset: 0, color: 'rgba(14, 157, 181, 1)'}
              ])
            }
          },
          animationDuration: 1000,
          animationEasing: 'quadraticOut',
        })
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
        !!val && this.chart.clear();
        setTimeout(()=>{
          this.setOptions(val)
        })
      }
    },
  },
}
</script>

<style lang=''>

</style>
