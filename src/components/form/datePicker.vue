<template>
  <el-date-picker
    v-model="yearValue"
    type="year"
    placeholder="选择年"
    v-if="this.showDate=='YEAR'"
    :size="size"
    v-bind="$attrs"
  >
  </el-date-picker>
  <el-date-picker
    v-model="monthValue"
    type="month"
    placeholder="选择月"
    v-if="this.showDate=='MONTH'"
    :size="size"
    v-bind="$attrs"
  >
  </el-date-picker>
  <el-date-picker
    v-model="dayValue"
    type="date"
    placeholder="选择日"
    v-if="this.showDate=='DAY'"
    :size="size"
    v-bind="$attrs"
  >
  </el-date-picker>
</template>

<script>
export default {
  props:{
    showDate:{
      type:String,
      default:"DAY"
    },
    size:{
      type:String,
      default:"default"
    }
  },
  data() {
    return {
      yearValue:"",
      monthValue:"",
      dayValue:"",
    }
  },
  created() {},
  methods: {},
}
</script>
<style lang='scss'>

</style>