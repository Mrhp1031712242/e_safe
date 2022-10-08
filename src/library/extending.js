// 扩展 Date 对象
/**
 * 格式化显示指定时间
 */
 Date.prototype.parse = function (template) {
  template = template || 'yyyy-MM-dd hh:mm:ss'
  const pattern = {
    'y+': "" + this.getFullYear(),
    'M+': "" + (this.getMonth() + 1),
    'd+': "" + this.getDate(),
    "h+": "" + this.getHours() % 24 == 0 ? '00' : "" + this.getHours() % 24,
    'H+': "" + this.getHours(),
    'm+': "" + this.getMinutes(),
    's+': "" + this.getSeconds()
  }
  Object.keys(pattern).forEach(key => {
    const exp = new RegExp(key, 'g'), matched = template.match(exp);
    let replaced = pattern[key]
    if (!!matched) {
      const str = matched[0]
      if (str.length > replaced.length) {
        const temp = replaced.split('').reverse();
        for (let i = str.length - replaced.length; i > 0; i--) {
          temp.push('0') // 前置补 0
        }
        replaced = temp.reverse().join('')
      }
      template = template.replace(exp, replaced)
    }
  })
  return template
}

/**
 * 指定时间相对于指定时间的展示，如显示 “刚刚”, “x秒前” 等
 */
Date.prototype.descript = function (template) {
  const offset = (new Date().getTime() - this.getTime()) / 1000
  if (offset < 30) {
    return '刚刚'
  } else if (offset < 3600) {
    return `${offset / 60}分钟前`
  } else if (offset < 3600 * 24) {
    return `${Math.ceil(offset / 3600)}小时前`
  } else if (offset < 3600 * 24 * 2) {
    return '1天前'
  } else {
    return reference.parse(template || 'MM月dd日hh时mm分')
  }
}

/**
 * 距离指定时间 X 天的时间, 负数表示之 X 天前
 */
Date.prototype.offset = function (offset) {
  return new Date(+this + (offset * 1000 * 60 * 60 * 24))
}

// 扩展 String 对象

/**
 * 字符串是否以某一段字符串开头
 */
String.prototype.startWith = function (str) {
  return !!str && new RegExp(`^${str}(.){0,}`).test(this)
}
/**
 * 字符串是否以某一段字符串结尾
 */
String.prototype.endWith = function (str) {
  return !!str && new RegExp(`(.){0,}${str}$`).test(this)
}
