<template>
  <div class="sidebar_devpart_menu">
    <el-scrollbar style="height: 100%;" view-class="side_part_scroll">
      <el-menu ref="navmenu" :default-active="$route.meta.id"
        background-color="#081C35"
        text-color="rgba(255,255,255,0.6)"
        active-text-color="#fff"
        :collapse="collDevPartapse" :collapse-transition="false" :unique-opened="true">
        <!-- 导航菜单树组件，动态加载菜单 -->
        <menu-tree v-for="item in navTree" :key="item.url" :menu="item"></menu-tree>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuTree from "@/components/MenuTree/index"
export default {
  components:{
    MenuTree
  },
  data() {
    return {

    }
  },
  computed:{
    ...mapState({
      collDevPartapse: state=>state.app.collDevPartapse,
      navTree: state=>state.menu.navTree.filter(it=>it.url != "/home" && it.url != "/useEleControl" && it.url != "/systemManage")
    })
  },
  created() {},
  methods: {},
}
</script>
<style lang='scss'>
.sidebar_devpart_menu{
  width: 100%;
  transition:all 0.1s;
  .side_part_scroll{
    .el-menu{
      --el-menu-item-height:48px;
      border-right: none;
      .is-active{
        background:#123866 !important;
        .el-sub-menu__title{
          // background: linear-gradient(to right,#5984B9,rgba(3, 47, 128,0));
        }
      }
      .el-sub-menu .el-menu-item{
        height: 40px;
        line-height: 40px;
        padding-left: 36px!important;
      }
      .el-menu-item{
        font-size: 15px;
        &:hover{
          i{
            color: #fff;
          }
          color: #fff;
        }
      }
      .el-menu--inline .el-menu-item{
        font-size: 14px;
      }
    }
  }
}
</style>