<template>
  <div class="chart" style="width:100%;height:100%;" ref="operationChart"></div>
</template>
<script>
import * as echarts from 'echarts'
import { markRaw } from "vue"
export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    autoResize: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      title: "",
      chart: null,
      colors:["#3075E5","#01CBE3","#7385DE","#5D9DF9","#ACB3F3","#DEDB8B","#00B6FB","#EFC5DA"]
    };
  },
  mounted(){
    this.initChart();
    this.$nextTick(()=>{
       setTimeout(()=>{
        this.chart?.resize();
      },300)
    })
    window.addEventListener("resize", this.resizeChange());
  },
  beforeUnmount() {
    if (!this.chart) {
      return
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    resizeChange() { 
      if (this.chart) {
        setTimeout(()=>{
          this.chart?.resize();
        },200)
      }
    },
    dotted() {
      let dataArr = [];
      for (let i = 0; i < 80; i++) {
        if (i % 2 === 0) {
          dataArr.push({
            name: (i + 1).toString(),
            value: 25,
            itemStyle: {
              normal: {
                color: "rgba(88,142,197,0.5)",
                borderWidth: 0,
                borderColor: "rgba(0,0,0,0)",
              },
            },
          });
        } else {
          dataArr.push({
            name: (i + 1).toString(),
            value: 20,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
                borderColor: "rgba(0,0,0,0)",
              },
            },
          });
        }
      }
      return dataArr;
    },
    setOptions(item) {
      let _this = this;
      this.chart = echarts.init(this.$refs.operationChart);
      this.option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return `${params.name} <br/>
                    使用: ${params.value} 次 <br/>
                    ${params.percent} %`;
          }
        },
        color: this.colors,
        legend: {
          type: "scroll",
          orient: 'vertical',
          pageIconColor:"#fff",
          pageIconInactiveColor:"rgba(255,255,255,0.6)",
          pageTextStyle:{
            color:"#fff"
          },
          textStyle:{
            color:"#fff",
            padding:7,
            fontSize:14,
          },
          right: '20%',
          bottom:'10%',
          top: 30,
          itemHeight:8,
          itemWidth:15,
          selectedMode: false,
          data:this.chartData
        },
        series: [
          {
            name: "",
            type: "pie",
            hoverOffset: 6,
            radius: ["60%", "75%"],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            data: item,
            labelLine: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              borderRadius: 10,
              borderColor: '#010D37',
              borderWidth: 2,
            },
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                formatter:[
                  "{title|{b}}",
                  "{values|使用{c}次}",
                  "{values|{d}%}",
                ].join("\n"),
                fontWeight: "normal",
                rich: {
                  title: {
                    color: "#fff",
                    fontSize: 20,
                    padding: [10, 0, 20, 0],
                  },
                  values: {
                    color: "#01CBE3",
                    fontSize: 14,
                    padding: [5, 0, 2, 0],
                  },
                },
              }
            }
          },
          {
            color: ["rgba(255,255,255,0.3)"],
            hoverAnimation: false,
            silent: true,
            type: "pie",
            radius: ["52%", "53%"],
            center: ["40%", "50%"],
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            showEmptyCircle: true,
            data: this.dotted(),
          },
          {
            color: ["rgba(255,255,255,0.1)"],
            type: "pie",
            silent: true,
            radius: ["0%", "48%"],
            center: ["40%", "50%"],
            label: {
              normal: {
                show: false,
              },
            },
            emphasis:{
              show: false
            },
            data: [0],
          },
        ]
      };
      this.chart.setOption(this.option);
     
      //记录上次高亮的索引
      let lastMouseOverIndex = null;
      // mouseover事件，记录当前数据索引并取消其他高亮，over在out之后
      this.chart.on('mouseover', function (params) {
        var dataLen = item.length;
        lastMouseOverIndex = params.dataIndex;
        for (var i = 0; i < dataLen; i++) {
          if (i != params.dataIndex) {
            _this.chart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: i
            })
          }
        }
      });
      this.chart.on('mouseout', function (params) {
        _this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: lastMouseOverIndex
        })
      });
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: lastMouseOverIndex
      })
       this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
    },
    initChart() {
      this.chart = markRaw(echarts.init(this.$el, 'macarons'));
      this.setOptions(this.chartData);
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    },
  }
};
</script>
