<script>
</script>

<template>
  <div id="winsun_wrap">
    <router-view />
  </div>
</template>

<style lang="scss">
#winsun_wrap {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  font-size: 14px;
}
::-webkit-scrollbar-thumb {
  min-height: 28px;
  background-color: #0C3F85;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border-radius: 2px;
}

::-webkit-scrollbar {
   width: 10px;
   height: 10px;
}
@import "./style/index.scss";
</style>
