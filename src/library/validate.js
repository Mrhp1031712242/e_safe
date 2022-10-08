/**
 * 验证规则
 */

/* 合法uri */
const validateURL = textval => /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(textval)

/* 邮箱验证 */
export const emailValidate = email => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);

/* 手机验证 */
export const phoneValidate = phone => /^1[3,5,6,7,8][0-9]{9}$/.test(phone);


/* 身份证验证 */
export const IDCardValidate = code => {
  const city = [11, 12, 13, 14, 15,
    21, 22, 23,
    31, 32, 33, 34, 35, 36, 37,
    41, 42, 43, 44, 45, 46,
    50, 51, 52, 53, 54,
    61, 62, 63, 64, 65,
    71,
    81, 82,
    91
  ]
  let result = {
    msg: "",
    pass: true
  };

  if (!code || !/[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/i.test(code)) {
    result.msg = "身份证号格式错误", result.pass = false;
  } else if (city.indexOf(+code.substr(0, 2)) === -1) {
    result.msg = "地址编码错误", result.pass = false;
  } else {
    // //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split("");
      //∑(ai×Wi)(mod 11)
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], //加权因子
        parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]; //校验位
      let sum = 0,
        last;
      for (let i = 0; i < 17; i++) { // 求和
        sum += code[i] * factor[i];
      }
      if (("" + parity[sum % 11]) != ("" + code[17]).toUpperCase()) {
        result.msg = "校验位错误", result.pass = false;
      }
    }
  }
  return result;
}
/**
 * 密码校验-长度在 8 位以上，包含字母、数字和字符。
 */
// export const passwordValidate = string => {
//   var regword = /[A-Z]/i;
//   var regNum = /\d/;
//   var regTeShu = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+-]");
//   var complex = 0;
//   if (regword.test(string)) {
//     ++complex;
//   }
//   if (regNum.test(string)) {
//     ++complex;
//   }
//   if (regTeShu.test(string)) {
//     ++complex;
//   }
//   if (complex < 3 || string.length < 8) {
//     return false
//   } else {
//     return true
//   }
// }
/**密码长度至少8位，至少包含以下4种类别中的3种：
大写字母、小写字母、数字、特殊符号 。 */
export const passwordValidate = password => /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,15}$/.test(password);
export const changeDevTypeInner = (val)=>{
  switch(val){
    case 'ROUTER': return "ROUTER"; 
      case 'TH_DETECTER': return "TH_DETECTER"; 
      case 'ENERGYSAVING_AIRC_CONTROLLER': return "ENERGYSAVING_AIRC_CONTROLLER"; 
      case 'ENERGYSAVING_AIRCRED_CONTROLLER': return "ENERGYSAVING_AIRCRED_CONTROLLER"; 
      case 'ENERGYSAVING_RRU_CONTROLLER': return "ENERGYSAVING_RRU_CONTROLLER"; 
      case 'ENERGYSAVING_AAU_CONTROLLER': return "ENERGYSAVING_AAU_CONTROLLER"; 
      default: return val; 
  }
}
export default {
  passwordValidate,
  emailValidate,
  phoneValidate,
  IDCardValidate,
  changeDevTypeInner
}