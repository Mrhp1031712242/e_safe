let h1 = window.location.href.split("/")[0];
let h2 = window.location.href.split("/")[1] + '//';
let h3 = window.location.href.split("/")[2];
// let url = h1 + h2 + h3;
// let url = "https://47.107.119.201:18086";
// let url = "http://192.168.210.153";
let url = "http://192.168.210.186";
window.baseURL = url + "/es";
// window.baseURL = url  + ":8600";
window.baseDownLoadURL = "http://192.168.210.186";
window.baseConfig = {
  sysKey:"e_safe1.0",
  systemName:"用电安全管理平台",
  isShowLogo:true,
}


