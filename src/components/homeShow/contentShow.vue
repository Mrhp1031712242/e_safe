<template>
  <div class="comp_content_show" :style="{height:contentHeight + 'px'}">
    <div class="inner_rect top_left"></div>
    <div class="inner_rect top_right"></div>
    <div class="inner_rect down_left"></div>
    <div class="inner_rect down_right"></div>
    <slot /> 
  </div>
</template>

<script>
export default {
  props:{
    contentHeight:{
      type:Number,
      default:100
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
.comp_content_show{
  width: 100%;
  position: relative;
  .inner_rect{
    width: 15px;
    height: 15px;
    position: absolute;
  }
  .top_left{
    top:0;
    left:0;
    border-top:2px solid #3296FA;
    border-left:2px solid #3296FA;
  }
  .top_right{
    top:0;
    right:0;
    border-top:2px solid #3296FA;
    border-right:2px solid #3296FA;
  }
  .down_left{
    bottom:0;
    left:0;
    border-bottom:2px solid #3296FA;
    border-left:2px solid #3296FA;
  }
  .down_right{
    bottom:0;
    right:0;
    border-bottom:2px solid #3296FA;
    border-right:2px solid #3296FA;
  }
}
</style>