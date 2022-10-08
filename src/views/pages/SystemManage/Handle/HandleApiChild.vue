<template>
  <div class="handle_api_child">
    <div class="table_part_wrap">
      <table class="top_table" style="width:100%;">
        <tr>
          <th class="w_per40">接口名</th>
          <th class="w_per20">是否鉴权</th>
          <th>接口路径</th>
          <th class="w_per10">
            <el-button type="primary" size="small" :icon="Plus" @click="addOne()"></el-button>
          </th>
        </tr>
        <tr v-for="(urlItem,urlIndex) in urlList" :key="'url_'+urlIndex">
          <td class="w_per40">
            <el-input v-model="urlItem.apiName"  size="default"></el-input>
          </td>
          <td class="w_per20">
            <el-switch
              :class="[urlItem.authorization == false ? 'switchActive' : '' ]"
              v-model="urlItem.authorization"
              :active-value="true"
              :inactive-value="false"
              active-color="#fff"
              inactive-color="#C4C4C4"
            ></el-switch>
          </td>
          <td>
            <el-input v-model="urlItem.url" size="default"></el-input>
          </td>
          <td class="w_per10">
            <el-button type="danger" size="small" :icon="Delete" :disabled="urlList.length == 1" @click="delOne(urlIndex)"></el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="control_dialog">
      <el-button @click="quit">关 闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { ChildPerList ,addChildPer} from "@/api/requestData/systemManage" 
import { Delete , Plus} from '@element-plus/icons-vue'
import { shallowRef } from 'vue'
export default {
  props:{
    id:{
      type:[String,Number]
    },
    viewCount:{
      type:Number
    },
  },
  emits:["closeChild"],
  data() {
    return {
      urlList:[],
      showErrorMsg:false,
      Delete:shallowRef(Delete),
      Plus:shallowRef(Plus),
    }
  },
  created() {
    // 获取权限数据
    this.getApiChildList(this.id);
  },
  methods: {
    // 获取权限数据
    getApiChildList(id){
      ChildPerList(id).then(res=>{
        if(res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE){
          res.data.forEach(item => {
            if(item.permission == "FAIL"){
              item.authorization = false;
            }else{
              item.authorization = true;
            }
          })
          this.urlList = res.data;
        }
      })
    },
    // 增加一个
    addOne(){
      this.urlList.push({
        apiName:"",
        authorization:false,
        url:"",
      })
    },
    // 删除某一个
    delOne(index){
      this.urlList.splice(index,1);
    },
    // 保存
    handleSubmit(name){
      this.showErrorMsg = false;
      let newArr = [],newObj={};
      this.urlList.forEach(item => {
        if(!item.apiName || !item.url){
          this.showErrorMsg = true;
        }
        newObj = {
          apiName:item.apiName,
          authorization:item.authorization,
          url:item.url,
        }
        newArr.push(newObj);
      })
      if(this.showErrorMsg){
        this.$message.warning("请填写完信息");
        return;
      }else{
        let paramsData = {
          details:newArr,
          permissionId:this.id,
        }
        addChildPer(paramsData).then(res=>{
          if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
            this.$message.success("保存成功");
            this.$emit("closeChild");
          }
        })
      }
    },
    // 退出
    quit(){
      this.$emit("closeChild");
    }
  },
  watch:{
    viewCount(val){
      if(val == 1){
        this.getApiChildList(this.id);
      }
    }
  }
}
</script>
<style lang='scss'>
.handle_api_child{
  .table_part_wrap{
    width: 100%;
    min-height: 200px;
    max-height: 400px;
    overflow: auto;
    .el-input__inner{
      color: #fff;
      border: none;
    }
  }
  .top_table{
    border-collapse: collapse; 
    font-size: 0.8rem;
    margin-bottom: 90px;
    margin-top: 10px;
    tr th{
      border: 1px solid #ddd;
      color: #fff;
      background: transparent;
      padding: 5px 10px;
      text-align: left;
    }
    tr td{
      padding: 5px 5px; 
      border: 1px solid #ddd;
      text-align: left;
      &:nth-last-child(1){
        padding: 5px 10px;
      }
      .el-button.is-disabled{
        background: rgba(245,108,108,0.5)!important;
        border-color: rgba(245,108,108,0.5)!important;
        .el-icon{
          opacity: 0.5!important;
        }
      }
    }
    .el-input__inner{
      padding: 0 6px !important;
    }
  }
}
</style>