<template>
  <div class="show_nomore_img" :style="{top:imgTop + '%',left:imgLeft + 'px'}">
    <!-- 暂无数据 -->
    <img src="@/assets/image/nomore_data.jpg" alt="" :style="{width:imgWidth + 'px'}">
  </div>
</template>

<script>
export default {
  props:{
    imgTop:{
      type:Number,
      default:30
    },
    imgLeft:{
      type:Number,
      default:0
    },
    imgWidth:{
      type:Number,
      default:200
    }
  },
  data() {
    return {

    }
  },
  created() {},
  methods: {},
}
</script>
<style lang='scss'>
.show_nomore_img{
  width: 100%;
  position: absolute;
  text-align: center;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}
</style>