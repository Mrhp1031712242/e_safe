<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="选择区域" prop="areaId">
        <TreeSelect ref="TreeRefSelect"
        :treeOptionData="$store.state.data.handleAreaOptions"
        :propTreeSelId="'TreeSelect' +new Date().getTime()" 
        :nodeClickEffect="true" :modelValue="areaIdVal" 
        class="ipt_tree_sel" style="width:100%" 
        @selectTreeVal="selectTreeVal"
        @selDataFullNameStr="selDataFullNameStr"/>
      </el-form-item>
      <el-form-item label="小区/村居" prop="villageId">
        <el-select v-model="handleForm.villageId" placeholder="请选择小区/村居" clearable filterable style="width:100%" @change="changeVillage">
          <el-option
            v-for="item in villageOptions.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋名称" prop="name">
        <el-input size="default"  v-model="handleForm.name" clearable placeholder="请输入楼栋名称"></el-input>
      </el-form-item>
      <el-form-item label="楼栋负责人" prop="linkMan">
        <el-input size="default"  v-model="handleForm.linkMan" clearable placeholder="请输入楼栋负责人"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input size="default"  v-model="handleForm.phone" clearable placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="物业公司" prop="pmc">
        <el-input size="default"  v-model="handleForm.pmc" clearable placeholder="请输入物业公司"></el-input>
      </el-form-item>
      <el-form-item label="具体位置" prop="address">
        <el-input size="default"  v-model="handleForm.address" clearable placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="经纬度" prop="latlng">
        <el-input size="default" v-model="handleForm.longitude" clearable placeholder="经度" style="width:43%"></el-input>
        <el-input size="default"  v-model="handleForm.latitude" clearable placeholder="纬度" style="width:43%;margin-left:4%;"></el-input>
        <span style="display:inline-block;width:10%;text-align:center;cursor:pointer;" class="lng_lat"  @click="getMapLocal">
          <el-icon><Coordinate /></el-icon>
        </span>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </div>
    <!-- 获取经纬度 -->
    <el-dialog title="获取经纬度" custom-class="map_dialog" 
      append-to-body :close-on-click-modal="false" 
      destroy-on-close 
      v-model="mapDialog.dialogVisible" 
      width="800px" 
      top="5vh">
      <BdMapAddress :address="handleForm.address" @getLng="getLng" @closeMapDialog="closeMapDialog"/>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { Coordinate } from '@element-plus/icons-vue'
import BdMapAddress from "./BdMapAddress.vue"
import { buildingAdd, buildingEdit, buildingInfo, villageFromArea } from "@/api/requestData/opsBasicInfo"
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { phoneValidate } from "@/library/validate";

