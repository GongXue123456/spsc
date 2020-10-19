function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function showFormatTime(time) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000
  
  if (diff < 30) {
      // less 30 second
      return '刚刚'
  } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
      // less 24 hour
      return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 30) {
      // less 30 day
      return Math.ceil(diff / (3600 * 24)) + '天前'
  } else {
      return (
      d.getFullYear() +
      ' 年 ' +
      Number(d.getMonth() +1) +
      ' 月 ' +
      d.getDate() +
      ' 日 ' +
      d.getHours() +
      ' : ' +
      d.getMinutes()
      )
  }
}
export function showFormatNum(num) {
    if (isNaN(+num)) {
        return num
    }
    if (+num > 9999) {
        num = +num / 10000;
        num = +(num.toFixed(1) + '');
        return num + '万';
    } else {
        return num + '';
    }
}

export default {
  formatNumber,
  formatTime,
  showFormatTime
}
