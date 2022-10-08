const modeDictData = [
  // 首页 - 异常趋势/用电趋势
  {
    value: "homeUseStatusType",
    data: [
      {id:"error",name:"异常趋势"},
      {id:"useEle",name:"用电趋势"},
    ]
  },
  // 首页 - 异常趋势/用电趋势
  {
    value: "homeUseStatusTimeType",
    data: [
      {id:"DAY",name:"按天"},
      {id:"MONTH",name:"按月"},
      {id:"YEAR",name:"按年"},
    ]
  },
  // 首页 - 电器分布
  {
    value: "distriType",
    data: [
      {id:"dianqi",name:"电器使用分布"},
      {id:"gaojing",name:"告警分布"},
    ]
  },
  // 首页 - 时间类型
  {
    value: "homeTimeType",
    data: [
      // {id:"THEWEEK",name:"本周"},
      {id:"THEMONTH",name:"本月"},
      {id:"LASTMONTH",name:"上月"},
      {id:"THEYEAR",name:"今年"},
    ]
  },
  // 首页 - 告警范围
  {
    value: "pointType",
    data: [
      {id:"monitor",name:"监测点"},
      {id:"building",name:"楼栋"},
      {id:"village",name:"小区/村居"},
    ]
  },


  // 用电监控 - 告警列表 - 处理状态
  {
    value: "isDutyed",
    data: [
      {id:"1",name:"已处理"},
      {id:"0",name:"未处理"},
    ]
  },
  // 用电监控 - 告警列表 - 处理结果
  {
    value: "dutyResult",
    data: [
      {id:"处理结果",name:"处理结果"},
      {id:"真实告警",name:"真实告警"},
      {id:"误报",name:"误报"},
      {id:"消防测试",name:"消防测试"},
      {id:"维保测试",name:"维保测试"},
      {id:"其他",name:"其他"},
    ]
  },
  // 用电监控 - 故障列表 - 处理状态
  {
    value: "failyDutyType",
    data: [
      {id:"真实故障",name:"真实故障"},
      {id:"误报",name:"误报"},
    ]
  },
  // 用户管理
  {
    value: "useStatus",
    data: [
      { name: '启用', id: "1" },
      { name: '停用', id: "0" },
    ]
  },
  // 操作日志
  {
    value: "isSuccess",
    data: [
      { name: '成功', id: "0" },
      { name: '失败', id: "-1" },
    ]
  },
  // 位置类型
  {
    value: "addressType",
    data: [
      { name: '室内', id: "0" },
      { name: '室外', id: "1" },
    ]
  },
  // 滤波算法类型
  {
    value: "firType",
    data: [
      { name: '低通', id: "0" },
      { name: '高通', id: "1" },
      { name: '带通', id: "2" },
      { name: '带阻', id: "3" },
    ]
  },
  // 滤波类型
  {
    value: "filterType",
    data: [
      { name: 'FIR', id: "0" },
      { name: 'IIR', id: "1" },
    ]
  },
  // 模板类型
  {
    value: "modelType",
    data: [
      { name: '充电器', id: "1" },
    ]
  },
  // 用电监控 - 监测数据
  {
    value: "modelType",
    data: [
      { name: '用电', id: "1" },
      { name: '电费', id: "1" },
    ]
  },
  // 用电监控 - 时间类型
  {
    value: "timeTypes",
    data: [
      {id:"HOUR",name:"按小时"},
      {id:"DAY",name:"按天"},
      // {id:"MONTH",name:"按月"},
    ]
  },
  // 版本管理 - 版本类型
  {
    value: "verType",
    data: [
      { name: '4G', id: "4G" },
      { name: 'MCU', id: "MCU" },
      { name: 'AirLink', id: "AirLink" },
    ]
  },
  // 设备类型
  {
    value: "devType",
    data: [
      { name: '用电监测器', id: "ROUTER" },
      { name: '电表', id: "ELECTRICITY_METER" },
    ]
  },
  // 推送管理
  {
    value: "isRela",
    data: [
      { name: '已关联', id: "1" },
      { name: '未关联', id: "0" },
    ]
  },
]
export default modeDictData;