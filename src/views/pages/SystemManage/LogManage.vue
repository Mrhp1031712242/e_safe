<template>
  <main-content class="log_manage_list">
    <div class="top_search_wrap">
      <el-select v-model="filter.createBy" class="ipt_words" size="default" placeholder="操作人" style="width:150px;" filterable clearable>
        <el-option
          v-for="(item,index) in createByOptions"
          :key="index"
          :label="item.userName"
          :value="item.userName">
        </el-option>
      </el-select>
      <dict-select listUrl="/api/rbac/keyValue/selectList/apiName" v-model="filter.apiName" size="default"  class="ipt_words" placeholder="请选择操作名称" style="width:150px;margin-left:10px"></dict-select>
      <dict-select mode="isSuccess" v-model="filter.isSuccess" size="default"  class="ipt_words" placeholder="操作结果" style="width:130px;margin-left:10px"></dict-select>
      <el-input size="default" v-model="filter.keyword" placeholder="请求数据关键字" clearable class="ipt_words" style="width:150px;margin-left:10px"></el-input>
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:10px;"
        size="default"
        v-model="filter.startTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="false"
        placeholder="开始时间">
      </el-date-picker>
      <span class="mid_words"> — </span>
      <el-date-picker
        class="ipt_words"
        style="width:185px;margin-left:0;"
        size="default"
        v-model="filter.endTime"
        type="datetime"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :clearable="false"
        placeholder="结束时间">
      </el-date-picker>
      <el-button size="default" color="#1A73AC" class="search_btn" @click="$refs.listTable.reload('search')">
        <i class="iconfont icon-sousuo"></i>
      </el-button>
    </div>
    <div class="table_list_part">
      <table-list ref="listTable" :fetch="fetch" :filter="filter">
        <table-column prop="$index" label="序号" width="70px"/>
        <table-column prop="createBy" label="操作人" width="100px"/>
        <table-column prop="apiName" label="操作名称" width="150px"/>
        <table-column prop="requestData" label="请求数据" :showOverflowTooltip="true"/>
        <table-column prop="responseData" label="返回数据"   width="230px" :showOverflowTooltip="true"/>
        <table-column prop="isSuccess" label="操作结果" optional width="100px">
          <template #default="scope">
            <span>{{scope.row.isSuccess == '0' ? '操作成功' : '操作失败'}}</span>
          </template>
        </table-column>
        <table-column prop="gmtCreated" label="操作时间" width="150px" sortable/>
      </table-list>
    </div>
  </main-content>
</template>

<script>
import {userList, sysControlList } from "@/api/requestData/systemManage"
export default {
  data() {
    return {
      createByOptions:[],
      filter:{
        apiName:"",
        keyword:"",
        isSuccess:"",
        createBy:null,
        startTime:new Date().parse('yyyy-MM-dd 00:00:00'),
        endTime:new Date().parse('yyyy-MM-dd HH:mm:ss')
      },
      fetch:sysControlList,
    }
  },
  created() {},
  activated(){
    this.getUsers();
  },
  methods: {
    getUsers(){
      userList({page:1,limit:100}).then(res=>{
        this.createByOptions = res.data;
      })
    },
  },
}
</script>
<style lang='scss'>

</style>