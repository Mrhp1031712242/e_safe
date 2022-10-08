/**
 * 小区管理
 */
// 列表
export function villageList(params){
  return $http({
    url:"/api/device/village/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 新增
export function villageAdd(params){
  return $http({
    url:"/api/device/village/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function villageEdit(params){
  return $http({
    url:"/api/device/village/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 详情
export function villageInfo(id){
  return $http({
    url:"/api/device/village/getVillageById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 删除
export function villageDel(id){
  return $http({
    url:"/api/device/village/deleteById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 导出
export function villageExportOut(params){
  return $http({
    url:"api/device/village/exportVillageList",
    method:"get",
    params,
    responseType:"blob"
  })
}
// 批量入库新增
export function villageAddMore(params){
  return $http({
    url:"/api/device/village/insertBatchVillage",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 通过区域ID查询小区列表
export function villageFromArea(params){
  return $http({
    url:"/api/device/village/selectByAreaIdList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
/**
 * 楼栋管理
 */
// 列表
export function buildingList(params){
  return $http({
    url:"/api/device/building/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 新增
export function buildingAdd(params){
  return $http({
    url:"/api/device/building/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function buildingEdit(params){
  return $http({
    url:"/api/device/building/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 详情
export function buildingInfo(id){
  return $http({
    url:"/api/device/building/getBuildingById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 删除
export function buildingDel(id){
  return $http({
    url:"/api/device/building/deleteById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 导出
export function buildingExportOut(params){
  return $http({
    url:"api/device/building/exportBuildingList",
    method:"get",
    params,
    responseType:"blob"
  })
}
// 批量入库新增
export function buildingAddMore(params){
  return $http({
    url:"/api/device/building/insertBatchBuild",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 通过小区ID查询楼栋列表
export function buildingFromVillage(params){
  return $http({
    url:"/api/device/building/getBuildingByVillageId",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
/**
 * 房间列表
 */
// 列表
export function roomList(params){
  return $http({
    url:"/api/device/room/getRoomList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 新增
export function roomAdd(params){
  return $http({
    url:"/api/device/room/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function roomEdit(params){
  return $http({
    url:"/api/device/room/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 详情
export function roomInfo(id){
  return $http({
    url:"/api/device/room/getRoomById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 删除
export function roomDel(id){
  return $http({
    url:"/api/device/room/deleteById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 导出
export function roomExportOut(params){
  return $http({
    url:"api/device/room/exportRoomList",
    method:"get",
    params,
    responseType:"blob"
  })
}
// 批量入库新增
export function roomAddMore(params){
  return $http({
    url:"/api/device/room/insertBatchRoom",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 通过小区ID查询楼栋列表
export function roomFromBuilding(params){
  return $http({
    url:"/api/device/room/getRoomByBuildingId",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
/**
 * 监测设备
 */
// 列表
export function moniDevsList(params){
  return $http({
    url:"/api/device/device/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 新增
export function moniDevAdd(params){
  return $http({
    url:"/api/device/device/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 批量设备新增
export function moniDevMoreAdd(params){
  return $http({
    url:"/api/device/device/insertBatchDeviceType",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function moniDevEdit(params){
  return $http({
    url:"/api/device/device/updateDeviceById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 批量修改
export function moniDevMoreEdit(params){
  return $http({
    url:"/api/device/device/updateBatchDeviceType",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 详情
export function moniDevInfo(id){
  return $http({
    url:"/api/device/device/getDeviceById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 删除
export function moniDevDel(id){
  return $http({
    url:"/api/device/device/deleteDeviceById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 批量删除
export function moniDevMoreDel(params){
  return $http({
    url:"/api/device/device/deleteBatchById",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 导出
export function moniDevExportOut(params){
  return $http({
    url:"api/device/device/exportDeviceList",
    method:"get",
    params,
    responseType:"blob"
  })
}
// 批量入库新增
export function moniDevAddMore(params){
  return $http({
    url:"/api/device/device/insertBatchDevice",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 获取软硬件版本列表
export function versionList(params){
  return $http({
    url:"/api/device/device/getHardAndSoftList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 查询设备id 端口
export function portsList(params){
  return $http({
    url:"/api/device/device/getDeviceAndPortList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}

/**
 * 监测点
 */
// 列表
export function moniPointList(params){
  return $http({
    url:"/api/device/deviceMonitor/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 新增
export function moniPointAdd(params){
  return $http({
    url:"/api/device/deviceMonitor/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function moniPointEdit(params){
  return $http({
    url:"/api/device/deviceMonitor/updateDeviceMonitorById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 详情
export function moniPointInfo(params){
  return $http({
    url:"/api/device/deviceMonitor/getDeviceMonitorById",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 删除
export function moniPointDel(id){
  return $http({
    url:"/api/device/deviceMonitor/deleteDeviceMonitorById/" + id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 导出
export function moniPointExportOut(params){
  return $http({
    url:"api/device/deviceMonitor/exportDeviceMonitorList",
    method:"get",
    params,
    responseType:"blob"
  })
}
// 批量入库新增
export function moniPointAddMore(params){
  return $http({
    url:"/api/device/deviceMonitor/insertBatchDeviceMonitor",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 上下电
export function activeOrInactivePort(params){
  return $http({
    url:"/api/device/deviceMonitor/controlDev",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}