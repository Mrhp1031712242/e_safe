<template>
  <div class="side_sys_barmenu">
    <div class="sidebarmenu_sys_wrap">
      <!-- 菜单 -->
      <el-scrollbar style="height: 100%" class="menu_child_bar">
        <ul class="ri_menu_wrap">
          <li v-for="(menuItem,menuIndex) in menuData.data" :key="'riMneu_'+menuIndex" 
            :class="[$route.path === menuItem.url ? 'active_sel_menu' : '']"
            @click="selChildUrl(menuItem)">
            <i class="iconfont menu_icon" :class="[menuItem.icon ? menuItem.icon.split('*')[0] : '']" :style="{transform:`translateY(-1px) translateX(${menuItem.icon && menuItem.icon.indexOf('*') != -1 ?  menuItem.icon.split('*')[1] + 'px' : 0})`}"></i>
            <a href="javascript:;">{{menuItem.menuName}}</a>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {  reactive, ref,toRef,shallowRef ,defineComponent,onMounted ,watch } from "vue"
import { useRoute } from 'vue-router';
import { useStore } from "vuex";
import { CaretBottom ,Search} from "@element-plus/icons-vue";

export default defineComponent ({
  components:{
    CaretBottom
  },
  setup(){
    const keywords = ref("");
    const store = useStore();
    const menuData = reactive({data:[]});
    const $route = useRoute();
    let navMenuData = reactive([]);

    function getChildMenu(val){
      menuData.data = [];
      let pUrl = val;
      switch(pUrl){
        case "systemManage" :
        navMenuData = store.state.menu.navTree.filter(item=>item.url == '/systemManage');
        break;
        case "useEleControl" :
        navMenuData = store.state.menu.navTree.filter(item=>item.url == '/useEleControl');
        break;
        default:
        navMenuData = [];
        break;
      }
      navMenuData.forEach(item=>{
        if(val === item.url.replace("/","")){
          menuData.data = item.children.filter(item => item.remark != 'hidden');
        }
      })
    }
    onMounted(()=>{
      getChildMenu($route.meta.pUrl)
    })
    
    watch(
      () => $route.meta.pUrl,(val)=>{
        getChildMenu(val)
      }
    )
    return {
      keywords,
      Search:shallowRef(Search),
      menuData
    }
  },
  data() {
    return {

    }
  },
  created() {},
  methods: {
    // 操作路由
    selChildUrl(item){
      sessionStorage.setItem(item.url.replace("/","").split("/")[0],item.url)
      this.$router.push({
        path:item.url
      })
    }
  },
  watch:{

  }
})
</script>
<style lang='scss'>
.side_sys_barmenu{
  height: 100%;
  .sidebarmenu_sys_wrap{
    height: 100%;
  }
  .separate_tip{
    padding: 10px 0 20px 0;
    font-size: 12px;
    border-bottom: 1px solid #485361;
  }
  .ri_menu_wrap{
    li{
      padding-left: 15px;
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      .menu_icon{
        display: inline-block;
        width: 20px;
        text-align: left;
        margin-right: 15px;
        color: rgba(255,255,255,0.5);
        font-size: 16px;
        vertical-align: middle;
        transform: translateY(-2px);
      }
      a{
        color: rgba(255,255,255,0.5);
        display: inline-block;
        font-size: 15px;
        vertical-align: middle;
      }
      &:hover{
        .menu_icon , a{
          color:#fff;
        }
      }
    }
    .active_sel_menu{
      background: #123866;
      .menu_icon , a{
        color:#fff;
      }
    }
  }
  
}
</style>