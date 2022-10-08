export const changeDuration = (duration) => {
  let du1 = duration.length >= 4 ? duration.substring(0, 4) : "";
  let du2 = duration.length >= 6 ? duration.substring(4, 6) : "";
  let du3 = duration.length >= 8 ? duration.substring(6, 8) : "";
  let reDu = "";
  if (!!du3) {
    reDu = du1 + "-" + du2 + "-" + du3;
  } else if (!!du2) {
    reDu = du1 + "-" + du2;
  } else {
    reDu = du1;
  }
  return reDu;
};

// 获取两个数组内非重复的数据
export const getArrDataReply = (arr01, arr02) => {
  let newArr = [];
  for (let i = 0; i < arr01.length; i++) {
    for (let j = 0; j < arr02.length; j++) {
      if (arr01[i] == arr02[j]) {
        arr01[i] = null;
        arr02[j] = null;
        break; //如果存在arr01[i]=arr02[j]，就跳出这个for循环
      }
    }
  }
  for (let i = 0; i < arr01.length; i++) {
    if (arr01[i] != null) {
      newArr.push(arr01[i]);
    }
  }
  for (let j = 0; j < arr02.length; j++) {
    if (arr02[j] != null) {
      newArr.push(arr02[j]);
    }
  }
  return newArr;
};

// 时间过滤  当前/今天/昨天/最近7天
export const changeTimeType = (val) => {
  let timeObj = { startTime: "", endTime: "" };
  switch (val) {
    case "CURRENT":
      timeObj.startTime = new Date(new Date().getTime() - 10 * 60 * 1000).parse(
        "yyyy-MM-dd hh:mm:ss"
      );
      timeObj.endTime = new Date(new Date().getTime() + 10 * 60 * 1000).parse(
        "yyyy-MM-dd hh:mm:ss"
      );
      return timeObj;
    case "DAY":
      timeObj.startTime = new Date().parse("yyyy-MM-dd 00:00:00");
      timeObj.endTime = new Date().parse("yyyy-MM-dd hh:mm:ss");
      return timeObj;
    case "YESTERDAY":
      timeObj.startTime = new Date(
        new Date().getTime() - 24 * 60 * 60 * 1000
      ).parse("yyyy-MM-dd 00:00:00");
      timeObj.endTime = new Date(
        new Date().getTime() - 24 * 60 * 60 * 1000
      ).parse("yyyy-MM-dd 23:59:59");
      return timeObj;
    case "SEVENDAY":
      timeObj.startTime = new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      ).parse("yyyy-MM-dd 00:00:00");
      timeObj.endTime = new Date().parse("yyyy-MM-dd 23:59:59");
      return timeObj;
  }
};

// 循环数组找不同
export const uniqueArray = (array, key) => {
  let result = [array[0]];
  for (let i = 1; i < array.length; i++) {
    let item = array[i];
    let repeat = false;
    for (let j = 0; j < result.length; j++) {
      if (item[key] == result[j][key]) {
        repeat = true;
        break;
      }
    }
    if (!repeat) {
      result.push(item);
    }
  }
  return result;
};


/**
 * 
 * @param {*} sortStr 
 * @param {*} sortNum 
 * @returns 
 * 获取楼栋数据使用
 */
// json 字符串文字排序
const sortStr = (a, b) => {
  return a.name.localeCompare(b.name);
}
// json 数字排序
const sortNum = (a, b) => {
  return a.nameNum - b.nameNum;
}
export const strNumData = (array) => {
  let newArr1 = [];
  let newArr2 = [];
  let newArrAll = [];
  array.forEach(item=>{
    if(item.name.match(/\d+/g)?.length > 0){
      item.nameNum = item.name.replace(/[\u4000-\uFFFF]/g, "");
      newArr1.push(item)
    }else{
      newArr2.push(item)
    }
  })
  newArrAll = (newArr2.sort(sortStr) || []).concat(...newArr1.sort(sortNum));
  return newArrAll;
}

/**
 * 返回指定小数
 */
export const getNumDot = (num,fixedNum = 0)=>{
  return num == null ? null : +num == 0 ? 0 : (+num).toFixed(fixedNum);
}

/**
 * 递归树形数据 + 过滤
 * */ 
let treeDataNewArr = [];
const treeDataFilter = (array,key,keyword)=>{
  array.forEach(item=>{
    if(item[key].indexOf(keyword) != -1){
      treeDataNewArr.push(item);
      return;
    }else{
      treeDataFilter(item.children,key,keyword);
    }
  })
}
export const getTreeFilterData = (array,key,keyword)=>{
  treeDataNewArr = [];
  treeDataFilter(array,key,keyword);
  return treeDataNewArr;
}

// 删除两个数组重复的数据
export const delArrRepeat = (arr1,arr2,key)=>{
  for(let i = 0;i< arr1.length;i++) {
    for(let j = 0;j< arr2.length;j++) {
      if(arr1.length > 0  && arr2.length > 0 && arr1[i][key] == arr2[j][key]){
        arr1.splice(i,1);
        arr2.splice(j,1);
        --j;
      }
    }
  }
  return arr1;
}

export default {
  changeDuration,
  getArrDataReply,
  changeTimeType,
  uniqueArray,
  strNumData,
  getTreeFilterData,
  delArrRepeat
};
