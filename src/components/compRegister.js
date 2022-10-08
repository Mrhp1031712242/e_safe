// 表格
import TableList from "@/components/table/tableList"
import TableColumn from "@/components/table/column"

import HomeTitleShow from "@/components/homeShow/titleShow"
import HomeContentShow from "@/components/homeShow/contentShow"
// 计数器
import VueCount from "@/components/vueCountTo/vue-countTo"

// 选择树下拉
import TreeSelect from "@/components/treeSelect"
// 表单
import DictSelect from "@/components/form/dictSelect"
import DatePicker from "@/components/form/datePicker"
// 面包屑
import Breadcrumb from "@/components/basicComp/breadcrumb"
// mainContent
import MainContent from "@/components/basicComp/mainContent"
import ShowTopTitle from "@/components/basicComp/ShowTopTitle"
import ShowNomoreImg from "@/components/basicComp/ShowNomoreImg"


export default {
  install:(app)=>{
    app.component('TableList', TableList);
    app.component('TableColumn', TableColumn);
    app.component('TreeSelect', TreeSelect);
    app.component('HomeTitleShow', HomeTitleShow);
    app.component('HomeContentShow', HomeContentShow);
    app.component('VueCount', VueCount);
    app.component('DictSelect', DictSelect);
    app.component('DatePicker', DatePicker);
    app.component('Breadcrumb', Breadcrumb);
    app.component('MainContent', MainContent);
    app.component('ShowTopTitle', ShowTopTitle);
    app.component('ShowNomoreImg', ShowNomoreImg);
  }
}