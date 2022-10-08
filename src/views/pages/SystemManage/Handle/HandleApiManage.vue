<template>
  <div class="handle_api_manage">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="接口名称" prop="permissionName">
        <el-input  size="default"  v-model="handleForm.permissionName" clearable placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单" prop="menuId">
        <TreeSelect :treeOptionData="menuData" 
        :modelValue="menuVal" 
        propTreeSelId="apidialog" 
        @selectTreeVal="(val)=>handleForm.menuId=val" 
        size="default"  
        ref="treeSelect" 
        isArea="menu"
        placeholder="菜单所属上级，不填则为一级菜单"
        class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="接口路径" prop="url">
        <el-input  size="default"  v-model="handleForm.url" clearable placeholder="请输入菜单路径"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input  size="default"  v-model="handleForm.remark" clearable placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="是否鉴权" prop="isAuthorization">
        <el-tooltip :content="handleForm.isAuthorization == true ? '是' : '否'" placement="top">
          <el-switch
            :class="[handleForm.isAuthorization == false ? 'switchActive' : '' ]"
            v-model="handleForm.isAuthorization"
            :active-value="true"
            :inactive-value="false"
            active-color="#fff"
            inactive-color="#C4C4C4"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div class="control_dialog">
      <el-button @click="quit(false)">关 闭</el-button>
      <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { addApi,viewApi, editApi ,menuList} from "@/api/requestData/systemManage";
export default {
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    },
    apiId:{
      type:[String,Number]
    }
  },
  name:'',
  emits:["closeHandle"],
  data(){
    return {
      menuVal:"",
      menuData:[],
      handleForm:{
        permissionName:"",
        menuId:null,
        url:"",
        remark:"",
        isAuthorization:true,
      },
      handleRules:{
        permissionName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
      }
    }
  },
  created(){
    this.getMenuList();
  },
  methods:{
    // 获取菜单数据
    getMenuList(){
      menuList().then(res=>{
        this.menuData = res.data;
      }).then(()=>{
        this.id && this.getOneIdData(this.id,this.apiId);
      })
    },
    // 获取详情
    getOneIdData(id,apiId) {
      viewApi({id,apiId}).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            permissionName:data.permissionName,
            menuId:data.menuId,
            url:data.url,
            isAuthorization:data.isAuthorization,
            remark:data.remark,
            permissionApiId:data.permissionApiId
          }
          this.menuVal = this.handleForm.menuId + "_" + new Date().getTime() || "";
        }
      });
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.id) {
            addApi(this.handleForm)
              .then(res => {
                if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("增加成功");
                  this.quit(true);
                }
              })
              .catch(error => {
                console.log(error);
              });
          }else{
            this.handleForm.id = this.id;
            editApi(this.handleForm).then(res=>{
               if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                  this.$message.success("修改成功");
                  this.quit(true);
                }
            })
          }
        } else {
          this.$message.warning("提交失败");
          return false;
        }
      });
    },
    // 关闭弹框
    quit(val){
      this.handleForm.isAuthorization = true;
      this.$refs.treeSelect.initValue();
      this.$refs['handleForm'].resetFields();
      this.$emit("closeHandle",val);
    }
  },
  watch:{
    handleCount(val){
      if(val == 1){
        this.getMenuList();
      }
    },
  }
}
</script>

<style lang='scss'>
.handle_api_manage{
  width: 100%;
  .handle_form_wrap{
    width: 60%;
    margin: auto;
  }
  .vue-treeselect__placeholder{
    color: rgba(255,255,255,0.6)!important;
  }
}
</style>
