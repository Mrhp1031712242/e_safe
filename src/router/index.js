import { createRouter ,createWebHashHistory } from 'vue-router'
import Layout from "@/views/layout"
import store from '@/store'
// import navMenuData from '@/mock/sideMenu';

import { menuApi } from "@/api/requestData/login.js"
let routerOpitons = [];
const modules = import.meta.glob("../views/**/**.vue");

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_BASEURL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login")
    },
    {
      path: "/changeInitPsd",
      name: "changeInitPsd",
      component: () => import("../views/changeInitPsd")
    },
  ],
})

// 路由守卫
const whiteList = ["/login","/changeInitPsd"];
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem("manage" + window.baseConfig.sysKey)) {
    if (to.path === '/login') {
      next({
        path: "/home"
      })
    } else {
      // 加载动态菜单和路由
      getMenuRoutes(sessionStorage.getItem('userId'),to);
      next();
    }
  } else {
    if(whiteList.indexOf(to.path) !== -1){
      next();
    }else{
      next('/login')
    }
  }
})
// 获取菜单数据
// let res = {
//   data:navMenuData
// }
let mainRouters = {
  path: "/",
  redirect:"/home",
  component: Layout,
  children: [
    {
      path: "/changePsd",
      name: "changePsd",
      component: () => import("../views/pages/SystemManage/ChangePsd.vue")
    },
  ]
}
function getMenuRoutes(userId,to){
  if (store.state.menu.menuRouteLoaded) {
    return;
  }
  menuApi(userId).then(res=>{
    if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
      mainRouters.children = mainRouters.children.concat(routerFunc(res.data));
      store.commit('menuRouteLoaded', true);
      store.dispatch("getHandleAreas");
      store.dispatch("getHandleDeparts");
      // store.dispatch("getSiteArea");
      setTimeout(()=>{
        router.addRoute(mainRouters);
        store.commit('setNavTree', res.data);
        if (to.matched.length == 0) { router.push(to.path); }
      })
    }
  })
}
// 替换大小写
function setUpperCase(item){
  return item.substring(0,1).toUpperCase() + item.substring(1)
}
// 获取路由数据转换
let routerFunc = (data) =>{
  data.forEach(routerItem=>{
    let url = '';
    let routeObj = {
      path:routerItem.url,
      component:null,
      children:null,
      name:routerItem.menuName,
      meta:{
        icon:routerItem.icon,
        id:routerItem.id,
        pUrl:routerItem.url.replace("/",'').split("/")[0],
      },
    }
    url = routerItem.url.replace(/^\//,'').split('/').map(item=>setUpperCase(item)).join(",").replace(/,/g,'/')
    routeObj["component"] = modules[(`../views/pages/${url == 'Home' ? 'Home/index' : url}.vue`)];
    
    if(routerItem.children && routerItem.children.length > 0){
      routeObj["redirect"] = routerItem.children[0].url;
      routerFunc(routerItem.children);
    }else{
      routeObj["redirect"] = null;
    }
    routerOpitons.push(routeObj);
  })
  return routerOpitons;
}




export default router;
