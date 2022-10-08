<template>
  <div class="layout">
    <Header></Header> 
    <div class="main_content_wrap">
      <div class="side_part" 
       :class="[
          $store.state.app.riMenuFoldChange == '1' ? 'side_wid_nohome_notinsite' : 'side_wid_home',
        ]"
       >
        <SideBarDevPartMenu v-if="$route.meta.pUrl!='home' && $route.meta.pUrl != 'systemManage' && $route.meta.pUrl != 'useEleControl'" />
        <SideBarSysPartMenu v-if="$route.meta.pUrl == 'systemManage' || $route.meta.pUrl == 'useEleControl'" />
      </div>
      <div class="fold_btn" 
        :style="{left:$store.state.app.riMenuFoldChange == '1'  ? '233px' : '0',transition:'0.1s'}" @click="foldHandle" 
        v-show="$route.path != '/home'"
      >
        <i class="fa fa-angle-left" v-if="$store.state.app.riMenuFoldChange == '1'"></i>
        <i class="fa fa-angle-right" v-else></i>
      </div>
      
      <div class="main_content" 
        :class="[
          $store.state.app.riMenuFoldChange == '1' ? 'ri_notinsiteMainfold' : 'riMainUnfold'
        ]">
        <div v-if="$route.meta.pUrl != 'home' && $route.path != '/home'">
          <Breadcrumb />
        </div>
        <el-scrollbar
          :style="{height:($route.meta.pUrl == 'home' || $route.path == '/home') ?'100%' :'calc(100% - 35px)'}" 
          :view-class="[ $route.meta.pUrl != 'home' && $route.path != '/home' ? 'notInHome' : 'inhome']">
          <div :class="['main_content_inner']">
            <router-view  v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" :key="$route.path"  v-if="$route.meta.pUrl != 'home'" />
              </keep-alive>
              <component :is="Component" :key="$route.path"  v-if="$route.meta.pUrl == 'home'" />
            </router-view>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./Header/index.vue";
import SideBarDevPartMenu from "./SideBar/SideBarDevPartMenu.vue";
import SideBarSysPartMenu from "./SideBar/SideBarSysPartMenu.vue";
export default {
  components:{
    Header,
    SideBarDevPartMenu,
    SideBarSysPartMenu,
  },
  data() {
    return {
    }
  },
  created(){
    if(this.$route.meta.pUrl!='home'){
      this.$store.state.app.riMenuFoldChange == '1';
    }else{
      this.$store.state.app.riMenuFoldChange = "0";
    }
  },
  methods: {
    // 菜单收缩
    shrinkHandle(){
      this.$store.state.app.riMenuFoldChange = "0";
      this.$store.state.app.leftSideBarDownIconColor = "#fff";
    },
    // 菜单展开 
    unfoldHandle(){
      this.$store.state.app.riMenuFoldChange = "1";
      this.$store.state.app.leftSideBarDownIconColor = "rgba(255,255,255,0.5)";
    },
    // 伸缩菜单
    foldHandle(){
      if(this.$store.state.app.riMenuFoldChange == '1'){
        this.shrinkHandle();
      }else{
        this.unfoldHandle();
      }
    }
  },
  watch:{
    "$route.meta.pUrl"(val){
      if(val == "home"){
        this.shrinkHandle();
        this.$store.state.menu.headerSel = "home";
        sessionStorage.setItem("HSE","home");
      }else if(val == "useEleControl"){
        this.unfoldHandle();
        this.$store.state.menu.headerSel = "useEleControl";
        sessionStorage.setItem("HSE","useEleControl");
      }else if(["opsBasicInfoManage","versionManage","taskManage"].includes(val)){
        this.unfoldHandle();
        this.$store.state.menu.headerSel = "opsBasicInfoManage";
        sessionStorage.setItem("HSE","opsBasicInfoManage");
      }else{
        this.unfoldHandle();
        this.$store.state.menu.headerSel = "systemManage";
        sessionStorage.setItem("HSE","systemManage");
      }
    }
  }
}
</script>
<style lang='scss'>
.layout{
  width:100%;
  height: 100%;
  // .el-scrollbar__bar{
  //   display: none;
  // }
  .main_content_wrap{
    width: 100%;
    height: calc(100% - 54px);
    position: absolute;
    top: 54px;
    // 菜单部分
    .side_part{
      position: absolute;
      left: 0;
      height: 100%;
      background: #081C35;
      color: #fff;
      overflow: hidden;
      transition:all 0.1s;
    }
    .side_wid_home{
      width: 0;
    }
    .side_wid_nohome_notinsite{
      width: 230px;
    }
    .notInHome{
      width: 100%;
      height: calc(100%) !important;
      position: absolute;
      top: 0;
    }
    .inhome{
      height: 100% !important;
    }
    // 主页面
    .main_content{
      position: absolute;
      height: 100%;
      background: radial-gradient(#0a2b6d 10%,#00062A );
      color:#fff;
      transition:all 0.1s;
      .main_content_inner{
        padding: 15px;
        height: calc(100% - 30px);
        width:calc(100% - 30px);
        min-width: 1200px;
      }
      &.ri_notinsiteMainfold{
        width: calc(100% - 230px) !important;
        left:230px;
      }
      &.riMainUnfold{
        width: 100% !important;
        left:0;
      }
    }
  }
}
</style>