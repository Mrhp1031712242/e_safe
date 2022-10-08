<template>
  <div class="push_wx_manage">
    <div class="top_search_wrap">
      <el-input size="default" v-model="filter.keyword" placeholder="请输入关键字" clearable class="ipt_words" style="width:220px;"></el-input>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="searchHandle">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
      <div class="right_btn fr">
        <el-button class="normal_type1_btn" size="small" @click="addHandle" v-if="permisionBtn(160301)">新增</el-button>
      </div>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="80"/>
        <table-column prop="userName" label="推送用户" />
        <table-column prop="openid" label="openid" />
        <table-column prop="gmtCreated" label="创建时间" />
        <table-column prop="remark" label="备注" />
        <table-column optional  label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button class="success_type1_btn" size="small" @click="editHandle(scope)" v-if="permisionBtn(160303)">修改</el-button>
            <el-button class="normal_type1_btn" size="small" @click="relaPushHandle(scope)" v-if="permisionBtn(160303)">关联推送</el-button>
            <el-button class="danger_type_btn" size="small" @click="delHandle(scope)" v-if="permisionBtn(160402)">删除</el-button>
          </template>
        </table-column>
      </table-list>
    </div>
    <!-- 新增/修改 -->
    <el-dialog
      :title="handleAddDialog.title"
      v-model="handleAddDialog.dialogVisible"
      :width="handleAddDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
    >
      <HandlePushWxManage
        ref="HandlePushWxManage"
        @handleAddClose="handleAddClose"
        :id="handleAddDialog.handleId"
      />
    </el-dialog>
    <!-- 推送管理 -->
    <el-dialog
      :title="handleRelaPushDialog.title"
      v-model="handleRelaPushDialog.dialogVisible"
      :width="handleRelaPushDialog.modalWidth"
      :close-on-click-modal="false" destroy-on-close
    >
      <HandleRelaPush
        ref="HandleRelaPush"
        @handleRelaPushClose="handleRelaPushClose"
        :id="handleRelaPushDialog.pushId"
      />
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent,ref ,onMounted,reactive } from 'vue'
import { ElMessageBox ,ElMessage} from 'element-plus'
import HandlePushWxManage from "./Handle/HandlePushWxManage.vue"
import HandleRelaPush from "./Handle/HandleRelaPush.vue"
import { pushControlList,delPushControl } from "@/api/requestData/systemManage"
export default defineComponent({
  components:{
    HandlePushWxManage,
    HandleRelaPush
  },
  setup(){
    const filter = reactive({
      keyword:"",
    })
    const listTable = ref(null);
    const fetch = pushControlList;
    // 定义新增/修改
    let handleAddDialog = reactive({
      title:"",
      dialogVisible:false,
      modalWidth:"600px",
      handleId:"",
    })
    // 定义关联推送
    let handleRelaPushDialog = reactive({
      title:"关联推送",
      dialogVisible:false,
      modalWidth:"1000px",
      pushId:""
    })
    // 搜索
    function searchHandle(){
      listTable.value.reload("search");
    }


    onMounted(()=>{})
    // 新增修改封装
    const dialog = (bool, title,handleId)=>{
      handleAddDialog.dialogVisible = bool;
      handleAddDialog.title = title;
      handleAddDialog.handleId = handleId;
    }
    // 新增
    function addHandle(){
      dialog(true,'新增推送','')
    }
    // 修改
    function editHandle(p){
      dialog(true,'修改推送',p.row.id)
    }
    // 关闭新增/修改弹窗
    function handleAddClose(val){
      handleAddDialog.dialogVisible = false;
      !!val && listTable.value.reload();
    }
    // 删除
    const delHandle = (p)=>{
      ElMessageBox.confirm(`确定删除推送用户 ${p.row.userName}, 是否继续?`, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delPushControl(p.row.id).then(res => {
          if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
            ElMessage.success("删除成功!");
            listTable.value.reload(); 
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch((error) => {
        return false;
      });
    }
    // 关联推送
    const relaPushHandle = (p)=>{
      handleRelaPushDialog.title = '关联推送' + ' · ' + p.row.userName;
      handleRelaPushDialog.dialogVisible = true;
      handleRelaPushDialog.pushId = p.row.id;
    }
    // 退出关联推送
    const handleRelaPushClose = (val)=>{
      handleRelaPushDialog.dialogVisible = false;
    }
    return {
      filter,
      listTable,
      fetch,
      handleAddDialog,
      searchHandle,
      addHandle,
      editHandle,
      handleAddClose,
      delHandle,
      relaPushHandle,

      handleRelaPushDialog,
      handleRelaPushClose,
    }
  },

  data() {
    return {
    }
  },
  created() {},
  methods: {
  },
})
</script>
<style lang='scss'>

</style>