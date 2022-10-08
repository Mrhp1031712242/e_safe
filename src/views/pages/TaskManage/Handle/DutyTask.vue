<template>
  <div class="handle_comp show_all_ipt">
    <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="100px" class="handle_form_wrap">
      <el-form-item label="处理结果" prop="result">
        <dict-select class="ipt_words" listUrl="/api/rbac/keyValue/selectList/taskResult" size="default" v-model="handleForm.result"  placeholder="请选择处理结果" style="width:100%;"></dict-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="handleForm.remark" placeholder="请输入备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="处理时间" prop="gmtModified">
        <el-date-picker
          class="ipt_words"
          style="width:100%;"
          size="default"
          v-model="handleForm.gmtModified"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
     </el-form>
     <div class="control_dialog">
        <el-button @click="quit(false)">关 闭</el-button>
        <el-button type="primary" class="control_dialog_btn" @click="handleSubmit('handleForm')">提 交</el-button>
     </div>
  </div>
</template>

<script>
import { taskEdit } from "@/api/requestData/taskManage";
export default {
  props:{
    id:{
      type:[String,Number]
    },
    alarmId:{
      type:String
    },
    taskType:{
      type:String
    }
  },
  emits:["closeHandle"],
  name:'',
  data(){
    return {
      handleForm:{
        id:"",
        alarmId:"",
        result:"",
        remark:"",
        gmtModified:new Date().parse("yyyy-MM-dd hh:mm:ss"),
        status:1,
        taskType:"",
      },
      handleRules:{
        result: [{ required: true, message: "请选择处理结果", trigger: "blur" }],
        gmtModified: [{ required: true, message: "请选择处理时间", trigger: "blur" }],
      }
    }
  },
  methods:{
    // 提交
    handleSubmit(name){
      this.$refs[name].validate(valid => {
        if (valid) {
          this.handleForm.id = this.id;
          this.handleForm.alarmId = this.alarmId;
          this.handleForm.taskType = this.taskType;
          taskEdit(this.handleForm).then(res=>{
              if (res.code == import.meta.env.VITE_APP_API_SUCCESS_CODE) {
                this.$message.success("操作成功");
                this.quit(true);
              }
          })
        } else {
          this.$message.warning("提交失败");
          return false;
        }
      });
    },
    // 关闭弹框
    quit(val){
      this.$refs['handleForm'].resetFields();
      this.$emit("handleDutyClose",val);
    }
  },
}
</script>

<style lang='scss'>
</style>
