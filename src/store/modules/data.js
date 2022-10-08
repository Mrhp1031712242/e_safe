import { areaPerList , areaPerListHandle,selectSiteAreaList, departList} from "@/api/requestData/systemManage";
// import { siteList } from "@/api/requestData/deviceManage";
import { getDepTreeListNoAuth } from  "@/api/requestData/login"
export default {
  state:{
    sites:[],
    departOptions:[],
    areaOptions:[],
    handleAreaOptions:[],
    selectSiteAreaOptions:[],
    technology:[],
    token:"",
    userId:"",
    homeDevQuery:{
      isOnline:null,
    },
    cacheData:{
      areaId:"",
    }
  },
  mutations:{
    getSitesData(state,sites){
      state.sites = sites;
    },
    getAreaData(state,areaOptions){
      state.areaOptions = areaOptions;
    },
    getHandleAreaData(state,handleAreaOptions){
      state.handleAreaOptions = handleAreaOptions;
    },
    getSiteAreaData(state,selectSiteAreaOptions){
      state.selectSiteAreaOptions = selectSiteAreaOptions;
    },
    // 获取单位/部门列表
    getDepartsListData(state,departOptions){
      state.departOptions = departOptions;
    }
  },
  actions:{
    // 获取区域数据
    async getAreas(context){
      let data = await areaPerList({status:'1'});
      context.commit('getAreaData',data.data);
    },
    // 增加操作获取区域
    async getHandleAreas(context){
      let data = await areaPerListHandle({status:'1'});
      context.commit('getHandleAreaData',data.data);
    },
    // 通过站点获取区域
    async getSiteArea(context){
      let data = await selectSiteAreaList({status:'1'});
      context.commit('getSiteAreaData',data.data);
    },
    // 获取设备列表数据
    // async getSites(context){
    //   let data = await siteList();
    //   context.commit('getSitesData',data.data);
    // },
    // 获取单位/部门数据
    async getHandleDeparts(context){
      let data = await getDepTreeListNoAuth();
      context.commit('getDepartsListData',data.data);
    },
  }
}