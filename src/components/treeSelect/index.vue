<template>
  <el-select
    ref="selectWrap"
    v-bind="$attrs"
    v-model="selectValue"
    :size="selectSize"
    :multiple="false"
    :disabled="disabled"
    :placeholder="placeholder"
    clearable
    filterable
    :filter-method="filterTrees"
    @focus="focusTreeSel"
    @blur="blurTreeSel"
    @clear="clearSelectValue"
    :popper-class="propTreeSel+' treeSel_model'"
  >
    <el-option :value="selectOption.optionValue" :label="selectOption.optionLable">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :indent="8"
        :data="treeOptionData"
        :highlight-current="true"
        node-key="id"
        :props="treeProps"
        :default-expanded-keys="defaultExpandKeys"
        :current-node-key="modelValue"
        empty-text="暂无数据"
        :expand-on-click-node="expandOnClickNode"
        :nodeClickEffect="nodeClickEffect"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
      />
    </el-option>
  </el-select>
</template>

<script>
import $ from "jquery";
export default {
  name: "mySelect",
  props: {
    /**select 结构 */
    modelValue: { 
      type: String, 
      default: "" 
    },
    placeholder:{
      type: String, 
      default: "请选择区域" 
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectSize:{
      type:String,
      default:"default"
    },
    isArea:{
      type: String, 
      default: "isArea" 
    },
    /**tree 结构 */
    // tree 数据
    treeOptionData: {
      type: Array,
      default: () => [
        {
          name: "选项1",
          id: "1",
          children: [{ name: "选项1-1", id: "1-1",children:[] }],
        },
        { name: "选项2", id: "2" ,children:[]},
      ],
    },
    expandOnClickNode:{
      type: Boolean,
      default: true,
    },
    nodeClickEffect:{
      type: Boolean,
      default: true,
    },
    propTreeSelId:{
      type: [String,Number],
      default: new Date().getTime(),
    }
  },
  emits:["selectTreeVal","watchSelectTreeVal","selDataFullNameStr"],
  data(){
    return {
      selectValue:"",
      propTreeSel:"propTreeSel_"+this.propTreeSelId,
      selectOption:{
        optionValue:"",
        optionLable:"",
      },
      treeLabel:"",
      treeNodeKey:"",
      treeProps:{
        label: 'name',
        children: 'children',
      },
      defaultExpandKeys:[],
    }
  },
  created(){
    this.selectValue =  this.getPropsInSelect(this.treeOptionData,this.modelValue);
    setTimeout(()=>{
      this.defaultExpandKeys = this.treeOptionData.length > 0 ? [this.treeOptionData[0].id] : [];
    },500)
  },
  mounted(){
    this.$nextTick(()=>{
      this.$refs.selectTree.setCurrentKey(this.selectValue)
    })
  },
  methods:{
    initValue(){
      this.selectOption.optionValue = "";
      this.selectOption.optionLable = "";
      // this.selectOption.optionLable = this.isArea == "isArea" ? "中国" : "";
      this.selectValue = "";
      this.$refs.selectTree.setCurrentKey(this.selectValue)
    },
    // 根据父组件传值子组件选择对应的值
    getPropsInSelect(arr,value){
      arr.forEach(fItem=>{
        if(fItem.id === value){
          if(!!fItem.id){
            this.treeLabel = fItem.name;
          }else{
            this.treeLabel = "";
          }
        }else{
          if(fItem.children && fItem.children.length > 0){
            this.getPropsInSelect(fItem.children,value)
          }
        }
      })
      return this.treeLabel;
    },
    // 聚焦选择
    focusTreeSel(e){
      $('.'+this.propTreeSel).attr("aria-hidden",false)
      $('.'+this.propTreeSel).css("display","");
      this.filterTrees("")
    },
    // 离焦
    blurTreeSel(){
      if(!this.selectValue){
        // this.$emit("selectTreeVal","");
      }
    },
    // 点击父节点是否展开
    setNodeClickExpand(data,clickEffect){
      if(!clickEffect){
        if(data.children.length > 0){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    // 点击结点
    handleNodeClick(data,node){
      if(!data.id){
        return;
      }
      if(this.setNodeClickExpand(data,this.nodeClickEffect)){
        return;
      }
      this.selectOption.optionValue = node.data.id;
      this.selectOption.optionLable = node.data.name;
      this.selectValue = node.data.id;
      this.$refs.selectTree.setCurrentKey(node.data.id);
      this.$store.state.data.cacheData.areaId = node.data.id;
      if(node.data.children.length > 0){
        this.defaultExpandKeys = [node.data.id]
      }
      this.$emit("selectTreeVal",this.selectValue,this.selectOption.optionLable);
      this.$emit("selDataFullNameStr",node.data.fullName)
      this.$refs.selectWrap.blur();
    },
    // 过滤tree 数据
    filterNode(value,data){
      if(!value){
        return true;
      }
      return data.name.indexOf(value) !== -1
    },
    // 过滤select
    filterTrees(selIptItem){
      this.$refs.selectTree.filter(selIptItem);
    },
    // 清除select
    clearSelectValue(){
      this.initValue();
      this.$emit("selectTreeVal","");
      this.$emit("selDataFullNameStr","")
    }
  },
  watch:{
    modelValue(val){
      let splitVal = val ? val.split("_")[0] : "";
      if(!!splitVal){
        this.selectValue =  this.getPropsInSelect(this.treeOptionData,splitVal);
        this.$emit("watchSelectTreeVal",splitVal);
        this.$nextTick(()=>{
          setTimeout(()=>{
            this.$refs.selectTree.setCurrentKey(splitVal)
          })
        })
      }else{
        this.initValue();
      }
    },
  }
}
</script>

<style lang="scss">
.treeSel_model{
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: scroll;
  }
  .el-select-dropdown__list{
    margin: 0 !important;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  ul li :deep(.el-tree .el-tree-node__content) {
    height: auto;
    padding: 0 20px;
  }
  .el-tree-node__label {
    font-weight: normal;
  }
  .el-tree :deep(.is-current .el-tree-node__label) {
    color: #409eff;
    font-weight: 700;
  }
  .el-tree :deep(.is-current .el-tree-node__children .el-tree-node__label) {
    color: #606266;
    font-weight: normal;
  }
}


</style>
