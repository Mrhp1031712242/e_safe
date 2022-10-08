
let permissionArr = JSON.parse(sessionStorage.getItem("permissionArr")) || [];
export const permisionBtn = (val) => {
  return permissionArr.indexOf(val) != -1
}

export default {
  permisionBtn
}