/**
 * 告警列表
 */
// 列表
export function warningList(params){
  return $http({
    url:"/api/dataanalysis/alarm/selectAlarmList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

/**
 * 故障列表
 */
// 列表
 export function failyList(params){
  return $http({
    url:"/api/dataanalysis/fault/selectFaultList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

/**
 * 用电监控
 */
// 监测点数据
export function getDeviceMonitorDataList(params){
  return $http({
    url:"/api/device/deviceMonitor/getDeviceMonitorDataList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 用电趋势
export function useElePriceList(params){
  return $http({
    url:"/api/dataanalysis/monitorData/selectEnergyChargeAndPerice",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 实时数据
export function currentMoniEleData(params){
  return $http({
    url:"/api/dataanalysis/monitorData/selectNowMonitorData",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 用电统计 / 电费统计
export function totalPriceData(params){
  return $http({
    url:"/api/dataanalysis/monitorData/selectTotalMonitorData",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 电器使用记录
export function selectLoadEventList(params){
  return $http({
    url:"/api/dataanalysis/loadEvent/selectLoadEventList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 功率数据
export function powerListData(params){
  return $http({
    url:"/api/dataanalysis/monitorData/selectUEPMonitorData",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 基本详情
export function getDeviceMonitorDataById(params){
  return $http({
    url:"/api/device/deviceMonitor/getDeviceMonitorDataById",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
/**
 * 地图监控
 */
// 地图监控-楼栋列表
export function selectMapList(params){
  return $http({
    url:"/api/device/building/selectMapList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 根据楼栋id查询所有检测点
export function selectMapByBuildingId(params){
  return $http({
    url:"/api/device/building/selectMapByBuildingId",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 根据监测点ID查询
export function getDeviceMonitorMapById(params){
  return $http({
    url:"/api/device/deviceMonitor/getDeviceMonitorMapById",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 通过时间获取告警列表
export function selectAlarmByTime(params){
  return $http({
    url:"/api/dataanalysis/alarm/selectAlarmByTime",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 通过时间获取故障列表
export function selectFaultByTime(params){
  return $http({
    url:"/api/dataanalysis/fault/selectFaultByTime",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 根据告警监测点分组统计
export function selectAlarmGroupList(params){
  return $http({
    url:"/api/dataanalysis/alarm/selectAlarmGroupList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 根据故障监测点分组统计
export function selectFaultGroupList(params){
  return $http({
    url:"/api/dataanalysis/fault/selectFaultGroupList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 根据监测点ID获取告警数据
export function selectAlarmMonitorId(params){
  return $http({
    url:"/api/dataanalysis/alarm/selectMonitorId",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 根据监测点ID获取故障数据
export function selectFailyMonitorId(params){
  return $http({
    url:"/api/dataanalysis/fault/selectMonitorId",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

/**
 * 用电统计
 */
// 列表
export function useEleTotalList(params){
  return $http({
    url:"/api/dataanalysis/monitorData/selectElectricityTotalList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 导出
export function exportElectricityTotalList(params){
  return $http({
    url:"api/dataanalysis/monitorData/exportElectricityTotalList",
    method:"get",
    params,
    responseType:"blob"
  })
}
/**
 * 实时数据
 */
// 列表
export function realTimeList(params){
  return $http({
    url:"/api/dataanalysis/monitorData/selectNowMonitorDataList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
