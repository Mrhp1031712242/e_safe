<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="ruleFormRef" :model="handleForm" :rules="handleRules" label-width="140px" class="handle_form_wrap">
      <el-form-item label="选择区域" prop="areaId">
        <TreeSelect ref="TreeRefSelect"
        :treeOptionData="$store.state.data.handleAreaOptions"
        :propTreeSelId="'TreeSelect' +new Date().getTime()" 
        :nodeClickEffect="true" :modelValue="areaIdVal" 
        class="ipt_tree_sel" style="width:100%" 
        @selectTreeVal="selectTreeVal"/>
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
      <el-form-item label="楼栋" prop="buildingId">
        <el-select v-model="handleForm.buildingId" placeholder="请选择楼栋" clearable filterable style="width:100%" @change="changeBuild">
          <el-option
            v-for="item in buildingOptions.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房间" prop="roomId">
        <el-select v-model="handleForm.roomId" placeholder="请选择房间" clearable filterable style="width:100%" @change="changeRoom">
          <el-option
            v-for="item in roomOptions.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监测点名称" prop="monitorName">
        <el-input size="default"  v-model="handleForm.monitorName" clearable placeholder="请输入监测点名称"></el-input>
      </el-form-item>
      <el-form-item label="监测设备ID" prop="deviceId">
        <el-select v-model="handleForm.deviceId" placeholder="请选择监测设备ID" clearable filterable style="width:100%" @change="changeBaseId">
          <el-option
            v-for="item in baseIdOptions.list"
            :key="item.deviceId"
            :label="item.deviceId"
            :value="item.deviceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-select v-model="handleForm.port" placeholder="请选择端口" clearable filterable style="width:100%">
          <el-option
            v-for="item in portOptions.list"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="电表编号">
        <el-input size="default"  v-model="handleForm.meterId" clearable placeholder="请输入电表编号"></el-input>
      </el-form-item>
      <el-form-item label="是否支持RS-485接口">
        <el-radio-group v-model="handleForm.rs485">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit(ruleFormRef)">提交</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
