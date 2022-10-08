import modeDictData from "./modeData";
export default {
  props:{
    areaParams:{
      type: String,
      default: null
    },
    deviceType:{
      type: String,
      default: null
    },
    size:{
      type:String,
      default:"default"
    },
    clearable:{
      type:Boolean,
      default:true
    },
    mode:{
      type:String,
      default:""
    },
    listUrl:{
      type: String,
      default: ""
    },
    dictKey:{
      type:Boolean,
    }
  },
  emits:["dictData"],
  data(){
    return {
      value:"",
      dictList:[]
    }
  },
  created(){
    this.getDictList();
  },
  methods:{
    reload(){
      this.getListUrlData();
    },
    getDictList(){
      if(!!this.mode){
        this.dictList = modeDictData.filter(item=>item.value == this.mode)[0].data;
      }
      if(!!this.listUrl){
        this.getListUrlData(this.areaParams,this.siteParams,this.deviceType);
      }
    },
    getListUrlData(areaParams,siteParams,deviceType){
      $http.get(window.baseURL+this.listUrl,{params:{page:1,limit:1000,areaId:areaParams,siteId:siteParams,deviceType:deviceType}}).then(resp => {
        this.dictList =  resp.data.data || [];
        if(this.dictKey){
          this.dictList.forEach(item=>{
            item.key = item.value;
          })
        }
        this.$emit('dictData',this.dictList)
      })
    },
  },
  watch:{
    areaParams(val){
      this.getListUrlData(val,this.siteParams || null,this.deviceType || null);
    },
  }
}