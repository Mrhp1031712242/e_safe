<template>
  <el-table-column v-bind="$attrs" :prop="prop" :label="label" :showOverflowTooltip="showTip" v-if="optional">
    <template #default="scope">
      <slot v-bind="scope" />
    </template>
  </el-table-column>
  <el-table-column v-else v-bind="$attrs" :prop="prop" :label="label" :showOverflowTooltip="showTip">
    <template #default="scope">
      <div v-if="!cancopy">
        <span v-if="!!needFixed">{{scope.row[prop] == null ? '-' : scope.row[prop] == 0 ? 0 : scope.row[prop].toFixed(2)}}</span>
        <span v-else>{{scope.row[prop] == 'null' ? '-' : scope.row[prop] || '-'}}</span>
      </div>
      <a href="javascript:;" v-else @dblclick="copyHandle(scope.row[prop])">
        {{scope.row[prop] || '-'}}
      </a>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props:{
    optional:{
      type:Boolean,
      default:false,
    },
    showTip:{
      type:Boolean,
      default:true,
    },
    prop:{
      type:String,
      default:"",
    },
    label:{
      type:String,
      default:"",
    },
    cancopy:{
      type:Boolean,
      default:false,
    },
    needFixed:{
      type:[Number,String],
      default:""
    }
  },
  data() {
    return {

    }
  },
  computed:{
  },
  created() {},
  methods: {
    // 复制
    copyHandle(val){
      let inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.value = val;
      document.body.appendChild(inputElement);
      // 选择增加的input元素
      inputElement.select();
      if (document.execCommand('Copy', 'false', null)) {
          // 如果复制成功
          this.$message.success("复制成功");
      }
      // 复制成功之后删除增加的这个input元素
      document.body.removeChild(inputElement);
    }
  },
}
</script>
<style lang='scss'>
.el-table__cell{
  .el-tooltip{
    a{
      color: #fff;
    }
    span{
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

</style>