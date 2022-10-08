<template>
  <div class="handle_depart_manage">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input  size="default"  v-model="handleForm.menuName" clearable placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="url">
        <el-input  size="default"  v-model="handleForm.url" clearable placeholder="请输入菜单路径"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId">
        <TreeSelect :treeOptionData="menuListData" 
        :modelValue="menuVal" 
        propTreeSelId="menudialog" 
        @selectTreeVal="(val)=>handleForm.parentId=val || null" 
        size="default"  
        ref="treeSelect" 
        isArea="menu"
        placeholder="菜单所属上级，不填则为一级菜单"
        class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="菜单等级" prop="level">
        <el-input-number size="default" v-model="handleForm.level" :min="1" :max="3" label="请输入菜单等级"></el-input-number>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input size="default" v-model="handleForm.icon" clearable placeholder="请输入图标"></el-input>
      </el-form-item>
      <el-form-item label="是否隐藏菜单" prop="hidden">
        <el-tooltip :content="handleForm.hidden == true ? '是' : '否'" placement="top">
          <el-switch
            :class="[handleForm.hidden == false ? 'switchActive' : '' ]"
            v-model="handleForm.hidden"
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
import { addMenu,viewMenu, editMenu } from "@/api/requestData/systemManage";
export default {
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    },
    menuListData:{
      type:Array
    }
  },
  emits:["closeHandle"],
  name:'',
  data(){
    return {
      menuVal:"",
      handleForm:{
        menuName:"",
        url:"",
        parentId:null,
        level:1,
        icon:null,
        hidden:false,
      },
      handleRules:{
        menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
      }
    }
  },
  created(){
    this.id && this.getOneIdData(this.id);
  },
  methods:{
    // 获取详情
    getOneIdData(id) {
      viewMenu(id).then(res => {
        let data = res.data;
        if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
          this.handleForm = {
            menuName:data.menuName,
            url:data.url,
            parentId:data.parentId,
            level:data.level,
            icon:data.icon,
            hidden:data.hidden,
          };
          this.menuVal = data.parentId + "_" + new Date().getTime() || "";
        }
      });
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.id) {
            addMenu(this.handleForm)
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
            editMenu(this.handleForm).then(res=>{
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
      this.handleForm.level = 1;
      this.handleForm.hidden = false;
      this.handleForm.parentId = null;
      this.$refs.treeSelect.initValue();
      this.$refs['handleForm'].resetFields();
      this.$emit("closeHandle",val);
    }
  },
  watch:{
    handleCount(val){
      if(val == 1){
        this.id && this.getOneIdData(this.id);
      }
    },
  }
}
</script>

<style lang='scss'>
.handle_depart_manage{
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
