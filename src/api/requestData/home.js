/**
 * 首页
 */
// 顶部
export function topCurrentList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getTop",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 中左 - 异常趋势
export function errorInfoList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getException",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 中左 - 用电趋势
export function useEleInfoList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getC",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 中右 - 电器分布
export function eleEquipDistriList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getLoadEventCount",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 中右 - 告警分布
export function warningDistriList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getAlarmCount",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 下左
export function warningTop10List(params){
  return $http({
    url:"/api/dataanalysis/homepage/getAlarmTop10",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 告警信息
export function getAlarmList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getAlarmList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

// 故障信息
export function getFaultList(params){
  return $http({
    url:"/api/dataanalysis/homepage/getFaultList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
