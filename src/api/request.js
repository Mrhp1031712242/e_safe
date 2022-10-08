import Axios from "axios";
import { ElMessage,ElMessageBox } from "element-plus";
// 创建请求
const service = Axios.create({
  baseURL: window.baseURL,
  timeout:60000,
})
// 请求拦截
service.interceptors.request.use(
  config => {
    if (sessionStorage.getItem("manage" + window.baseConfig.sysKey)){
      config.headers['authorization'] = sessionStorage.getItem("manage" + window.baseConfig.sysKey);
    }
    return config;
  },
  error => {
    if(new RegExp('15000ms exceeded').test(error)){
      ElMessage.error('请求超时');
    }
    return Promise.reject(error);
  }
)

// 响应拦截
service.interceptors.response.use(
  response=>{
    if(response.data.code == 201){
      ElMessageBox.alert('token已过期，请重新登录', '温馨提示', {
        confirmButtonText: '确定',
        callback: () => {
          sessionStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
    }
    if(response.data.code != import.meta.env.VITE_APP_API_SUCCESS_CODE){
      if(response.data.msg){
        ElMessage.error(response.data.msg);
        return;
      }
      return response;
    }
    return response;
  },
  error =>{
    return Promise.reject(error);
  }
)
export default {
  install: (app) => {
    Object.defineProperty(app.config.globalProperties, "$http", { value: service });
    Object.defineProperty(global, "$http", { value:  service });
  }
}