export default defineComponent({
  components:{
    Coordinate,
    BdMapAddress
  },
  props:{
    id:{
      type:[String,Number]
    }
  },
  emits: ["handleAddClose"],
  setup(props,ctx){
    const store = useStore();
    const ruleFormRef = ref(null);
    const TreeRefSelect = ref(null);
    const areaIdVal = ref("");
    const areaFullName = ref("");
    const villageName = ref("");
    const villageOptions = reactive({list:[]});
    let handleForm = reactive({
      areaId:"",
      villageId:"",
      name:"",
      linkMan:"",
      phone:"",
      address:"",
      longitude:"",
      latitude:"",
      pmc:"",
    })
    let mapDialog = reactive({
      dialogVisible:false,
    })
    // 区域验证
    const areaIdConfirm = (rule, value, callback) => {
      if(!handleForm.areaId){
        return callback(new Error('请选择区域'))
      }else {
        callback()
      }
    }
    // 数字验证
    const testVerify = (value)=>{
      if(!isNaN(value)){
        return typeof(parseFloat(value)) === "number";
      }else{
        return false;
      }
    }
    // 手机号验证
    const validatePhone = (rule,value,callback) =>{
      if(!phoneValidate(value)){
        return callback(new Error('请输入正确的手机号'))
      }else{
        callback()
      }
    }
    // 经纬度验证
    const validateLatLng = (rule, value, callback) => {
      if (!handleForm.longitude || !handleForm.latitude) {
        return callback(new Error('请填写经纬度'))
      }else if (!testVerify(String(handleForm.longitude)) || !testVerify(String(handleForm.latitude))) {
        return callback(new Error('经纬度无效'))
      }else if (handleForm.longitude > 180 || handleForm.longitude < -180) {
        return callback(new Error('经度在-180~180之间'))
      }else if (handleForm.latitude > 90 || handleForm.latitude < -90) {
        return callback(new Error('纬度在-90~90之间'))
      } else {
        callback()
      }
    }
    // 表格验证
    let handleRules = reactive({
      areaId: [{ required: true,validator: areaIdConfirm, trigger: "change" }],
      name:[{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
      villageId:[{ required: true, message: "请输入小区/村居", trigger: "change" }],
      linkMan:[{ required: true, message: "请输入楼栋负责人", trigger: "blur" }],
      latlng:[{ required: true,validator: validateLatLng, trigger: "blur" }],
      phone:[{ required: true, validator: validatePhone, trigger: "blur" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      areaIdVal.value = store.state.data.cacheData.areaId + '_'+ new Date().getTime() || "";
      handleForm.areaId = store.state.data.cacheData.areaId;
      if(!!store.state.data.cacheData.areaId){
        selectTreeVal(store.state.data.cacheData.areaId);
      }
      !!props.id && getOneIdData(props.id);
    })
    // 获取详情
    const getOneIdData = (id)=>{
      buildingInfo(id).then(res=>{
        let data = res.data;
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          if(!!data.areaId){
            selectTreeVal(data.areaId);
          }
          handleForm.villageId = data.villageId;
          handleForm.name = data.name;
          handleForm.address = data.address;
          handleForm.longitude = data.longitude;
          handleForm.latitude = data.latitude;
          handleForm.linkMan = data.linkMan;
          handleForm.phone = data.phone;
          handleForm.pmc = data.pmc;
          areaIdVal.value = handleForm.areaId + '_'+ new Date().getTime() || "";
        }
      })
    }
    // 选择区域
    const selectTreeVal = (val)=>{
      handleForm.villageId = "";
      villageOptions.list = [];
      handleForm.areaId = val;
      if(!!val){
        villageFromArea({areaId:val}).then(res=>{
          villageOptions.list = res.data;
        })
      }
    }
    // 选择区域后获取区域全称
    const selDataFullNameStr = (val)=>{
      areaFullName.value = !!val ? val : '';
      handleForm.address = areaFullName.value.replace(/-/g,'') + villageName.value;
    }
    // 修改小区/村庄
    const changeVillage = (val)=>{
      villageName.value = !!val ? villageOptions.list.filter(item=>item.id == val)[0].name : '';
      handleForm.address = areaFullName.value.replace(/-/g,'') + villageName.value;
    }
    // 提交新增/修改
    const handleSubmit = async(ruleFormRef) =>{
      if(!ruleFormRef){
        return ;
      }
      await ruleFormRef.validate((valid, fields) => {
        if (valid) {
          let paramsData = {
            id:null,
            areaId:handleForm.areaId,
            villageId:handleForm.villageId,
            name:handleForm.name,
            address:handleForm.address,
            longitude:handleForm.longitude,
            latitude:handleForm.latitude,
            linkMan:handleForm.linkMan,
            phone:handleForm.phone,
            pmc:handleForm.pmc,
          }
          if(!props.id){
            buildingAdd(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }else{
            paramsData.id = props.id;
            buildingEdit(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("修改成功");
                quit(true);
              }
            })
          }
        } else {
          ElMessage.warning("提交失败");
          return;
        }
      })
    }
    // 点击地图
    const getMapLocal = ()=>{
      mapDialog.dialogVisible = true;
    }
    // 关闭新增/修改弹窗
    const quit = (val)=>{
      TreeRefSelect.value.initValue();
      ctx.emit("handleAddClose",val)
    }
    // 获取地图经纬度
    const getLng = (obj)=> {
      handleForm.longitude = obj.longitude;
      handleForm.latitude = obj.latitude;
      mapDialog.dialogVisible = false;
    }
    // 关闭地图弹窗
    const closeMapDialog = ()=>{
      mapDialog.dialogVisible = false;
    }

    return {
      TreeRefSelect,
      areaIdVal,
      selectTreeVal,
      selDataFullNameStr,
      areaFullName,
      villageName,
      changeVillage,

      villageOptions,
      handleForm,
      handleRules,
      handleSubmit,
      ruleFormRef,
      getMapLocal,
      mapDialog,
      quit,
      closeMapDialog,
      getLng,
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