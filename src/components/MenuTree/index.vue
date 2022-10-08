<template>
  <el-sub-menu v-if="menu.children.length > 0 && menu.remark != 'hidden'" :index="'' + menu.id" >
    <template #title>
      <i class="iconfont menu_icon" :class="menu.icon"></i>
      <span>{{menu.menuName}}</span>
    </template>
    <MenuTree v-for="item in menu.children" :key="item.url" :menu="item"></MenuTree>
  </el-sub-menu>
  <el-menu-item v-else-if="menu.children.length==0 && menu.remark != 'hidden'" :index="'' + menu.id" @click="handleRoute(menu)">
    <i class="iconfont menu_icon_child" :class="[menu.icon ? menu.icon : '']" :style="{transform:`translateY(-1px) translateX(${menu.icon && menu.icon.indexOf('*') != -1 ?  menu.icon.split('*')[1] + 'px' : 0})`}"></i>
    <span>{{menu.menuName}}</span>
    <!-- <i class="choose_item_icon" v-if="menu.menuName === $route.name"></i> -->
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  data(){
    return{
      chooseItem:'home',
    }
  },
  created(){

  },
  methods: {
    handleRoute (menu) {
      sessionStorage.setItem("opsBasicInfoManage",menu.url)
      // 通过菜单URL跳转至指定路由
      this.$router.push(menu.url);
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  li{
    position: relative;
    .choose_item_icon{
      position: absolute;
      height: 100%;
      width: 4px;
      left: 0;
      background: #fff !important;
    }
    .menu_icon{
      display: inline-block;
      padding: 0 16px 0 0;
      width: 16px;
    }
    .menu_icon_child{
      display: inline-block;
      width: 16px;
      text-align: left;
      color: rgba(255,255,255,0.5);
      vertical-align: middle;
      padding: 0 16px 0 0;
    }
  }
}
.el-menu-item.is-active i{
  color: #fff!important;
}

</style>