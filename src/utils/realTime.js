export const realTime = (date) => {
  let year = new Date(date).getFullYear();
  let month =
    new Date(date).getMonth() + 1 < 10
      ? "0" + (new Date(date).getMonth() + 1)
      : new Date(date).getMonth() + 1;
  let day =
    new Date(date).getDate() < 10
      ? "0" + new Date(date).getDate()
      : new Date(date).getDate();
  let hh =
    new Date(date).getHours() < 10
      ? "0" + new Date(date).getHours()
      : new Date(date).getHours();
  let mm =
    new Date(date).getMinutes() < 10
      ? "0" + new Date(date).getMinutes()
      : new Date(date).getMinutes();
  let ss =
    new Date(date).getSeconds() < 10
      ? "0" + new Date(date).getSeconds()
      : new Date(date).getSeconds();
  let realTimes =
    year + "年" + month + "月" + day + "日" + " " + hh + ":" + mm + ":" + ss;
  return realTimes;
};

export default {
  realTime,
}