import { moniPointAdd, moniPointEdit, moniPointInfo, villageFromArea,buildingFromVillage,
roomFromBuilding ,portsList} from "@/api/requestData/opsBasicInfo"
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { strNumData } from "@/utils/commonAny";
export default defineComponent({
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
    const villageOptions = reactive({list:[]});
    const buildingOptions = reactive({list:[]});
    const roomOptions = reactive({list:[]});
    const deviceTypeOptions = reactive({list:[]});
    const baseIdOptions = reactive({list:[]});
    const portOptions = reactive({list:[]});
    const villageName = ref("");
    const buildingName = ref("");
    const roomName = ref("");
    let handleForm = reactive({
      id:"",
      areaId:"",
      villageId:"",
      buildingId:"",
      roomId:"",
      deviceTypeId:"ROUTER",
      deviceId:"",
      port:"",
      meterId:"",
      monitorName:"",
      rs485:false,
    })
    // 区域验证
    const areaIdConfirm = (rule, value, callback) => {
      if(!handleForm.areaId){
        return callback(new Error('请选择区域'))
      }else {
        callback()
      }
    }
    // 表格验证
    let handleRules = reactive({
      areaId: [{ required: true,validator: areaIdConfirm, trigger: "change" }],
      villageId:[{ required: true, message: "请选择小区/村居", trigger: "change" }],
      buildingId:[{ required: true, message: "请选择楼栋", trigger: "change" }],
      roomId:[{ required: true, message: "请选择房间", trigger: "change" }],
      deviceId:[{ required: true, message: "请选择监测设备ID", trigger: "change" }],
      port:[{ required: true, message: "请输入端口", trigger: "blur" }],
      monitorName:[{ required: true, message: "请输入监测点", trigger: "blur" }],
    })

    // 关闭新增/修改 弹窗
    onMounted(()=>{
      // getDevs();
      areaIdVal.value = store.state.data.cacheData.areaId + '_'+ new Date().getTime() || "";
      handleForm.areaId = store.state.data.cacheData.areaId;
      if(!!store.state.data.cacheData.areaId){
        selectTreeVal(store.state.data.cacheData.areaId);
      }
      !!props.id && getOneIdData(props.id);
    })

    // 获取详情
    const getOneIdData = (id)=>{
      moniPointInfo({id:id}).then(res=>{
        let data = res.data;
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          if(!!data.areaId){
            selectTreeVal(data.areaId);
          }
          if(!!data.villageId){
            changeVillage(data.villageId)
          }
          if(!!data.buildingId){
            changeBuild(data.buildingId)
          }
          handleForm.id = data.id;
          handleForm.deviceId = data.deviceId;
          handleForm.meterId = data.meterId;
          handleForm.monitorName = data.monitorName;
          setTimeout(()=>{
            handleForm.villageId = data.villageId;
            handleForm.buildingId = data.buildingId;
            handleForm.roomId = data.roomId;
            handleForm.deviceTypeId = data.deviceTypeName;
            handleForm.port = data.port;
            handleForm.rs485 = data.rs485;
            areaIdVal.value = data.areaId + '_'+ new Date().getTime() || "";
            villageName.value = data.villageName;
            buildingName.value = data.buildingName;
            roomName.value = data.roomName;
          },300)
        }
      })
    }
    /**
     * 级联选择部分
     * @param {*} val 
     */
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
    // 选择小区
    const changeVillage = (val) =>{
      handleForm.buildingId = "";
      buildingOptions.list = [];
      if(!!val){
        buildingFromVillage({villageId:val}).then(res=>{
          buildingOptions.list = strNumData(res.data);
          if(villageOptions.list.length > 0){
            villageName.value = villageOptions.list.filter(item=>item.id == val)[0].name;
          }
        })
      }
    }
    // 选择楼栋
    const changeBuild = (val)=>{
      handleForm.roomId = "";
      roomOptions.list = [];
      if(!!val){
        roomFromBuilding({buildingId:val}).then(res=>{
          roomOptions.list = res.data;
          if(buildingOptions.list.length > 0){
            buildingName.value = buildingOptions.list.filter(item=>item.id == val)[0].name;
          }
        })
        getDevs()
      }
    }
    // 选择房间
    const changeRoom = (val)=>{
      roomName.value = roomOptions.list.filter(item=>item.id == val)[0]?.name;
      handleForm.monitorName = villageName.value + buildingName.value + roomName.value;
    }
    // 获取监测设备ID
    const getDevs = (val)=>{
      portsList().then(res=>{
        baseIdOptions.list = res.data || [];
      })
    }

    // 选择监测设备ID 获取端口
    const changeBaseId = (val)=>{
      portOptions.list = baseIdOptions.list.filter(item=>item.deviceId == val)[0]?.portList;
    }
    
    // 提交新增/修改
    const handleSubmit = async(ruleFormRef) =>{
      if(!ruleFormRef){
        return ;
      }
      await ruleFormRef.validate((valid, fields) => {
        if (valid) {
          let paramsData = {
            id:handleForm.id,
            areaId:handleForm.areaId,
            villageId:handleForm.villageId,
            buildingId:handleForm.buildingId,
            roomId:handleForm.roomId,
            deviceId:handleForm.deviceId,
            port:handleForm.port,
            meterId:handleForm.meterId,
            monitorName:handleForm.monitorName,
            rs485:handleForm.rs485
          }
          if(!props.id){
            moniPointAdd(paramsData).then(res=>{
              if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
                ElMessage.success("新增成功");
                quit(true);
              }
            })
          }else{
            moniPointEdit(paramsData).then(res=>{
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
    // 关闭新增/修改弹窗
    const quit = (val)=>{
      TreeRefSelect.value.initValue()
      ctx.emit("handleAddClose",val)
    }

    return {
      TreeRefSelect,
      areaIdVal,
      selectTreeVal,

      villageOptions,
      buildingOptions,
      roomOptions,
      deviceTypeOptions,
      baseIdOptions,
      portOptions,

      changeVillage,
      changeBuild,
      changeRoom,
      changeBaseId,

      handleForm,
      handleRules,
      handleSubmit,
      ruleFormRef,
      quit,
      villageName,
      buildingName,
      roomName
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