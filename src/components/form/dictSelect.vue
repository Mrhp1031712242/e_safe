<template>
  <el-select v-model="value" 
  class="dict_select" 
  v-bind="$attrs" 
  :clearable="clearable"
  filterable
  :size="size"
 >
    <el-option
      v-for="(item,index) in dictList"
      :key="index"
      :label="item.name || item.value || item.baseId"
      :value="item.id || item.key"
    >
    </el-option>
  </el-select>
</template>

<script>
import Mixin from "./dictMixin/index"
export default {
  mixins:[Mixin],
  data() {
    return {

    }
  },
  created() {
    // console.log()
  },
  methods: {},
}
</script>
<style lang='scss'>

</style>