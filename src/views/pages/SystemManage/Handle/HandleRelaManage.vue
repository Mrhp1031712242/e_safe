<template>
  <div class="handle_rela_manage show_all_ipt">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="120px" class="handle_form_wrap">
      <el-form-item label="所属部门">      
        <TreeSelect :treeOptionData="$store.state.data.departOptions" 
        :modelValue="departVal" 
        propTreeSelId="departdialog" 
        @selectTreeVal="(val)=>handleForm.depart=val" 
        ref="treeSelect" 
        placeholder="选择所属部门"
        class="ipt_tree_sel w_form_item_inner_all" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="handleForm.name" clearable placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="name">
        <el-input v-model="handleForm.name" clearable placeholder="请输入职务"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input  v-model="handleForm.phone" clearable placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input  v-model="handleForm.remark" clearable placeholder="请输入电子邮箱"></el-input>
      </el-form-item>
     </el-form>
     <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">提 交</el-button>
     </div>
  </div>
</template>

<script>
export default{
  props:{
    id:{
      type:[String,Number]
    },
    handleCount:{
      type:Number
    }
  },
  emits:["closeHandle"],
  name:'',
  data(){
    return {
      handleForm:{
        roleName:"",
        remark:"",
      },
      handleRules:{
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      }
    }
  },
  created(){
    this.id && this.getOneIdData(this.id);
  },
  methods:{
    // 获取详情
    getOneIdData(id) {
      // getRoleInfo(id).then(res => {
      //   let data = res.data;
      //   if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
      //     this.handleForm = {
      //       roleName:data.roleName,
      //       remark:data.remark,
      //     };
      //   }
      // });
    },
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.id) {
            addRole(this.handleForm)
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
            editRole(this.handleForm).then(res=>{
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

</style>