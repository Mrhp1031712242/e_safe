<template>
  <div class="bread_crumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }" @click="toHome">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item v-if="!!headerLeft">{{headerLeft}}</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(breadItem,breadIndex) in breadList" :key="'bread_'+breadIndex" >
        {{breadItem.name}}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.path == '/changePsd'">修改密码</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { shallowRef } from 'vue'
// import navMenuData from '@/mock/sideMenu';
import { ArrowRight } from '@element-plus/icons-vue'
export default {
  data() {
    return {
      breadList:[],
      ArrowRight:shallowRef(ArrowRight),
      headerLeft:"",
      setBreadHead:[
        {
          pUrl:["opsBasicInfoManage","taskManage","versionManage"],
          pStr:"运维管理"
        },
      ]
    }
  },
  created() {
    this.setBreadCrumb(this.$route.path);
  },
  methods: {
    setBreadCrumb(path){
      this.breadList = [];
      let breadObj = {};
      let routeStr = path.replace('/',"").split('/')[0];
      let navMenuData = this.$store.state.menu.navTree;
      this.setBreadHead.forEach(bItem=>{
        if(bItem.pUrl.includes(routeStr)){
          this.headerLeft = bItem.pStr;
        }else{
          this.headerLeft = ""
        }
      })
      navMenuData.forEach(fItem=>{
        breadObj = {};
        if(fItem.url === path){
          breadObj.url = fItem.url;
          breadObj.name = fItem.menuName;
          this.breadList.push(breadObj);
        }
        if(fItem.url === '/'+ routeStr){
          breadObj.url = fItem.url;
          breadObj.name = fItem.menuName;
          this.breadList.push(breadObj);
        }
        if(fItem.children && fItem.children.length > 0){
          fItem.children.forEach(cItem=>{
            if(cItem.url === path){
              breadObj = {};
              breadObj.url = cItem.url;
              breadObj.name = cItem.menuName;
              this.breadList.push(breadObj);
            }
          })
        }
      })
    },
    // 进入首页
    toHome(){
      this.$store.state.app.riMenuFoldChange = "0";
      this.$store.state.menu.headerSel = "home";
      sessionStorage.setItem("HSE",this.$store.state.menu.headerSel);
    }
  },
  watch:{
    "$route.path"(val){
      this.setBreadCrumb(val);
    }
  }
}
</script>
<style lang='scss'>
.bread_crumb{
  width: 100%;
  height: 35px;
  background: linear-gradient(to left,#0E296A,#072343);
  .el-breadcrumb{
    line-height: 35px;
    padding: 0 15px;
    .el-breadcrumb__item{
      .el-breadcrumb__inner{
        color: #9ba1b5 !important;
      }
      &:nth-last-child(1){
        .el-breadcrumb__inner{
          color: #fff !important;
        }
      }
      &:nth-last-child(2){
        .el-breadcrumb__separator{
          color: #fff;
        }
      }
    }
  }
}
</style>