export default {
  state: {
    navTree: [], // 导航菜单树
    menuRouteLoaded:false,
    headerSel:"",
  },
  getters: {

  },
  mutations: {
    setNavTree(state, navTree) { // 设置导航菜单树
      state.navTree = navTree;
    },
    menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
      state.menuRouteLoaded = menuRouteLoaded;
    }
  },
  actions: {

  }
}