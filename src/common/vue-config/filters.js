import moment from 'moment'
function config(vue) {
  vue.filter("s", function (val) {
    return val || ""
  });
  vue.filter("n", function (val) {
    return isNaN(val) ? 0 : val
  });
  vue.filter("pn", function (val) {
    return isNaN(val) ? "" : (Number(val) < 0 ? 0 : val)
  });
  // 金额保留2位小数
  vue.filter("m", function (val) {
    return isNaN(val) ? "" : Number(val).toFixed(2)
  });
  vue.filter("fix", function (val, fixed = 2) {
    return isNaN(val) ? "" : Number(val).toFixed(fixed)
  });
  vue.filter('sizeFormat', function (num) {
    // jacked from: https://github.com/sindresorhus/pretty-bytes
    if (typeof num !== 'number' || isNaN(num)) {
      return "未知大小";
      // throw new TypeError('Expected a number');
    }

    let exponent;
    let unit;
    let neg = num < 0;
    let units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if (neg) {
      num = -num;
    }

    if (num < 1) {
      return (neg ? '-' : '') + num + ' B';
    }

    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1);
    num = (num / Math.pow(1024, exponent)).toFixed(2) * 1;
    unit = units[exponent];

    return (neg ? '-' : '') + num + ' ' + unit;
  });
  // 同下面的moment格式化时间过滤器相同
  vue.filter('dateFormat', function (value, fmt) {
    let agent = navigator.userAgent.toLowerCase()
    let getDate = getDate = new Date(value);
    // 兼容ie
    if (agent.indexOf('trident') > 0) {
      getDate = new Date(value.replace("-", "/"));
    }
    // console.log(getDate)
    // console.log(getDate.getMonth())
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  });
  vue.filter('moment', (value, fmt = 'YYYY-MM-DD HH:mm:ss') => {
    if (!value) { return null }
    return moment(value).format(fmt)
  });
  vue.filter("wrap", function (val, num) {
    if (!val) {
      return val;
    } else if (val.length < num) {
      return val;
    } else {
      return val.slice(0, num) + '...';
    }



    // return isNaN(val) ? "" : (Number(val) < 0 ? 0 : val)
  });

}

export default {
  install: function (vue) {
    config(vue);
  }
}