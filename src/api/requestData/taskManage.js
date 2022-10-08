// 列表
export function taskList(params){
  return $http({
    url:"/api/device/sysPlanTask/selectTaskList",
    method:"get",
    params
  }).then(res =>{
    res.data.data.forEach(item=>{
      item.deviceRelMark = item.deviceMonitorName.split("\n");
      if(item.deviceRelMark.length > 2){
        item.deviceRelMoniShowStr = item.deviceRelMark.slice(0,2).join(',')+',......'
      }
    })
    return res.data
  })
}
// 新增
export function taskAdd(params){
  return $http({
    url:"/api/device/sysPlanTask/add",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 修改
export function taskEdit(params){
  return $http({
    url:"/api/device/sysPlanTask/updateById",
    method:"post",
    data:params
  }).then(res =>{
    return res.data
  })
}
// 导出
export function taskExportOut(params){
  return $http({
    url:"api/device/sysPlanTask/exportTaskList",
    method:"get",
    params,
    responseType:"blob"
  })
}