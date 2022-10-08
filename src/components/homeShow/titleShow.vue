<template>
  <div class="comp_title_show" :style="{width:showWidth + 'px'}">
    <img src="@/assets/image/home_title_left.png" alt="">
    <span>{{compTitle}}</span>
    <img src="@/assets/image/home_title_right.png" alt="">
    
  </div>
</template>

<script>
export default {
  props:{
    compTitle:{
      type:String,
      default:"title"
    },
    showWidth:{
      type:Number,
      default:280
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
.comp_title_show{
  // background: url("../../assets/image/home/titlepic.png") no-repeat;
  height: 17px;
  // background-size: 100% 100%;
  color: #fff;
  text-align: center;
  line-height: 19px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}
</style>