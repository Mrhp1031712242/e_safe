import { createApp } from 'vue'
import App from './App.vue'
// 注册router
import router from './router'
// 引用element-plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引用element-plus中文
import 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
// 引入阿里矢量图 / fontawesome
import "@/font/iconfont.css"
import 'font-awesome/css/font-awesome.min.css'
// 注册全局组件
import compRegister from "@/components/compRegister";
// api请求封装
import http from "@/api/request";
// 引入全局状态
import { store } from './store'
// 引入公共方法
import "@/library/index"
import  { permisionBtn }  from "@/library/permisionBtn.js"
import { filterMethods } from "@/library/filter.js"

const app = createApp(App)
app.config.globalProperties.permisionBtn = permisionBtn;
app.config.globalProperties.$filters = filterMethods;

app.use(store)
   .use(router)
   .use(http)
   .use(compRegister)
   .use(ElementPlus, {locale})
   .mount('#winsun')
