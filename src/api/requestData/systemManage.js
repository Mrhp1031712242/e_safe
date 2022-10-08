/**
 * 部门管理
 */
// 列表
export function departList(params){
  return $http({
    url:"/api/rbac/department/selectTreeList",
    method:"get",
    params 
  }).then(res =>{
    return res.data
  })
}
// 新增
export function addDepart(params){
  return $http({
    url:"/api/rbac/department/add",
    method:"post",
    data:params 
  }).then(res =>{
    return res.data
  })
}
// 修改
export function editDepart(params){
  return $http({
    url:"/api/rbac/department/updateById",
    method:"post",
    data:params 
  }).then(res =>{
    return res.data
  })
}
// 删除
export function delDepart(id){
  return $http({
    url:"/api/rbac/department/deleteById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 查看
export function viewDepart(id){
  return $http({
    url:"/api/rbac/department/getDepartmentById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}

/**
 * 区域管理
 */
// 列表总
export function areaList(params){
  return $http({
    url:"/api/rbac/area/selectList",
    method:"get",
    params 
  }).then(res =>{
    return res.data
  })
}
// 权限区域列表
export function areaPerList(params){
  return $http({
    url:"/api/rbac/area/getAreaList",
    method:"get",
    params 
  }).then(res =>{
    return res.data
  })
}
// 放置权限混合
export function areaPerListHandle(params){
  return $http({
    url:"/api/rbac/area/listAll",
    method:"get",
    params 
  }).then(res =>{
    return res.data
  })
}
// 站点获取区域
export function selectSiteAreaList(params){
  return $http({
    url:"/api/rbac/area/selectSiteAreaList",
    method:"get",
    params 
  }).then(res =>{
    return res.data
  })
}
// 新增
export function addArea(params){
  return $http({
    url:"/api/rbac/area/add",
    method:"post",
    data:params 
  }).then(res =>{
    return res.data
  })
}
// 修改
export function editArea(params){
  return $http({
    url:"/api/rbac/area/updateById",
    method:"post",
    data:params 
  }).then(res =>{
    return res.data
  })
}
// 详情
export function viewArea(id){
  return $http({
    url:"/api/rbac/area/selectById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 删除
export function delArea(id){
  return $http({
    url:"/api/rbac/area/deleteById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 关键字搜索
export function getAreaByName(params){
  return $http({
    url:"/api/rbac/area/getAreaByName",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 启用停用
export function changeAreaStatus(params){
  return $http({
    url:"/api/rbac/area/updateAreaStatus/"+params.id + "/"+ params.status,
    method:"get",
  }).then(res =>{
    return res.data
  })
}

/**
 * 用户管理
 */
// 列表
export function userList(params){
  return $http({
    url:"/api/rbac/user/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data
  })
}
// 新增
export function addUser(params){
  return $http({
    url:"/api/rbac/user/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function editUser(params){
  return $http({
    url:"/api/rbac/user/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 用户详情
export function viewUser(id){
  return $http({
    url:"/api/rbac/user/selectById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 删除
export function delUser(id){
  return $http({
    url:"/api/rbac/user/deleteById/"+id,
    method:"post",
  }).then(res =>{
    return res.data
  })
}
// 恢复默认密码
export function recoveryPsd(params){
  return $http({
    url:"/api/rbac/user/changePassword",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改用户密码
export function changePsd(params){
  return $http({
    url:"/api/rbac/user/updatePassword",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 获取用户角色列表
export function roleList(id){
  return $http({
    url:"/api/rbac/user/roleList/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 用户关联角色
export function relaRoles(params){
  return $http({
    url:"/api/rbac/user/relRole",
    method:"post",
    params
  }).then(res =>{
    return res.data
  })
}
// 根据用户ID 获取设备厂商
export function getDevFatorys(userId,str){
  return $http({
    url:"/api/rbac/user/getManufactorByUserId/" + userId + '/' + str  ,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
/**
 * 角色管理
 */
//  列表
export function roleAllList(params){
  return $http({
    url:"/api/rbac/role/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}

// 增加
export function addRole(params){
  return $http({
    url:"/api/rbac/role/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 获取某一个
export function getRoleInfo(id){
  return $http({
    url:"/api/rbac/role/selectById/"+ id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 修改
export function editRole(params){
  return $http({
    url:"/api/rbac/role/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 删除
export function delRole(id){
  return $http({
    url:"/api/rbac/role/deleteById/"+ id,
    method:"post",
  }).then(res =>{
    return res.data;
  })
}

// 关联用户
export function relaUser(params){
  return $http({
    url:"/api/rbac/role/relUser",
    method:"post",
    params
  }).then(res =>{
    return res.data;
  })
}
// 关联用户列表
export function getRelaUserList(id){
  return $http({
    url:"/api/rbac/role/userList/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 关联权限
export function relaPer(params){
  return $http({
    url:"/api/rbac/role/relMenu",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 权限列表
export function relMenuList(id){
  return $http({
    url:"/api/rbac/role/menuList/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}

/**
 * 菜单管理
 */
// 列表
export function menuList(params){
  return $http({
    url:"/api/rbac/menu/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 新增
export function addMenu(params){
  return $http({
    url:"/api/rbac/menu/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 详情
export function viewMenu(id){
  return $http({
    url:"/api/rbac/menu/selectById/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 修改
export function editMenu(params){
  return $http({
    url:"/api/rbac/menu/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 删除
export function delMenu(id){
  return $http({
    url:"/api/rbac/menu/deleteById/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}

/**
 * 接口管理
 */
// 列表
export function apiList(params){
  return $http({
    url:"/api/rbac/permission/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 新增
export function addApi(params){
  return $http({
    url:"/api/rbac/permission/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 详情
export function viewApi(params){
  return $http({
    url:"/api/rbac/permission/selectById",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 修改
export function editApi(params){
  return $http({
    url:"/api/rbac/permission/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 删除
export function delApi(params){
  return $http({
    url:"/api/rbac/permission/deleteById/",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 添加子权限
export function addChildPer(params){
  return $http({
    url:"/api/rbac/permission/insertSonPermission",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 修改子权限
export function changeChildPer(params){
  return $http({
    url:"/api/rbac/permission/updateSonPermission",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 子权限列表
export function ChildPerList(id){
  return $http({
    url:"/api/rbac/permission/selectApiList/" + id,
    method:"get",
  }).then(res =>{
    console
    return res.data;
  })
}
/**
 * 数据补偿任务
 * @param {*} params 
 */
// 列表
export function comPensationTaskList(params){
  return $http({
    url:"/api/dataservice/dataCompensationTask/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 删除
export function delComPensationTask(id){
  return $http({
    url:"/api/dataservice/dataCompensationTask/deleteById/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 新增
export function comPensationTaskAdd(params){
  return $http({
    url:"/api/dataservice/dataCompensationTask/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 详情
export function viewComPensationTask(id){
  return $http({
    url:"/api/dataservice/dataCompensationTask/selectById/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 修改
export function comPensationTaskEdit(params){
  return $http({
    url:"/api/dataservice/dataCompensationTask/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}

// 操作日志
export function sysControlList(params){
  return $http({
    url:"/api/rbac/sysLog/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}

/**
 * 字典管理
 * @param {*} params 
 * @returns 
 */
// 列表
export function dictList(params){
  return $http({
    url:"/api/rbac/keyValue/getKeyValueList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 删除
export function delDict(params){
  return $http({
    url:"/api/rbac/keyValue/delete",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 新增
export function dictAdd(params){
  return $http({
    url:"/api/rbac/keyValue/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 详情
export function viewDict(params){
  return $http({
    url:"/api/rbac/keyValue/getKeyValueByType",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 修改
export function dictEdit(params){
  return $http({
    url:"/api/rbac/keyValue/update",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}

/**
 * 告警设置
 * @returns 
 */
// 告警设置 - 新增
export function warningSetAdd(params){
  return $http({
    url:"/api/rbac/alarm/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 告警设置 - 根据设备id查询
export function warningsByeMonitorId(params){
  return $http({
    url:"/api/rbac/alarm/getAlarmByDeviceMonitorId",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 告警设置-查询全局配置
export function getAlarmByGlobal(params){
  return $http({
    url:"/api/rbac/alarm/getAlarmByGlobal",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
/**
 * 模板设置
 */
// 模板设置-新增
export function warningModelAdd(params){
  return $http({
    url:"/api/rbac/load/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 模板设置-根据id删除
export function warningModelDel(id){
  return $http({
    url:"/api/rbac/load/deleteById/" + id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 模板设置-根据id查询
export function warningModelView(id){
  return $http({
    url:"/api/rbac/load/selectById/" + id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 模板设置-查询所有告警模板
export function warningModelList(params){
  return $http({
    url:"/api/rbac/load/selectLoadList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}

/**
 *  推送管理  
 */ 
// 列表
export function pushControlList(params){
  return $http({
    url:"/api/rbac/push/selectList",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}
// 删除
export function delPushControl(id){
  return $http({
    url:"/api/rbac/push/deleteById/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 新增
export function pushControlAdd(params){
  return $http({
    url:"/api/rbac/push/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}
// 详情
export function viewPushControl(id){
  return $http({
    url:"/api/rbac/push/getPushById/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}
// 修改
export function pushControlEdit(params){
  return $http({
    url:"/api/rbac/push/updatePush",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}

// 关联推送
export function relaPush(params){
  return $http({
    url:"/api/rbac/push/relPush",
    method:"post",
    data:params
  }).then(res =>{
    return res.data;
  })
}

// 获取关联/未关联监测点
export function getRelMonitor(params){
  return $http({
    url:"/api/rbac/push/getRelMonitor",
    method:"get",
    params
  }).then(res =>{
    return res.data;
  })
}

