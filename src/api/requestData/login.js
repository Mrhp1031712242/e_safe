export function loginByUser(params){
  return $http({
    url:"/api/rbac/auth/login",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}

// 修改密码
export function changePassword(params){
  return $http({
    url:"/api/rbac/user/updatePassword",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 获取菜单
export function menuApi(id){
  return $http({
    url:"/api/rbac/user/routers/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}


// 获取用户权限
export function viewPermission(id){
  return $http({
    url:"/api/rbac/user/perCodeList/"+id,
    method:"get",
  }).then(res =>{
    return res.data;
  })
}


/* 无权限访问数据*/
// 获取告警设置
export function getAlarmByGlobalNoAuth(){
  return $http({
    url:"/api/rbac/alarm/getAlarmByGlobalNoAuth",
    method:"get",
  }).then(res =>{
    return res.data;
  })
}

// 获取部门
export function getDepTreeListNoAuth(){
  return $http({
    url:"/api/rbac/department/getDepTreeListNoAuth ",
    method:"get",
  }).then(res =>{
    return res.data;
  })
}