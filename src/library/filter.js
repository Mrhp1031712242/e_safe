// 过滤设备类型
export const filterMethods = {
  changeDevType:(val)=>{
    if(!val) {
      return "/";
    }else{
      switch(val){
        case 'ROUTER': return "网关"; 
        case 'TH_DETECTER': return "温湿度"; 
        case 'ENERGYSAVING_AIRC_CONTROLLER': return "空调控制器"; 
        case 'ENERGYSAVING_AIRCRED_CONTROLLER': return "红外空调控制器"; 
        case 'ENERGYSAVING_RRU_CONTROLLER': return "RRU控制器"; 
        case 'ENERGYSAVING_AAU_CONTROLLER': return "AAU控制器"; 
        case 'AUPS': return "精准备电设备"; 
        default: return val; 
      }
    }
  },
  changeSiteManageType:(val)=>{
    switch(val){
      case 'main' : return "主设备数据";
      case 'air' : return "空调数据";
      case 'AUPS' : return "精准备电数据";
      case 'set' : return "站点配置";
      default: return val; 
    }
  },
  changeDuration:(val)=>{
    let du1 = val.length >=4 ? val.substring(0,4) : "";
    let du2 = val.length >=6 ? val.substring(4,6) : "";
    let du3 = val.length >=8 ? val.substring(6,8) : "";
    let reDu = "";
    if(!!du3){
      reDu = du1 + '-' + du2 + '-' + du3;
    }else if(!!du2){
      reDu = du1 + '-' + du2;
    }else{
      reDu = du1;
    } 
    return reDu;
  }
} 

export default {
  filterMethods
}