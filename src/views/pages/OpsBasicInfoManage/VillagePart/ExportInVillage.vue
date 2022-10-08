<template>
  <div class="export_dia_wrap">
    <div class="top_txt">
      <div class="le_name fl" :style="{ color:!exportName ? 'rgba(255,255,255,0.5)': '#fff'}">{{exportName || "小区/村居导入文件名"}}</div>
      <div class="ri_btn fr">
        <span style="display:inline-block;margin-left:10px;">
          <el-upload 
          :action="exportInUrl+'/api/device/village/importVillage'"
          :headers="{authorization:urlHeaders.authorization}"
          :on-success="handleExportInSuccess" 
          :show-file-list="false">
            <el-button type="success">选取文件导入</el-button>
            <template #tip>
              <a :href="baseDownLoadURL + '/template/esafe/esafe_villages.xlsx'" class="down_load_btn">下载模板</a>
            </template>
          </el-upload>
        </span>
      </div>
    </div>
    <div class="table_part_wrap table_list_part">
      <el-table
        ref="listExportTable"
        :data="exportData.list"
        :height="400"
        size="small"
      >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <table-column prop="$index" label="序号" width="55"/> 
        <table-column prop="areaStr" label="区域"/>
        <table-column prop="name" label="小区/村居名称" />
        <table-column prop="electrovalence" label="电价" />
        <table-column prop="maxBeyondQuantity" label="最大透支用电" />
        <table-column prop="t01" label="提示" optional>
          <template #default="scope">
            <span :class="[scope.row.t01 != null ? 'or_remark' : '']">{{scope.row.t01 || '/'}}</span>
          </template>
        </table-column>       
      </el-table>
    </div>
    <div class="sub_tip" v-if="isShowTip">
      提示：导入数据有误，请重新导入
    </div>
    <div class="control_dialog">
      <el-button @click="closeExport">关闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleExports(exportData.list)" v-if="submitBool">提交</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { ElMessage ,ElMessageBox} from "element-plus";
import { villageAddMore } from "@/api/requestData/opsBasicInfo"
export default defineComponent({
  emits:["handleExportClose"],
  setup(props,ctx){
    let exportName = ref("");
    let baseDownLoadURL = window.baseDownLoadURL;
    let exportInUrl = window.baseURL;
    let urlHeaders = reactive({
      authorization:sessionStorage.getItem("manage" + window.baseConfig.sysKey)
    })
    let submitBool = ref(false);
    let isShowTip = ref(false);
    // 上传之后列表数据
    const exportData = reactive({list:[]})
    
    onMounted(()=>{
      initExportInData();
    })
    // 初始化数据
    const initExportInData = ()=>{
      exportName.value = "";
      exportData.list = [];
      submitBool.value = false;
      isShowTip.value = false;
    }
    // 选择文件自动上传
    const handleExportInSuccess = (res,file)=>{
      if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
        if(res.data.length > 0){
          res.data.forEach((item,index)=>{
            item.$index = index + 1;
          })
          exportName.value = file.name;
          exportData.list = res.data;
          submitBool.value = !(exportData.list.filter(item=>!!item.t01).length > 0);
          isShowTip.value = exportData.list.filter(item=>!!item.t01).length > 0;
        }
      }else{
        ElMessage.error("上传文件失败,请重新上传");
        return false;
      }
    }
    // 关闭导入弹框
    const closeExport = (val)=>{
      ctx.emit("handleExportClose",val)
    }

    // 提交
    const handleExports = (data)=>{
      if(data.length == 0){
        ElMessage.warning("暂无数据");
        return;
      }
      let bool = data.filter(it=>!!it.remark).length > 0;
      if(bool){
        ElMessageBox.confirm(`存在数据不符合规则的站点，该站点数据全部不导入。本次只导入数据符合规则的站点。`, "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }).then(()=>{
          doPriceSubmit(data);
        }).catch(()=>{
          return;
        })
      }else{
        doPriceSubmit(data);
      }
    }

    const doPriceSubmit = (data)=>{
      let paramsData = [];
      data.forEach(item=>{
        let obj = {};
        obj.id = item.id || null;
        obj.areaId = item.areaId || null;
        obj.name = item.name || null;
        obj.electrovalence = item.electrovalence || null;
        obj.maxBeyondQuantity = item.maxBeyondQuantity || null;
        paramsData.push(obj);
      })
      villageAddMore(paramsData).then(res => {
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          closeExport(true);
        }
      }).catch(error=>{
        console.log(error)
      })
    }

    return {
      exportName,
      isShowTip,
      baseDownLoadURL,
      exportInUrl,
      urlHeaders,
      handleExportInSuccess,
      exportData,
      submitBool,
      closeExport,
      handleExports,
    }
  },

  data() {
    return {

    }
  },
  created() {},
  methods: {},
})
</script>
<style lang='scss'>

</style>