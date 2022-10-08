<template>
  <div class="right_main_content_wrap">
    <div class="right_main_content_wrap_inner" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created() {},
  methods: {},
}
</script>
<style lang='scss'>
.right_main_content_wrap{
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,#041153,#0E1951,#0F2F81);
  border-radius: 5px;
  .right_main_content_wrap_inner{
    height: calc(100% - 30px);
    padding: 15px;
  }
}
</style>