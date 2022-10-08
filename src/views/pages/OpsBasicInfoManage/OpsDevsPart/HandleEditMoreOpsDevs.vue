<template>
  <div class="handle_edit_more_devs table_list_part">
    <el-table
        ref="listTable"
        :data="tableData.list"
        :height="450"
        size="small"
        >
        <template #empty>
          <ShowNomoreImg :imgTop="13" :imgWidth="300"/>
        </template>
        <table-column prop="baseId" label="监测设备ID" width="140"/>
        <table-column label="区域" min-width="130" optional>
          <template #default="scope">
            <TreeSelect ref="TreeRefSelect"
              :propTreeSelId="'edit_more_ops_dia' +scope.row.baseId" 
              :nodeClickEffect="true" :modelValue="scope.row.areaId" 
              class="ipt_tree_sel" style="width:100%" 
              @selectTreeVal="selectTreeVal"/>
          </template>
        </table-column>
        <table-column label="安装位置" min-width="300" optional>
          <template #default="scope">
            <el-select v-model="scope.row.village" placeholder="请选择小区/村居" clearable filterable style="width:150px" @change="changeVillage">
              <el-option
                v-for="item in villageOptions.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select v-model="scope.row.building" placeholder="请选择楼栋" clearable filterable style="width:150px;margin-left:10px;" @change="changeBuild">
              <el-option
                v-for="item in buildingOptions.list"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="scope.row.room" placeholder="请选择房间" clearable filterable style="width:150px;margin-left:10px;" @change="changeRoom">
              <el-option
                v-for="item in roomOptions.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>  
          </template>
        </table-column>
      </el-table>
      <div class="control_dialog">
        <el-button @click="quit(false)">关闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit">提交</el-button>
      </div>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted, reactive } from 'vue'
export default defineComponent({
  setup(props,ctx){
    let tableData = reactive({list:[
      {
        baseId:123456,
        areaId:"",
        village:"",
        building:"",
        room:"",
      }
    ]});

    const villageOptions = reactive({list:[]});
    const buildingOptions = reactive({list:[]});
    const roomOptions = reactive({list:[]});
    onMounted(()=>{})

    const selectTreeVal = (val)=>{

    }
    // 提交
    const handleSubmit = ()=>{

    }

    // 关闭新增/修改弹窗
    const quit = (val)=>{
      ctx.emit("handleEditMoreClose",val)
    }
    return {
      tableData,
      selectTreeVal,
      villageOptions,
      buildingOptions,
      roomOptions,
      quit,
      handleSubmit,
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