<template>
  <div class="header">
    <div class="header_le fl">
      <img src="@/assets/image/header_logo.png" alt="" class="header_le_img" v-if="isShowLogo">
      <el-divider direction="vertical" style="margin:0 15px;" v-if="isShowLogo"></el-divider>
      <span>{{systemName}}</span>
    </div>
    <ul class="header_mid" :style="{width:menuFatherList.length * 102 + 'px'}">
      <li v-for="(mfItem,mfIndex) in menuFatherList" :key="'mf_'+mfIndex" 
      :class="[mfItem.id == (this.$store.state.menu.headerSel || headerSelStorege) ? 'header_sel' : '']"
      @click="selMenuMf(mfItem,mfIndex)">
        <a href="javascript:;">
          <span>{{mfItem.menuName}}</span>
        </a>
      </li>
    </ul>
    <div class="header_ri fr">
      <span>
        <el-dropdown>
          <img src="@/assets/image/header_avatar.png" alt="" class="avatar_img">
          <i>{{username}}</i>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/changePsd')">修改密码</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ArrowDown } from '@element-plus/icons-vue'
import { uniqueArray } from "@/utils/commonAny"
export default {
  components:{
    ArrowDown
  },
  data() {
    return {
      isShowLogo:window.baseConfig.isShowLogo,
      systemName:window.baseConfig.systemName,
      username:sessionStorage.getItem("username") || "",
      menuFatherList:[],
      headerSelStorege:sessionStorage.getItem('HSE') || "home",
    }
  },
  computed:{
    ...mapState({
      navTree: state=>state.menu.navTree
    })
  },
  created() {
    this.setHeaderMenu(this.navTree);
  },
  methods: {
    // 获取header大菜单
    setHeaderMenu(menuData){
      let newArr = [];
      menuData.forEach((item,index,array)=>{
        let newObj = {};
        if(item.url == "/home"){
          newObj.num = 1;
          newObj.id = 'home';
          newObj.url = item.url;
          newObj.menuName = item.menuName;
          newObj.riMenuFoldChange = '0';
        }
        if(item.url == "/useEleControl"){
          newObj.num = 2;
          newObj.id = 'useEleControl';
          newObj.url = sessionStorage.getItem("useEleControl") || item.children[0].url;
          newObj.menuName = item.menuName;
          newObj.riMenuFoldChange = '1';
        }
        if(item.url == "/opsBasicInfoManage" || item.url == "/versionManage" || item.url == "/taskManage/taskList"){
          newObj.num = 3;
          newObj.id = 'opsBasicInfoManage';
          newObj.url = sessionStorage.getItem("opsBasicInfoManage") || item.children[0]?.url || item.url;
          newObj.menuName = "运维管理";
          newObj.riMenuFoldChange = '1';
        }
        if(item.url == "/systemManage"){
          newObj.num = 4;
          newObj.id = 'systemManage';
          newObj.url = sessionStorage.getItem("systemManage") || item.children[0].url,
          newObj.menuName = item.menuName;
          newObj.riMenuFoldChange = '1';
        }
        newArr.push(newObj);
      })
      this.filterMenuData(uniqueArray(newArr,'id'));
    },
    // 去重菜单数据
    filterMenuData(data){
      let menuListArr = data.sort((a,b)=>{
        return a.num - b.num;
      })
      setTimeout(()=>{
        this.menuFatherList = menuListArr;
      },500)  
    },
    // 选择父菜单
    selMenuMf(item){
      this.$store.state.menu.headerSel = item.id;
      sessionStorage.setItem("HSE",this.$store.state.menu.headerSel);
      if(sessionStorage.getItem("useEleControl")){
        this.menuFatherList.filter(it=>it.id == "useEleControl")[0].url = sessionStorage.getItem("useEleControl");
      }
      if(sessionStorage.getItem("systemManage")){
        this.menuFatherList.filter(it=>it.id == "systemManage")[0].url = sessionStorage.getItem("systemManage");
      }
      if(sessionStorage.getItem("opsBasicInfoManage")){
        this.menuFatherList.filter(it=>it.id == "opsBasicInfoManage")[0].url = sessionStorage.getItem("opsBasicInfoManage");
      }
      this.$router.push({
        path:item.url
      })
      this.$store.state.app.riMenuFoldChange = item.riMenuFoldChange;
    },
    // 退出登录
    loginOut(){
      sessionStorage.clear();
      window.location.reload();
    },
  },
}
</script>
<style lang='scss'>
.header{
  width: 100%;
  height: 54px;
  position: absolute;
  background: linear-gradient(to bottom, #081B2E,#1A325F);
  color: #fff;
  line-height: 54px;
  .el-divider{
    opacity: 0.5;
  }
  // 左侧title
  .header_le{
    padding: 0 30px;
    font-size: 18px;
    .header_le_img{
      vertical-align: middle;
      transform: translateY(-4px);
    }
    span{
      cursor: pointer;
    }
  }
  // 中间菜单
  .header_mid{
    overflow: hidden;
    display: inline-block;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    li{
      width: auto;
      text-align: center;
      float: left;
      cursor: pointer;
      &.header_sel{
        background: linear-gradient(to bottom, #12264D,#2B4F88);
      }
      a{
        display: inline-block;
        width: 60px;
        text-align: center;
        padding: 0 21px;
        color: #fff;
        span{
          font-size: 15px;
        }
      }
      &:hover{
        background: linear-gradient(to bottom, #12264D,#2B4F88);
      }
    }
  }
  // 右侧
  .header_ri{
    padding: 0 30px;
    span{
      display: inline-block;
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      .avatar_img{
        vertical-align: middle;
        width: 30px;
        margin-right: 5px;
        transform: translateY(-3px);
      }
      i{
        font-style: normal;
      }
      &:hover{
        color: rgba(255,255,255,0.8);
      }
      .el-dropdown{
        vertical-align:middle;
        color: #fff;
      }
    }
    .login_out_btn{
      margin-left: 15px;
    }
  }
}
</style>