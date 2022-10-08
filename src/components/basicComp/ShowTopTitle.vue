<template>
  <div class="show_top_title" :style="{width:this.titleWidth + '%'}">
    <span>{{this.title}}</span>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:""
    },
    titleWidth:{
      type:Number,
      default:60
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
.show_top_title{
  height: 20px;
  background: url("../../assets/image/show_title_bg.png") no-repeat;
  background-size:100% 100%;
  text-align: center;
  margin: auto;
}
</style>