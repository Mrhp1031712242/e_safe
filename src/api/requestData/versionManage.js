// 版本号管理 
// let versionUrl = "http://ecoran-apiv2.rastyletech.com:8088";
export function listVersion(params) {
  return $http({
    url: "/api/firmware/listVersion",
    method: "get",
    params
  }).then(res => {
    return res.data;
  });
}

// 删除版本
export function delVer(id) {
  return $http({
    url: "/api/firmware/deleteVersion?id=" + id,
    method: "get",
  }).then(res => {
    return res.data;
  });
}
// 更新日志
export function listVersionUpdateLog(params) {
  return $http({
    url: "/api/firmware/listTaskStatus",
    method: "get",
    params
  }).then(res => {
    return res.data;
  });
}
// 创建版本任务
export function createVersionUpdateTask(params) {
  return $http({
    url: "/api/firmware/createVersionUpdateTask",
    method: "post",
    data: params
  }).then(res => {
    return res.data;
  });
}

// 删除版本更新任务
export function deleteVersionUpdateTask(id) {
  return $http({
    url: "/api/firmware/deleteVersionUpdateTask?taskId=" + id,
    method: "get",
  }).then(res => {
    return res.data;
  });
}

// 版本更新任务列表
export function listVersionUpdateTask(params) {
  return $http({
    url: "/api/firmware/listVersionUpdateTask",
    method: "get",
    params
  }).then(res => {
    return res.data;
  });
}
/**
 * 型号管理
 */
// 列表
export function modelList(params){
  return $http({
    url:"/api/firmware/deviceModel/selectList",
    method:"get",
    params 
  }).then(res =>{
    return res.data
  })
}
// 新增
export function addModel(params){
  return $http({
    url:"/api/firmware/deviceModel/add",
    method:"post",
    data:params 
  }).then(res =>{
    return res.data
  })
}
// 修改
export function editModel(params){
  return $http({
    url:"/api/firmware/deviceModel/updateById",
    method:"post",
    data:params 
  }).then(res =>{
    return res.data
  })
}
// 删除
export function delModel(id){
  return $http({
    url:"/api/firmware/deviceModel/deleteById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
// 查看
export function viewModel(id){
  return $http({
    url:"/api/firmware/deviceModel/selectById/"+id,
    method:"get",
  }).then(res =>{
    return res.data
  })
}
