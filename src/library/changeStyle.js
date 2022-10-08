export const changeInnerHeight = (cls,h)=>{
  window.onresize = ()=>{
    if(document.getElementsByClassName(cls)[0]){
      return (window.innerHeight - (document.getElementsByClassName(cls)[0]?.offsetTop + h));
    }
  }
  return (window.innerHeight - (document.getElementsByClassName(cls)[0]?.offsetTop + h));
}

export default {
  changeInnerHeight
}